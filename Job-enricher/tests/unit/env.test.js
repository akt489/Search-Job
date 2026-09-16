process.env.DATABASE_URL = 'postgresql://enricher@localhost/db';
process.env.OPENROUTER_API_KEY = 'key';

test('loads dedicated database and worker configuration', async () => {
    const { loadEnv } = await import('../../src/config/env.js');
    const parsed = loadEnv({ DATABASE_URL: 'postgresql://enricher@localhost/db', DIRECT_DATABASE_URL: 'postgresql://enricher@localhost/db', OPENROUTER_API_KEY: 'key', OPENROUTER_MODEL: 'model' });
    expect(parsed.databaseUrl).toContain('enricher');
    expect(parsed.batchSize).toBe(5);
});
