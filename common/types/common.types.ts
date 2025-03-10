import type { ApplicationEnvironment } from './common.enums';

export type NonEmpty<T> = T extends null | undefined | '' | [] | Record<string, never> | 0 ? never : T;
export type ErrorResponse = {
    code: string;
    description: string;
};

export type CommonAppConfig = {
    environment: ApplicationEnvironment;
};

export type ApiResponseMetadata = {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};
