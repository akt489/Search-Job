import { enrichmentSchema } from '../../src/validation/enrichmentSchema.js';

test('accepts valid enrichment output', () => expect(enrichmentSchema.parse({ title: 'Developer', requirements: [] })).toEqual(expect.objectContaining({ title: 'Developer', requirements: [] })));
test('rejects invalid types', () => expect(() => enrichmentSchema.parse({ title: 'Developer', remote: 'yes' })).toThrow());
test('requires a non-empty title', () => expect(() => enrichmentSchema.parse({ title: '', requirements: [] })).toThrow());
