export const CommonErrorCodes = {
    concurrentError: {
        code: '1001',
        description: 'The operation is too frequent, please try again later.',
    },
    internalServerError: {
        code: '1002',
        description: 'An unexpected error occurred. Please try again later.',
    },
    notFound: {
        code: '1003',
        description: 'Resource does not exist.',
    },
    secretNotFound: {
        code: '1004',
        description: 'Please set the secret key required to generate JWT token',
    },
    parameterSetIncorrectly: {
        code: '1005',
        description: 'One or several parameters is not set correctly.',
    },
    platformUnderMaintenance: {
        code: '1006',
        description: 'Platform under maintenance.',
    },
};
