# 🧪 Test Users & Sample Data

This document contains all the test user credentials and sample data for testing the Cognident dental practice management system.

## 🔐 Quantum-Resistant Security

All test users are protected with quantum-resistant encryption based on NIST Post-Quantum Cryptography Standards:

- **FIPS 203 (ML-KEM)**: CRYSTALS-Kyber for key encapsulation
- **FIPS 204 (ML-DSA)**: CRYSTALS-Dilithium for digital signatures  
- **FIPS 205 (SLH-DSA)**: SPHINCS+ for backup signatures
- **HQC**: Code-based backup for key encapsulation

## 👥 Test User Credentials

### 🦷 Dentist Users

#### Dr. Sarah Smith (Oral Surgeon)
- **Email**: `dr.smith@cognident.org`
- **Password**: `DentistPass123!`
- **Role**: Dentist
- **Specialization**: Oral Surgery
- **License**: DDS-12345
- **Experience**: 15 years

#### Dr. Michael Johnson (Orthodontist)
- **Email**: `dr.johnson@cognident.org`
- **Password**: `DentistPass456!`
- **Role**: Dentist
- **Specialization**: Orthodontics
- **License**: DDS-67890
- **Experience**: 12 years

### 📋 Receptionist Users

#### Mary Wilson (Lead Receptionist)
- **Email**: `mary.wilson@cognident.org`
- **Password**: `ReceptionPass123!`
- **Role**: Receptionist
- **Title**: Lead Receptionist
- **Permissions**: Full access (scheduling, billing, patient records, insurance)

#### Jennifer Brown (Receptionist)
- **Email**: `jennifer.brown@cognident.org`
- **Password**: `ReceptionPass456!`
- **Role**: Receptionist
- **Title**: Receptionist
- **Permissions**: Limited access (scheduling, patient records)

### 🏥 Patient Users

#### John Doe
- **Email**: `john.doe@email.com`
- **Password**: `PatientPass123!`
- **Role**: Patient
- **DOB**: June 15, 1985
- **Insurance**: Delta Dental (DD-123456789)
- **Outstanding Balance**: $225.00

#### Alice Johnson
- **Email**: `alice.johnson@email.com`
- **Password**: `PatientPass456!`
- **Role**: Patient
- **DOB**: March 22, 1992
- **Insurance**: MetLife Dental (ML-987654321)
- **Outstanding Balance**: $0.00

#### Robert Smith
- **Email**: `robert.smith@email.com`
- **Password**: `PatientPass789!`
- **Role**: Patient
- **DOB**: November 8, 1978
- **Insurance**: Cigna Dental (CG-456789123)
- **Outstanding Balance**: $450.00

## 📊 Sample Data Overview

### Appointments
- 5 sample appointments across different dates
- Various appointment types (cleaning, consultation, root canal, etc.)
- Different statuses (scheduled, confirmed, in-progress)
- Realistic time slots and durations

### Patients
- 3 comprehensive patient profiles
- Complete medical histories
- Insurance information
- Emergency contacts
- Visit tracking

### Treatments
- Historical and planned treatments
- Cost tracking
- Follow-up requirements
- Status monitoring

### Invoices
- Payment tracking
- Insurance claims
- Outstanding balances
- Due dates

## 🚀 Getting Started

### 1. Database Setup
```bash
# Push schema to database
npm run db:generate

# Seed with test data
npm run db:seed
```

### 2. Login Testing
1. Navigate to the login page
2. Use any of the test user credentials above
3. Verify redirect to appropriate dashboard:
   - Dentists → `/dashboard/dentist`
   - Receptionists → `/dashboard/receptionist`
   - Patients → `/dashboard/patient`

### 3. Dashboard Features

#### Dentist Dashboard
- Today's appointments overview
- Patient management
- Treatment planning
- Revenue tracking
- Clinical notes

#### Receptionist Dashboard
- Appointment scheduling
- Patient registration
- Insurance verification
- Payment processing
- Communication tools

#### Patient Dashboard
- Upcoming appointments
- Medical history
- Treatment plans
- Billing information
- Communication with practice

## 🔧 Development Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Seed database with test data
npm run seed

# Complete database setup
npm run db:seed

# View database in Prisma Studio
npx prisma studio
```

## 🌐 Browser Title

The browser title has been updated to display "Cognident" across all pages:
- Main layout: "Cognident - Practice Management"
- Dentist Dashboard: "Cognident - Dentist Dashboard"
- Receptionist Dashboard: "Cognident - Receptionist Dashboard"
- Patient Portal: "Cognident - Patient Portal"

## 🔒 Security Features

- Quantum-resistant password hashing
- Secure session tokens
- Multi-factor authentication ready
- Encrypted data storage
- Audit logging
- Role-based access control

## 📝 Notes

- All passwords use strong encryption with quantum-resistant algorithms
- Sample data is realistic but fictional
- Database relationships are properly maintained
- All user roles have appropriate permissions
- Ready for production deployment with real data

## 🆘 Troubleshooting

### Database Connection Issues
If you encounter database connection errors:
1. Check your `.env` file for correct `DATABASE_URL`
2. Ensure your database server is running
3. Verify network connectivity

### Seeding Errors
If seeding fails:
1. Run `npx prisma db push` first
2. Check for any schema validation errors
3. Ensure all required fields are provided

### Login Issues
If login doesn't work:
1. Verify the user exists in the database
2. Check password hashing implementation
3. Ensure session management is working

---

**Ready to test!** 🎉 Use these credentials to thoroughly test all login flows and dashboard functionality.
