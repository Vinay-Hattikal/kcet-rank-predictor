const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  placements: {
    averagePackage: { type: Number, required: true },
    highestPackage: { type: Number, required: true }
  },
  fees: {
    government: { type: Number, required: true },
    management: { type: Number, required: true }
  },
  infrastructureRating: { type: Number, min: 1, max: 10 },
  ranking: { type: Number },
  coursesOffered: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('College', collegeSchema);
