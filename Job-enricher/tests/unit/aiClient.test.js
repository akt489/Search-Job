process.env.DATABASE_URL = 'postgresql://enricher@localhost/db';
process.env.OPENROUTER_API_KEY = 'key';

import { jest } from '@jest/globals';
const { OpenRouterClient } = await import('../../src/ai/aiClient.js');

test('calls OpenRouter without leaking credentials', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ model: 'model', choices: [{ message: { content: '{"title":"Developer"}' } }], usage: { total_tokens: 3 } }) });
    const client = new OpenRouterClient({ baseUrl: 'https://openrouter.example/api/v1', apiKey: 'secret', model: 'model', timeoutMs: 1000, maxRetries: 0, fetchImpl });
    const result = await client.enrich([{ role: 'user', content: 'job' }]);
    expect(result.content).toContain('Developer');
    expect(fetchImpl).toHaveBeenCalledWith('https://openrouter.example/api/v1/chat/completions', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer secret' }) }));
});
