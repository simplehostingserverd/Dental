import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createProductionAccounts() {
  console.log('🔐 Creating production user accounts...');

  try {
    // Get the practice
    const practice = await prisma.practice.findFirst({
      where: { id: 'prod-practice-1' }
    });

    if (!practice) {
      throw new Error('Practice not found. Please run seed-production-data.ts first.');
    }

    // Production accounts with secure passwords
    const accounts = [
      {
        id: 'admin-cognident',
        email: 'admin@cognident.org',
        password: 'CogniDent2024!Admin',
        firstName: 'Dr. Sarah',
        lastName: 'Martinez',
        role: 'ADMIN' as const,
        type: 'Admin/Owner',
        description: 'Practice owner with full system access',
        specialization: 'General Dentistry'
      },
      {
        id: 'dentist-cognident',
        email: 'dentist@cognident.org',
        password: 'CogniDent2024!Doctor',
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        role: 'DOCTOR' as const,
        type: 'Dentist',
        description: 'Primary dentist with clinical and billing access',
        specialization: 'Oral Surgery'
      },
      {
        id: 'receptionist-cognident',
        email: 'receptionist@cognident.org',
        password: 'CogniDent2024!Front',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        role: 'RECEPTIONIST' as const,
        type: 'Receptionist',
        description: 'Front desk staff with scheduling and billing access'
      },
      {
        id: 'billing-cognident',
        email: 'billing@cognident.org',
        password: 'CogniDent2024!Billing',
        firstName: 'Jennifer',
        lastName: 'Thompson',
        role: 'MANAGER' as const,
        type: 'Billing Specialist',
        description: 'Billing specialist with full financial system access'
      },
      {
        id: 'hygienist-cognident',
        email: 'hygienist@cognident.org',
        password: 'CogniDent2024!Hygiene',
        firstName: 'Ashley',
        lastName: 'Williams',
        role: 'HYGIENIST' as const,
        type: 'Dental Hygienist',
        description: 'Dental hygienist with clinical access',
        specialization: 'Dental Hygiene'
      }
    ];

    console.log('🔒 Hashing passwords...');
    
    for (const account of accounts) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(account.password, 12);

      // Create or update the practice user
      const user = await prisma.practiceUser.upsert({
        where: { id: account.id },
        update: {
          email: account.email,
          password: hashedPassword,
          firstName: account.firstName,
          lastName: account.lastName,
          role: account.role,
          practiceId: practice.id,
          emailVerified: true,
          specialization: account.specialization,
          isActive: true,
        },
        create: {
          id: account.id,
          email: account.email,
          password: hashedPassword,
          firstName: account.firstName,
          lastName: account.lastName,
          role: account.role,
          practiceId: practice.id,
          emailVerified: true,
          specialization: account.specialization,
          isActive: true,
        },
      });

      console.log(`✅ Created ${account.type}: ${account.email}`);
    }

    // Create patient accounts
    const patientAccounts = [
      {
        id: 'patient-user-john',
        email: 'john.doe@email.com',
        password: 'Patient2024!John',
        patientId: 'patient-john-doe',
        name: 'John Doe'
      },
      {
        id: 'patient-user-jane',
        email: 'jane.smith@email.com',
        password: 'Patient2024!Jane',
        patientId: 'patient-jane-smith',
        name: 'Jane Smith'
      },
      {
        id: 'patient-user-mike',
        email: 'mike.johnson@email.com',
        password: 'Patient2024!Mike',
        patientId: 'patient-mike-johnson',
        name: 'Mike Johnson'
      }
    ];

    console.log('👥 Creating patient accounts...');

    for (const patientAccount of patientAccounts) {
      const hashedPassword = await bcrypt.hash(patientAccount.password, 12);

      // Create patient user account
      await prisma.patientUser.upsert({
        where: { id: patientAccount.id },
        update: {
          email: patientAccount.email,
          password: hashedPassword,
          isActive: true,
        },
        create: {
          id: patientAccount.id,
          email: patientAccount.email,
          password: hashedPassword,
          isActive: true,
        },
      });

      // Link patient user to patient record
      await prisma.patient.update({
        where: { id: patientAccount.patientId },
        data: {
          patientUserId: patientAccount.id,
        },
      });

      console.log(`✅ Created patient account: ${patientAccount.email}`);
    }

    console.log('\n🎉 Production accounts created successfully!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('=' .repeat(80));
    
    console.log('\n🏥 STAFF ACCOUNTS:');
    console.log('-'.repeat(50));
    
    accounts.forEach(account => {
      console.log(`\n${account.type.toUpperCase()}:`);
      console.log(`  Email:    ${account.email}`);
      console.log(`  Password: ${account.password}`);
      console.log(`  Name:     ${account.firstName} ${account.lastName}`);
      console.log(`  Role:     ${account.role}`);
      console.log(`  Access:   ${account.description}`);
    });

    console.log('\n👥 PATIENT ACCOUNTS:');
    console.log('-'.repeat(50));
    
    patientAccounts.forEach(account => {
      console.log(`\n${account.name.toUpperCase()}:`);
      console.log(`  Email:    ${account.email}`);
      console.log(`  Password: ${account.password}`);
      console.log(`  Portal:   Patient portal access`);
    });

    console.log('\n🌐 LOGIN URLS:');
    console.log('-'.repeat(50));
    console.log('Staff Login:   https://cognident.org/auth/signin');
    console.log('Admin Login:   https://cognident.org/auth/signin');
    console.log('Dentist Login: https://cognident.org/auth/dentist/signin');
    console.log('Patient Login: https://cognident.org/auth/patient/signin');
    console.log('Spanish Login: https://cognident.org/es/auth/signin');

    console.log('\n🔐 SECURITY NOTES:');
    console.log('-'.repeat(50));
    console.log('• All passwords are securely hashed with bcrypt');
    console.log('• Email verification is pre-completed for immediate access');
    console.log('• Role-based access control is enforced');
    console.log('• All accounts are linked to the production practice');
    console.log('• Change passwords after first login for additional security');

    console.log('\n🚀 READY FOR PRODUCTION USE!');
    console.log('=' .repeat(80));

  } catch (error) {
    console.error('❌ Error creating production accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the account creator
if (require.main === module) {
  createProductionAccounts()
    .then(() => {
      console.log('✅ Account creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Account creation failed:', error);
      process.exit(1);
    });
}

export { createProductionAccounts };
