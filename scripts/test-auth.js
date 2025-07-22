#!/usr/bin/env node

/**
 * Test script to verify authentication endpoints and redirects
 */

const BASE_URL = 'http://localhost:3001';

// Test users from the test system
const testUsers = [
  {
    email: 'robert.smith@email.com',
    password: 'password123',
    expectedRole: 'patient',
    expectedRedirect: '/patient/dashboard'
  },
  {
    email: 'dr.johnson@email.com', 
    password: 'password123',
    expectedRole: 'dentist',
    expectedRedirect: '/dashboard/dentist'
  },
  {
    email: 'mary.wilson@email.com',
    password: 'password123', 
    expectedRole: 'receptionist',
    expectedRedirect: '/receptionist'
  }
];

async function testLogin(user) {
  console.log(`\n🧪 Testing login for ${user.email} (${user.expectedRole})`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/smart-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ Login successful`);
      console.log(`   Role: ${data.user?.role}`);
      console.log(`   Redirect: ${data.redirectUrl}`);
      console.log(`   User Type: ${data.userType}`);
      
      // Verify expected values
      if (data.user?.role === user.expectedRole) {
        console.log(`✅ Role matches expected: ${user.expectedRole}`);
      } else {
        console.log(`❌ Role mismatch. Expected: ${user.expectedRole}, Got: ${data.user?.role}`);
      }
      
      if (data.redirectUrl === user.expectedRedirect) {
        console.log(`✅ Redirect matches expected: ${user.expectedRedirect}`);
      } else {
        console.log(`❌ Redirect mismatch. Expected: ${user.expectedRedirect}, Got: ${data.redirectUrl}`);
      }
      
    } else {
      console.log(`❌ Login failed: ${data.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

async function testAuthMe() {
  console.log(`\n🧪 Testing /api/auth/me endpoint`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting authentication tests...');
  console.log(`Base URL: ${BASE_URL}`);
  
  // Test the /api/auth/me endpoint first
  await testAuthMe();
  
  // Test each user login
  for (const user of testUsers) {
    await testLogin(user);
  }
  
  console.log('\n✨ Tests completed!');
  console.log('\n📝 Manual testing steps:');
  console.log('1. Go to http://localhost:3001/auth/signin');
  console.log('2. Try logging in with:');
  console.log('   - robert.smith@email.com / password123 (should go to /patient/dashboard)');
  console.log('   - dr.johnson@email.com / password123 (should go to /dashboard/dentist)');
  console.log('   - mary.wilson@email.com / password123 (should go to /receptionist)');
  console.log('3. Verify no redirect loops or /api/auth/me issues');
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testLogin, testAuthMe, runTests };
