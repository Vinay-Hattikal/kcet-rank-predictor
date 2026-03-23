const axios = require('axios');

const testLiveLogin = async () => {
  try {
    const res = await axios.post('https://kcet-rank-predictor-production.up.railway.app/api/auth/login', {
      email: 'admin@collegepredictor.com',
      password: 'password123'
    });
    console.log('Login Success!');
    console.log('Token:', res.data.token);
    console.log('Role:', res.data.role);
  } catch (err) {
    console.log('Login Failed!');
    console.log('Status:', err.response?.status);
    console.log('Data:', err.response?.data);
  }
};

testLiveLogin();
