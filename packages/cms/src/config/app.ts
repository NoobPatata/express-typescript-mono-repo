import { ApplicationEnvironment } from '../../../../common/types/common.enums';
import type { ApplicationConfig } from '../types/common.types';

export const appConfig: ApplicationConfig = {
    version: '0.0.1', // update this version for every deployment
    name: process.env.APP_NAME || 'base',
    environment: (process.env.APP_ENV as ApplicationEnvironment) || ApplicationEnvironment.Local,
    port: Number(process.env.PORT) || 8002,

    api: {
        prefix: '/base',
    },
};