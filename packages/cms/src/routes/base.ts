import compression from 'compression';
import cors from 'cors';
import express, { type Express, type NextFunction, type Request, type Response, Router } from 'express';
import { NotFoundError } from '../../../../common/exceptions/notFoundError';
import { exceptionHandler } from '../../../../common/middlewares/exceptionHandler';
import { requestLogger } from '../../../../common/middlewares/requestLogger';
import { responseFormatter } from '../../../../common/middlewares/responseFormatter';
import { config } from '../config';
import { userRoutes } from './v1/user.routes';

export class BaseRouter {
    static initialize(app: Express): void {
        app.disable('x-powered-by');

        app.use((_request: Request, response: Response, next: NextFunction) => {
            /**
             * These headers are set to mitigate some security issues
             * Do refer to https://www.npmjs.com/package/helmet
             * for more information on each header configuration
             *
             * X-XSS-Protection: Legacy header that tries to mitigate XSS attacks, but makes things worse
             * X-Content-Type-Options: Blocks a request if the request destination is of type style
             * and the MIME type is not text/css, or of type script and the MIME type is not a JavaScript MIME type
             *
             */
            response.setHeader('X-XSS-Protection', '0');
            response.setHeader('X-Content-Type-Options', 'nosniff');
            next();
        });

        app.use(cors());
        app.use(express.json({ limit: '5mb' }));
        app.use(express.urlencoded({ limit: '5mb', extended: true }));

        /**
         * Enable gzip compressing to decrease the size of the response body and hence increase the speed of a web app
         */
        app.use(compression({ filter: BaseRouter.shouldCompress }));

        app.use(responseFormatter);
        app.use(requestLogger);

        app.get(`${config.app.api.prefix}/health`, (_request: Request, response: Response) => {
            response.success({ version: config.app.version });
            return;
        });

        // Register all APIs routes
        BaseRouter.loadVersionOneRoutes(app);

        // Catch unknown routes and forward to error handler
        app.use((_request: Request, _response: Response, next: NextFunction) => {
            next(new NotFoundError());
        });

        // Global error handling, this should always be declared after all routes declaration
        app.use(exceptionHandler);
    }

    static loadVersionOneRoutes(app: Express) {
        const routePrefix = `${config.app.api.prefix}/v1`;

        const router = Router();
        userRoutes(router);

        app.use(routePrefix, router);
    }

    static shouldCompress(request: Request, response: Response) {
        if (request.headers['x-no-compression']) {
            return false;
        }

        return compression.filter(request, response);
    }
}