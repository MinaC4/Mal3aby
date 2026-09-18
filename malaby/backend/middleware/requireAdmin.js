const jwt = require('jsonwebtoken');
const { adminAuthFailures } = require('../utils/metrics');

// Verifies a Bearer JWT carrying role=admin. 401 when absent, 403 when invalid/expired.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    adminAuthFailures.inc({ reason: 'missing_token' });
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || payload.role !== 'admin') {
      adminAuthFailures.inc({ reason: 'wrong_role' });
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    req.admin = { username: payload.sub };
    return next();
  } catch (err) {
    adminAuthFailures.inc({ reason: 'invalid_token' });
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { requireAdmin };
