import { type FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  try {
    // Clean up test database
    console.log('🗑️ Cleaning up test database...');
    
    // Reset database to clean state
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });

    // Clean up any test files or artifacts
    console.log('📁 Cleaning up test artifacts...');
    
    // Remove any uploaded test files
    try {
      execSync('rm -rf public/uploads/test-*', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } catch (error) {
      // Ignore if no test files exist
    }

    // Clean up translation cache
    try {
      execSync('rm -rf .translation-cache-test', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } catch (error) {
      // Ignore if cache doesn't exist
    }

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;
