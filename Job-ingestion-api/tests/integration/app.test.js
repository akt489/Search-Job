process.env.IMPORT_API_KEY = 'test-key';

const { default: request } = await import('supertest');
const { default: app } = await import('../../src/app.js');

test('health endpoint is public', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['x-request-id']).toBeTruthy();
});

test('import endpoint rejects missing authentication', async () => {
    const response = await request(app).post('/api/jobs/import').send({});
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
});