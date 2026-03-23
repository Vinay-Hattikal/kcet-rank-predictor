const mongoose = require('mongoose');
const dotenv = require('dotenv');
const College = require('./models/College');

dotenv.config();

const inspectData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const college = await College.findOne({ name: /PES UNIVERSITY/i });
    if (college) {
      console.log('Found College:', college.name);
      console.log('Ranking:', college.ranking);
      console.log('Location:', college.location);
      console.log('Placements:', JSON.stringify(college.placements));
      console.log('Fees:', JSON.stringify(college.fees));
    } else {
      console.log('College not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

inspectData();
