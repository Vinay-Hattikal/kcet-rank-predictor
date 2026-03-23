async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@collegepredictor.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    if (!token) {
        console.log('Login failed:', loginData);
        return;
    }

    const res = await fetch('http://localhost:5000/api/admin/colleges/bulk', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        colleges: [
          {
            name: 'Test College',
            location: 'Karnataka',
            ranking: 1,
            placements: { averagePackage: 500000, highestPackage: 1000000 },
            fees: { government: 100000, management: 200000 }
          }
        ]
      })
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.log('Error:', err.message);
  }
}

test();
