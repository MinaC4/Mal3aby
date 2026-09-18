const test = require('node:test');
const assert = require('node:assert');
const { escapeRegex, validateHttpUrl } = require('../utils/security');

test('escapeRegex neutralises regex metacharacters', () => {
  assert.strictEqual(escapeRegex('a.b*c'), 'a\\.b\\*c');
  assert.strictEqual(escapeRegex('(x)[y]{z}'), '\\(x\\)\\[y\\]\\{z\\}');
  assert.strictEqual(escapeRegex('^$|?+\\'), '\\^\\$\\|\\?\\+\\\\');
});

test('validateHttpUrl accepts only http(s) URLs', () => {
  assert.strictEqual(validateHttpUrl('https://example.com/a.png'), true);
  assert.strictEqual(validateHttpUrl('http://example.com/a.png'), true);
  assert.strictEqual(validateHttpUrl('javascript:alert(1)'), false);
  assert.strictEqual(validateHttpUrl('ftp://example.com/x'), false);
  assert.strictEqual(validateHttpUrl('not a url'), false);
  assert.strictEqual(validateHttpUrl(''), false);
  assert.strictEqual(validateHttpUrl(undefined), false);
  assert.strictEqual(validateHttpUrl('https://x.com/' + 'a'.repeat(3000)), false);
});
