const https = require('https');

const data = JSON.stringify({
  email: 'admin@collegepredictor.com',
  password: 'password123'
});

const options = {
  hostname: 'kcet-rank-predictor-production.up.railway.app',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
