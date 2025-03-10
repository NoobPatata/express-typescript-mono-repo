export const databaseConfig = {
    defaultTimeout: Number(process.env.DATABASE_DEFAULT_TIMEOUT_MS) || 5000,
    app: {
        connectionString: process.env.APP_DATABASE_CONNECTION_STRING || '',
        databaseName: process.env.APP_DATABASE_NAME || '',
    },
    cms: {
        connectionString: process.env.CMS_DATABASE_CONNECTION_STRING || '',
        databaseName: process.env.CMS_DATABASE_NAME || '',
    },
};
