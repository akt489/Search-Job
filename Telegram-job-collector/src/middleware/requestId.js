import { randomUUID } from 'node:crypto';

export const requestId = (req, res, next) => {
    const id = String(req.get('X-Request-ID') || randomUUID()).slice(0, 128);
    req.requestId = id;
    res.setHeader('X-Request-ID', id);
    next();
};
