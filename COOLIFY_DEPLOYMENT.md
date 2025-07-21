# 🚀 Coolify Deployment Guide for Cognident Dental App

## Prerequisites

- ✅ Coolify installed on your VPS (128GB RAM, Dual Xeon, A5000 GPU)
- ✅ Domain pointed to your VPS (cognident.org)
- ✅ Git repository access

## Step 1: Create New Application in Coolify

1. **Login to Coolify Dashboard**
2. **Click "New Resource" → "Application"**
3. **Select "Docker Compose"**
4. **Connect your Git repository**

## Step 2: Configure Git Repository

```
Repository URL: https://github.com/your-username/cognident-dental
Branch: main
Build Pack: Docker Compose
```

## Step 3: Environment Variables

Copy these variables from `.env.coolify` to Coolify environment settings:

### 🔐 **Critical Security Variables (CHANGE THESE!)**
```
NEXTAUTH_SECRET=generate_32_character_secret
JWT_SECRET=generate_32_character_secret  
PATIENT_JWT_SECRET=generate_32_character_secret
POSTGRES_PASSWORD=generate_secure_password
REDIS_PASSWORD=generate_secure_password
```

### 🌐 **Domain Configuration**
```
NEXTAUTH_URL=https://cognident.org
```

### 📊 **Database Configuration**
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@postgres:5432/cognident
POSTGRES_USER=postgres
POSTGRES_DATABASE=cognident
```

## Step 4: Domain Configuration

1. **Add Domain**: `cognident.org`
2. **Enable SSL**: Automatic Let's Encrypt
3. **Set Port**: `3000` (main app)

## Step 5: Resource Allocation

With your powerful VPS specs, configure:

```yaml
App Container:
  CPU: 4 cores
  Memory: 8GB

PostgreSQL:
  CPU: 2 cores  
  Memory: 4GB

Redis:
  CPU: 1 core
  Memory: 2GB
```

## Step 6: Deploy

1. **Click "Deploy"**
2. **Monitor build logs**
3. **Wait for all services to be healthy**

## Step 7: Post-Deployment Setup

### Initialize Database
```bash
# Access app container
docker exec -it cognident_app_1 sh

# Run database migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run db:seed
```

## Step 8: Verify Deployment

Visit: `https://cognident.org`

### Test Endpoints:
- ✅ Health Check: `/api/health`
- ✅ Main App: `/`
- ✅ Patient Login: `/auth/patient/signin`
- ✅ Dentist Login: `/auth/dentist/signin`
- ✅ Receptionist Login: `/auth/employee/signin`

## 🔧 Troubleshooting

### Build Fails
```bash
# Check build logs in Coolify
# Common issues:
# 1. Environment variables missing
# 2. Database connection failed
# 3. Node.js version mismatch
```

### Database Connection Issues
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker logs cognident_postgres_1
```

## 🚀 Performance Optimization

Your VPS specs allow for excellent performance:

### Recommended Settings:
- **Node.js Workers**: 4-8 (utilize multiple cores)
- **Database Connections**: 20-50 pool size
- **Redis Memory**: 2GB allocation
- **File Upload Limit**: 50MB (plenty of RAM)

## 🔒 Security Checklist

- ✅ Change all default passwords
- ✅ Enable SSL/TLS
- ✅ Configure firewall rules
- ✅ Set up backup strategy
- ✅ Enable monitoring/logging

## 📊 Monitoring

Coolify provides built-in monitoring for:
- CPU/Memory usage
- Container health
- Application logs
- Database performance

## 🔄 Updates

To update the application:
1. Push changes to Git repository
2. Coolify auto-deploys (if enabled)
3. Or manually trigger deployment in Coolify

## 🎯 Next Steps

1. **Set up backups** for PostgreSQL data
2. **Configure monitoring alerts**
3. **Set up staging environment**
4. **Implement CI/CD pipeline**
