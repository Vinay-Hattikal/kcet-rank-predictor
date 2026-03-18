const express = require('express');
const College = require('../models/College');

const router = express.Router();

// @route GET /api/colleges
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.name = { $regex: escapedSearch, $options: 'i' };
    }
    
    // If searching, limit results; otherwise return all (or use pagination if list is huge)
    const colleges = await College.find(query).limit(search ? 10 : 100);
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/colleges/compare
// Example query: ?ids=id1,id2
router.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ message: 'No college IDs provided' });
    
    const idArray = ids.split(',').slice(0, 4); // max 4 colleges
    const colleges = await College.find({ '_id': { $in: idArray } });
    
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
