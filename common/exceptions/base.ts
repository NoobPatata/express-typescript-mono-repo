import type { ErrorResponse } from '../types/common.types';

export class BaseError extends Error {
    public httpCode = 500;

    constructor(
        errorResponse: ErrorResponse,
        public readonly error?: unknown,
    ) {
        super(errorResponse.description);
        this.name = errorResponse.code;

        if (!this.name || !this.message) {
            throw new Error(`${this.constructor.name}: ${this.message}`);
        }
    }
}
