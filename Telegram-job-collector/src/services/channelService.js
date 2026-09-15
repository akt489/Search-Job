import { logger } from '../utils/logger.js';

export const validateConfiguredChannels = (channels) => {
    const valid = channels.filter((channel) => /^@[a-zA-Z0-9_]{3,}$/.test(channel) || /^https:\/\/t\.me\/[a-zA-Z0-9_]{3,}$/.test(channel));
    for (const channel of channels.filter((item) => !valid.includes(item))) {
        logger.warn({ event: 'invalid_channel_configuration', channel }, 'Ignoring invalid Telegram channel configuration');
    }
    return valid;
};
