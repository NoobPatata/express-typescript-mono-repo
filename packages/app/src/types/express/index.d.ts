import type { ApplicationEnvironment } from '../../../common/types';
import type { ApiResponseMetadata } from '../../../../../common/types/common.types';

declare global {
    namespace Express {
        export interface Request {
            user?: {
                username: string;
            };
            platformObjId: string;
            environment: ApplicationEnvironment;
        }
        export interface Response {
            error: (
                httpStatus: number,
                error: { code: string; message: unknown; stack?: string },
                details?: unknown,
            ) => void;
            success: (data: unknown, metadata?: ApiResponseMetadata) => void;
        }
    }
}