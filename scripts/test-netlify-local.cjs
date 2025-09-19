#!/usr/bin/env node

/**
 * Script to test Netlify Functions locally
 * This helps verify that the API endpoints work before deployment
 */

const fs = require('fs');
const path = require('path');

// Mock event object for testing
const mockEvent = {
  httpMethod: 'GET',
  path: '/.netlify/functions/api/characters',
  body: null,
};

// Mock context object
const mockContext = {};

console.log('🧪 Testing Netlify Function locally...\n');

function testFunction() {
  try {
  // Check if db.json exists
  const dbPath = path.join(__dirname, '..', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ db.json not found. Run "npm run generate-data" first.');
    process.exit(1);
  }

  // Load the function
  const functionPath = path.join(__dirname, '..', 'netlify', 'functions', 'api.js');
  if (!fs.existsSync(functionPath)) {
    console.error('❌ Netlify function not found at:', functionPath);
    process.exit(1);
  }

  // Import and test the function
  const apiFunction = require(functionPath);

  console.log('✅ Function loaded successfully');
  console.log('📊 Testing GET /characters endpoint...\n');

  // Test the function
  apiFunction.handler(mockEvent, mockContext)
    .then(result => {
      console.log('📋 Response Status:', result.statusCode);
      console.log('📋 Response Headers:', JSON.stringify(result.headers, null, 2));
      
      if (result.body) {
        try {
          const data = JSON.parse(result.body);
          console.log('📋 Response Data:');
          console.log(`   - Total characters: ${data.length}`);
          console.log(`   - First character: ${data[0]?.name || 'N/A'}`);
          console.log(`   - Sample IDs: ${data.slice(0, 3).map(c => c.id).join(', ')}`);
        } catch (e) {
          console.log('📋 Response Body:', result.body);
        }
      }

      if (result.statusCode === 200) {
        console.log('\n✅ Function test passed! Ready for deployment.');
      } else {
        console.log('\n❌ Function test failed. Check the implementation.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Function test error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Test setup error:', error);
    process.exit(1);
  }
}

// Run the test
testFunction();
