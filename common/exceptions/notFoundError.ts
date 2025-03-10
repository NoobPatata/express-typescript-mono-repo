import { BaseError } from './base';
import { CommonErrorCodes } from './errorCodes';

export class NotFoundError extends BaseError {
    public override httpCode = 404;
    constructor() {
        super(CommonErrorCodes.notFound);
    }
}
