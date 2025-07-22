#!/usr/bin/env node

/**
 * Environment Variable Checker for Coolify Deployment
 * This script helps debug environment variable issues in production
 */

console.log('🔍 Environment Variable Checker for Coolify');
console.log('='.repeat(50));

// Required environment variables
const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PATIENT_JWT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_STACK_PROJECT_ID',
  'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY',
  'STACK_SECRET_SERVER_KEY',
  'NODE_ENV'
];

// Optional but recommended variables
const OPTIONAL_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'TOGETHERAI_API_KEY',
  'MURF_API_KEY'
];

console.log(`📊 Node.js Version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`🐳 Platform: ${process.platform}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log('');

// Check required variables
console.log('✅ Required Variables:');
let missingRequired = [];
let foundRequired = [];

REQUIRED_VARS.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    foundRequired.push(varName);
    // Show partial value for security
    const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') 
      ? `${value.substring(0, 8)}...` 
      : value.length > 50 
        ? `${value.substring(0, 47)}...`
        : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    missingRequired.push(varName);
    console.log(`  ❌ ${varName}: NOT SET`);
  }
});

console.log('');

// Check optional variables
console.log('📋 Optional Variables:');
let foundOptional = [];

OPTIONAL_VARS.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    foundOptional.push(varName);
    const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') || varName.includes('KEY')
      ? `${value.substring(0, 8)}...` 
      : value.length > 50 
        ? `${value.substring(0, 47)}...`
        : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ⚠️  ${varName}: NOT SET`);
  }
});

console.log('');
console.log('📈 Summary:');
console.log(`  Required: ${foundRequired.length}/${REQUIRED_VARS.length} found`);
console.log(`  Optional: ${foundOptional.length}/${OPTIONAL_VARS.length} found`);

if (missingRequired.length > 0) {
  console.log('');
  console.log('❌ MISSING REQUIRED VARIABLES:');
  missingRequired.forEach(varName => {
    console.log(`  - ${varName}`);
  });
  
  console.log('');
  console.log('💡 TROUBLESHOOTING STEPS:');
  console.log('  1. Check Coolify Environment Variables section');
  console.log('  2. Ensure variables are saved and deployment is restarted');
  console.log('  3. Verify no typos in variable names');
  console.log('  4. Check for trailing spaces in values');
  console.log('  5. Try adding COOLIFY_DEPLOYMENT=true to bypass strict validation');
  
  process.exit(1);
} else {
  console.log('');
  console.log('🎉 All required environment variables are set!');
  console.log('✅ Your application should start successfully');
  process.exit(0);
}
