import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const ingestionRateLimit = rateLimit({
    windowMs: env.rateLimitWindowMs,
    limit: env.rateLimitMax,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => req.collectorKey || req.get('Authorization') || req.ip,
    handler: (req, res) => {
        logger.warn({ event: 'rate_limit_rejected', request_id: req.requestId }, 'Ingestion rate limit exceeded');
        res.status(429).json({
            error: { code: 'RATE_LIMITED', message: 'Too many ingestion requests', requestId: req.requestId },
        });
    },
});
