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

// @route POST /api/predict
router.post('/', async (req, res) => {
  try {
    const { examType, marks, rank, category, branch } = req.body;
    
    if (!examType || (!marks && !rank) || !category) {
      return res.status(400).json({ message: 'Missing required fields: Exam Type, Rank, or Category' });
    }

    // Step 1: Use actual rank if provided, otherwise predict (fallback)
    const predictedRank = rank ? Number(rank) : calculateRank(examType, Number(marks));

    // Step 2: Fetch colleges within a specific window: [rank-3000] to [rank+7000]
    // Default to latest round available for that year/exam
    const latestRoundRec = await Cutoff.findOne({ examType, year: new Date().getFullYear() - 1 }).sort({ roundNumber: -1 });
    const roundToUse = latestRoundRec ? latestRoundRec.roundNumber : 1;

    const minRank = Math.max(1, predictedRank - 3000);
    const maxRank = predictedRank + 7000;

    let query = {
      examType,
      category,
      roundNumber: roundToUse,
      closingRank: { $gte: minRank, $lte: maxRank } 
    };

    if (branch) {
      query.courseName = new RegExp(branch, 'i');
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
      recommendations: processedRecommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
