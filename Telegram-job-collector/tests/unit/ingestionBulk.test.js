process.env.TELEGRAM_API_ID = '123';
process.env.TELEGRAM_API_HASH = 'hash';
process.env.INGESTION_API_URL = 'https://ingestion.example';
process.env.IMPORT_API_KEY = 'key';
process.env.CHANNELS = '@jobs';

import { jest } from '@jest/globals';
const { IngestionClient } = await import('../../src/ingestion/ingestionClient.js');

test('sends historical batches to the bulk endpoint', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [{ status: 'created', jobId: 8 }] }),
    });
    const client = new IngestionClient({ baseUrl: 'https://ingestion.example', apiKey: 'secret', timeoutMs: 1000, maxRetries: 0, fetchImpl });
    await client.importBulk([{ sourceType: 'telegram', sourceName: '@jobs', sourceMessageId: '1', rawText: 'Hiring developer' }], 'req-bulk');
    expect(fetchImpl).toHaveBeenCalledWith('https://ingestion.example/api/jobs/import/bulk', expect.objectContaining({
        body: expect.stringContaining('sourceMessageId'),
    }));
});