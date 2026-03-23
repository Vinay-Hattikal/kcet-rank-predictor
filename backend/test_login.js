const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@collegepredictor.com';
    const password = 'password123';

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found in DB');
      process.exit(1);
    }

    console.log('User found:', user.email);
    console.log('Role:', user.role);

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    // Manual check
    const manualMatch = await bcrypt.compare(password, user.password);
    console.log('Manual bcrypt match result:', manualMatch);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testLogin();
