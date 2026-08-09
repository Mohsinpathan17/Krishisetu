// Simple test script to verify the API endpoint
const http = require('http');

const options = {
  host: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

console.log('Testing API endpoint...');
const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('API Response:', data);
    console.log('Test completed successfully!');
  });
});

req.on('error', (error) => {
  console.error('Error testing API:', error.message);
});

req.end();