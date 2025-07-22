#!/usr/bin/env node

/**
 * Test setup script for Playwright tests
 * Installs browsers and sets up test environment
 */

const { execSync } = require('child_process');
const path = require('path');

async function setupTests() {
  console.log('🎭 Setting up Playwright test environment...');

  try {
    // Install Playwright browsers
    console.log('📦 Installing Playwright browsers...');
    execSync('npx playwright install', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    // Install system dependencies for browsers
    console.log('🔧 Installing system dependencies...');
    execSync('npx playwright install-deps', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    // Create test results directory
    console.log('📁 Creating test directories...');
    execSync('mkdir -p test-results', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    // Set up test database
    console.log('🗄️ Setting up test database...');
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
    
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    console.log('✅ Test setup completed successfully!');
    console.log('');
    console.log('🚀 You can now run tests with:');
    console.log('  npm test                 - Run all tests');
    console.log('  npm run test:ui          - Run tests with UI');
    console.log('  npm run test:headed      - Run tests in headed mode');
    console.log('  npm run test:debug       - Debug tests');
    console.log('  npm run test:report      - View test report');
    console.log('');
    console.log('🌐 Translation-specific tests:');
    console.log('  npx playwright test tests/translation/');
    console.log('');

  } catch (error) {
    console.error('❌ Test setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupTests();
}

module.exports = { setupTests };
