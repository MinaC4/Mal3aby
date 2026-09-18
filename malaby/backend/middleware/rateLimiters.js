const rateLimit = require('express-rate-limit');

const standard = { standardHeaders: true, legacyHeaders: false };

// Broad limiter for all API traffic.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  ...standard,
  message: { success: false, message: 'Too many requests, please slow down.' }
});

// Stricter limiter for state-changing public endpoints.
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  ...standard,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Login brute-force protection.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  ...standard,
  message: { success: false, message: 'Too many login attempts, try again later.' }
});

module.exports = { apiLimiter, writeLimiter, loginLimiter };
