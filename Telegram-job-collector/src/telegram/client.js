import { TelegramClient } from 'telegram';
import { NewMessage } from 'telegram/events/index.js';
import { StringSession } from 'telegram/sessions/index.js';
import fs from 'node:fs';
import { env } from '../config/env.js';
import { authenticateTelegram, ensureUserAuthorization } from './authentication.js';

export class TelegramClientAdapter {
    constructor({ clientFactory = (session) => new TelegramClient(session, env.apiId, env.apiHash, { connectionRetries: 5 }) } = {}) {
        const configuredSession = env.session.trim();
        let persistedSession = '';
        if (!configuredSession) {
            try {
                persistedSession = fs.readFileSync(env.sessionFile, 'utf8').trim();
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
            }
        }
        this.sessionValue = configuredSession || persistedSession;
        this.session = new StringSession(this.sessionValue);
        this.client = clientFactory(this.session);
    }

    async connect() {
        await authenticateTelegram({ client: this.client, session: this.sessionValue, sessionFile: env.sessionFile });
        await ensureUserAuthorization(this.client);
        return this;
    }

    async disconnect() {
        if (this.client.connected) await this.client.disconnect();
    }

    async getChannel(channel) {
        return this.client.getEntity(channel);
    }

    async getRecentMessages(channel, limit) {
        const entity = await this.getChannel(channel);
        return this.client.getMessages(entity, { limit });
    }

    subscribeToMessages(channel, handler) {
        return this.client.addEventHandler(handler, new NewMessage({ chats: [channel] }));
    }

    getSessionString() {
        return this.client.session.save();
    }
}
