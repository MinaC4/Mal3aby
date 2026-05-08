const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const pitches = require('./routes/pitches');
const bookings = require('./routes/bookings');
const notifications = require('./routes/notifications');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Malaby API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.use('/api/pitches', pitches);
app.use('/api/bookings', bookings);
app.use('/api/notifications', notifications);

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Malaby API',
    version: '1.0.0',
    endpoints: {
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

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

module.exports = app;
