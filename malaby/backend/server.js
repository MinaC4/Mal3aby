const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiters');
const { register, httpRequestDuration, httpRequestsTotal } = require('./utils/metrics');

dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const pitches = require('./routes/pitches');
const bookings = require('./routes/bookings');
const notifications = require('./routes/notifications');
const auth = require('./routes/auth');

const app = express();

app.disable('x-powered-by');
// Traffic path: Traefik -> frontend nginx -> api (two proxies). Trusting two hops makes
// express-rate-limit read the real client IP from X-Forwarded-For (one hop gave the Traefik IP).
app.set('trust proxy', 2);
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// CORS: explicit allowlist per environment; "*" only if explicitly configured.
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({
  origin: corsOrigins.length === 0 || corsOrigins.includes('*') ? '*' : corsOrigins,
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}

// Liveness: process is up. Readiness: database is actually reachable.
const dbConnected = () => mongoose.connection.readyState === 1;

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Malaby API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: dbConnected() ? 'connected' : 'disconnected'
  });
});

app.get('/ready', (req, res) => {
  if (!dbConnected()) {
    return res.status(503).json({ success: false, message: 'Database not ready' });
  }
  return res.status(200).json({ success: true, message: 'Ready' });
});

// Prometheus metrics for every request (also used by Grafana dashboards).
app.use((req, res, next) => {
  const stop = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const labels = { method: req.method, route: req.route ? req.route.path : 'unmatched', status: String(res.statusCode) };
    stop(labels);
    httpRequestsTotal.inc(labels);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api', apiLimiter);
app.use('/api/auth', auth);
app.use('/api/pitches', pitches);
app.use('/api/bookings', bookings);
app.use('/api/notifications', notifications);

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Malaby API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      pitches: '/api/pitches',
      bookings: '/api/bookings',
      notifications: '/api/notifications',
      health: '/health'
    }
  });
});

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const adminDist = path.join(__dirname, '../frontend-admin/dist');
  const userDist = path.join(__dirname, '../frontend-user/dist');

  app.use('/admin', express.static(adminDist));
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });

  app.use(express.static(userDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(userDist, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    });
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

// Graceful shutdown so Kubernetes rolling updates don't wait for the kill timeout.
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
});

module.exports = app;
