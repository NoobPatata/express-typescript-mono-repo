import { config } from '../config';
import { RedisClientId } from '../types/redis.enums';
import { RedisFactory } from './redisFactory';

export class GlobalRedis extends RedisFactory {
    constructor() {
        super({
            name: RedisClientId.Default,
            enabled: config.redis.global.enabled,
            host: config.redis.global.host,
            port: Number(config.redis.global.port),
            username: config.redis.global.username,
            password: config.redis.global.password,
        });
    }
}

export const globalRedisClient = new GlobalRedis();
