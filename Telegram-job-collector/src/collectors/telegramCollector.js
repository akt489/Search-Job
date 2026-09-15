import { randomUUID } from 'node:crypto';
import { isCandidateJobMessage } from '../parsers/jobMessageFilter.js';
import { buildIngestionPayload } from '../ingestion/ingestionPayload.js';
import { logger } from '../utils/logger.js';
import { readRecentMessages } from '../telegram/messageReader.js';

export class TelegramCollector {
    constructor({ telegramClient, ingestionClient, channels, historyLimit, batchSize, jobKeywords }) {
        this.telegramClient = telegramClient;
        this.ingestionClient = ingestionClient;
        this.channels = channels;
        this.historyLimit = historyLimit;
        this.batchSize = batchSize;
        this.jobKeywords = jobKeywords;
        this.handlers = [];
    }

    async collectHistory() {
        const channelResults = await readRecentMessages({ telegramClient: this.telegramClient, channels: this.channels, limit: this.historyLimit });
        const summary = [];
        for (const result of channelResults) {
            const candidates = result.messages.filter((message) => isCandidateJobMessage(message.message || message.text, this.jobKeywords));
            const payloads = candidates.map((message) => buildIngestionPayload({ message, channel: result.channel }));
            const channelSummary = { channel: result.channel, scanned: result.messages.length, potentialJobs: payloads.length, created: 0, duplicates: 0, invalid: 0, failed: 0 };
            for (let index = 0; index < payloads.length; index += this.batchSize) {
                const batch = payloads.slice(index, index + this.batchSize);
                try {
                    const response = await this.ingestionClient.importBulk(batch, randomUUID());
                    for (const item of response.results || []) {
                        if (item.status === 'created') channelSummary.created += 1;
                        else if (item.status === 'duplicate') channelSummary.duplicates += 1;
                        else if (item.status === 'invalid') channelSummary.invalid += 1;
                        else channelSummary.failed += 1;
                    }
                } catch (error) {
                    channelSummary.failed += batch.length;
                    logger.error({ event: 'job_batch_submission_failed', channel: result.channel, batch_size: batch.length, error: error.message }, 'Candidate job batch submission failed');
                }
            }
            summary.push(channelSummary);
            logger.info({ event: 'telegram_history_completed', ...channelSummary }, 'Telegram history collection completed');
        }
        return summary;
    }

    async monitor() {
        for (const channel of this.channels) {
            const handler = async (event) => {
                const message = event.message || event;
                if (!isCandidateJobMessage(message.message || message.text, this.jobKeywords)) return;
                const payload = buildIngestionPayload({ message, channel });
                try {
                    await this.ingestionClient.importJob(payload, randomUUID());
                } catch (error) {
                    logger.error({ event: 'telegram_realtime_submission_failed', channel, message_id: payload.sourceMessageId, error: error.message }, 'Real-time Telegram submission failed');
                }
            };
            this.telegramClient.subscribeToMessages(channel, handler);
            this.handlers.push(handler);
            logger.info({ event: 'telegram_channel_monitoring', channel }, 'Telegram channel monitoring enabled');
        }
    }

    stopMonitoring() {
        this.handlers.length = 0;
    }
}
