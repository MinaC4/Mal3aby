const test = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';
const { requireAdmin } = require('../middleware/requireAdmin');

function mockRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.body = body; return res; };
  return res;
}

test('rejects requests with no token (401)', () => {
  const res = mockRes();
  let called = false;
  requireAdmin({ headers: {} }, res, () => { called = true; });
  assert.strictEqual(called, false);
  assert.strictEqual(res.statusCode, 401);
});

test('rejects invalid token (403)', () => {
  const res = mockRes();
  let called = false;
  requireAdmin({ headers: { authorization: 'Bearer not-a-jwt' } }, res, () => { called = true; });
  assert.strictEqual(called, false);
  assert.strictEqual(res.statusCode, 403);
});

test('rejects a valid token without the admin role (403)', () => {
  const token = jwt.sign({ sub: 'user', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const res = mockRes();
  let called = false;
  requireAdmin({ headers: { authorization: `Bearer ${token}` } }, res, () => { called = true; });
  assert.strictEqual(called, false);
  assert.strictEqual(res.statusCode, 403);
});

test('accepts a valid admin token and attaches req.admin', () => {
  const token = jwt.sign({ sub: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = mockRes();
  let called = false;
  requireAdmin(req, res, () => { called = true; });
  assert.strictEqual(called, true);
  assert.deepStrictEqual(req.admin, { username: 'admin' });
});
