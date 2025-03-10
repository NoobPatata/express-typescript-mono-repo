import { CommonErrorCodes } from '../../../../common/exceptions/errorCodes';
import { SystemError } from '../../../../common/exceptions/systemError';
import { Utility } from '../../../../common/helpers/utility';
import type { AuthConfig } from '../types/common.types';
import { appConfig } from './app';

if (!Utility.isDefined(process.env.APP_SECRET)) {
    throw new SystemError(CommonErrorCodes.secretNotFound);
}

export const authConfig: AuthConfig = {
    secret: process.env.APP_SECRET,
    expiry: Number(process.env.MEMBER_TOKEN_EXPIRY) || 60 * 60 * 6,
    issuer: process.env.MEMBER_TOKEN_ISSUER || `${appConfig.name}_AUTH_ISSUER`,
};