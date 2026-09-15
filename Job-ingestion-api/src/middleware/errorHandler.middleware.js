import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
    if (res.headersSent) return next(error);
    const isValidation = error instanceof ZodError;
    const statusCode = isValidation ? 400 : error.statusCode || 500;
    const code = isValidation ? 'VALIDATION_ERROR' : error.code || 'INTERNAL_ERROR';
    const message = isValidation ? 'Invalid job import data' : statusCode === 500 ? 'Unexpected server error' : error.message;

    logger.error({
        event: 'request_failed',
        request_id: req.requestId,
        error_code: code,
        status_code: statusCode,
        error: error.message,
    }, 'Ingestion request failed');

    res.status(statusCode).json({
        error: {
            code,
            message,
            requestId: req.requestId,
            ...(isValidation ? { details: error.flatten() } : {}),
        },
    });
};
