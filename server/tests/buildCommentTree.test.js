import { test } from 'node:test';
import assert from 'node:assert';
import { buildCommentTree } from '../src/utils/buildCommentTree.js';

test('builds nested replies from a flat list', () => {
  const comments = [
    { _id: 'a', parent: null, body: 'A' },
    { _id: 'b', parent: 'a', body: 'B reply to A' },
    { _id: 'c', parent: 'b', body: 'C reply to B' },
    { _id: 'd', parent: null, body: 'D' },
  ];

  const tree = buildCommentTree(comments);

  assert.strictEqual(tree.length, 2);
  assert.strictEqual(tree[0].replies[0].body, 'B reply to A');
  assert.strictEqual(tree[0].replies[0].replies[0].body, 'C reply to B');
  assert.strictEqual(tree[1].replies.length, 0);
});

test('a reply whose parent is missing becomes a top-level comment', () => {
  const tree = buildCommentTree([{ _id: 'x', parent: 'gone', body: 'X' }]);
  assert.strictEqual(tree.length, 1);
});

test('empty list gives empty tree', () => {
  assert.deepStrictEqual(buildCommentTree([]), []);
});
