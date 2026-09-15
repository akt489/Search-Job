import { CollectorError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { withRetries } from './retryService.js';

export class IngestionClient {
    constructor({ baseUrl, apiKey, timeoutMs, maxRetries, fetchImpl = fetch }) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiKey = apiKey;
        this.timeoutMs = timeoutMs;
        this.maxRetries = maxRetries;
        this.fetchImpl = fetchImpl;
    }

    async request(path, payload, requestId) {
        return withRetries(async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
            try {
                const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Request-ID': requestId,
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                });
                const body = await response.json().catch(() => ({}));
                if (!response.ok) {
                    const retryAfter = Number(response.headers.get('retry-after'));
                    throw new CollectorError(body?.error?.message || `Ingestion API returned ${response.status}`, 'INGESTION_HTTP_ERROR', {
                        statusCode: response.status,
                        retryAfterMs: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : undefined,
                    });
                }
                logger.info({ event: 'job_submitted', source_message_id: payload.sourceMessageId, request_id: body.requestId || requestId, status: body.status }, 'Job submitted to ingestion API');
                return body;
            } finally {
                clearTimeout(timeout);
            }
        }, {
            maxRetries: this.maxRetries,
            onRetry: ({ attempt, delayMs, error }) => logger.warn({ event: 'ingestion_retry', attempt, delay_ms: delayMs, status_code: error.statusCode, source_message_id: payload.sourceMessageId }, 'Retrying ingestion request'),
        });
    }

    async importJob(payload, requestId) {
        return this.request('/api/jobs/import', payload, requestId);
    }

    async importBulk(payloads, requestId) {
        return this.request('/api/jobs/import/bulk', { items: payloads }, requestId);
    }
}
