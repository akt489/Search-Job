import 'dotenv/config';

const numberFromEnv = (name, fallback) => {
    const value = Number(process.env[name] ?? fallback);
    if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be a positive number`);
    return value;
};

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: numberFromEnv('PORT', 4010),
    databaseUrl: process.env.DATABASE_URL,
    importApiKey: process.env.IMPORT_API_KEY,
    clientOrigin: process.env.CLIENT_ORIGIN || undefined,
    rateLimitWindowMs: numberFromEnv('RATE_LIMIT_WINDOW_MS', 60_000),
    rateLimitMax: numberFromEnv('RATE_LIMIT_MAX', 120),
    maxBatchSize: numberFromEnv('MAX_BATCH_SIZE', 100),
    maxBodySize: process.env.MAX_BODY_SIZE || '1mb',
    duplicateWindowDays: numberFromEnv('DUPLICATE_WINDOW_DAYS', 7),
};

export const assertProductionConfig = () => {
    const missing = ['DATABASE_URL', 'IMPORT_API_KEY'].filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
};
