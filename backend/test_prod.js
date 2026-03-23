const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testProduction() {
  try {
    // 1. Login to live server
    console.log('Logging in to live server...');
    const loginRes = await axios.post('https://kcet-rank-predictor-production.up.railway.app/api/auth/login', {
      email: 'admin@collegepredictor.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    
    if (!token) {
        console.log('Login failed');
        return;
    }
    console.log('Login successful.');

    // 2. Prepare mock CSV data
    const testCsv = `College: E001 University of Visvesvaraya College of Engineering (A State Autonomous Public University on IIT Model) K R Circle, Bangalore
Course Name,1G,1K,1R,2AG,2AK,2AR,2BG,2BK,2BR,3AG,3AK,3AR,3BG,3BK,3BR,GM,GMK,GMR,GMP,SCG,SCK,SCR,STG,STK,STR
ARTIFICIAL INTELLIGENCE AN,7802,--,--,8424,--,--,9558,11781,--,--,--,--,6904,--,--,6889,9379,--,7574,--,--,26425,41199,33087,25226,--,27201
CIVIL ENGINEERING,77408,--,96372,78404,94879,89482,74579,--,79602,63732,--,--,63278,80218,--,71645,88840.5,61622,--,69924,--,--,84098,119598,93876,112510,--,127611
COMPUTER SCIENCE AND ENG,6520,9347,7462,7544,9881,8120,10476,--,--,5200,--,--,5005,--,--,5723,7871,--,5713,--,--,24490,39060,29024,17552,--,19055
College: E002 Govt.S K S J T Institute of Engineering, Bangalore AMBEDKAR VEEDHI, K.R. CIRCLE, BANGALORE-01
Course Name,1G,1K,1R,2AG,2AK,2AR,2BG,2BK,2BR,3AG,3AK,3AR,3BG,3BK,3BR,GM,GMK,GMR,GMP,SCG,SCK,SCR,STG,STK,STR
CIVIL ENGINEERING,143668,--,--,136248,145540,151931,103223,--,--,108642,--,--,97522,--,--,112853,89550,94744,--,--,--,131895,139264,138771,162948,--,205515`;

    fs.writeFileSync('test_upload_prod.csv', testCsv);

    const formData = new FormData();
    formData.append('files', fs.createReadStream('test_upload_prod.csv'));
    formData.append('examType', 'KCET');
    formData.append('year', '2024');
    formData.append('roundNumber', '1');

    console.log('Sending upload request to production...');
    const res = await axios.post('https://kcet-rank-predictor-production.up.railway.app/api/admin/cutoffs/upload', formData, {
      headers: { 
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}` 
      }
    });
    
    console.log('Status:', res.status);
    console.log('Response:', res.data);
  } catch (err) {
    if (err.response) {
       console.log('Error status:', err.response.status);
       console.log('Error payload:', err.response.data);
    } else {
       console.log('Error:', err.message);
    }
  }
}

testProduction();
