import { env } from './config/env.js';
import { TelegramClientAdapter } from './telegram/client.js';
import { IngestionClient } from './ingestion/ingestionClient.js';
import { TelegramCollector } from './collectors/telegramCollector.js';
import { validateConfiguredChannels } from './services/channelService.js';
import { createHealthServer } from './health/healthServer.js';
import { runHistoryCollection } from './services/collectionService.js';
import { logger } from './utils/logger.js';

const channels = validateConfiguredChannels(env.channels);
if (!channels.length) throw new Error('No valid Telegram channels configured');

const telegramClient = new TelegramClientAdapter();
const ingestionClient = new IngestionClient({
    baseUrl: env.ingestionApiUrl,
    apiKey: env.importApiKey,
    timeoutMs: env.requestTimeoutMs,
    maxRetries: env.maxRetries,
});
const collector = new TelegramCollector({ ...env, telegramClient, ingestionClient, channels });
const historyMode = process.argv.includes('--history');
const healthServer = historyMode ? null : await createHealthServer({ port: env.port, getReadiness: () => Boolean(telegramClient.client?.connected) });

try {
    await telegramClient.connect();
    if (historyMode) {
        await runHistoryCollection(collector);
    } else {
        await collector.monitor();
    }
} catch (error) {
    logger.fatal({ event: 'collector_start_failed', error: error.message }, 'Telegram collector failed to start');
    healthServer?.close();
    await telegramClient.disconnect();
    process.exitCode = 1;
}

const shutdown = async (signal) => {
    logger.info({ event: 'collector_shutdown', signal }, 'Telegram collector shutting down');
    collector.stopMonitoring();
    await telegramClient.disconnect();
    if (healthServer) await new Promise((resolve) => healthServer.close(resolve));
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
