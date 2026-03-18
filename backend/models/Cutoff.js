const mongoose = require('mongoose');

const cutoffSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  examType: { type: String, enum: ['KCET', 'JEE', 'NEET', 'COMEDK'], required: true },
  year: { type: Number, required: true },
  roundNumber: { type: Number, default: 1 },
  courseName: { type: String, required: true },
  category: { type: String, required: true },
  closingRank: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cutoff', cutoffSchema);
