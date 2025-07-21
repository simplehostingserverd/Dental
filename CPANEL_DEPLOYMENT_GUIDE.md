# 🚀 cPanel Deployment Guide for Cognident

## 📋 Pre-Deployment Checklist

### ✅ **What You Have:**
- `cognident-cpanel-production.zip` (755KB)
- Two startup options: `app.js` and `server.js`
- Complete Next.js application with database
- Multi-tenant SaaS architecture

## 🔧 **Step-by-Step Deployment**

### **Step 1: Upload & Extract**
1. **Upload** `cognident-cpanel-production.zip` to cPanel File Manager
2. **Navigate** to your domain's public folder (usually `public_html`)
3. **Extract** the zip file
4. **Move** all contents to the root of your domain folder

### **Step 2: Create Node.js Application**

In cPanel, go to **"Node.js App"** and configure:

```
Node.js version: 18.x (or latest available)
Application mode: Production
Application root: /home/yourusername/public_html (or your domain path)
Application URL: https://cognident.org
Application startup file: server.js (recommended) or app.js
```

### **Step 3: Environment Variables**

Click **"ADD VARIABLE"** for each:

#### **🔐 Required Variables:**
```bash
DATABASE_URL=postgresql://username:password@host:5432/database_name
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-key-here-min-32-chars
NEXTAUTH_URL=https://cognident.org
JWT_SECRET=general-jwt-secret-key-cognident-2025-production-secure
PATIENT_JWT_SECRET=patient-jwt-secret-key-cognident-2025-production-secure
NODE_ENV=production
PORT=3000
```

#### **🤖 AI Services (Optional):**
```bash
TOGETHERAI_API_KEY=03d486a7d98ba99f2dd3e9dd6ec09c9d451721b25229007a7c56c8ee318dc7fa
MURF_API_KEY=ap2_0a097fea-1198-49a2-91e7-fde910aa2913
```

#### **📧 Email Configuration (Optional):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@cognident.org
SMTP_PASS=your-app-specific-password
SMTP_FROM=Cognident <noreply@cognident.org>
```

### **Step 4: Install Dependencies**

In cPanel Terminal or SSH:

```bash
cd /home/yourusername/public_html
npm install --production
```

**Note:** The npm ERESOLVE warnings are normal and safe to ignore.

### **Step 5: Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed with sample data
npm run db:seed
```

### **Step 6: Build Application**

```bash
npm run build
```

### **Step 7: Start Application**

Click **"RESTART"** in the cPanel Node.js App interface.

## 🔍 **Troubleshooting Common Issues**

### **Issue 1: npm ERESOLVE warnings**
```
npm warn ERESOLVE overriding peer dependency
```
**Solution:** ✅ **This is normal!** These are just peer dependency conflicts and won't affect functionality.

### **Issue 2: Application won't start**
**Solutions:**
1. Try switching startup file from `app.js` to `server.js` (or vice versa)
2. Check environment variables are set correctly
3. Ensure Node.js version is 18.x or higher
4. Verify application root path is correct

### **Issue 3: Database connection errors**
**Solutions:**
1. Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
2. Ensure database server allows connections from your cPanel server
3. Check database credentials and permissions

### **Issue 4: Build errors**
**Solutions:**
1. Run `npm install` again
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 🎯 **Startup File Options**

### **Option A: server.js (Recommended)**
- Direct Next.js server integration
- Better error handling
- More reliable for cPanel hosting
- Custom HTTP server configuration

### **Option B: app.js**
- Uses npm start command
- Simpler approach
- Good for standard hosting environments

## 🔐 **Security Configuration**

### **SSL Certificate**
Ensure your domain has SSL enabled in cPanel for HTTPS.

### **Environment Variables Security**
- Never commit `.env` files to version control
- Use strong, unique secrets for JWT tokens
- Rotate secrets regularly in production

## 📊 **Post-Deployment Verification**

### **1. Health Check**
Visit: `https://cognident.org/api/health`
Should return: `{"status": "ok", "timestamp": "..."}`

### **2. Database Connection**
Check logs for successful database connection.

### **3. Authentication Test**
- Visit: `https://cognident.org/auth/signup`
- Create a test practice account
- Verify login functionality

### **4. Dashboard Access**
- Login and access dashboard
- Verify all features load correctly
- Test patient/appointment creation

## 🏢 **Multi-Tenant Features**

### **New Practice Registration**
- Companies can register at `/auth/signup`
- Automatic tenant isolation
- Separate data spaces per practice

### **Data Import Options**
- CSV upload for existing patient data
- API integration for bulk imports
- Manual entry with guided setup

## 📈 **Performance Optimization**

### **cPanel Specific Settings**
```bash
# In package.json, ensure these scripts exist:
"build": "next build"
"start": "next start"
"postinstall": "prisma generate"
```

### **Memory Management**
- Monitor Node.js memory usage in cPanel
- Restart application if memory usage is high
- Consider upgrading hosting plan for high traffic

## 🆘 **Support & Monitoring**

### **Log Files**
Check cPanel error logs for application issues:
- Error Logs → Domain → View latest entries

### **Application Monitoring**
- Monitor CPU and memory usage
- Check for failed requests
- Monitor database connection pool

### **Backup Strategy**
- Regular database backups
- File system backups
- Environment variables backup

## 🎉 **Success Indicators**

✅ **Application starts without errors**
✅ **Database connections successful**
✅ **SSL certificate active**
✅ **Registration/login working**
✅ **Dashboard loads correctly**
✅ **Multi-tenant isolation working**

---

## 🚨 **Quick Fix for Current Error**

Based on your screenshot, try this immediate fix:

1. **Change startup file** from `app.js` to `server.js`
2. **Click "RESTART"** in cPanel
3. **Check error logs** for specific error messages
4. **Verify environment variables** are all set correctly

The application should start successfully with the `server.js` file! 🎯
