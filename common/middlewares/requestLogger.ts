import type { NextFunction, Request, Response } from 'express';
import { Utility } from '../helpers/utility';

export function requestLogger(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl, ip } = request;
    const timestamp = new Date().toISOString();
    const requestBody = structuredClone(request.body);
    const startTime = process.hrtime();
    const requestId = request.headers['x-request-id'] || Utility.generateRequestId();
    request.headers['x-request-id'] = requestId;

    console.info({
        type: 'request',
        requestId,
        timestamp,
        method,
        url: originalUrl,
        ip,
        username: request.user?.username || 'unknown',
        request: JSON.stringify(Utility.censoredData(requestBody)),
        headers: JSON.stringify(request.headers),
    });

    const originalSend = response.send;
    response.send = (body: unknown) => {
        const timestamp = new Date().toISOString();
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const durationMs = Math.round(seconds * 1e3 + nanoseconds / 1e6);

        let responseBody: unknown;
        try {
            responseBody = JSON.parse(body as string);
        } catch {
            responseBody = body;
        }

        console.info({
            type: 'response',
            requestId,
            timestamp,
            durationMs,
            method,
            url: originalUrl,
            ip,
            username: request.user?.username || 'unknown',
            code: response.statusCode,
            response: JSON.stringify(Utility.censoredData(responseBody)).slice(0, 500),
        });

        response.send = originalSend;
        return response.send(body);
    };

    return next();
}
