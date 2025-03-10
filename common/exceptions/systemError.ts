import type { ErrorResponse } from '../types/common.types';
import { BaseError } from './base';
import { CommonErrorCodes } from './errorCodes';

export class SystemError extends BaseError {
    public override httpCode = 500;
    constructor(errorResponse: ErrorResponse = CommonErrorCodes.internalServerError) {
        super(errorResponse);
    }
}
