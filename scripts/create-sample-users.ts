#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SampleUser {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  practiceId?: string;
}

const SAMPLE_USERS: SampleUser[] = [
  // DOCTOR USERS (Dentists)
  {
    email: 'dentist@cognident.org',
    password: 'dentist123',
    role: 'DOCTOR',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
  },
  {
    email: 'dentist.es@cognident.org',
    password: 'dentista123',
    role: 'DOCTOR',
    firstName: 'Dr. Carlos',
    lastName: 'Rodriguez',
  },

  // RECEPTIONIST USERS
  {
    email: 'receptionist@cognident.org',
    password: 'reception123',
    role: 'RECEPTIONIST',
    firstName: 'Maria',
    lastName: 'Garcia',
  },
  {
    email: 'recepcionista@cognident.org',
    password: 'recepcion123',
    role: 'RECEPTIONIST',
    firstName: 'Ana',
    lastName: 'Martinez',
  },

  // ADMIN USERS
  {
    email: 'admin@cognident.org',
    password: 'admin123',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User',
  },

  // ASSISTANT USERS
  {
    email: 'assistant@cognident.org',
    password: 'assistant123',
    role: 'ASSISTANT',
    firstName: 'Lisa',
    lastName: 'Wilson',
  },
  {
    email: 'asistente@cognident.org',
    password: 'asistente123',
    role: 'ASSISTANT',
    firstName: 'Roberto',
    lastName: 'Lopez',
  },

  // HYGIENIST USERS
  {
    email: 'hygienist@cognident.org',
    password: 'hygienist123',
    role: 'HYGIENIST',
    firstName: 'Jennifer',
    lastName: 'Davis',
  },

  // PRACTICE MANAGER
  {
    email: 'manager@cognident.org',
    password: 'manager123',
    role: 'MANAGER',
    firstName: 'Michael',
    lastName: 'Brown',
  },
];

async function createSampleUsers() {
  console.log('🚀 Creating sample users for Cognident...\n');

  try {
    // Create or get default practice
    let practice = await prisma.practice.findFirst({
      where: { name: 'Cognident Demo Practice' }
    });

    if (!practice) {
      practice = await prisma.practice.create({
        data: {
          name: 'Cognident Demo Practice',
          email: 'demo@cognident.org',
          phone: '+1-555-DENTAL',
          address: '123 Dental Street',
          city: 'Healthcare City',
          state: 'HC',
          zipCode: '12345',
          website: 'https://cognident.org',
          timezone: 'America/New_York',
        }
      });

      // Create practice settings separately
      await prisma.practiceSettings.create({
        data: {
          practiceId: practice.id,
          allowOnlineBooking: true,
          emailNotifications: true,
          smsNotifications: true,
          appointmentDuration: 30,
          workingHoursStart: '09:00',
          workingHoursEnd: '17:00',
          workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        }
      });

      console.log('✅ Created demo practice and settings');
    }

    // Create users
    for (const userData of SAMPLE_USERS) {
      try {
        // Check if user already exists
        const existingUser = await prisma.practiceUser.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create practice user
        const user = await prisma.practiceUser.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role as any,
            practiceId: practice.id,
            emailVerified: true,
            isActive: true,
          }
        });



        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }

    // Create sample patients separately
    const samplePatients = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'patient@cognident.org',
        phone: '+1-555-0123',
        dateOfBirth: new Date('1985-03-15'),
      },
      {
        firstName: 'Miguel',
        lastName: 'Hernandez',
        email: 'paciente@cognident.org',
        phone: '+1-555-0124',
        dateOfBirth: new Date('1990-07-22'),
      },
      {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.patient@cognident.org',
        phone: '+1-555-0125',
        dateOfBirth: new Date('1988-11-08'),
      },
    ];

    for (const patientData of samplePatients) {
      try {
        const existingPatient = await prisma.patient.findFirst({
          where: { email: patientData.email }
        });

        if (existingPatient) {
          console.log(`⚠️  Patient ${patientData.email} already exists, skipping...`);
          continue;
        }

        await prisma.patient.create({
          data: {
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            email: patientData.email,
            phone: patientData.phone,
            dateOfBirth: patientData.dateOfBirth,
            practiceId: practice.id,
            address: {
              street: '456 Patient Ave',
              city: 'Healthcare City',
              state: 'HC',
              zipCode: '12345'
            },
            emergencyContact: {
              name: 'Emergency Contact',
              phone: '+1-555-0911',
              relationship: 'Spouse'
            },
          }
        });

        console.log(`✅ Created PATIENT: ${patientData.email}`);
      } catch (error) {
        console.error(`❌ Error creating patient ${patientData.email}:`, error);
      }
    }

    console.log('\n🎉 Sample users and patients created successfully!\n');
    
  } catch (error) {
    console.error('❌ Error creating sample users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createSampleUsers();
}

export { createSampleUsers, SAMPLE_USERS };
