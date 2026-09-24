const test = require('node:test');
const assert = require('node:assert');
const { isValidDuration, isValidDateString } = require('../utils/validation');

test('isValidDuration accepts 1..4 only', () => {
  assert.strictEqual(isValidDuration(1), true);
  assert.strictEqual(isValidDuration('2'), true);
  assert.strictEqual(isValidDuration(4), true);
  assert.strictEqual(isValidDuration(0), false);
  assert.strictEqual(isValidDuration(5), false);
  assert.strictEqual(isValidDuration(-1000000), false);
  assert.strictEqual(isValidDuration(1.5), false);
  assert.strictEqual(isValidDuration('abc'), false);
  assert.strictEqual(isValidDuration(undefined), false);
});

test('isValidDateString accepts YYYY-MM-DD only', () => {
  assert.strictEqual(isValidDateString('2026-12-01'), true);
  assert.strictEqual(isValidDateString('2026-1-1'), false);
  assert.strictEqual(isValidDateString('01-12-2026'), false);
  assert.strictEqual(isValidDateString('not-a-date'), false);
  assert.strictEqual(isValidDateString(undefined), false);
});
