import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MEXICAN_PRACTICES = [
  {
    id: 'beautiful-smiles-mx-001',
    name: 'Beautiful Smiles Dental Clinic',
    address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '03100',
    phone: '+52 55 1234-5678',
    email: 'contacto@beautifulsmiles.mx',
    website: 'https://beautifulsmiles.mx',
    timezone: 'America/Mexico_City',
    users: [
      {
        email: 'dentist.beautiful@cognident.org',
        password: 'beautiful123',
        firstName: 'Dr. María',
        lastName: 'González',
        role: 'DENTIST',
        licenseNumber: 'DEN-MX-001234',
        specialization: 'Odontología General',
      },
      {
        email: 'recepcion.beautiful@cognident.org',
        password: 'recepcion123',
        firstName: 'Ana',
        lastName: 'Martínez',
        role: 'RECEPTIONIST',
      },
    ],
  },
  {
    id: 'creative-smile-mx-002',
    name: 'Creative Smile Dental Clinic',
    address: 'Blvd. Manuel Ávila Camacho 567, Col. Polanco',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '11560',
    phone: '+52 55 2345-6789',
    email: 'info@creativesmile.mx',
    website: 'https://creativesmile.mx',
    timezone: 'America/Mexico_City',
    users: [
      {
        email: 'dentist.creative@cognident.org',
        password: 'creative123',
        firstName: 'Dr. Carlos',
        lastName: 'Rodríguez',
        role: 'DENTIST',
        licenseNumber: 'DEN-MX-002345',
        specialization: 'Ortodoncia',
      },
      {
        email: 'recepcion.creative@cognident.org',
        password: 'recepcion123',
        firstName: 'Sofía',
        lastName: 'López',
        role: 'RECEPTIONIST',
      },
    ],
  },
  {
    id: 'wizard-dental-mx-003',
    name: 'Wizard Dental Clinic',
    address: 'Av. Revolución 890, Col. San Ángel',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '01000',
    phone: '+52 55 3456-7890',
    email: 'contacto@wizarddental.mx',
    website: 'https://wizarddental.mx',
    timezone: 'America/Mexico_City',
    users: [
      {
        email: 'dentist.wizard@cognident.org',
        password: 'wizard123',
        firstName: 'Dr. Luis',
        lastName: 'Hernández',
        role: 'DENTIST',
        licenseNumber: 'DEN-MX-003456',
        specialization: 'Cirugía Oral',
      },
      {
        email: 'recepcion.wizard@cognident.org',
        password: 'recepcion123',
        firstName: 'Carmen',
        lastName: 'Jiménez',
        role: 'RECEPTIONIST',
      },
    ],
  },
];

