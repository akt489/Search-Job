import { sleep } from '../utils/sleep.js';

export const isRetryableStatus = (status) => status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
export const isRetryableError = (error) => error?.name === 'AbortError' || ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'].includes(error?.code);
export const getBackoffMs = (attempt, retryAfterMs) => retryAfterMs ?? 1000 * (2 ** attempt);

export const withRetries = async (operation, { maxRetries, onRetry = () => { } }) => {
    let attempt = 0;
    while (true) {
        try {
            return await operation(attempt);
        } catch (error) {
            if (attempt >= maxRetries || (!isRetryableStatus(error.statusCode) && !isRetryableError(error))) throw error;
            const delayMs = getBackoffMs(attempt, error.retryAfterMs);
            await onRetry({ attempt: attempt + 1, delayMs, error });
            await sleep(delayMs);
            attempt += 1;
        }
    }
};
