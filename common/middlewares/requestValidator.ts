import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodObject, type ZodTypeAny, z } from 'zod';
import { CommonErrorCodes } from '../exceptions/errorCodes';
import { Utility } from '../helpers/utility';

type ZodOutput<T extends ZodTypeAny> = T['_output'];
export const emptyObjectSchema = z.object({}).strict();
type Empty = typeof emptyObjectSchema;

const defaultValidatorSchema = z.object({
    platformId: z.string(),
    hash: z.string(),
});

export function validate(): RequestHandler<unknown, unknown, ZodOutput<typeof defaultValidatorSchema>, unknown>;

export function validate<Body extends ZodTypeAny = Empty>(
    schema: Body,
): RequestHandler<unknown, unknown, ZodOutput<Body & typeof defaultValidatorSchema>, unknown>;

export function validate<Body extends ZodTypeAny = Empty>(
    schema?: Body,
    options?: { isStrict?: boolean; includeDefault: false },
): RequestHandler<unknown, unknown, ZodOutput<Body>, unknown>;

export function validate<Body extends ZodTypeAny = Empty>(
    schema?: Body,
    options?: { isStrict?: boolean; includeDefault?: true },
): RequestHandler<unknown, unknown, ZodOutput<Body & typeof defaultValidatorSchema>, unknown>;

export function validate<Body extends ZodTypeAny = Empty>(
    schema?: Body,
    options?: {
        isStrict?: boolean;
        includeDefault?: boolean;
    },
): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        const { isStrict = true, includeDefault = true } = options || {};
        if (Utility.isEmpty(schema) && !includeDefault) {
            return next();
        }

        let finalSchema: ZodTypeAny = schema ?? defaultValidatorSchema;
        if (schema instanceof ZodObject && includeDefault) {
            finalSchema = defaultValidatorSchema.merge(schema);
        }

        if (finalSchema instanceof ZodObject && isStrict) {
            finalSchema = finalSchema.strict();
        }

        const validatedRequest = await finalSchema.safeParseAsync(request.body);
        if (!validatedRequest.success) {
            const errorMessages = validatedRequest.error.errors.map((issue) => ({
                [`${issue.path.join('.')}`]: issue.message,
            }));

            response.error(
                400,
                {
                    code: CommonErrorCodes.parameterSetIncorrectly.code,
                    message: CommonErrorCodes.parameterSetIncorrectly.description,
                },
                errorMessages,
            );
            return;
        }

        return next();
    };
}
