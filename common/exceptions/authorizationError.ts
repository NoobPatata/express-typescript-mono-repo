import { BaseError } from './base';

export class AuthorizationError extends BaseError {
    public override httpCode = 403;
}
