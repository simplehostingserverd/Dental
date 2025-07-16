import { db } from "@/server/db"
import { PasswordService } from "@/lib/auth/password"
import type { PracticeRole } from "@prisma/client"

interface SampleUser {
  type: 'practice' | 'patient'
  email: string
  password: string
  firstName: string
  lastName: string
  role?: PracticeRole
  description: string
}

const sampleUsers: SampleUser[] = [
  // Practice Users
  {
    type: 'practice',
    email: 'admin@dentalcloud.com',
    password: 'Admin123!',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'ADMIN',
    description: 'Practice Administrator - Full access to all features'
  },
  {
    type: 'practice',
    email: 'doctor@dentalcloud.com',
    password: 'Doctor123!',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'DOCTOR',
    description: 'Dentist - Access to patient records, treatments, and scheduling'
  },
  {
    type: 'practice',
    email: 'hygienist@dentalcloud.com',
    password: 'Hygienist123!',
    firstName: 'Emily',
    lastName: 'Williams',
    role: 'HYGIENIST',
    description: 'Dental Hygienist - Access to cleanings and basic treatments'
  },
  {
    type: 'practice',
    email: 'staff@dentalcloud.com',
    password: 'Staff123!',
    firstName: 'David',
    lastName: 'Brown',
    role: 'STAFF',
    description: 'General Staff - Limited access to scheduling and basic features'
  },
  {
    type: 'practice',
    email: 'receptionist@dentalcloud.com',
    password: 'Reception123!',
    firstName: 'Lisa',
    lastName: 'Anderson',
    role: 'RECEPTIONIST',
    description: 'Receptionist - Access to scheduling, patient check-in, and billing'
  },
  // Patient Users
  {
    type: 'patient',
    email: 'patient1@example.com',
    password: 'Patient123!',
    firstName: 'John',
    lastName: 'Smith',
    description: 'Patient Portal User - Access to personal health records and appointments'
  },
  {
    type: 'patient',
    email: 'patient2@example.com',
    password: 'Patient123!',
    firstName: 'Jane',
    lastName: 'Doe',
    description: 'Patient Portal User - Access to personal health records and appointments'
  }
]

/**
 * Create sample practice and patient users
 */
export async function createSampleUsers() {
  console.log("👥 Creating Sample Users...\n")

  try {
    // First, ensure we have a practice to assign users to
    let practice = await db.practice.findFirst()
    
    if (!practice) {
      console.log("🏥 Creating sample practice...")
      practice = await db.practice.create({
        data: {
          name: "DentalCloud Demo Practice",
          address: "123 Main Street, Anytown, ST 12345",
          phone: "(555) 123-4567",
          email: "info@dentalcloud.com",
          website: "https://dentalcloud.com",
          timezone: "America/New_York",
        }
      })
      console.log(`✅ Created practice: ${practice.name}`)
    }

    console.log("👨‍⚕️ Creating Practice Users:")
    console.log("=" .repeat(80))

    // Create practice users
    for (const user of sampleUsers.filter(u => u.type === 'practice')) {
      try {
        // Check if user already exists
        const existingUser = await db.practiceUser.findUnique({
          where: { email: user.email }
        })

        if (existingUser) {
          console.log(`⚠️  Practice user ${user.email} already exists - skipping`)
          continue
        }

        // Hash password
        const hashedPassword = await PasswordService.hashPassword(user.password)

        // Create practice user
        const practiceUser = await db.practiceUser.create({
          data: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as PracticeRole,
            practiceId: practice.id,
            isActive: true,
          }
        })

        console.log(`✅ Created: ${user.firstName} ${user.lastName} (${user.role})`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Password: ${user.password}`)
        console.log(`   Description: ${user.description}`)
        console.log()

      } catch (error) {
        console.log(`❌ Failed to create practice user ${user.email}:`, error)
      }
    }

    console.log("👤 Creating Patient Users:")
    console.log("=" .repeat(80))

    // Create patient users
    for (const user of sampleUsers.filter(u => u.type === 'patient')) {
      try {
        // Check if patient user already exists
        const existingPatientUser = await db.patientUser.findUnique({
          where: { email: user.email }
        })

        if (existingPatientUser) {
          console.log(`⚠️  Patient user ${user.email} already exists - skipping`)
          continue
        }

        // Create patient record first
        const patient = await db.patient.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: new Date('1990-01-01'), // Sample DOB
            gender: 'Other',
            email: user.email,
            phone: '(555) 123-4567',
            address: '456 Oak Street, Anytown, ST 12345',
            practiceId: practice.id,
            emergencyContact: 'Emergency Contact Name - (555) 987-6543',
            insurance: 'Sample Insurance Provider',
          }
        })

        // Hash password
        const hashedPassword = await PasswordService.hashPassword(user.password)

        // Create patient user account
        const patientUser = await db.patientUser.create({
          data: {
            email: user.email,
            password: hashedPassword,
            isActive: true,
          }
        })

        // Link patient to user account
        await db.patient.update({
          where: { id: patient.id },
          data: { patientUserId: patientUser.id }
        })

        console.log(`✅ Created: ${user.firstName} ${user.lastName} (Patient)`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Password: ${user.password}`)
        console.log(`   Description: ${user.description}`)
        console.log()

      } catch (error) {
        console.log(`❌ Failed to create patient user ${user.email}:`, error)
      }
    }

    console.log("📋 Login Summary:")
    console.log("=" .repeat(80))
    console.log("🏥 PRACTICE STAFF LOGINS (Use at /auth/signin):")
    console.log()
    
    for (const user of sampleUsers.filter(u => u.type === 'practice')) {
      console.log(`${user.role?.padEnd(12)} | ${user.email.padEnd(25)} | ${user.password}`)
    }
    
    console.log()
    console.log("👤 PATIENT PORTAL LOGINS (Use at /patient/auth/signin):")
    console.log()
    
    for (const user of sampleUsers.filter(u => u.type === 'patient')) {
      console.log(`Patient      | ${user.email.padEnd(25)} | ${user.password}`)
    }

    console.log()
    console.log("🎉 Sample users created successfully!")
    console.log()
    console.log("🚀 Next Steps:")
    console.log("1. Start the development server: npm run dev")
    console.log("2. Visit http://localhost:3000/auth/signin for practice staff")
    console.log("3. Visit http://localhost:3000/patient/auth/signin for patients")
    console.log("4. Use any of the credentials above to test the authentication")

  } catch (error) {
    console.error("❌ Failed to create sample users:", error)
    throw error
  }
}

/**
 * Main function to run sample user creation
 */
async function main() {
  try {
    await createSampleUsers()
    process.exit(0)
  } catch (error) {
    console.error("Sample user creation failed:", error)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
