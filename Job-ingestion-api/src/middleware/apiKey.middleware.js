import { timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const sameSecret = (received, expected) => {
    if (!received || !expected) return false;
    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
};

export const apiKeyMiddleware = (req, res, next) => {
    const authorization = req.get('Authorization') || '';
    const [scheme, key] = authorization.split(' ');
    if (scheme !== 'Bearer' || !sameSecret(key, env.importApiKey)) {
        logger.warn({ event: 'authentication_failed', request_id: req.requestId }, 'Ingestion authentication failed');
        return next(new AppError('Missing or invalid API key', 'UNAUTHORIZED', 401));
    }
    req.collectorKey = key;
    next();
};
