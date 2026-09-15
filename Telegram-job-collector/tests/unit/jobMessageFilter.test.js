import { isCandidateJobMessage } from '../../src/parsers/jobMessageFilter.js';

test('accepts a message with multiple job signals', () => {
    expect(isCandidateJobMessage('Hiring a backend developer. Apply before Friday.')).toBe(true);
});

test('ignores empty and short unrelated messages', () => {
    expect(isCandidateJobMessage('Good morning')).toBe(false);
    expect(isCandidateJobMessage('')).toBe(false);
});
