const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

dotenv.config();

const testUpload = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ role: 'admin' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const form = new FormData();
    form.append('files', fs.createReadStream('c:/Users/Dell/kcet-rank/test_combined.csv'));
    form.append('examType', 'KCET');
    form.append('year', '2024');
    form.append('roundNumber', '1');

    const response = await axios.post('http://localhost:5000/api/admin/cutoffs/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Response:', response.data);
    
    // Check if college was updated
    const College = require('./models/College');
    const college = await College.findOne({ name: /University of Visvesvaraya/i });
    console.log('College Data in DB:', JSON.stringify(college, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

testUpload();
