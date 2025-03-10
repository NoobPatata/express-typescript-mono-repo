import type { ErrorResponse } from '../types/common.types';
import { BaseError } from './base';
import { CommonErrorCodes } from './errorCodes';

export class SystemMaintenanceError extends BaseError {
    public override httpCode = 503;
    constructor(errorResponse: ErrorResponse = CommonErrorCodes.platformUnderMaintenance) {
        super(errorResponse);
    }
}
