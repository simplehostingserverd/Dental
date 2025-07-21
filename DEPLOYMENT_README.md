# Cognident - Production Deployment Guide

## 📦 Package Contents

This deployment package contains:
- Complete Next.js application with all features
- Production-optimized build
- Server configuration for Namecheap cPanel
- Environment variables template
- Database schema and migrations

## 🚀 Quick Deployment Steps

### 1. Upload to cPanel
1. Upload `cognident-production.zip` to your cPanel File Manager
2. Extract the zip file in your domain's `public_html` folder
3. Navigate to the extracted folder

### 2. Create Node.js Application
1. In cPanel, go to **"Node.js App"**
2. Click **"Create Application"**
3. Configure:
   - **Node.js Version**: 18.x or higher
   - **Application Mode**: Production
   - **Application Root**: Path to your extracted folder
   - **Application URL**: Your domain/subdomain
   - **Startup File**: `server.js`

### 3. Configure Environment Variables
Copy the variables from `PRODUCTION_ENV_VARIABLES.txt` and add them in the Node.js App interface:

**Required Variables:**
```
DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host:5432/your_db_name
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
PATIENT_JWT_SECRET=patient-jwt-secret-key-cognident-2025-production
TOGETHERAI_API_KEY=03d486a7d98ba99f2dd3e9dd6ec09c9d451721b25229007a7c56c8ee318dc7fa
MURF_API_KEY=ap2_0a097fea-1198-49a2-91e7-fde910aa2913
NODE_ENV=production
```

**Email Configuration (Optional but recommended):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@cognident.org
SMTP_PASS=your-app-specific-password
SMTP_FROM=Cognident <noreply@cognident.org>
```

### 4. Database Setup
1. Create a PostgreSQL database in cPanel
2. Update `DATABASE_URL` with your database credentials
3. In the Node.js App terminal, run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### 5. Install Dependencies & Start
1. In the Node.js App terminal, run:
   ```bash
   npm install
   ```
2. Click **"Start"** in the Node.js App interface

## 🔧 Features Included

### ✅ Core Features
- **Multi-Dashboard System**: Separate dashboards for dentists, patients, and receptionists
- **Authentication System**: Secure login for all user types
- **Appointment Management**: Booking, scheduling, and management
- **Patient Records**: Comprehensive patient information system
- **Billing & Insurance**: Invoice generation and payment processing
- **Messaging System**: Internal communication platform

### ✅ Advanced Features
- **AI-Powered Help Chatbot**: TogetherAI integration for customer support
- **Internationalization**: English and Spanish language support
- **Contact Form**: Automated email sending to info@cognident.org
- **Phone Integration**: Direct calling to +1-956-357-5588
- **Responsive Design**: Mobile-friendly interface
- **Security**: JWT authentication, rate limiting, and data protection

### ✅ Technical Features
- **Next.js 15**: Latest framework with App Router
- **TypeScript**: Type-safe development
- **Prisma ORM**: Database management
- **Tailwind CSS**: Modern styling
- **Production Optimized**: Built for performance and scalability

## 🔐 Security Configuration

### Generate Production Secrets
For security, generate new secrets for production:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate PATIENT_JWT_SECRET
openssl rand -base64 32
```

### SSL Configuration
1. In cPanel, go to **"SSL/TLS"**
2. Enable **"Force HTTPS Redirect"**
3. Install SSL certificate (Let's Encrypt is free)

## 📧 Email Setup

### Option 1: Use cPanel Email
1. Create email accounts in cPanel
2. Use your domain's SMTP settings
3. Update SMTP variables accordingly

### Option 2: Use Gmail (Recommended)
1. Enable 2-Factor Authentication on Gmail
2. Generate an App Password
3. Use these settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

## 🗄️ Database Configuration

### Namecheap PostgreSQL
1. Create database in cPanel
2. Note the connection details
3. Format: `postgresql://username:password@host:port/database`

### External Database (Alternative)
You can also use external services like:
- Neon (Free tier available)
- Supabase (Free tier available)
- Railway (Free tier available)

## 🚨 Troubleshooting

### Application Won't Start
1. Check Node.js App logs in cPanel
2. Verify all environment variables are set
3. Ensure database connection is working
4. Check Node.js version (must be 18.x+)

### Database Connection Issues
1. Verify DATABASE_URL format
2. Check database credentials
3. Ensure database exists
4. Test connection from cPanel

### Email Not Working
1. Verify SMTP credentials
2. Check spam folders
3. Test with a simple email service first
4. Ensure firewall allows SMTP connections

### Build Errors
1. Check Node.js version compatibility
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 📞 Support

For technical support:
- **Email**: info@cognident.org
- **Phone**: +1-956-357-5588
- **Help Center**: Use the built-in AI chatbot

## 🔄 Updates

To update the application:
1. Download the new deployment package
2. Stop the Node.js application
3. Replace files (keep environment variables)
4. Run database migrations if needed
5. Restart the application

---

**🎉 Congratulations!** Your Cognident dental practice management system is now ready for production use!
