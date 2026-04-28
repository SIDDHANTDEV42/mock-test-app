const axios = require('axios');

async function verify() {
    try {
        const res = await axios.get('http://localhost:5000/api/questions');
        console.log(`API returned ${res.data.length} questions.`);
        if (res.data.length > 0) {
            console.log('First question:', res.data[0].text);
        }
    } catch (e) {
        // If it's a 401, that's fine, it means the endpoint is reachable but needs auth
        if (e.response && e.response.status === 401) {
            console.log('API is alive but requires authentication (401). This is expected.');
        } else {
            console.error('API Verification failed:', e.message);
        }
    }
}

verify();
