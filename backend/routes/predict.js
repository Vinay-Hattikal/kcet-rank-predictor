const express = require('express');
const Cutoff = require('../models/Cutoff');

const router = express.Router();

// Mock rank calculation function
// In a real app, this would use a complex formula or regression model
const calculateRank = (examType, marks) => {
  if (examType === 'KCET') {
    return Math.max(1, 100000 - (marks * 500)); 
  } else if (examType === 'JEE') {
    return Math.max(1, 1000000 - (marks * 3000));
  }
  return 50000;
};

// @route GET /api/predict/branches
router.get('/branches', async (req, res) => {
  try {
    const branches = await Cutoff.distinct('courseName');
    res.json(branches.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/predict
router.post('/', async (req, res) => {
  try {
    const { examType, marks, rank, category, branch } = req.body;
    
    if (!examType || (!marks && !rank) || !category) {
      return res.status(400).json({ message: 'Missing required fields: Exam Type, Rank, or Category' });
    }

    // Step 1: Use actual rank if provided, otherwise predict (fallback)
    const predictedRank = rank ? Math.round(Number(rank)) : Math.round(calculateRank(examType, Number(marks)));

    // Step 2: Fetch the latest year and round available for this examType
    const latestRec = await Cutoff.findOne({ examType }).sort({ year: -1, roundNumber: -1 });
    const yearUsed = latestRec ? latestRec.year : new Date().getFullYear();
    const roundUsed = latestRec ? latestRec.roundNumber : 1;

    const minRank = Math.max(1, predictedRank - 1000);

    let query = {
      examType,
      category,
      year: yearUsed,
      roundNumber: roundUsed,
      closingRank: { $gte: minRank } 
    };

    console.log('--- PREDICT QUERY ---');
    console.log('Predicted Rank:', predictedRank);
    console.log('Min Rank:', minRank);
    console.log('Query:', JSON.stringify(query, null, 2));

    if (branch) {
      // Create a flexible regex that allows optional spaces between any characters
      const flexibleBranch = branch.trim().split('').map(c => 
        c === ' ' ? '\\s+' : `${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`
      ).join('');
      query.courseName = new RegExp(flexibleBranch, 'i');
    }

    // Sort by best colleges first
    const recommendations = await Cutoff.find(query)
      .populate('collegeId')
      .sort({ closingRank: 1 })
      .limit(100);

    // Map labels 
    const processedRecommendations = recommendations.map(rec => {
      let chance = 'Low';
      let chanceColor = '#ef4444'; // Red

      if (rec.closingRank >= predictedRank + 3000) {
        chance = 'High';
        chanceColor = '#10b981'; // Green
      } else if (rec.closingRank >= predictedRank) {
        chance = 'Medium';
        chanceColor = '#f59e0b'; // Amber
      }

      return { 
        ...rec._doc, 
        chance, 
        chanceColor 
      };
    });

    res.json({
      predictedRank,
      yearUsed,
      roundUsed,
      recommendations: processedRecommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
