const axios = require('axios');

const API_URL = 'https://kcet-rank-predictor-production.up.railway.app';

async function diagnose() {
    console.log(`Checking backend at: ${API_URL}`);
    try {
        const response = await axios.get(`${API_URL}/api/health`, { timeout: 10000 });
        console.log('✅ Backend is reachable!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Backend is UNREACHABLE.');
        if (error.code === 'ENOTFOUND') {
            console.log('Error: DNS Resolution failed (NXDOMAIN). The domain does not exist in DNS.');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('Error: Connection refused. The server is not accepting connections.');
        } else if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else {
            console.log('Error Message:', error.message);
        }
        
        console.log('\n--- RECOMMENDATIONS ---');
        console.log('1. Go to Railway Dashboard -> kcet-rank-predictor service -> Settings.');
        console.log('2. Check the "Networking" section.');
        console.log('3. Ensure "Public Networking" is enabled.');
        console.log('4. Verify that the domain listed matches: kcet-rank-predictor-production.up.railway.app');
        console.log('5. If the NXDOMAIN persists, try generating a NEW domain in Railway or attaching your custom domain (api.rank2college.in).');
    }
}

diagnose();
