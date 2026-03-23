const express = require('express');
const Lead = require('../models/Lead');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to protect admin routes
const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.role === 'admin') {
        req.user = user;
        next();
      } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @route POST /api/leads
// @desc Create a new lead
// @access Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, city, rank } = req.body;
    if (!name || !phone || !city) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const lead = await Lead.create({ name, phone, city, rank });
    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/leads
// @desc Get all leads (Admin only)
// @access Private/Admin
router.get('/', protectAdmin, async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
