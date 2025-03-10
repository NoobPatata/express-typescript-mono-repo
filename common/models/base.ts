import type { DeleteOptions, UpdateOptions } from 'mongodb';
import type {
    Aggregate,
    AnyKeys,
    GetLeanResultType,
    HydratedDocument,
    MergeType,
    Model,
    ModifyResult,
    MongooseBaseQueryOptions,
    MongooseUpdateQueryOptions,
    PipelineStage,
    PopulateOption,
    QueryWithHelpers,
    RootFilterQuery,
    Types,
    UnpackedIntersection,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';
import { config } from '../config';
import type {
    AggregateOptions,
    BaseFindOptions,
    CountDocumentsOptions,
    FindOneAndUpdateOptions,
} from '../types/database.types';

export function modelBaseGenerator<
    RawDocType,
    // biome-ignore lint/complexity/noBannedTypes: This is in accordance to mongoose type
    QueryHelpers = {},
    // biome-ignore lint/complexity/noBannedTypes: This is in accordance to mongoose type
    InstanceMethods = {},
    // biome-ignore lint/complexity/noBannedTypes: This is in accordance to mongoose type
    Virtual = {},
    HydratedDocumentType = HydratedDocument<RawDocType, Virtual & InstanceMethods, QueryHelpers>,
    // biome-ignore lint/suspicious/noExplicitAny: This is in accordance to mongoose type
    Schema = any,
>() {
    return class Base {
        protected static readonly batchSize: number = 250;
        protected static readonly defaultTimeout: number = config.database.defaultTimeout;

        protected static readonly collection: Model<
            RawDocType,
            QueryHelpers,
            InstanceMethods,
            Virtual,
            HydratedDocumentType,
            Schema
        >;

        static aggregate<ReturnType>(
            aggregate: PipelineStage[],
            options?: AggregateOptions,
        ): Aggregate<Array<ReturnType>> {
            const { allowDiskUse = true, readSecondary = true, maxTimeMS = 60000, ...queryOptions } = options || {};

            if (readSecondary) {
                queryOptions.readPreference = 'secondaryPreferred';
            }

            return this.collection.aggregate<ReturnType>(aggregate, queryOptions);
        }

        static count(
            filter: RootFilterQuery<RawDocType>,
            options?: CountDocumentsOptions<RawDocType>,
        ): Promise<number> {
            const { readSecondary = true, maxTimeMS = this.defaultTimeout, ...countOptions } = options || {};
            if (readSecondary) {
                countOptions.readPreference = 'secondaryPreferred';
            }

            return this.collection.countDocuments(filter, { maxTimeMS, ...countOptions });
        }

        static create<DocContents = AnyKeys<RawDocType>>(
            docs: Array<RawDocType | DocContents>,
        ): Promise<HydratedDocumentType[]>;

        static create<DocContents = AnyKeys<RawDocType>>(doc: DocContents | RawDocType): Promise<HydratedDocumentType>;

        static create<DocContents = AnyKeys<RawDocType>>(
            ...docs: Array<RawDocType | DocContents>
        ): Promise<HydratedDocumentType[]>;

        static create<DocContents = AnyKeys<RawDocType>>(
            docs: DocContents | RawDocType | Array<RawDocType | DocContents>,
        ): Promise<HydratedDocumentType | HydratedDocumentType[] | (HydratedDocumentType | Error)[]> {
            return this.collection.create(docs);
        }

        static deleteMany(
            filter?: RootFilterQuery<RawDocType>,
            options?: (DeleteOptions & MongooseBaseQueryOptions<RawDocType>) | null,
        ) {
            return this.collection.deleteMany(filter, options).then((deletedDocument) => {
                return deletedDocument.deletedCount && deletedDocument.acknowledged;
            });
        }

        static deleteOne(
            filter: RootFilterQuery<RawDocType>,
            options?: (DeleteOptions & MongooseBaseQueryOptions<RawDocType>) | null,
        ) {
            return this.collection.deleteOne(filter, options).then((deletedDocument) => {
                return deletedDocument.deletedCount && deletedDocument.acknowledged;
            });
        }

        static findById<ResultDoc = HydratedDocumentType>(
            id: Types.ObjectId,
            options?: BaseFindOptions<RawDocType>,
        ): QueryWithHelpers<ResultDoc | null, ResultDoc, QueryHelpers, RawDocType, 'findOne', InstanceMethods>;

        static findById<PopulatePaths, ResultDoc = HydratedDocumentType>(
            id: Types.ObjectId,
            options: BaseFindOptions<ResultDoc> & { populate: PopulateOption },
        ): QueryWithHelpers<
            MergeType<ResultDoc, PopulatePaths> | null,
            ResultDoc,
            QueryHelpers,
            UnpackedIntersection<RawDocType, PopulatePaths>,
            'findOne',
            InstanceMethods
        >;

        static findById<ResultDoc = HydratedDocumentType>(
            id: Types.ObjectId,
            options: BaseFindOptions<ResultDoc> & { lean: true },
        ): QueryWithHelpers<
            GetLeanResultType<RawDocType, RawDocType, 'findOne'> | null,
            ResultDoc,
            QueryHelpers,
            RawDocType,
            'findOne',
            InstanceMethods
        >;

        static findById<PopulatePaths, ResultDoc = HydratedDocumentType>(
            id: Types.ObjectId,
            options?: BaseFindOptions<RawDocType>,
        ):
            | QueryWithHelpers<ResultDoc | null, ResultDoc, QueryHelpers, RawDocType, 'findOne', InstanceMethods>
            | QueryWithHelpers<
                  MergeType<ResultDoc, PopulatePaths> | null,
                  ResultDoc,
                  QueryHelpers,
                  UnpackedIntersection<RawDocType, PopulatePaths>,
                  'findOne',
                  InstanceMethods
              >
            | QueryWithHelpers<
                  GetLeanResultType<RawDocType, RawDocType, 'findOne'> | null,
                  ResultDoc,
                  QueryHelpers,
                  RawDocType,
                  'findOne',
                  InstanceMethods
              > {
            const {
                isCursor = false,
                projection,
                maxTimeMS = this.defaultTimeout,
                readSecondary = true,
                ...queryOptions
            } = options || {};

            if (readSecondary) {
                queryOptions.readPreference = 'secondaryPreferred';
            }

            if (!isCursor) {
                queryOptions.lean = { getters: true };
            }

            return this.collection.findById<ResultDoc>(id, projection, {
                maxTimeMS,
                ...queryOptions,
            });
        }

        static find<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            options?: BaseFindOptions<RawDocType>,
        ): QueryWithHelpers<Array<ResultDoc>, ResultDoc, QueryHelpers, RawDocType, 'find', InstanceMethods>;

        static find<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            options: BaseFindOptions<RawDocType> & { isCursor?: false },
        ): QueryWithHelpers<
            GetLeanResultType<RawDocType, RawDocType[], 'find'>,
            ResultDoc,
            QueryHelpers,
            RawDocType,
            'find',
            InstanceMethods
        >;

        static find<PopulatePaths, ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            options: BaseFindOptions<RawDocType> & { populate: PopulateOption },
        ): QueryWithHelpers<
            Array<MergeType<ResultDoc, PopulatePaths>>,
            ResultDoc,
            QueryHelpers,
            UnpackedIntersection<RawDocType, PopulatePaths>,
            'find',
            InstanceMethods
        >;

        static find<PopulatePaths, ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            options?: BaseFindOptions<RawDocType>,
        ):
            | QueryWithHelpers<Array<ResultDoc>, ResultDoc, QueryHelpers, RawDocType, 'find', InstanceMethods>
            | QueryWithHelpers<
                  GetLeanResultType<RawDocType, RawDocType[], 'find'>,
                  ResultDoc,
                  QueryHelpers,
                  RawDocType,
                  'find',
                  InstanceMethods
              >
            | QueryWithHelpers<
                  Array<MergeType<ResultDoc, PopulatePaths>>,
                  ResultDoc,
                  QueryHelpers,
                  UnpackedIntersection<RawDocType, PopulatePaths>,
                  'find',
                  InstanceMethods
              > {
            const {
                isCursor = false,
                readSecondary = true,
                projection,
                maxTimeMS = Base.defaultTimeout,
                ...queryOptions
            } = options || {};

            if (readSecondary) {
                queryOptions.readPreference = 'secondaryPreferred';
            }

            if (isCursor) {
                queryOptions.batchSize = queryOptions.batchSize || Base.batchSize;
            }

            if (!isCursor) {
                queryOptions.lean = { getters: true };
            }

            return this.collection.find<ResultDoc>(filter, projection, {
                maxTimeMS,
                ...queryOptions,
            });
        }

        static findOne<ResultDoc = HydratedDocumentType>(
            filter?: RootFilterQuery<RawDocType>,
            options?: BaseFindOptions<RawDocType>,
        ): QueryWithHelpers<ResultDoc | null, ResultDoc, QueryHelpers, RawDocType, 'findOne', InstanceMethods>;

        static findOne<PopulatePaths, ResultDoc = HydratedDocumentType>(
            filter?: RootFilterQuery<RawDocType>,
            options?: BaseFindOptions<RawDocType> & { populate: PopulateOption },
        ): QueryWithHelpers<
            MergeType<ResultDoc, PopulatePaths> | null,
            ResultDoc,
            QueryHelpers,
            UnpackedIntersection<RawDocType, PopulatePaths>,
            'findOne',
            InstanceMethods
        >;

        static findOne<PopulatePaths, ResultDoc = HydratedDocumentType>(
            filter?: RootFilterQuery<RawDocType>,
            options?: BaseFindOptions<RawDocType>,
        ):
            | QueryWithHelpers<ResultDoc | null, ResultDoc, QueryHelpers, RawDocType, 'findOne', InstanceMethods>
            | QueryWithHelpers<
                  MergeType<ResultDoc, PopulatePaths> | null,
                  ResultDoc,
                  QueryHelpers,
                  UnpackedIntersection<RawDocType, PopulatePaths>,
                  'findOne',
                  InstanceMethods
              > {
            const {
                isCursor = false,
                projection,
                readSecondary = true,
                maxTimeMS = Base.defaultTimeout,
                ...queryOptions
            } = options || {};

            if (readSecondary) {
                queryOptions.readPreference = 'secondaryPreferred';
            }

            if (!isCursor) {
                queryOptions.lean = { getters: true };
            }

            return this.collection.findOne<ResultDoc>(filter, projection, {
                maxTimeMS,
                ...queryOptions,
            });
        }

        static findOneAndUpdate<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            update: UpdateQuery<RawDocType>,
            options: FindOneAndUpdateOptions<RawDocType> & { includeResultMetadata: true; isCursor?: false },
        ): QueryWithHelpers<
            ModifyResult<RawDocType>,
            ResultDoc,
            QueryHelpers,
            RawDocType,
            'findOneAndUpdate',
            InstanceMethods
        >;

        static findOneAndUpdate<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            update: UpdateQuery<RawDocType> | UpdateWithAggregationPipeline,
            options?: FindOneAndUpdateOptions<RawDocType> & { isCursor?: false },
        ): QueryWithHelpers<
            GetLeanResultType<RawDocType, RawDocType, 'findOneAndUpdate'> | null,
            ResultDoc,
            QueryHelpers,
            RawDocType,
            'findOneAndUpdate',
            InstanceMethods
        >;

        static findOneAndUpdate<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            update: UpdateQuery<RawDocType>,
            options: FindOneAndUpdateOptions<RawDocType> & { includeResultMetadata: true },
        ): QueryWithHelpers<
            ModifyResult<ResultDoc>,
            ResultDoc,
            QueryHelpers,
            RawDocType,
            'findOneAndUpdate',
            InstanceMethods
        >;

        static findOneAndUpdate<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            update: UpdateQuery<RawDocType>,
            options: FindOneAndUpdateOptions<RawDocType> & { upsert: true; returnNew?: true },
        ): QueryWithHelpers<ResultDoc, ResultDoc, QueryHelpers, RawDocType, 'findOneAndUpdate', InstanceMethods>;

        static findOneAndUpdate<ResultDoc = HydratedDocumentType>(
            filter?: RootFilterQuery<RawDocType>,
            update?: UpdateQuery<RawDocType> | UpdateWithAggregationPipeline,
            options?: FindOneAndUpdateOptions<RawDocType>,
        ): QueryWithHelpers<ResultDoc | null, ResultDoc, QueryHelpers, RawDocType, 'findOneAndUpdate', InstanceMethods>;

        static findOneAndUpdate<ResultDoc = HydratedDocumentType>(
            filter: RootFilterQuery<RawDocType>,
            update: UpdateQuery<RawDocType> | UpdateWithAggregationPipeline,
            options?: FindOneAndUpdateOptions<RawDocType>,
        ):
            | QueryWithHelpers<
                  ResultDoc | null,
                  ResultDoc,
                  QueryHelpers,
                  RawDocType,
                  'findOneAndUpdate',
                  InstanceMethods
              >
            | QueryWithHelpers<
                  GetLeanResultType<RawDocType, RawDocType, 'findOneAndUpdate'> | null,
                  ResultDoc,
                  QueryHelpers,
                  RawDocType,
                  'findOneAndUpdate',
                  InstanceMethods
              > {
            const {
                returnNew = true,
                isCursor = false,
                maxTimeMS = Base.defaultTimeout,
                upsert = false,
                setDefaultsOnInsert = true,
                ...queryOptions
            } = options || {};

            if (!isCursor) {
                queryOptions.lean = { getters: true };
            }

            return this.collection.findOneAndUpdate<ResultDoc>(filter, update, {
                maxTimeMS,
                upsert,
                setDefaultsOnInsert,
                new: returnNew,
                ...queryOptions,
            });
        }

        static updateOne(
            filter: RootFilterQuery<RawDocType>,
            updatePayload: UpdateQuery<RawDocType> | UpdateWithAggregationPipeline,
            options?: (UpdateOptions & MongooseUpdateQueryOptions<RawDocType>) | null,
        ): Promise<boolean> {
            const { maxTimeMS = Base.defaultTimeout, ...queryOptions } = options || {};

            return this.collection
                .updateOne(filter, updatePayload, { maxTimeMS, ...queryOptions })
                .then((updatedResult) => {
                    return !(!updatedResult || !updatedResult.modifiedCount || !updatedResult.matchedCount);
                });
        }

        static updateMany(
            filter: RootFilterQuery<RawDocType>,
            payload: UpdateQuery<RawDocType> | UpdateWithAggregationPipeline,
            options?: (UpdateOptions & MongooseUpdateQueryOptions<RawDocType>) | null,
        ): Promise<boolean> {
            const { maxTimeMS = Base.defaultTimeout, ...queryOptions } = options || {};

            return this.collection.updateMany(filter, payload, { maxTimeMS, ...queryOptions }).then((updatedResult) => {
                return !(!updatedResult || !updatedResult.modifiedCount || !updatedResult.matchedCount);
            });
        }
    };
}
