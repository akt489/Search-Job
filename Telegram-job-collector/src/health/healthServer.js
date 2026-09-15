import express from 'express';
import { requestId } from '../middleware/requestId.js';

export const createHealthServer = ({ port, getReadiness = () => true }) => {
    const app = express();
    app.use(requestId);
    app.get('/health', (req, res) => res.json({ status: 'ok', service: 'telegram-job-collector' }));
    app.get('/ready', (req, res) => res.status(getReadiness() ? 200 : 503).json({ ready: getReadiness() }));
    return new Promise((resolve) => {
        const server = app.listen(port, () => resolve(server));
    });
};
