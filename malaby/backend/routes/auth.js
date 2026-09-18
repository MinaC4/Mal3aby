const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginLimiter } = require('../middleware/rateLimiters');

// @desc    Admin login — issues a JWT
// @route   POST /api/auth/login
// @access  Public (rate-limited)
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const hash = process.env.ADMIN_PASSWORD_HASH;

    if (!hash || !process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Authentication is not configured' });
    }

    const userOk = typeof username === 'string' && username === expectedUser;
    const passOk = typeof password === 'string' && password.length > 0 && (await bcrypt.compare(password, hash));

    if (!userOk || !passOk) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
    const token = jwt.sign({ sub: expectedUser, role: 'admin' }, process.env.JWT_SECRET, { expiresIn });

    return res.status(200).json({
      success: true,
      data: { token, username: expectedUser, expiresIn }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;
