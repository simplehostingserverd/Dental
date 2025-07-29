# 🇲🇽 Mexican Dental Practices Setup Guide

This guide explains how to set up and manage the three Mexican dental practices with unique IDs and data isolation.

## 🏥 Practice Information

### Beautiful Smiles Dental Clinic
- **ID**: `beautiful-smiles-mx-001`
- **Location**: Av. Insurgentes Sur 1234, Col. Del Valle, CDMX
- **Phone**: +52 55 1234-5678
- **Email**: contacto@beautifulsmiles.mx

### Creative Smile Dental Clinic
- **ID**: `creative-smile-mx-002`
- **Location**: Blvd. Manuel Ávila Camacho 567, Col. Polanco, CDMX
- **Phone**: +52 55 2345-6789
- **Email**: info@creativesmile.mx

### Wizard Dental Clinic
- **ID**: `wizard-dental-mx-003`
- **Location**: Av. Revolución 890, Col. San Ángel, CDMX
- **Phone**: +52 55 3456-7890
- **Email**: contacto@wizarddental.mx

## 🔐 Demo Login Credentials

### Beautiful Smiles Dental Clinic
- **Dentist**: dentist.beautiful@cognident.org / beautiful123
- **Receptionist**: recepcion.beautiful@cognident.org / recepcion123

### Creative Smile Dental Clinic
- **Dentist**: dentist.creative@cognident.org / creative123
- **Receptionist**: recepcion.creative@cognident.org / recepcion123

### Wizard Dental Clinic
- **Dentist**: dentist.wizard@cognident.org / wizard123
- **Receptionist**: recepcion.wizard@cognident.org / recepcion123

## 🚀 Setup Instructions

### 1. Install Dependencies (using pnpm)
```bash
pnpm install
```

### 2. Setup Database
```bash
pnpm run db:push
```

### 3. Setup Mexican Practices
```bash
pnpm run setup-mexican-practices
```

### 4. Start Development Server
```bash
pnpm run dev
```

## 📊 Data Import System

### Supported Formats
- **CSV**: Comma-separated values
- **Excel**: .xlsx and .xls files
- **JSON**: JavaScript Object Notation

### Required Fields
- `firstName` (required)
- `lastName` (required)
- `dateOfBirth` (required, format: YYYY-MM-DD)

### Optional Fields
- `gender`
- `phone` (Mexican format: +52 55 XXXX-XXXX)
- `email`
- `address.*` (street, city, state, zipCode, country)
- `emergencyContact.*` (name, phone, relationship)
- `insurance.*` (provider, policyNumber, groupNumber)

### Import Process
1. Navigate to `/es/dashboard/data-import`
2. Download the CSV template
3. Fill in your patient data
4. Upload the file
5. Review import results

### Data Isolation
- Each practice has a unique ID
- Patient data is completely isolated by practice
- No cross-practice data access
- Secure multi-tenant architecture

## 🌐 Spanish Dashboard Access

### Login URLs
- **Main Spanish Login**: `/es/auth/signin`
- **Dentist Login**: `/es/auth/dentist/signin`
- **Receptionist Login**: `/es/auth/receptionist/signin`

### Dashboard URLs
- **Dentist Dashboard**: `/es/dashboard/dentist`
- **Receptionist Dashboard**: `/es/receptionist`
- **Data Import**: `/es/dashboard/data-import`

## 🔧 Technical Architecture

### Multi-Tenant Security
- Practice-specific authentication
- Data isolation at database level
- Unique practice IDs prevent data mixing
- Audit logging for all operations

### Authentication Flow
1. User logs in with email/password
2. System identifies practice from user record
3. Practice context is set in session
4. User is redirected to appropriate Spanish dashboard
5. All subsequent operations are scoped to practice

### Database Schema
```sql
-- Practices have unique IDs
Practice {
  id: String (unique, e.g., "beautiful-smiles-mx-001")
  name: String
  address: String
  city: String
  state: String
  zipCode: String
  phone: String
  email: String
}

-- Users belong to specific practices
PracticeUser {
  id: String
  email: String
  practiceId: String (foreign key)
  role: Role (DENTIST, RECEPTIONIST, ADMIN)
}

-- Patients are isolated by practice
Patient {
  id: String
  practiceId: String (foreign key)
  firstName: String
  lastName: String
  dateOfBirth: DateTime
  // ... other fields
}
```

## 📈 Importing 6,500+ Patients

### Best Practices
1. **Split Large Files**: Divide into batches of 1,000 patients
2. **Validate Data**: Use the template format exactly
3. **Test First**: Import a small sample first
4. **Backup**: Always backup existing data
5. **Monitor**: Watch the import progress carefully

### Performance Tips
- Import during off-peak hours
- Use CSV format for best performance
- Ensure stable internet connection
- Have technical support contact ready

### Error Handling
- Download error reports for failed imports
- Fix data issues and re-import
- Contact support for complex issues

## 🆘 Support Information

### Technical Support
- **Email**: mexico@cognident.org
- **Phone**: +52 55 1234-5678
- **WhatsApp**: +52 55 8765-4321
- **Hours**: 24/7 (Mexico Time Zone)

### Resources
- [Data Import Guide](/es/help/importacion-masiva)
- [Mexican Format Guide](/es/help/formatos-mexico)
- [Security Documentation](/es/help/seguridad-datos)
- [Multi-Clinic Management](/es/help/multi-clinica)

## 🔍 Troubleshooting

### Common Issues
1. **Login Problems**: Check practice-specific credentials
2. **Data Not Showing**: Verify practice context
3. **Import Failures**: Check file format and required fields
4. **Permission Errors**: Ensure user has correct role

### Debug Commands
```bash
# Check practice setup
pnpm run health:check

# Test Mexican logins
pnpm run test-mexican-logins

# Reset passwords if needed
pnpm run reset-passwords
```

## 🎯 Production Deployment

### Environment Variables
```env
# Database
DATABASE_URL="your-production-database-url"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Mexican Practice Settings
MEXICAN_PRACTICES_ENABLED=true
DEFAULT_TIMEZONE="America/Mexico_City"
DEFAULT_CURRENCY="MXN"
```

### Deployment Steps
1. Set up production database
2. Run migrations: `pnpm run db:migrate`
3. Setup practices: `pnpm run setup-mexican-practices`
4. Deploy application
5. Test all login flows
6. Verify data isolation

## ✅ Verification Checklist

- [ ] All three practices created with unique IDs
- [ ] Demo users can log in to their respective practices
- [ ] Spanish dashboards load correctly
- [ ] Data import system works
- [ ] Practice data is properly isolated
- [ ] Authentication redirects to correct dashboards
- [ ] All Mexican-specific features work
- [ ] Support information is accessible

## 📝 Notes

- This system is designed for production use with real patients
- All data is encrypted and HIPAA-compliant
- Practice IDs are permanent and should not be changed
- Regular backups are essential
- Monitor system performance during large imports
