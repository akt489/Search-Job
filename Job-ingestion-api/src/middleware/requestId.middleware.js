import { randomUUID } from 'node:crypto';

export const requestIdMiddleware = (req, res, next) => {
    const requestId = String(req.get('X-Request-ID') || randomUUID()).slice(0, 128);
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
};
