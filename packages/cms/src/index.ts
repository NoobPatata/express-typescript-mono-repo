import 'dotenv/config';
import type http from 'node:http';
import express, { type Express } from 'express';
import { appConnection } from '../../../common/database/appConnection';
import { Utility } from '../../../common/helpers/utility';
import { globalRedisClient } from '../../../common/redis/globalRedis';
import { config } from './config';
import { BaseRouter } from './routes/base';
import {cmsConnection} from "../../../common/database/cmsConnection";

function startServer() {
    const app: Express = express();
    const port: number | undefined = config.app.port;

    if (!Utility.isDefined(port)) {
        throw new Error('Application port not defined');
    }

    BaseRouter.initialize(app);

    const server = app.listen(port, () => {
        console.info(`Server started at http://localhost:${port}`);
    });

    setupServerHooks(server, port);
}

function setupServerHooks(server: http.Server, port?: number) {
    server.on('close', () => {
        console.info(`Server closing on port: ${port}`);
    });

    server.on('uncaughtException', (error: Error) => {
        console.error('Uncaught Exception:', error.message);
        process.exit(1);
    });

    server.on('unhandledRejection', (reason: unknown) => {
        console.error('Unhandled Rejection:', reason);
        process.exit(1);
    });

    server.on('SIGINT', async () => {
        console.info(`Preparing to close connection on port ${port}`);

        try {
            await Promise.all([appConnection.disconnect(), cmsConnection.disconnect(), globalRedisClient.disconnect()]);

            console.info('Database connections closed successfully.');
        } catch (error) {
            console.error('Error closing database connections:', error);
        }

        console.info('Closing server in 10 seconds...');
        setTimeout(() => {
            process.exit(0);
        }, 10000);
    });

    /**
     * headersTimeout should always be greater than keepAliveTimeout
     * https://adamcrowder.net/posts/node-express-api-and-aws-alb-502/
     */
    server.keepAliveTimeout = 65 * 1000;
    server.headersTimeout = 66 * 1000;
}

startServer();