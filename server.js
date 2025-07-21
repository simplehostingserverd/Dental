#!/usr/bin/env node

/**
 * Cognident cPanel Production Server
 * Alternative startup file for cPanel Node.js hosting
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

console.log('🏥 Cognident Dental Management System');
console.log('🚀 Starting server...');
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', port);
console.log('🖥️  Hostname:', hostname);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Start server
  server.listen(port, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err);
      throw err;
    }
    console.log(`✅ Server ready on http://${hostname}:${port}`);
    console.log('🎯 Application URL: https://cognident.org');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

}).catch((ex) => {
  console.error('❌ Failed to start application:', ex);
  process.exit(1);
});
