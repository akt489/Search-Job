import { EnricherError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { sleep } from '../utils/sleep.js';

const retryable = (status) => [429, 500, 502, 503, 504].includes(status);

export class OpenRouterClient {
    constructor({ baseUrl, apiKey, model, timeoutMs, maxRetries, fetchImpl = fetch }) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.model = model;
        this.timeoutMs = timeoutMs;
        this.maxRetries = maxRetries;
        this.fetchImpl = fetchImpl;
    }

    async enrich(messages) {
        for (let attempt = 0; ; attempt += 1) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
            const started = Date.now();
            try {
                const response = await this.fetchImpl(`${this.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: this.model, messages, temperature: 0, response_format: { type: 'json_object' } }),
                    signal: controller.signal,
                });
                const body = await response.json().catch(() => ({}));
                if (!response.ok) {
                    const retryAfter = Number(response.headers.get('retry-after'));
                    const error = new EnricherError(`OpenRouter returned ${response.status}`, 'AI_HTTP_ERROR', { statusCode: response.status, retryAfterMs: retryAfter > 0 ? retryAfter * 1000 : undefined });
                    if (attempt >= this.maxRetries || !retryable(response.status)) throw error;
                    await sleep(error.retryAfterMs || 1000 * 2 ** attempt);
                    continue;
                }
                return {
                    content: body.choices?.[0]?.message?.content || '',
                    usage: body.usage || {},
                    durationMs: Date.now() - started,
                    model: body.model || this.model,
                };
            } catch (error) {
                if (error.code === 'AI_HTTP_ERROR') throw error;
                if (attempt >= this.maxRetries) throw new EnricherError('OpenRouter request failed', 'AI_NETWORK_ERROR', { cause: error });
                logger.warn({ event: 'ai_retry', attempt: attempt + 1 }, 'Retrying OpenRouter request');
                await sleep(1000 * 2 ** attempt);
            } finally {
                clearTimeout(timeout);
            }
        }
    }
}
