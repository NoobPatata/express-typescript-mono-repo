import type { ApplicationEnvironment } from '../../../../common/types/common.enums';

export type ApplicationConfig = {
    version: string;
    name: string;
    environment: ApplicationEnvironment;
    port: number;
    api: {
        prefix: string;
    };
};

export type AuthConfig = {
    secret?: string;
    expiry: number | string;
    issuer: string;
};