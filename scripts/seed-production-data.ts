import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProductionData() {
  console.log('🌱 Seeding production data...');

  try {
    // Create a sample practice
    const practice = await prisma.practice.upsert({
      where: { id: 'prod-practice-1' },
      update: {},
      create: {
        id: 'prod-practice-1',
        name: 'Cognident Dental Practice',
        address: '123 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        phone: '(512) 555-0123',
        email: 'info@cognident.org',
        website: 'https://cognident.org',
        timezone: 'America/Chicago',
      },
    });

    console.log('✅ Practice created');

    // Create insurance payers
    const insurancePayers = [
      {
        id: 'payer-delta-dental',
        name: 'Delta Dental',
        type: 'PRIMARY' as const,
        payerCode: 'DELTA001',
        address: '100 First Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '(800) 765-6003',
        email: 'providers@deltadental.com',
        website: 'https://www.deltadental.com',
        contractedRates: {
          preventive: 100,
          basic: 80,
          major: 50,
          orthodontic: 50,
        },
      },
      {
        id: 'payer-metlife',
        name: 'MetLife Dental',
        type: 'PRIMARY' as const,
        payerCode: 'METLIFE001',
        address: '200 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10166',
        phone: '(800) 942-0854',
        email: 'providers@metlife.com',
        website: 'https://www.metlife.com',
        contractedRates: {
          preventive: 100,
          basic: 80,
          major: 50,
          orthodontic: 0,
        },
      },
      {
        id: 'payer-cigna',
        name: 'Cigna Dental',
        type: 'PRIMARY' as const,
        payerCode: 'CIGNA001',
        address: '900 Cottage Grove Road',
        city: 'Bloomfield',
        state: 'CT',
        zipCode: '06002',
        phone: '(800) 244-6224',
        email: 'providers@cigna.com',
        website: 'https://www.cigna.com',
        contractedRates: {
          preventive: 100,
          basic: 70,
          major: 50,
          orthodontic: 50,
        },
      },
    ];

    for (const payer of insurancePayers) {
      await prisma.insurancePayer.upsert({
        where: { id: payer.id },
        update: {},
        create: {
          ...payer,
          practiceId: practice.id,
        },
      });
    }

    console.log('✅ Insurance payers created');

    // Create clearinghouses
    const clearinghouses = [
      {
        id: 'ch-dentalxchange',
        name: 'DentalXChange',
        type: 'DENTAL' as const,
        apiEndpoint: 'https://api.dentalxchange.com/v1',
        username: 'cognident_user',
        password: 'encrypted_password_123',
        submitterId: 'COGNI001',
        receiverId: 'DXC001',
        supportedTransactions: ['270', '271', '276', '277', '837', '835'],
        testMode: false,
        status: 'CONNECTED' as const,
      },
      {
        id: 'ch-nea-fastattach',
        name: 'NEA FastAttach',
        type: 'DENTAL' as const,
        apiEndpoint: 'https://api.neafastattach.com/v2',
        username: 'cognident_nea',
        password: 'encrypted_password_456',
        submitterId: 'COGNI002',
        receiverId: 'NEA001',
        supportedTransactions: ['270', '271', '837', '835'],
        testMode: false,
        status: 'CONNECTED' as const,
      },
    ];

    for (const clearinghouse of clearinghouses) {
      await prisma.clearinghouse.upsert({
        where: { id: clearinghouse.id },
        update: {},
        create: {
          ...clearinghouse,
          practiceId: practice.id,
        },
      });
    }

    console.log('✅ Clearinghouses created');

    // Create financing options
    const financingOptions = [
      {
        id: 'fin-carecredit-promo',
        provider: 'CARECREDIT' as const,
        name: 'CareCredit 12-Month Promotional',
        type: 'PROMOTIONAL' as const,
        minAmount: 200,
        maxAmount: 25000,
        termMonths: 12,
        interestRate: 26.99,
        promotionalRate: 0,
        promotionalMonths: 12,
        applicationUrl: 'https://www.carecredit.com/apply',
        apiEndpoint: 'https://api.carecredit.com/v1',
        apiKey: 'encrypted_api_key_123',
      },
      {
        id: 'fin-carecredit-standard',
        name: 'CareCredit Standard',
        provider: 'CARECREDIT' as const,
        type: 'STANDARD' as const,
        minAmount: 200,
        maxAmount: 25000,
        termMonths: 60,
        interestRate: 26.99,
        applicationUrl: 'https://www.carecredit.com/apply',
        apiEndpoint: 'https://api.carecredit.com/v1',
        apiKey: 'encrypted_api_key_123',
      },
      {
        id: 'fin-internal-plan',
        name: 'Internal Payment Plan',
        provider: 'INTERNAL' as const,
        type: 'PAYMENT_PLAN' as const,
        minAmount: 100,
        maxAmount: 10000,
        termMonths: 24,
        interestRate: 0,
      },
    ];

    for (const option of financingOptions) {
      await prisma.financingOption.upsert({
        where: { id: option.id },
        update: {},
        create: {
          ...option,
          practiceId: practice.id,
        },
      });
    }

    console.log('✅ Financing options created');

    // Create sample patients
    const patients = [
      {
        id: 'patient-john-doe',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1985-06-15'),
        phone: '(512) 555-0101',
        email: 'john.doe@email.com',
        address: '456 Oak Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        outstandingBalance: 1250.00,
      },
      {
        id: 'patient-jane-smith',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-03-22'),
        phone: '(512) 555-0102',
        email: 'jane.smith@email.com',
        address: '789 Pine Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78703',
        outstandingBalance: 850.00,
      },
      {
        id: 'patient-mike-johnson',
        firstName: 'Mike',
        lastName: 'Johnson',
        dateOfBirth: new Date('1978-11-08'),
        phone: '(512) 555-0103',
        email: 'mike.johnson@email.com',
        address: '321 Elm Drive',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704',
        outstandingBalance: 2100.00,
      },
    ];

    for (const patient of patients) {
      await prisma.patient.upsert({
        where: { id: patient.id },
        update: {},
        create: {
          ...patient,
          practiceId: practice.id,
        },
      });
    }

    console.log('✅ Sample patients created');

    // Create patient insurance records
    const patientInsurances = [
      {
        id: 'ins-john-delta',
        patientId: 'patient-john-doe',
        payerId: 'payer-delta-dental',
        policyNumber: 'DELTA123456789',
        groupNumber: 'GRP001',
        subscriberId: 'SUB123456',
        subscriberName: 'John Doe',
        relationship: 'SELF' as const,
        coverageType: 'PRIMARY' as const,
        effectiveDate: new Date('2024-01-01'),
        expirationDate: new Date('2024-12-31'),
        isActive: true,
        eligibilityVerified: true,
        lastVerified: new Date(),
        copay: 25.00,
        deductible: 50.00,
        annualMaximum: 1500.00,
        deductibleMet: 50.00,
        benefitsUsed: 650.00,
      },
      {
        id: 'ins-jane-metlife',
        patientId: 'patient-jane-smith',
        payerId: 'payer-metlife',
        policyNumber: 'MET987654321',
        groupNumber: 'GRP002',
        subscriberId: 'SUB987654',
        subscriberName: 'Jane Smith',
        relationship: 'SELF' as const,
        coverageType: 'PRIMARY' as const,
        effectiveDate: new Date('2024-01-01'),
        expirationDate: new Date('2024-12-31'),
        isActive: true,
        eligibilityVerified: true,
        lastVerified: new Date(),
        copay: 20.00,
        deductible: 75.00,
        annualMaximum: 1200.00,
        deductibleMet: 75.00,
        benefitsUsed: 420.00,
      },
    ];

    for (const insurance of patientInsurances) {
      await prisma.patientInsurance.upsert({
        where: { id: insurance.id },
        update: {},
        create: insurance,
      });
    }

    console.log('✅ Patient insurance records created');

    console.log('🎉 Production data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Practice: ${practice.name}`);
    console.log(`- Insurance Payers: ${insurancePayers.length}`);
    console.log(`- Clearinghouses: ${clearinghouses.length}`);
    console.log(`- Financing Options: ${financingOptions.length}`);
    console.log(`- Sample Patients: ${patients.length}`);
    console.log(`- Insurance Records: ${patientInsurances.length}`);

  } catch (error) {
    console.error('❌ Error seeding production data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedProductionData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedProductionData };
