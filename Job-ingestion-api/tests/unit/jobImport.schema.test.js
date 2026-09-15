import { jobImportSchema } from '../../src/schemas/jobImport.schema.js';

test('rejects malformed import data', () => {
    const result = jobImportSchema.safeParse({
        sourceType: 'telegram',
        sourceName: '@jobs',
        sourceMessageId: '1',
        rawText: '',
    });
    expect(result.success).toBe(false);
});

test('accepts a valid source-oriented import', () => {
    const result = jobImportSchema.safeParse({
        sourceType: 'telegram',
        sourceName: '@jobs',
        sourceMessageId: '1',
        sourceUrl: 'https://t.me/jobs/1',
        postedAt: '2026-09-15T10:30:00Z',
        rawText: 'Backend Developer',
    });
    expect(result.success).toBe(true);
});
