import { buildSourceUrl, mapTelegramMessage } from '../../src/parsers/telegramMessageParser.js';

test('maps Telegram metadata without changing raw text', () => {
    const message = { id: 12345, date: 1757932200, message: 'Hiring a developer\nApply now' };
    expect(mapTelegramMessage({ message, channel: '@example_jobs' })).toEqual({
        sourceType: 'telegram',
        sourceName: '@example_jobs',
        sourceMessageId: '12345',
        sourceUrl: 'https://t.me/example_jobs/12345',
        postedAt: '2025-09-15T10:30:00.000Z',
        rawText: 'Hiring a developer\nApply now',
    });
});

test('builds public channel URLs', () => {
    expect(buildSourceUrl('https://t.me/example_jobs', 12)).toBe('https://t.me/example_jobs/12');
});
