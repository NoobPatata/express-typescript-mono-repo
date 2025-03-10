import type { NextFunction, Request, Response } from 'express';
import { ApiResponseStatus } from '../types/common.enums';
import type { ApiResponseMetadata } from '../types/common.types';

export function responseFormatter(_request: Request, response: Response, next: NextFunction) {
    response.success = (data: unknown, metadata?: ApiResponseMetadata) => {
        return response.status(200).json({
            status: ApiResponseStatus.Success,
            data,
            metadata,
        });
    };

    response.error = (
        httpStatus: number,
        error: { code: string; message: unknown; stack?: string },
        details?: unknown,
    ) => {
        return response.status(httpStatus).json({
            status: ApiResponseStatus.Error,
            code: error.code,
            description: error.message,
            stack: error.stack,
            error: details,
        });
    };

    return next();
}
