import { BaseError } from './base';

export class ValidationError extends BaseError {
    public override httpCode = 400;
}
