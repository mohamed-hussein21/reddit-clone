import { test } from 'node:test';
import assert from 'node:assert';

test('sanity', () => {
  assert.strictEqual(1 + 1, 2);
});
// TODO: add tests for vote concurrency (send many votes at once, check score)
