import express from 'express';

export const createHealthServer = ({ port, getReady }) => {
    const app = express();
    app.get('/health', (req, res) => res.json({ status: 'ok', service: 'job-enricher' }));
    app.get('/ready', async (req, res) => {
        try { res.status((await getReady()) ? 200 : 503).json({ ready: await getReady() }); }
        catch { res.status(503).json({ ready: false }); }
    });
    return new Promise((resolve) => {
        const server = app.listen(port, () => resolve(server));
    });
};
