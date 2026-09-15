export class AppError extends Error {
    constructor(message, code, statusCode = 500, details) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export const isUniqueViolation = (error, constraint) =>
    error?.code === '23505' && (!constraint || error.constraint === constraint);
