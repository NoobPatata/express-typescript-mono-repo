import { ApplicationEnvironment } from '../types/common.enums';
import type { CommonAppConfig } from '../types/common.types';

export const appConfig: CommonAppConfig = {
    environment: (process.env.APP_ENV as ApplicationEnvironment) || ApplicationEnvironment.Local,
};
