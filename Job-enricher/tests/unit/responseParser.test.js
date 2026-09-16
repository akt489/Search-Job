import { extractJson } from '../../src/ai/responseParser.js';

test('parses direct JSON', () => expect(extractJson('{"title":"Developer"}')).toEqual({ title: 'Developer' }));
test('parses fenced JSON', () => expect(extractJson('```json\n{"title":"Developer"}\n```')).toEqual({ title: 'Developer' }));
test('parses JSON embedded in text', () => expect(extractJson('Result: {"title":"Developer"} done')).toEqual({ title: 'Developer' }));
test('rejects malformed JSON', () => expect(() => extractJson('no json')).toThrow('No valid JSON'));
