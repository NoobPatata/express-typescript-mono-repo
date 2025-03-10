import { appConfig } from './app';
import { databaseConfig } from './database';
import { redisConfig } from './redis';

export const config = {
    app: appConfig,
    database: databaseConfig,
    redis: redisConfig,
};
