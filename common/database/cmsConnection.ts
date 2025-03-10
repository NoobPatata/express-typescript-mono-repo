import type { Connection } from 'mongoose';
import { config } from '../config';
import type { CmsDatabaseModels } from '../types/database.types';
import { DatabaseFactory } from './databaseFactory';
import { userSchema } from './schemas/user';

export class CmsConnection extends DatabaseFactory {
    constructor() {
        super(config.database.cms.connectionString);
        this.connect();
    }

    override connect(): Connection {
        return super.connect({ dbName: config.database.cms.databaseName });
    }

    createModels() {
        return {
            adminCollection: this.createModel('User', userSchema),
        };
    }
}

export const cmsConnection = new CmsConnection();
export const cmsModels: CmsDatabaseModels = cmsConnection.createModels();
