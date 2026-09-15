process.env.TELEGRAM_API_ID = '123';
process.env.TELEGRAM_API_HASH = 'hash';
process.env.INGESTION_API_URL = 'https://ingestion.example';
process.env.IMPORT_API_KEY = 'key';
process.env.CHANNELS = '@jobs';

import { jest } from '@jest/globals';
const { IngestionClient } = await import('../../src/ingestion/ingestionClient.js');

test('sends the exact bearer contract and maps a successful response', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'created', jobId: 7, requestId: 'req-1' }),
    });
    const client = new IngestionClient({ baseUrl: 'https://ingestion.example', apiKey: 'secret', timeoutMs: 1000, maxRetries: 0, fetchImpl });
    const result = await client.importJob({ sourceType: 'telegram', sourceName: '@jobs', sourceMessageId: '1', rawText: 'Hiring developer' }, 'req-1');
    expect(result.status).toBe('created');
    expect(fetchImpl).toHaveBeenCalledWith('https://ingestion.example/api/jobs/import', expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer secret', 'X-Request-ID': 'req-1' }),
    }));
});
