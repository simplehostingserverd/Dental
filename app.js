#!/usr/bin/env node

// Simple startup script for cPanel Node.js hosting
const { exec } = require('child_process');
const path = require('path');

// Set default environment variables
const nodeEnv = process.env.NODE_ENV || 'production';
const port = process.env.PORT || '3000';

console.log('🚀 Starting Cognident Application...');
console.log('📍 Working Directory:', __dirname);
console.log('🌍 Environment:', nodeEnv);
console.log('🔌 Port:', port);

// Change to application directory
process.chdir(__dirname);

// Start Next.js application
console.log('📦 Starting Next.js server...');

const startCommand = 'npm run start';
const child = exec(startCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error starting application:', error);
    return;
  }
  if (stderr) {
    console.error('⚠️ Stderr:', stderr);
  }
  console.log('✅ Stdout:', stdout);
});

// Pipe output to console
if (child.stdout) {
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}

if (child.stderr) {
  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });
}

child.on('close', (code) => {
  console.log(`🔚 Process exited with code: ${code}`);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down...');
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down...');
  child.kill('SIGINT');
});
