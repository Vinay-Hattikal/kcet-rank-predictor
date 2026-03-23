const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const getAuthToken = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ role: 'admin' });
    if (!user) {
      console.error('Admin not found');
      process.exit(1);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

getAuthToken();
