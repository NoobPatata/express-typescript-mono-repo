import type { CountOptions } from 'mongodb';
import type {
    AggregateOptions as MongooseAggregateOptions,
    MongooseBaseQueryOptions,
    ProjectionType,
    QueryOptions,
} from 'mongoose';
import type { AppDatabase } from '../database/appConnection';
import type { CmsConnection } from '../database/cmsConnection';

export type AppDatabaseModels = ReturnType<AppDatabase['createModels']>;
export type CmsDatabaseModels = ReturnType<CmsConnection['createModels']>;

export type AggregateOptions = {
    readSecondary?: boolean;
} & MongooseAggregateOptions;

export type CountDocumentsOptions<RawDocType> =
    | (CountOptions & MongooseBaseQueryOptions<RawDocType> & { readSecondary?: boolean })
    | null;

export type BaseFindOptions<RawDocType> = {
    isCursor?: boolean;
    readSecondary?: boolean;
    projection?: ProjectionType<RawDocType> | null;
} & QueryOptions<RawDocType>;

export type FindOneAndUpdateOptions<RawDocType> = BaseFindOptions<RawDocType> &
    QueryOptions<RawDocType> & { returnNew?: boolean };
