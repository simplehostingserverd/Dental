import { chromium, type FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';

  try {
    // Reset and seed test database
    console.log('📊 Setting up test database...');
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    // Run database seeds for test data
    execSync('npm run seed', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    // Create test users and practice data
    await createTestData();

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

async function createTestData() {
  // Launch browser for setup operations
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Create test practice and users via API
    console.log('👥 Creating test users...');
    
    // Create test practice
    const practiceResponse = await page.request.post('http://localhost:3000/api/test-setup/practice', {
      data: {
        name: 'Test Dental Practice',
        email: 'test@testpractice.com',
        phone: '(555) 123-4567',
        address: '123 Test Street, Test City, TC 12345'
      }
    });

    if (!practiceResponse.ok()) {
      throw new Error(`Failed to create test practice: ${await practiceResponse.text()}`);
    }

    const practice = await practiceResponse.json();
    process.env.TEST_PRACTICE_ID = practice.id;

    // Create test users
    const users = [
      {
        email: 'dentist@test.com',
        password: 'TestPassword123!',
        role: 'DENTIST',
        firstName: 'Dr. John',
        lastName: 'Smith',
        practiceId: practice.id
      },
      {
        email: 'receptionist@test.com',
        password: 'TestPassword123!',
        role: 'RECEPTIONIST',
        firstName: 'Mary',
        lastName: 'Johnson',
        practiceId: practice.id
      },
      {
        email: 'patient@test.com',
        password: 'TestPassword123!',
        role: 'PATIENT',
        firstName: 'Jane',
        lastName: 'Doe',
        practiceId: practice.id
      }
    ];

    for (const user of users) {
      const userResponse = await page.request.post('http://localhost:3000/api/test-setup/user', {
        data: user
      });

      if (!userResponse.ok()) {
        console.warn(`Failed to create test user ${user.email}: ${await userResponse.text()}`);
      } else {
        console.log(`✅ Created test user: ${user.email}`);
      }
    }

    // Create test appointments
    console.log('📅 Creating test appointments...');
    const appointmentResponse = await page.request.post('http://localhost:3000/api/test-setup/appointments', {
      data: {
        practiceId: practice.id,
        count: 5
      }
    });

    if (!appointmentResponse.ok()) {
      console.warn(`Failed to create test appointments: ${await appointmentResponse.text()}`);
    }

    // Set up translation test data
    console.log('🌐 Setting up translation test data...');
    const translationResponse = await page.request.post('http://localhost:3000/api/test-setup/translations', {
      data: {
        practiceId: practice.id
      }
    });

    if (!translationResponse.ok()) {
      console.warn(`Failed to setup translation data: ${await translationResponse.text()}`);
    }

  } catch (error) {
    console.error('Failed to create test data:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
