#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  console.log('🔍 Testing login credentials...\n');

  try {
    // Test practice users
    console.log('📋 PRACTICE USERS:');
    const practiceUsers = await prisma.practiceUser.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        password: true,
      }
    });

    for (const user of practiceUsers) {
      const passwordTest = await bcrypt.compare('dentist123', user.password || '');
      console.log(`✅ ${user.email} | ${user.firstName} ${user.lastName} | ${user.role} | Active: ${user.isActive} | Verified: ${user.emailVerified} | Password Test: ${passwordTest ? '✅' : '❌'}`);
    }

    console.log('\n📋 PATIENTS:');
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });

    for (const patient of patients) {
      console.log(`✅ ${patient.email} | ${patient.firstName} ${patient.lastName} | PATIENT`);
    }

    console.log('\n🔐 Testing specific login credentials:');
    
    // Test dentist login
    const dentist = await prisma.practiceUser.findUnique({
      where: { email: 'dentist@cognident.org' }
    });

    if (dentist) {
      const passwordMatch = await bcrypt.compare('dentist123', dentist.password || '');
      console.log(`🩺 Dentist Login Test: ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`   Email: ${dentist.email}`);
      console.log(`   Role: ${dentist.role}`);
      console.log(`   Active: ${dentist.isActive}`);
      console.log(`   Verified: ${dentist.emailVerified}`);
    } else {
      console.log('❌ Dentist user not found');
    }

    // Test receptionist login
    const receptionist = await prisma.practiceUser.findUnique({
      where: { email: 'receptionist@cognident.org' }
    });

    if (receptionist) {
      const passwordMatch = await bcrypt.compare('reception123', receptionist.password || '');
      console.log(`🏥 Receptionist Login Test: ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`   Email: ${receptionist.email}`);
      console.log(`   Role: ${receptionist.role}`);
      console.log(`   Active: ${receptionist.isActive}`);
      console.log(`   Verified: ${receptionist.emailVerified}`);
    } else {
      console.log('❌ Receptionist user not found');
    }

    console.log('\n🌐 Testing API endpoint...');
    
    // Test the smart-login API
    try {
      const response = await fetch('http://localhost:3000/api/auth/smart-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'dentist@cognident.org',
          password: 'dentist123'
        })
      });

      const data = await response.json();
      console.log(`🔗 API Test Response:`, data);
      
      if (data.success) {
        console.log('✅ API login successful!');
        console.log(`   Redirect URL: ${data.redirectUrl}`);
        console.log(`   User Type: ${data.userType}`);
      } else {
        console.log('❌ API login failed:', data.error);
      }
    } catch (error) {
      console.log('❌ API test failed:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testLogin();
}

export { testLogin };
