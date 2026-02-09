// Quick test script for chat API
const testUrl = 'http://localhost:3000/companion/chat';
const testData = {
    message: 'xin chào',
    userId: 'demo-user-id'
};

fetch(testUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
})
    .then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));
