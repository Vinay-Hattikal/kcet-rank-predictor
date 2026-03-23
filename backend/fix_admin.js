const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const diagnostic = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@collegepredictor.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Admin user NOT found in database.');
      return;
    }

    console.log('Admin user found:', user.email);
    console.log('Role:', user.role);
    
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log('Password match for "admin123":', isMatch);

    if (!isMatch) {
      console.log('Password mismatch! Re-hashing password to fix...');
      user.password = 'admin123';
      await user.save();
      console.log('Password updated and saved.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Diagnostic error:', error);
    process.exit(1);
  }
};

diagnostic();
