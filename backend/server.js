require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Reduced limit for security
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'College Predictor API is running' });
});

// Routes (to be implemented)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/predict', require('./routes/predict'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leads', require('./routes/leads'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.stack) console.error(err.stack);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // In production, we usually hide stack traces, but for setup phase we can show more message info
  res.status(statusCode).json({
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ensure uploads directory exists
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Fix: Ensure MONGO_URI is provided by Railway/Environment
if (!process.env.MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
