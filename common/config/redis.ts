export const redisConfig = {
    global: {
        enabled: process.env.REDIS_ENABLED === 'true',
        host: process.env.REDIS_HOST || '',
        port: process.env.REDIS_PORT || '',
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
    },
    app: {
        enabled: process.env.APP_REDIS_ENABLED === 'true',
        host: process.env.APP_REDIS_HOST || '',
        port: process.env.APP_REDIS_PORT || '',
        username: process.env.APP_REDIS_USERNAME || '',
        password: process.env.APP_REDIS_PASSWORD || '',
    },
    cms: {
        enabled: process.env.CMS_REDIS_ENABLED === 'true',
        host: process.env.CMS_REDIS_HOST || '',
        port: process.env.CMS_REDIS_PORT || '',
        username: process.env.CMS_REDIS_USERNAME || '',
        password: process.env.CMS_REDIS_PASSWORD || '',
    },
};
