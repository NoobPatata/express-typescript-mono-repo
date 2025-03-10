import type { Connection } from 'mongoose';
import { config } from '../config';
import type { AppDatabaseModels } from '../types/database.types';
import { DatabaseFactory } from './databaseFactory';
import { userSchema } from './schemas/user';

export class AppDatabase extends DatabaseFactory {
    constructor() {
        super(config.database.app.connectionString);
        this.connect();
    }

    override connect(): Connection {
        return super.connect({ dbName: config.database.app.databaseName });
    }

    createModels() {
        return {
            userCollection: this.createModel('User', userSchema),
        };
    }
}

export const appConnection = new AppDatabase();
export const appModels: AppDatabaseModels = appConnection.createModels();
