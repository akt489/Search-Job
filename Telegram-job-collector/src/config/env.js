import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    TELEGRAM_API_ID: z.coerce.number().int().positive(),
    TELEGRAM_API_HASH: z.string().min(1),
    TELEGRAM_SESSION: z.string().optional().default(''),
    TELEGRAM_SESSION_FILE: z.string().default('.telegram-session'),
    INGESTION_API_URL: z.string().url(),
    IMPORT_API_KEY: z.string().min(1),
    CHANNELS: z.string().min(1),
    LOG_LEVEL: z.string().default('info'),
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().int().positive().default(4020),
    POLL_INTERVAL_MS: z.coerce.number().int().positive().default(30000),
    BATCH_SIZE: z.coerce.number().int().positive().max(100).default(50),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
    MAX_RETRIES: z.coerce.number().int().min(0).max(10).default(3),
    HISTORY_LIMIT: z.coerce.number().int().positive().max(1000).default(100),
    JOB_KEYWORDS: z.string().default('hiring,vacancy,job,position,developer,engineer,internship,recruitment,career,apply,salary,deadline'),
});

export const loadEnv = (source = process.env) => {
    const parsed = envSchema.safeParse(source);
    if (!parsed.success) {
        const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
        throw new Error(`Invalid collector configuration: ${details}`);
    }
    return {
        apiId: parsed.data.TELEGRAM_API_ID,
        apiHash: parsed.data.TELEGRAM_API_HASH,
        session: parsed.data.TELEGRAM_SESSION,
        sessionFile: parsed.data.TELEGRAM_SESSION_FILE,
        ingestionApiUrl: parsed.data.INGESTION_API_URL.replace(/\/$/, ''),
        importApiKey: parsed.data.IMPORT_API_KEY,
        channels: parsed.data.CHANNELS.split(',').map((channel) => channel.trim()).filter(Boolean),
        logLevel: parsed.data.LOG_LEVEL,
        nodeEnv: parsed.data.NODE_ENV,
        port: parsed.data.PORT,
        pollIntervalMs: parsed.data.POLL_INTERVAL_MS,
        batchSize: parsed.data.BATCH_SIZE,
        requestTimeoutMs: parsed.data.REQUEST_TIMEOUT_MS,
        maxRetries: parsed.data.MAX_RETRIES,
        historyLimit: parsed.data.HISTORY_LIMIT,
        jobKeywords: parsed.data.JOB_KEYWORDS.split(',').map((keyword) => keyword.trim().toLowerCase()).filter(Boolean),
    };
};

export const env = loadEnv();
