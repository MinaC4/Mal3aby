const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'malaby_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [register]
});

const httpRequestsTotal = new client.Counter({
  name: 'malaby_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const adminAuthFailures = new client.Counter({
  name: 'malaby_admin_auth_failures_total',
  help: 'Admin endpoint auth failures (missing/invalid token)',
  labelNames: ['reason'],
  registers: [register]
});

module.exports = { client, register, httpRequestDuration, httpRequestsTotal, adminAuthFailures };
