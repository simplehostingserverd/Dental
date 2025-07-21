#!/usr/bin/env node

// Simple startup script for cPanel Node.js hosting
const { exec } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000;

console.log('🚀 Starting Cognident Application...');
console.log('📍 Working Directory:', __dirname);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', process.env.PORT);

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
child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.error(data.toString());
});

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
