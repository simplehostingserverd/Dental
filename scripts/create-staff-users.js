#!/usr/bin/env node

/**
 * Create Staff Users for Production Database
 * This script creates real staff accounts that can be used for login
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function createStaffUsers() {
  console.log('🏥 Creating Staff Users for Cognident...');
  console.log('='.repeat(50));

  try {
    // First, ensure we have a practice
    let practice = await db.practice.findFirst();
    if (!practice) {
      console.log('📋 Creating default practice...');
      practice = await db.practice.create({
        data: {
          name: "Cognident Demo Practice",
          email: "demo@cognident.org",
          phone: "(555) 123-4567",
          timezone: "America/New_York",
        },
      });
      console.log(`✅ Created practice: ${practice.name}`);
    } else {
      console.log(`✅ Using existing practice: ${practice.name}`);
    }

    // Staff users to create
    const staffUsers = [
      {
        email: "admin@cognident.org",
        password: "Admin123!",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        phone: "(555) 100-0001",
      },
      {
        email: "dr.smith@cognident.org", 
        password: "Doctor123!",
        firstName: "Dr. Sarah",
        lastName: "Smith",
        role: "DOCTOR",
        phone: "(555) 100-0002",
        licenseNumber: "DDS-12345",
        specialization: "General Dentistry",
      },
      {
        email: "receptionist@cognident.org",
        password: "Reception123!",
        firstName: "Mary",
        lastName: "Wilson", 
        role: "RECEPTIONIST",
        phone: "(555) 100-0003",
      },
      {
        email: "hygienist@cognident.org",
        password: "Hygienist123!",
        firstName: "Jennifer",
        lastName: "Brown",
        role: "HYGIENIST", 
        phone: "(555) 100-0004",
      }
    ];

    console.log('\n👥 Creating staff users...');
    
    for (const userData of staffUsers) {
      // Check if user already exists
      const existingUser = await db.practiceUser.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await db.practiceUser.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          practiceId: practice.id,
          phone: userData.phone,
          licenseNumber: userData.licenseNumber || null,
          specialization: userData.specialization || null,
          isActive: true,
          emailVerified: true, // Skip email verification for demo
        },
      });

      console.log(`✅ Created ${userData.role}: ${userData.email}`);
      console.log(`   Name: ${userData.firstName} ${userData.lastName}`);
      console.log(`   Password: ${userData.password}`);
      console.log('');
    }

    console.log('🎉 Staff user creation completed!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    
    staffUsers.forEach(user => {
      console.log(`${user.role}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log('');
    });

    console.log('🌐 Login URL: https://cognident.org/auth/signin');
    console.log('📝 Select "Practice Staff" when signing in');

  } catch (error) {
    console.error('❌ Error creating staff users:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Run the script
createStaffUsers();
