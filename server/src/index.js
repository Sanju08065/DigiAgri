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

// CORS — allow all origins in production (tighten to your Vercel frontend URL if needed)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/weather', weatherRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-agriculture';

// Cache DB connection across serverless invocations
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
  console.log('MongoDB connected');
};

// For local dev — start server normally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(err => console.error('MongoDB connection error:', err));
} else {
  // For Vercel serverless — connect on each cold start
  connectDB().catch(console.error);
}

module.exports = app;
