require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cropRoutes = require('./routes/crops');
const complaintRoutes = require('./routes/complaints');
const schemeRoutes = require('./routes/schemes');
const weatherRoutes = require('./routes/weather');

const app = express();

// ── CORS first — before everything ────────────────────────────────────────
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', allowedHeaders: 'Content-Type,Authorization', credentials: false }));
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.status(204).end();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── MongoDB connection (serverless-safe) ───────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI env var not set — add it in Vercel project settings');
  // Already connected
  if (mongoose.connection.readyState === 1) return;
  // Connecting — wait for it
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
    return;
  }
  // Connect fresh
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });
}

// ── DB middleware — skip OPTIONS and health ────────────────────────────────
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed', detail: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    db: states[mongoose.connection.readyState] || 'unknown',
    mongoUri: MONGODB_URI ? 'set ✓' : 'NOT SET ✗ — add MONGODB_URI in Vercel env vars',
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/weather', weatherRoutes);

// ── Error handler ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ── Local dev only ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server on port ${PORT}`)))
    .catch(err => { console.error(err.message); process.exit(1); });
}

module.exports = app;
