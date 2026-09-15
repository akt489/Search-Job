process.env.IMPORT_API_KEY = 'test-key';
import { jest } from '@jest/globals';
const { apiKeyMiddleware } = await import('../../src/middleware/apiKey.middleware.js');

test('rejects a missing API key', () => {
    const next = jest.fn();
    apiKeyMiddleware({ get: () => undefined, requestId: 'req-1' }, {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 'UNAUTHORIZED' }));
});

test('accepts the configured bearer API key', () => {
    const next = jest.fn();
    apiKeyMiddleware({ get: () => 'Bearer test-key', requestId: 'req-1' }, {}, next);
    expect(next).toHaveBeenCalledWith();
});