async function setupMexicanPractices() {
  console.log('🇲🇽 Setting up Mexican dental practices...');

  try {
    for (const practiceData of MEXICAN_PRACTICES) {
      console.log(`\n🏥 Setting up ${practiceData.name}...`);

      // Check if practice already exists
      const existingPractice = await prisma.practice.findUnique({
        where: { id: practiceData.id },
      });

      let practice;
      if (existingPractice) {
        console.log(`⚠️  Practice ${practiceData.name} already exists, updating...`);
        practice = await prisma.practice.update({
          where: { id: practiceData.id },
          data: {
            name: practiceData.name,
            address: practiceData.address,
            city: practiceData.city,
            state: practiceData.state,
            zipCode: practiceData.zipCode,
            phone: practiceData.phone,
            email: practiceData.email,
            website: practiceData.website,
            timezone: practiceData.timezone,
            isActive: true,
          },
        });
      } else {
        practice = await prisma.practice.create({
          data: {
            id: practiceData.id,
            name: practiceData.name,
            address: practiceData.address,
            city: practiceData.city,
            state: practiceData.state,
            zipCode: practiceData.zipCode,
            phone: practiceData.phone,
            email: practiceData.email,
            website: practiceData.website,
            timezone: practiceData.timezone,
            isActive: true,
          },
        });
        console.log(`✅ Created practice: ${practice.name} (ID: ${practice.id})`);
      }

      // Create practice settings
      await prisma.practiceSettings.upsert({
        where: { practiceId: practice.id },
        update: {},
        create: {
          practiceId: practice.id,
          businessHours: {
            monday: { open: '08:00', close: '18:00', isOpen: true },
            tuesday: { open: '08:00', close: '18:00', isOpen: true },
            wednesday: { open: '08:00', close: '18:00', isOpen: true },
            thursday: { open: '08:00', close: '18:00', isOpen: true },
            friday: { open: '08:00', close: '18:00', isOpen: true },
            saturday: { open: '09:00', close: '14:00', isOpen: true },
            sunday: { open: '00:00', close: '00:00', isOpen: false },
          },
          appointmentSettings: {
            defaultDuration: 30,
            bufferTime: 15,
            maxAdvanceBooking: 90,
            allowOnlineBooking: true,
            requireConfirmation: true,
          },
          notificationSettings: {
            emailReminders: true,
            smsReminders: true,
            reminderHours: [24, 2],
          },
          billingSettings: {
            currency: 'MXN',
            taxRate: 16.0,
            paymentTerms: 30,
            acceptedPaymentMethods: ['cash', 'card', 'transfer'],
          },
        },
      });

      // Create users for this practice
      for (const userData of practiceData.users) {
        try {
          const existingUser = await prisma.practiceUser.findUnique({
            where: { email: userData.email },
          });

          if (existingUser) {
            console.log(`⚠️  User ${userData.email} already exists, updating...`);
            await prisma.practiceUser.update({
              where: { email: userData.email },
              data: {
                password: await bcrypt.hash(userData.password, 12),
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role as any,
                licenseNumber: userData.licenseNumber,
                specialization: userData.specialization,
                isActive: true,
                emailVerified: true,
              },
            });
          } else {
            const user = await prisma.practiceUser.create({
              data: {
                email: userData.email,
                password: await bcrypt.hash(userData.password, 12),
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role as any,
                practiceId: practice.id,
                licenseNumber: userData.licenseNumber,
                specialization: userData.specialization,
                isActive: true,
                emailVerified: true,
              },
            });
            console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.role})`);
          }
        } catch (error) {
          console.error(`❌ Error creating user ${userData.email}:`, error);
        }
      }

      // Create sample patients for demonstration
      const samplePatients = [
        {
          firstName: 'Juan Carlos',
          lastName: 'Pérez García',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'Male',
          phone: '+52 55 1111-1111',
          email: 'juan.perez@email.com',
          address: {
            street: 'Calle Reforma 123',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '06600',
            country: 'México',
          },
        },
        {
          firstName: 'María Elena',
          lastName: 'Rodríguez López',
          dateOfBirth: new Date('1990-07-22'),
          gender: 'Female',
          phone: '+52 55 2222-2222',
          email: 'maria.rodriguez@email.com',
          address: {
            street: 'Av. Universidad 456',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '04510',
            country: 'México',
          },
        },
      ];

      for (const patientData of samplePatients) {
        try {
          const existingPatient = await prisma.patient.findFirst({
            where: {
              practiceId: practice.id,
              firstName: patientData.firstName,
              lastName: patientData.lastName,
              dateOfBirth: patientData.dateOfBirth,
            },
          });

          if (!existingPatient) {
            await prisma.patient.create({
              data: {
                ...patientData,
                practiceId: practice.id,
                totalVisits: Math.floor(Math.random() * 5) + 1,
                outstandingBalance: Math.random() * 2000,
              },
            });
            console.log(`✅ Created sample patient: ${patientData.firstName} ${patientData.lastName}`);
          }
        } catch (error) {
          console.error(`❌ Error creating patient ${patientData.firstName}:`, error);
        }
      }

      console.log(`✅ Completed setup for ${practice.name}`);
    }

    console.log('\n🎉 All Mexican practices have been set up successfully!');
    console.log('\n📋 Practice Summary:');
    for (const practice of MEXICAN_PRACTICES) {
      console.log(`\n🏥 ${practice.name}`);
      console.log(`   ID: ${practice.id}`);
      console.log(`   Location: ${practice.city}, ${practice.state}`);
      console.log(`   Users:`);
      for (const user of practice.users) {
        console.log(`     - ${user.firstName} ${user.lastName} (${user.role}): ${user.email} / ${user.password}`);
      }
    }

  } catch (error) {
    console.error('❌ Error setting up Mexican practices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
if (require.main === module) {
  setupMexicanPractices()
    .then(() => {
      console.log('\n✅ Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

export default setupMexicanPractices;
