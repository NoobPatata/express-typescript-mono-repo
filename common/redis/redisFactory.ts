import type { RedisJSON } from '@redis/json/dist/commands';
import { type RedisClientType, createClient } from 'redis';
import { SystemError } from '../exceptions/systemError';
import { Utility } from '../helpers/utility';
import { RedisSetCondition } from '../types/redis.enums';
import type { ConvertToRedisJson, JsonGetOptions, JsonSetOptions, JsonSetPayload } from '../types/redis.types';

export class RedisFactory {
    protected client?: ReturnType<typeof createClient>;

    constructor(
        private readonly config: {
            name: string;
            host: string;
            port: number;
            enabled: boolean;
            username?: string;
            password?: string;
        },
    ) {
        if (!config.enabled) {
            return;
        }

        if (Utility.isEmpty(config.host)) {
            throw new Error('Missing redis host.');
        }

        console.info(`Connecting to ${config.name} redis...`);

        this.connect();
    }

    async connect() {
        this.client = await createClient({
            socket: {
                host: this.config.host,
                port: this.config.port,
            },
            username: this.config.username,
            password: this.config.password,
        }).connect();

        await this.setupRedisHooks();
        await this.initializeCache();
    }

    async initializeCache(): Promise<void> {}

    async setupRedisHooks() {
        this.client?.on('ready', () => console.info('Redis Connected'));
        this.client?.on('reconnecting', () => console.info('Redis Reconnecting'));
        this.client?.on('end', () => console.info('Redis End'));
        this.client?.on('error', (error: unknown) => console.error('Redis Error', error));
    }

    disconnect() {
        console.info('Disconnecting from redis...');
        return this.client?.disconnect();
    }

    isConnected(): this is { client: RedisClientType } {
        return Utility.isDefined(this.client) && this.client.isOpen;
    }

    async jsonSet(payload: JsonSetPayload, options?: JsonSetOptions) {
        if (!this.isConnected()) {
            console.warn('Redis is not enabled. Please check configuration to enable.');
            return false;
        }

        try {
            const { key, path = '$', value } = payload;
            const { expire, expireAt, setCondition } = options ?? {};

            // biome-ignore lint/style/useNamingConvention: NX and XX are the only acceptable key in redis json set options
            let redisOptions: { NX: true } | { XX: true } | undefined;

            if (setCondition === RedisSetCondition.Nx) {
                // biome-ignore lint/style/useNamingConvention: NX and XX are the only acceptable key in redis json set options
                redisOptions = { NX: true };
            }

            if (setCondition === RedisSetCondition.Xx) {
                // biome-ignore lint/style/useNamingConvention: NX and XX are the only acceptable key in redis json set options
                redisOptions = { XX: true };
            }

            await this.client.json.set(key, path, value, redisOptions);
            await this.setKeyExpiry(key, { expire, expireAt });

            return true;
        } catch (error) {
            console.error('Error setting redis json', error);
            return false;
        }
    }

    async jsonGet<FallbackReturnType>(
        key: string,
        fallback: () => Promise<FallbackReturnType>,
        options?: JsonGetOptions,
    ): Promise<ConvertToRedisJson<FallbackReturnType> | FallbackReturnType> {
        if (!this.isConnected()) {
            console.warn('Redis is not enabled. Please check configuration to enable.');
            return fallback();
        }

        try {
            const { expire, expireAt, path, setIfNotFound = true } = options ?? {};
            const result = await this.client.json.get(key, { path });

            if (!result && setIfNotFound) {
                const dataToCache = await fallback();
                await this.jsonSet({ key, value: dataToCache as RedisJSON });
                await this.setKeyExpiry(key, { expire, expireAt });

                return dataToCache;
            }

            await this.setKeyExpiry(key, { expire, expireAt });

            return result ? (result as ConvertToRedisJson<FallbackReturnType>) : fallback();
        } catch (error: unknown) {
            console.error('Error retrieving redis json key', error);
            return fallback();
        }
    }

    async setKeyExpiry(key: string, options: { expire?: number; expireAt?: number | Date }) {
        if (!this.isConnected()) {
            console.warn('Redis is not enabled. Please check configuration to enable.');
            return false;
        }

        const { expire, expireAt } = options ?? {};

        if (!Utility.isDefined(expire) && !Utility.isDefined(expireAt)) {
            return false;
        }

        if (Utility.isDefined(expire) && Utility.isDefined(expireAt)) {
            return Promise.reject(
                new SystemError({
                    code: 'INVALID_REDIS_EXPIRE_PARAMETER',
                    description: 'Please set the expire or expireAt parameter only.',
                }),
            );
        }

        if (Utility.isDefined(expire)) {
            return this.client.expire(key, expire);
        }

        return this.client.expireAt(key, expireAt as Date | number);
    }
}
