import { env } from './config/env.js';
import { pool } from './db/client.js';
import { countPendingJobs } from './db/jobRepository.js';
import { OpenRouterClient } from './ai/aiClient.js';
import { EnrichmentService } from './services/enrichmentService.js';
import { recoverAndClaim } from './services/jobClaimService.js';
import { createHealthServer } from './health/healthServer.js';
import { logger } from './utils/logger.js';
import { sleep } from './utils/sleep.js';

let stopping = false;
let processing = false;
let processedSinceStart = 0;
let usage = { prompt: 0, completion: 0, total: 0 };
const startedAt = Date.now();

const aiClient = new OpenRouterClient({ baseUrl: env.openRouterBaseUrl, apiKey: env.openRouterApiKey, model: env.openRouterModel, timeoutMs: env.requestTimeoutMs, maxRetries: env.maxRetries });
const enrichmentService = new EnrichmentService({
    aiClient, model: env.openRouterModel, onUsage: (value) => {
        usage.prompt += value.prompt_tokens || 0;
        usage.completion += value.completion_tokens || 0;
        usage.total += value.total_tokens || 0;
    }
});
const healthServer = await createHealthServer({ port: env.port, getReady: async () => { await pool.query('SELECT 1'); return true; } });

const processBatch = async () => {
    processing = true;
    try {
        const { recovered, jobs } = await recoverAndClaim({ staleTimeoutMs: env.staleTimeoutMs, batchSize: env.batchSize });
        if (recovered) logger.warn({ event: 'stale_jobs_recovered', count: recovered }, 'Recovered stale enrichment jobs');
        for (const job of jobs) {
            try {
                await enrichmentService.processJob(job);
            } catch (error) {
                logger.error({ event: 'job_enrichment_failed', jobId: job.id, error: error.message }, 'Job enrichment failed');
                try { await enrichmentService.markFailed(job.id, error); } catch (updateError) { logger.error({ event: 'job_failure_update_failed', jobId: job.id, error: updateError.message }, 'Could not mark job failed'); }
            }
            processedSinceStart += 1;
            if (processedSinceStart % 10 === 0) logger.info({ event: 'ai_usage_summary', jobsProcessed: processedSinceStart, totalPromptTokens: usage.prompt, totalCompletionTokens: usage.completion, totalTokens: usage.total }, 'Cumulative AI usage');
        }
    } finally {
        processing = false;
    }
};

const heartbeat = setInterval(async () => {
    try { logger.info({ event: 'worker_heartbeat', pendingCount: await countPendingJobs(), processedSinceStart, uptimeSec: Math.floor((Date.now() - startedAt) / 1000) }, 'Enricher heartbeat'); }
    catch (error) { logger.error({ event: 'heartbeat_failed', error: error.message }, 'Enricher heartbeat failed'); }
}, env.heartbeatIntervalMs);

const shutdown = async (signal, exitCode = 0) => {
    if (stopping) return;
    stopping = true;
    logger.info({ event: 'worker_shutdown', signal }, 'Enricher shutdown requested');
    while (processing) await sleep(100);
    clearInterval(heartbeat);
    await new Promise((resolve) => healthServer.close(resolve));
    await pool.end();
    process.exit(exitCode);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

const runWorker = async () => {
    while (!stopping) {
        await processBatch();
        if (!stopping) await sleep(env.pollIntervalMs);
    }
};

try {
    await runWorker();
} catch (error) {
    logger.fatal({ event: 'worker_failed', error: error.message }, 'Enricher worker stopped unexpectedly');
    process.exitCode = 1;
    await shutdown('worker_failure', 1);
}
