import { mapTelegramMessage } from '../parsers/telegramMessageParser.js';

export const buildIngestionPayload = ({ message, channel }) => mapTelegramMessage({ message, channel });
