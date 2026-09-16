export class EnricherError extends Error {
    constructor(message, code, options = {}) {
        super(message);
        this.name = 'EnricherError';
        this.code = code;
        this.statusCode = options.statusCode;
        this.retryAfterMs = options.retryAfterMs;
    }
}
