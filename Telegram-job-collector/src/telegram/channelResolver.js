export const resolveChannels = async (telegramClient, channels) => {
    const resolved = [];
    for (const channel of channels) {
        try {
            const entity = await telegramClient.getChannel(channel);
            resolved.push({ configuredName: channel, entity });
        } catch (error) {
            resolved.push({ configuredName: channel, entity: null, error });
        }
    }
    return resolved;
};
