const axios = require('axios');

async function testAuth() {
    const baseUrl = 'http://localhost:3000'; // Checking main.ts for port, default often 3000 or 3001

    try {
        // 1. Register
        console.log('Testing Register...');
        const email = `test_${Date.now()}@example.com`;
        const registerRes = await axios.post(`${baseUrl}/auth/register`, {
            email,
            password: 'password123',
            fullName: 'Test User'
        });
        console.log('Register Success:', registerRes.data);
        const { access_token } = registerRes.data;

        // 2. Login
        console.log('Testing Login...');
        const loginRes = await axios.post(`${baseUrl}/auth/login`, {
            email,
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data);

        // 3. Get Me
        console.log('Testing Get Me...');
        const meRes = await axios.get(`${baseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        console.log('Get Me Success:', meRes.data);

    } catch (error) {
        console.error('Test Failed:', error);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data));
        }
    }
}

testAuth();
