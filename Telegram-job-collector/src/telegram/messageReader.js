import { logger } from '../utils/logger.js';
import { resolveChannels } from './channelResolver.js';

export const readRecentMessages = async ({ telegramClient, channels, limit }) => {
    const resolved = await resolveChannels(telegramClient, channels);
    const results = [];
    for (const channel of resolved) {
        if (channel.error) {
            logger.error({ event: 'telegram_channel_resolution_failed', channel: channel.configuredName, error: channel.error.message }, 'Telegram channel could not be resolved');
            results.push({ channel: channel.configuredName, messages: [], error: channel.error });
            continue;
        }
        try {
            const messages = await telegramClient.getRecentMessages(channel.configuredName, limit);
            results.push({ channel: channel.configuredName, messages, error: null });
            logger.info({ event: 'telegram_messages_read', channel: channel.configuredName, message_count: messages.length }, 'Telegram messages read');
        } catch (error) {
            logger.error({ event: 'telegram_messages_read_failed', channel: channel.configuredName, error: error.message }, 'Telegram messages could not be read');
            results.push({ channel: channel.configuredName, messages: [], error });
        }
    }
    return results;
};
