import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiKeyMiddleware } from './middleware/apiKey.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { ingestionRateLimit } from './middleware/rateLimit.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import healthRoutes from './routes/health.routes.js';
import jobImportRoutes from './routes/jobImport.routes.js';

export const createApp = () => {
    const app = express();
    app.locals.maxBatchSize = env.maxBatchSize;
    app.use(helmet());
    app.use(requestIdMiddleware);
    app.use(express.json({ limit: env.maxBodySize }));
    app.use(env.clientOrigin ? cors({ origin: env.clientOrigin }) : cors());
    app.use(healthRoutes);
    app.use('/api/jobs', apiKeyMiddleware, ingestionRateLimit, jobImportRoutes);
    app.use(notFoundMiddleware);
    app.use(errorHandler);
    return app;
};

export default createApp();
