# Cognident Deployment Guide for Coolify VPS

This comprehensive guide will walk you through deploying the Cognident dental practice management application on your Coolify VPS server.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Prerequisites](#prerequisites)
3. [Docker Configuration](#docker-configuration)
4. [Environment Setup](#environment-setup)
5. [Database Configuration](#database-configuration)
6. [Coolify Deployment](#coolify-deployment)
7. [Domain Configuration](#domain-configuration)
8. [SSL/HTTPS Setup](#ssl-https-setup)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

## System Architecture

The Cognident application consists of several components that work together to provide a complete dental practice management solution.

```mermaid
graph TB
    subgraph "Internet"
        U[Users/Patients]
        D[Dentists]
        E[Employees]
        A[Admin]
    end

    subgraph "Coolify VPS Server"
        subgraph "Reverse Proxy"
            RP[Nginx/Traefik]
        end
        
        subgraph "Application Layer"
            APP[Next.js Application]
            subgraph "Authentication"
                AUTH[Stack Auth/Custom Auth]
            end
            subgraph "API Layer"
                API[TRPC API Routes]
                BLOG[Blog Management API]
            end
        end
        
        subgraph "Database Layer"
            DB[(PostgreSQL Database)]
            REDIS[(Redis Cache)]
        end
        
        subgraph "File Storage"
            FS[File System/S3]
        end
    end

    subgraph "External Services"
        EMAIL[Email Service]
        SMS[SMS Service]
        BACKUP[Backup Service]
    end

    U --> RP
    D --> RP
    E --> RP
    A --> RP
    
    RP --> APP
    APP --> AUTH
    APP --> API
    APP --> BLOG
    
    API --> DB
    BLOG --> DB
    AUTH --> DB
    
    APP --> REDIS
    APP --> FS
    
    APP --> EMAIL
    APP --> SMS
    
    DB --> BACKUP
    FS --> BACKUP

    classDef userClass fill:#e1f5fe
    classDef appClass fill:#f3e5f5
    classDef dbClass fill:#e8f5e8
    classDef externalClass fill:#fff3e0
    
    class U,D,E,A userClass
    class APP,AUTH,API,BLOG appClass
    class DB,REDIS,FS dbClass
    class EMAIL,SMS,BACKUP externalClass
```

## Prerequisites

Before deploying Cognident on your Coolify VPS, ensure you have:

### Server Requirements
- **VPS Specifications**: Minimum 2 CPU cores, 4GB RAM, 50GB SSD
- **Operating System**: Ubuntu 20.04+ or Debian 11+
- **Coolify**: Latest version installed and configured
- **Domain**: `cognident.org` pointed to your VPS IP address

### Required Services
- **PostgreSQL**: For main application database
- **Redis**: For caching and session storage
- **Node.js**: Version 18+ for the Next.js application

## Docker Configuration

Create the following Docker configuration files in your project root:

### Dockerfile
```dockerfile
# Use the official Node.js 18 image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - cognident-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=cognident
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - cognident-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - cognident-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - cognident-network

volumes:
  postgres_data:
  redis_data:

networks:
  cognident-network:
    driver: bridge
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name cognident.org www.cognident.org;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name cognident.org www.cognident.org;

        ssl_certificate /etc/nginx/ssl/cognident.org.crt;
        ssl_certificate_key /etc/nginx/ssl/cognident.org.key;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## Environment Setup

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://cognident_user:secure_password@postgres:5432/cognident"
POSTGRES_USER=cognident_user
POSTGRES_PASSWORD=secure_password

# Authentication
NEXTAUTH_SECRET=your-super-secure-secret-key-here
NEXTAUTH_URL=https://cognident.org

# Redis
REDIS_URL=redis://redis:6379

# Stack Auth (if using)
NEXT_PUBLIC_STACK_PROJECT_ID=your-stack-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-stack-publishable-key
STACK_SECRET_SERVER_KEY=your-stack-secret-key

# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password

# Application
NODE_ENV=production
PORT=3000
```

## Database Configuration

### Initial Database Setup
Create an `init.sql` file for initial database setup:

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial admin user for blog management
INSERT INTO admin_users (id, username, password_hash, created_at) 
VALUES (
    uuid_generate_v4(),
    'admin',
    '$2b$10$encrypted_password_hash_here',
    NOW()
);

-- Create initial blog categories
INSERT INTO blog_categories (name, slug) VALUES
('Patient Care', 'patient-care'),
('Technology', 'technology'),
('Business', 'business'),
('Compliance', 'compliance'),
('Marketing', 'marketing');
```

### Database Migration
Run Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

## Coolify Deployment

### Step 1: Create New Project in Coolify

1. Log into your Coolify dashboard
2. Click "New Project"
3. Name it "Cognident"
4. Select your server

### Step 2: Configure Application

1. **Source**: Connect your Git repository
2. **Build Pack**: Docker
3. **Port**: 3000
4. **Domain**: cognident.org

### Step 3: Environment Variables

Add all environment variables from your `.env.production` file in the Coolify dashboard.

### Step 4: Database Services

1. **PostgreSQL**:
   - Service: PostgreSQL 15
   - Database: cognident
   - Username: cognident_user
   - Password: Generate secure password

2. **Redis**:
   - Service: Redis 7
   - No authentication needed for internal use

### Step 5: Deploy

1. Click "Deploy"
2. Monitor the build logs
3. Verify deployment success

## Domain Configuration

### DNS Settings
Configure your DNS records for `cognident.org`:

```
Type    Name    Value               TTL
A       @       YOUR_VPS_IP         300
A       www     YOUR_VPS_IP         300
CNAME   api     cognident.org       300
```

### SSL Certificate

Coolify automatically handles SSL certificates via Let's Encrypt. Ensure:

1. Domain is properly pointed to your VPS
2. Ports 80 and 443 are open
3. Let's Encrypt validation can complete

## Monitoring & Maintenance

### Health Checks
Implement health check endpoints:

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### Backup Strategy

1. **Database Backups**:
   ```bash
   # Daily automated backup
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **File Backups**:
   - User uploads
   - Configuration files
   - SSL certificates

### Monitoring Tools

1. **Application Monitoring**: Use Coolify's built-in monitoring
2. **Database Monitoring**: PostgreSQL logs and metrics
3. **Error Tracking**: Implement Sentry or similar service

## User Access & Dashboards

The application provides separate access points for different user types:

### Access URLs
- **Patients**: `https://cognident.org/auth/patient/signin`
- **Dentists**: `https://cognident.org/auth/dentist/signin`
- **Employees**: `https://cognident.org/auth/employee/signin`
- **Blog Admin**: `https://cognident.org/admin/login`

### Dashboard Routes
- **Patient Dashboard**: `/dashboard/patient`
- **Dentist Dashboard**: `/dashboard/dentist`
- **Employee Dashboard**: `/dashboard/employee`
- **Blog Management**: `/admin/blog`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check DATABASE_URL format
   - Verify PostgreSQL service is running
   - Check network connectivity

2. **SSL Certificate Issues**:
   - Verify DNS propagation
   - Check domain configuration
   - Review Let's Encrypt logs

3. **Application Crashes**:
   - Check application logs in Coolify
   - Verify environment variables
   - Monitor resource usage

### Log Locations
- **Application Logs**: Coolify dashboard
- **Database Logs**: PostgreSQL container logs
- **Nginx Logs**: Nginx container logs

### Performance Optimization

1. **Database Optimization**:
   - Regular VACUUM and ANALYZE
   - Proper indexing
   - Connection pooling

2. **Application Optimization**:
   - Enable Redis caching
   - Optimize images
   - Use CDN for static assets

3. **Server Optimization**:
   - Monitor resource usage
   - Scale services as needed
   - Regular security updates

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Database Security**: Use strong passwords and limit access
3. **SSL/TLS**: Always use HTTPS in production
4. **Regular Updates**: Keep all services updated
5. **Backup Encryption**: Encrypt all backups
6. **Access Control**: Implement proper user permissions

## Conclusion

This deployment guide provides a comprehensive approach to deploying Cognident on your Coolify VPS. The architecture ensures scalability, security, and maintainability while providing separate access for different user types.

For additional support or questions, refer to the Coolify documentation or contact your system administrator.
