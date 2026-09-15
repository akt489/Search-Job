import readline from 'node:readline/promises';
import fs from 'node:fs/promises';
import { stdin as input, stdout as output } from 'node:process';
import { StringSession } from 'telegram/sessions/index.js';
import { Api } from 'telegram/index.js';
import { logger } from '../utils/logger.js';

const ask = async (question) => {
    const prompt = readline.createInterface({ input, output });
    try {
        return (await prompt.question(question)).trim();
    } finally {
        prompt.close();
    }
};

export const authenticateTelegram = async ({ client, session, sessionFile }) => {
    if (session) {
        await client.connect();
        logger.info({ event: 'telegram_connected' }, 'Telegram session connected');
        return session;
    }

    await client.start({
        phoneNumber: () => ask('Telegram phone number: '),
        password: () => ask('Telegram 2FA password: '),
        phoneCode: () => ask('Telegram login code: '),
        onError: (error) => logger.error({ event: 'telegram_authentication_error', error: error.message }, 'Telegram authentication failed'),
    });

    const savedSession = client.session.save();
    await fs.writeFile(sessionFile, savedSession, { encoding: 'utf8', mode: 0o600 });
    console.log(`TELEGRAM_SESSION=${savedSession}`);
    logger.info({ event: 'telegram_authenticated', session_saved: true }, 'Telegram authentication completed');
    return savedSession;
};

export const ensureUserAuthorization = async (client) => {
    const me = await client.getMe();
    if (!me) throw new Error('Telegram account authorization could not be verified');
    return me;
};

export const getApiEntity = (channel) => (channel.startsWith('@') ? channel : new Api.PeerChannel({ channelId: channel }));

export { StringSession };
