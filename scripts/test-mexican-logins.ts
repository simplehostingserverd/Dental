#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MEXICAN_CREDENTIALS = [
  { email: 'dentist.es@cognident.org', password: 'dentista123', role: 'DOCTOR', name: 'Dr. Carlos Rodriguez' },
  { email: 'recepcionista@cognident.org', password: 'recepcion123', role: 'RECEPTIONIST', name: 'Ana Martinez' },
  { email: 'asistente@cognident.org', password: 'asistente123', role: 'ASSISTANT', name: 'Roberto Lopez' },
];

async function testMexicanLogins() {
  console.log('🇲🇽 Testing Mexican Login System...\n');

  try {
    // Test database credentials
    console.log('📋 MEXICAN PRACTICE USERS IN DATABASE:');
    console.log('=====================================');
    
    for (const cred of MEXICAN_CREDENTIALS) {
      try {
        const user = await prisma.practiceUser.findUnique({
          where: { email: cred.email },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            emailVerified: true,
            password: true,
            practiceId: true,
          }
        });

        if (user) {
          const passwordMatch = await bcrypt.compare(cred.password, user.password || '');
          console.log(`✅ ${cred.role.padEnd(12)} | ${user.email.padEnd(35)} | ${passwordMatch ? '✅ PASS' : '❌ FAIL'}`);
          console.log(`   Name: ${user.firstName} ${user.lastName}`);
          console.log(`   Active: ${user.isActive} | Verified: ${user.emailVerified}`);
          console.log(`   Practice ID: ${user.practiceId}`);
          console.log('');
        } else {
          console.log(`❌ ${cred.role.padEnd(12)} | ${cred.email.padEnd(35)} | USER NOT FOUND`);
        }
      } catch (error) {
        console.log(`❌ Error testing ${cred.email}:`, error);
      }
    }

    // Test API endpoints
    console.log('🌐 TESTING MEXICAN API AUTHENTICATION:');
    console.log('=====================================');

    for (const cred of MEXICAN_CREDENTIALS) {
      try {
        console.log(`Testing ${cred.role}: ${cred.email}...`);
        
        const response = await fetch('http://localhost:3000/api/auth/smart-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: cred.email,
            password: cred.password
          })
        });

        const data = await response.json();
        
        if (data.success) {
          console.log(`✅ ${cred.role} API LOGIN SUCCESS`);
          console.log(`   Redirect URL: ${data.redirectUrl}`);
          console.log(`   User Type: ${data.userType}`);
          console.log(`   User Name: ${data.user?.firstName} ${data.user?.lastName}`);
        } else {
          console.log(`❌ ${cred.role} API LOGIN FAILED: ${data.error}`);
        }
        console.log('');
      } catch (error) {
        console.log(`❌ API test failed for ${cred.email}:`, error);
      }
    }

    // Test Mexican patients
    console.log('🧑‍🦲 TESTING MEXICAN PATIENTS:');
    console.log('=============================');
    
    const mexicanPatient = await prisma.patient.findFirst({
      where: { email: 'paciente@cognident.org' }
    });

    if (mexicanPatient) {
      console.log(`✅ Mexican Patient Found: ${mexicanPatient.firstName} ${mexicanPatient.lastName}`);
      console.log(`   Email: ${mexicanPatient.email}`);
      console.log(`   Practice ID: ${mexicanPatient.practiceId}`);
    } else {
      console.log('❌ Mexican patient not found');
    }

    // Check practice settings
    console.log('\n🏥 PRACTICE INFORMATION:');
    console.log('========================');
    
    const practice = await prisma.practice.findFirst({
      include: {
        settings: true
      }
    });

    if (practice) {
      console.log(`✅ Practice: ${practice.name}`);
      console.log(`   ID: ${practice.id}`);
      console.log(`   Location: ${practice.city}, ${practice.state}`);
      console.log(`   Timezone: ${practice.timezone}`);
      console.log(`   Settings: ${practice.settings ? 'Configured' : 'Missing'}`);
    }

    console.log('\n🎯 MEXICAN LOGIN URLS TO TEST:');
    console.log('==============================');
    console.log('Main Mexican Login: http://localhost:3000/es/auth/signin');
    console.log('Mexican Receptionist: http://localhost:3000/es/receptionist');
    console.log('Mexican Landing: http://localhost:3000/es/');

    console.log('\n🔐 MEXICAN CREDENTIALS FOR DEMO:');
    console.log('================================');
    for (const cred of MEXICAN_CREDENTIALS) {
      console.log(`${cred.role.padEnd(12)} | ${cred.email.padEnd(35)} | ${cred.password}`);
    }
    console.log(`PATIENT      | paciente@cognident.org              | paciente123`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testMexicanLogins();
}

export { testMexicanLogins };
