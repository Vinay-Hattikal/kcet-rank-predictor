const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const College = require('./models/College');
const Cutoff = require('./models/Cutoff');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-predictor');

const seedData = async () => {
  try {
    await User.deleteMany();
    await College.deleteMany();
    await Cutoff.deleteMany();

    console.log('Database cleared');

    // Admin user
    await User.create({
      name: 'Admin',
      email: 'admin@collegepredictor.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Admin user created');

    // Colleges
    const colleges = await College.insertMany([
      {
        name: 'RV College of Engineering',
        location: 'Bengaluru',
        placements: { averagePackage: 1200000, highestPackage: 5000000 },
        fees: { government: 100000, management: 500000 },
        infrastructureRating: 9,
        ranking: 1,
        coursesOffered: ['Computer Science', 'Electronics']
      },
      {
        name: 'PES University',
        location: 'Bengaluru',
        placements: { averagePackage: 1000000, highestPackage: 4500000 },
        fees: { government: 110000, management: 450000 },
        infrastructureRating: 8,
        ranking: 2,
        coursesOffered: ['Computer Science', 'Mechanical']
      },
      {
        name: 'BMS College of Engineering',
        location: 'Bengaluru',
        placements: { averagePackage: 800000, highestPackage: 3000000 },
        fees: { government: 90000, management: 400000 },
        infrastructureRating: 8,
        ranking: 3,
        coursesOffered: ['Computer Science', 'Civil']
      }
    ]);

    console.log('Colleges created');

    // Cutoffs
    await Cutoff.insertMany([
      { collegeId: colleges[0]._id, examType: 'KCET', year: 2025, courseName: 'Computer Science', category: 'General', closingRank: 300 },
      { collegeId: colleges[0]._id, examType: 'KCET', year: 2025, courseName: 'Electronics', category: 'General', closingRank: 800 },
      { collegeId: colleges[1]._id, examType: 'KCET', year: 2025, courseName: 'Computer Science', category: 'General', closingRank: 1000 },
      { collegeId: colleges[2]._id, examType: 'KCET', year: 2025, courseName: 'Computer Science', category: 'General', closingRank: 1500 }
    ]);

    console.log('Cutoffs seeded');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
