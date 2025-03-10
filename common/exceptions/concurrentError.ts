import { BaseError } from './base';
import { CommonErrorCodes } from './errorCodes';

export class ConcurrentError extends BaseError {
    public override httpCode = 409;
    constructor() {
        super(CommonErrorCodes.concurrentError);
    }
}
