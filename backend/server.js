// server.js — YewToob Express Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded files

// ── Routes ────────────────────────────────────────────────────
app.use('/api/users',         require('./routes/users'));
app.use('/api/videos',        require('./routes/videos'));
app.use('/api/comments',      require('./routes/comments'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'YewToob' }));

// ── MongoDB connection + server start ─────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yewtoob';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
    }
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
  });

module.exports = app;
