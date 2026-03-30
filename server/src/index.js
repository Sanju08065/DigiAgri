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

// ── CORS — must be FIRST, before everything ────────────────────────────────
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: false,
};
app.use(cors(corsOptions));

// Handle ALL preflight OPTIONS requests immediately — no DB needed
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── DB connection (cached for serverless) ──────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
let cached = global._mongoConn || { conn: null, promise: null };
global._mongoConn = cached;

async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set in environment variables');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ── DB middleware — skip for OPTIONS (preflight) and health ────────────────
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // preflight — no DB needed
  if (req.path === '/api/health') return next(); // health check — no DB needed
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Database connection failed', detail: err.message });
  }
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    db: states[mongoose.connection.readyState] || 'unknown',
    mongoUri: MONGODB_URI ? 'set' : 'NOT SET',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/weather', weatherRoutes);

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ── Local dev ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server on port ${PORT}`)))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = app;
