import { config } from '../config';
import { ApplicationEnvironment } from '../types/common.enums';
import type { NonEmpty } from '../types/common.types';

export class Utility {
    static isProduction() {
        return [ApplicationEnvironment.PreRelease, ApplicationEnvironment.Production].includes(
            config.app.environment as ApplicationEnvironment,
        );
    }

    static isDefined<T>(obj: T | null | undefined): obj is T {
        return obj !== undefined && obj !== null;
    }

    static isEmpty<PayloadType>(payload: PayloadType): payload is Exclude<PayloadType, NonEmpty<PayloadType>> {
        if (payload === undefined || payload === null) {
            return true;
        }

        if ((typeof payload === 'string' || typeof payload === 'number') && !payload) {
            return true;
        }

        if (typeof payload === 'object' && !(payload instanceof Date)) {
            return Object.keys(payload).length === 0;
        }

        if (Array.isArray(payload)) {
            return payload.length === 0;
        }

        return false;
    }

    static censoredData(data: unknown, visited = new WeakSet()): unknown {
        const sensitiveFields = ['password', 'email', 'mobile'];

        if (typeof data !== 'object' || data === null || data === undefined) {
            return data;
        }

        // Avoid processing circular references
        if (visited.has(data)) {
            return '[Circular Reference]';
        }

        visited.add(data);

        const masked = (value: unknown) => (typeof value !== 'object' ? '******' : value);
        if (Array.isArray(data)) {
            return data.map((item) => Utility.censoredData(item, visited));
        }

        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                sensitiveFields.includes(key) ? masked(value) : Utility.censoredData(value, visited),
            ]),
        );
    }

    static generateRequestId(): string {
        return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    }
}
