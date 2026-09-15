test('loads and parses collector configuration', async () => {
    const original = { ...process.env };
    Object.assign(process.env, {
        TELEGRAM_API_ID: '123',
        TELEGRAM_API_HASH: 'hash',
        INGESTION_API_URL: 'https://ingestion.example',
        IMPORT_API_KEY: 'key',
        CHANNELS: '@one,@two',
    });
    const { loadEnv } = await import('../../src/config/env.js');
    const parsed = loadEnv(process.env);
    expect(parsed.apiId).toBe(123);
    expect(parsed.channels).toEqual(['@one', '@two']);
    process.env = original;
});
