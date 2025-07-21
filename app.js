const { spawn } = require('child_process');
const path = require('path');

// Set the port from environment or default to 3000
const port = process.env.PORT || 3000;

// Set NODE_ENV to production if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('Starting Cognident application...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV);

// Start the Next.js application
const nextStart = spawn('npm', ['start'], {
  cwd: __dirname,
  env: { ...process.env, PORT: port },
  stdio: 'inherit'
});

nextStart.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

nextStart.on('close', (code) => {
  console.log(`Application exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  nextStart.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  nextStart.kill('SIGINT');
});
