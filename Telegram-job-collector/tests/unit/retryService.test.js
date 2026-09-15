import { isRetryableStatus, isRetryableError, getBackoffMs } from '../../src/ingestion/retryService.js';

test('retries transient HTTP statuses only', () => {
    expect(isRetryableStatus(429)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(401)).toBe(false);
});

test('recognizes transient network errors and exponential backoff', () => {
    expect(isRetryableError({ code: 'ETIMEDOUT' })).toBe(true);
    expect(getBackoffMs(0)).toBe(1000);
    expect(getBackoffMs(2)).toBe(4000);
    expect(getBackoffMs(1, 5000)).toBe(5000);
});
