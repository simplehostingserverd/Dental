#!/bin/bash

# Cognident cPanel Installation Script
# Run this after extracting the zip file in cPanel

echo "🏥 Cognident Dental Management System - cPanel Installation"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the extracted application directory."
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "🔍 Checking Node.js version..."

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please ensure Node.js 18+ is installed."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
echo "Note: npm ERESOLVE warnings are normal and safe to ignore."
echo ""

# Install dependencies
npm install --production --no-audit --no-fund

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

echo ""
echo "🔧 Generating Prisma client..."

# Generate Prisma client
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully!"
else
    echo "❌ Failed to generate Prisma client. Please check your DATABASE_URL environment variable."
    exit 1
fi

echo ""
echo "🏗️ Building application..."

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Application built successfully!"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up your environment variables in cPanel Node.js App"
echo "2. Set startup file to: server.js (recommended) or app.js"
echo "3. Run database migrations: npx prisma migrate deploy"
echo "4. Click 'RESTART' in cPanel Node.js App interface"
echo ""
echo "🌐 Your application will be available at: https://cognident.org"
echo ""
echo "📚 For detailed instructions, see: CPANEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "🆘 Need help? Check the deployment guide or contact support."
