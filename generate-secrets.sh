#!/bin/bash

# Generate Secure Secrets for Coolify Deployment
echo "🔐 Generating secure secrets for Cognident deployment..."
echo ""

# Function to generate random string
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Generate secrets
NEXTAUTH_SECRET=$(generate_secret)
JWT_SECRET=$(generate_secret)
PATIENT_JWT_SECRET=$(generate_secret)
POSTGRES_PASSWORD=$(generate_secret)
REDIS_PASSWORD=$(generate_secret)

echo "📋 Copy these environment variables to Coolify:"
echo ""
echo "# Authentication Secrets"
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "JWT_SECRET=$JWT_SECRET"
echo "PATIENT_JWT_SECRET=$PATIENT_JWT_SECRET"
echo ""
echo "# Database Secrets"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo "REDIS_PASSWORD=$REDIS_PASSWORD"
echo ""
echo "# Database URLs (update with your domain)"
echo "DATABASE_URL=postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/cognident"
echo "POSTGRES_URL=postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/cognident"
echo "POSTGRES_PRISMA_URL=postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/cognident?pgbouncer=true&connect_timeout=15"
echo "POSTGRES_URL_NO_SSL=postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/cognident"
echo "POSTGRES_URL_NON_POOLING=postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/cognident"
echo ""
echo "# Domain Configuration (update with your domain)"
echo "NEXTAUTH_URL=https://cognident.org"
echo ""
echo "# Redis Configuration"
echo "REDIS_URL=redis://redis:6379"
echo ""
echo "# Application Configuration"
echo "NODE_ENV=production"
echo "NEXT_TELEMETRY_DISABLED=1"
echo ""
echo "✅ Secrets generated successfully!"
echo "🔒 Keep these secrets secure and never commit them to version control."
echo ""
echo "📝 Next steps:"
echo "1. Copy these variables to Coolify environment settings"
echo "2. Update NEXTAUTH_URL with your actual domain"
echo "3. Deploy your application"
