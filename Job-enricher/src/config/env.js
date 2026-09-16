import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
    DATABASE_URL: z.string().url(),
    DIRECT_DATABASE_URL: z.string().url().optional(),
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().min(1).default('deepseek/deepseek-chat'),
    OPENROUTER_BASE_URL: z.string().url().default('https://openrouter.ai/api/v1'),
    BATCH_SIZE: z.coerce.number().int().positive().max(50).default(5),
    POLL_INTERVAL_MS: z.coerce.number().int().positive().default(60000),
    MAX_RETRIES: z.coerce.number().int().min(0).max(10).default(3),
    STALE_TIMEOUT_MS: z.coerce.number().int().positive().default(600000),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
    HEARTBEAT_INTERVAL_MS: z.coerce.number().int().positive().default(300000),
    LOG_LEVEL: z.string().default('info'),
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().int().positive().default(4030),
});

export const loadEnv = (source = process.env) => {
    const result = schema.safeParse(source);
    if (!result.success) {
        const message = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
        throw new Error(`Invalid enricher configuration: ${message}`);
    }
    return {
        databaseUrl: result.data.DATABASE_URL,
        directDatabaseUrl: result.data.DIRECT_DATABASE_URL || result.data.DATABASE_URL,
        openRouterApiKey: result.data.OPENROUTER_API_KEY,
        openRouterModel: result.data.OPENROUTER_MODEL,
        openRouterBaseUrl: result.data.OPENROUTER_BASE_URL.replace(/\/$/, ''),
        batchSize: result.data.BATCH_SIZE,
        pollIntervalMs: result.data.POLL_INTERVAL_MS,
        maxRetries: result.data.MAX_RETRIES,
        staleTimeoutMs: result.data.STALE_TIMEOUT_MS,
        requestTimeoutMs: result.data.REQUEST_TIMEOUT_MS,
        heartbeatIntervalMs: result.data.HEARTBEAT_INTERVAL_MS,
        logLevel: result.data.LOG_LEVEL,
        nodeEnv: result.data.NODE_ENV,
        port: result.data.PORT,
    };
};

export const env = loadEnv();
