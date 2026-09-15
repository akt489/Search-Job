export const getMessageText = (message) => {
    if (typeof message?.message === 'string') return message.message;
    if (typeof message?.text === 'string') return message.text;
    return '';
};

export const getMessageDate = (message) => {
    const value = message?.date;
    const date = value instanceof Date ? value : new Date(value ? Number(value) * 1000 : Date.now());
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export const buildSourceUrl = (channel, messageId) => {
    const name = String(channel || '').replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '').replace(/\/$/, '');
    return name ? `https://t.me/${name}/${messageId}` : null;
};

export const mapTelegramMessage = ({ message, channel }) => ({
    sourceType: 'telegram',
    sourceName: channel.startsWith('@') ? channel : `@${channel}`,
    sourceMessageId: String(message.id),
    sourceUrl: buildSourceUrl(channel, message.id),
    postedAt: getMessageDate(message),
    rawText: getMessageText(message),
});
