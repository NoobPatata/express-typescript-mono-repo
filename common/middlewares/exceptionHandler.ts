import type { NextFunction, Request, Response } from 'express';
import { BaseError } from '../exceptions/base';
import { SystemError } from '../exceptions/systemError';
import { Utility } from '../helpers/utility';

export function exceptionHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
    if (error instanceof BaseError) {
        return response.error(
            error.httpCode,
            {
                code: error.name,
                message: error.message,
                stack: Utility.isProduction() ? undefined : error.stack,
            },
            error.error,
        );
    }

    console.error('Unknown error:', error);

    const defaultReturn = new SystemError();
    return response.error(defaultReturn.httpCode, {
        code: defaultReturn.name,
        message: defaultReturn.message,
    });
}
