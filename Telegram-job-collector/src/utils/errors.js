export class CollectorError extends Error {
    constructor(message, code, options = {}) {
        super(message);
        this.name = 'CollectorError';
        this.code = code;
        this.statusCode = options.statusCode;
        this.retryAfterMs = options.retryAfterMs;
    }
}
