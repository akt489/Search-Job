import { normalizeJob } from '../../src/services/jobNormalization.service.js';

test('normalizes source text into canonical job fields deterministically', () => {
    const result = normalizeJob({
        sourceType: 'telegram',
        sourceName: '@ethiopian_jobs',
        sourceMessageId: '123',
        postedAt: '2026-09-15T10:30:00Z',
        rawText: 'Junior Backend Developer at Acme\nLocation: Addis\n- Node.js\n- 2 years experience\nApply: https://example.com/jobs/1',
    });

    expect(result.title).toBe('Junior Backend Developer');
    expect(result.company).toBe('Acme');
    expect(result.location).toBe('Addis Ababa');
    expect(result.remote).toBe(false);
    expect(result.requirements).toEqual([
        { text: 'Node.js', category: 'technical_skill' },
        { text: '2 years experience', category: 'experience' },
    ]);
    expect(result.applicationUrl).toBe('https://example.com/jobs/1');
});
