import mongoose, { type Connection, type ConnectOptions, type Schema } from 'mongoose';
import { Utility } from '../helpers/utility';

mongoose.Promise = Promise;

export class DatabaseFactory {
    private connection?: Connection;

    constructor(private readonly connectionString: string) {
        if (Utility.isEmpty(connectionString)) {
            throw new Error('Missing connection string.');
        }
    }

    connect(options?: ConnectOptions) {
        const {
            retryWrites = true,
            socketTimeoutMS = 60000,
            connectTimeoutMS = 45000,
            readConcernLevel = 'local',
        } = options || {};

        this.connection = mongoose.createConnection(this.connectionString, {
            retryWrites,
            socketTimeoutMS,
            connectTimeoutMS,
            readConcernLevel,
            ...options,
        });

        this.connection.once('open', () => {
            console.info(`Successfully connected to ${options?.dbName} database.`);
        });

        return this.connection;
    }

    async disconnect() {
        return this.connection?.close();
    }

    createModel<SchemaType extends Schema>(name: string, schema: SchemaType) {
        if (!this.connection) {
            throw new Error('Database connection required');
        }

        return this.connection.model(name, schema);
    }
}
