import app from './app.js';
import { assertProductionConfig, env } from './config/env.js';
import { pool } from './config/database.js';
import { logger } from './utils/logger.js';

assertProductionConfig();
const server = app.listen(env.port, () => {
    logger.info({ event: 'server_started', port: env.port, environment: env.nodeEnv }, 'Job ingestion API started');
});

const shutdown = async (signal) => {
    logger.info({ event: 'server_shutdown', signal }, 'Job ingestion API shutting down');
    server.close(async () => {
        await pool.end();
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
