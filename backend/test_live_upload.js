const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://kcet-rank-predictor-production.up.railway.app/api';
const EMAIL = 'admin@collegepredictor.com';
const PASSWORD = 'password123';

async function testUpload() {
  try {
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email: EMAIL, password: PASSWORD });
    const token = loginRes.data.token;
    console.log('Token acquired.');

    console.log('2. Preparing test CSV...');
    const csvPath = path.join(__dirname, 'test_colleges.csv');
    fs.writeFileSync(csvPath, 'College Name,Location,Ranking,Average Package (LPA),Highest Package (LPA),Government Fee (LPA),Management Fee (LPA)\nTest College,' + Date.now() + ',1,5,10,1,2');

    const form = new FormData();
    form.append('files', fs.createReadStream(csvPath));

    console.log('3. Uploading to /admin/colleges/upload...');
    const uploadRes = await axios.post(`${API_URL}/admin/colleges/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('UPLOAD SUCCESS:', uploadRes.data);
  } catch (error) {
    console.error('UPLOAD FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

testUpload();
