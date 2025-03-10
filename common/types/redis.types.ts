import type { RedisJSON } from '@redis/json/dist/commands';
import type { Types } from 'mongoose';
import type { RedisSetCondition } from './redis.enums';

export type JsonSetPayload = {
    key: string;
    path?: string;
    value: RedisJSON;
};

export type JsonSetOptions =
    | { expire: number; expireAt?: never; setCondition?: RedisSetCondition }
    | { expireAt: number | Date; expire?: never; setCondition?: RedisSetCondition };

export type JsonGetOptions = (
    | { expire: number; expireAt?: never; path?: string | Array<string> }
    | { expireAt: number | Date; expire?: never; path?: string | Array<string> }
) & { path?: string | Array<string>; setIfNotFound?: boolean };

export type ConvertToRedisJson<T> = T extends Types.ObjectId | Date | string
    ? string
    : T extends number | boolean
      ? T
      : T extends (infer U)[]
        ? ConvertToRedisJson<U>[]
        : T extends Record<string | number, unknown>
          ? { [K in keyof T]: ConvertToRedisJson<T[K]> }
          : T;
