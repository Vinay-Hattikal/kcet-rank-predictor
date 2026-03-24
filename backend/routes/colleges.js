const express = require('express');
const College = require('../models/College');
const Cutoff = require('../models/Cutoff');

const router = express.Router();

// @route GET /api/colleges
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Build an abbreviation-aware pattern: "rv" → r[.\s\-]*v
      // This makes each character optionally separated by dots, spaces, or hyphens
      const fuzzyAbbreviationPattern = escapedSearch
        .split('')
        .join('[.\\s\\-]*');

      query = {
        $or: [
          // Direct substring match (e.g. "rv" matches "RV Institute")
          { name: { $regex: escapedSearch, $options: 'i' } },
          // Abbreviation-aware match (e.g. "rv" matches "R.V. College")
          { name: { $regex: fuzzyAbbreviationPattern, $options: 'i' } }
        ]
      };
    }
    
    // If searching, limit results; otherwise return all (or use pagination if list is huge)
    const colleges = await College.find(query).limit(search ? 15 : 100);
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

// @route GET /api/colleges/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const college = await College.findOne({ slug });
    
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    // Fetch all cutoffs for this college
    const cutoffs = await Cutoff.find({ collegeId: college._id }).sort({ year: -1, roundNumber: 1 });
    
    res.json({
      college,
      cutoffs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
