#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PASSWORD_UPDATES = [
  { email: 'dentist@cognident.org', password: 'dentist123' },
  { email: 'dentist.es@cognident.org', password: 'dentista123' },
  { email: 'receptionist@cognident.org', password: 'reception123' },
  { email: 'recepcionista@cognident.org', password: 'recepcion123' },
  { email: 'admin@cognident.org', password: 'admin123' },
  { email: 'assistant@cognident.org', password: 'assistant123' },
  { email: 'asistente@cognident.org', password: 'asistente123' },
  { email: 'hygienist@cognident.org', password: 'hygienist123' },
  { email: 'manager@cognident.org', password: 'manager123' },
  { email: 'billing@cognident.org', password: 'billing123' },
];

async function resetPasswords() {
  console.log('🔐 Resetting passwords for sample users...\n');

  try {
    for (const update of PASSWORD_UPDATES) {
      try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(update.password, 12);

        // Update the user
        const result = await prisma.practiceUser.update({
          where: { email: update.email },
          data: { 
            password: hashedPassword,
            isActive: true,
            emailVerified: true,
          },
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          }
        });

        console.log(`✅ Updated ${result.email} (${result.firstName} ${result.lastName}) - ${result.role}`);
        console.log(`   New password: ${update.password}`);
      } catch (error) {
        console.log(`⚠️  User ${update.email} not found, skipping...`);
      }
    }

    console.log('\n🎉 Password reset complete!\n');

    // Test one login to verify
    console.log('🧪 Testing dentist login...');
    const dentist = await prisma.practiceUser.findUnique({
      where: { email: 'dentist@cognident.org' }
    });

    if (dentist) {
      const passwordMatch = await bcrypt.compare('dentist123', dentist.password || '');
      console.log(`🩺 Dentist password test: ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    }

    console.log('\n📋 UPDATED LOGIN CREDENTIALS:');
    console.log('================================');
    
    for (const update of PASSWORD_UPDATES) {
      try {
        const user = await prisma.practiceUser.findUnique({
          where: { email: update.email },
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          }
        });

        if (user) {
          console.log(`${user.role.padEnd(12)} | ${update.email.padEnd(30)} | ${update.password}`);
        }
      } catch (error) {
        // Skip if user doesn't exist
      }
    }

    console.log('\n🇲🇽 MEXICAN USERS:');
    console.log('==================');
    console.log(`DOCTOR       | dentist.es@cognident.org       | dentista123`);
    console.log(`RECEPTIONIST | recepcionista@cognident.org    | recepcion123`);
    console.log(`ASSISTANT    | asistente@cognident.org        | asistente123`);

    console.log('\n🧑‍🦲 PATIENT LOGINS (No password reset needed):');
    console.log('===============================================');
    console.log(`patient@cognident.org     | patient123`);
    console.log(`paciente@cognident.org    | paciente123`);
    console.log(`emily.patient@cognident.org | patient123`);

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  resetPasswords();
}

export { resetPasswords };
