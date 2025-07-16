import { db } from "@/server/db"

interface EnvCheck {
  key: string
  value?: string
  required: boolean
  description: string
  status: 'OK' | 'MISSING' | 'EMPTY'
}

/**
 * Check environment variables and database connection
 */
export async function checkEnvironment() {
  console.log("🔍 Checking Environment Configuration...\n")

  const envChecks: EnvCheck[] = [
    {
      key: "DATABASE_URL",
      value: process.env.DATABASE_URL,
      required: true,
      description: "PostgreSQL database connection string"
    },
    {
      key: "NEXTAUTH_SECRET",
      value: process.env.NEXTAUTH_SECRET,
      required: true,
      description: "NextAuth.js secret for JWT signing"
    },
    {
      key: "NEXTAUTH_URL",
      value: process.env.NEXTAUTH_URL,
      required: false,
      description: "NextAuth.js URL (for production)"
    },
    {
      key: "AUTH_DISCORD_ID",
      value: process.env.AUTH_DISCORD_ID,
      required: false,
      description: "Discord OAuth client ID"
    },
    {
      key: "AUTH_DISCORD_SECRET",
      value: process.env.AUTH_DISCORD_SECRET,
      required: false,
      description: "Discord OAuth client secret"
    },
    {
      key: "JWT_SECRET",
      value: process.env.JWT_SECRET,
      required: true,
      description: "Custom JWT secret for practice authentication"
    },
    {
      key: "PATIENT_JWT_SECRET",
      value: process.env.PATIENT_JWT_SECRET,
      required: true,
      description: "Custom JWT secret for patient authentication"
    },
    {
      key: "NODE_ENV",
      value: process.env.NODE_ENV,
      required: true,
      description: "Node.js environment (development/production)"
    }
  ]

  // Check each environment variable
  console.log("📋 Environment Variables:")
  console.log("=" .repeat(80))
  
  let hasErrors = false
  
  for (const check of envChecks) {
    if (!check.value) {
      check.status = 'MISSING'
      if (check.required) hasErrors = true
    } else if (check.value.trim() === '' || check.value === 'placeholder') {
      check.status = 'EMPTY'
      if (check.required) hasErrors = true
    } else {
      check.status = 'OK'
    }

    const statusIcon = check.status === 'OK' ? '✅' : check.status === 'MISSING' ? '❌' : '⚠️'
    const maskedValue = check.value && check.key.toLowerCase().includes('secret') 
      ? `${check.value.substring(0, 8)}...` 
      : check.value || 'NOT SET'
    
    console.log(`${statusIcon} ${check.key.padEnd(20)} | ${check.status.padEnd(8)} | ${maskedValue}`)
    console.log(`   ${check.description}`)
    console.log()
  }

  // Check database connection
  console.log("🗄️  Database Connection:")
  console.log("=" .repeat(80))
  
  try {
    console.log("Attempting to connect to database...")
    
    // Test basic connection
    await db.$connect()
    console.log("✅ Database connection successful")
    
    // Test query execution
    const result = await db.$queryRaw`SELECT 1 as test`
    console.log("✅ Database query execution successful")
    
    // Check if tables exist
    try {
      const userCount = await db.user.count()
      console.log(`✅ User table accessible (${userCount} records)`)
    } catch (error) {
      console.log("⚠️  User table not found - database may need migration")
    }

    try {
      const practiceUserCount = await db.practiceUser.count()
      console.log(`✅ PracticeUser table accessible (${practiceUserCount} records)`)
    } catch (error) {
      console.log("⚠️  PracticeUser table not found - database needs migration")
    }

    try {
      const patientUserCount = await db.patientUser.count()
      console.log(`✅ PatientUser table accessible (${patientUserCount} records)`)
    } catch (error) {
      console.log("⚠️  PatientUser table not found - database needs migration")
    }

  } catch (error) {
    console.log("❌ Database connection failed:")
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    hasErrors = true
    
    if (error instanceof Error && error.message.includes('P1017')) {
      console.log("   💡 This usually means the database connection was closed")
      console.log("   💡 Check if your database URL is correct and the database is running")
    }
  } finally {
    try {
      await db.$disconnect()
    } catch (error) {
      // Ignore disconnect errors
    }
  }

  // Summary
  console.log("\n📊 Summary:")
  console.log("=" .repeat(80))
  
  if (hasErrors) {
    console.log("❌ Configuration has errors that need to be fixed")
    console.log("\n🔧 Next Steps:")
    console.log("1. Update missing/empty environment variables in .env file")
    console.log("2. Run 'npx prisma db push' to create database tables")
    console.log("3. Run this check again to verify configuration")
  } else {
    console.log("✅ Environment configuration looks good!")
    console.log("\n🚀 Ready to:")
    console.log("1. Create sample users")
    console.log("2. Test authentication")
    console.log("3. Start the application")
  }

  return { hasErrors, envChecks }
}

/**
 * Generate missing environment variables
 */
export async function generateMissingEnvVars() {
  console.log("\n🔑 Suggested Environment Variables:")
  console.log("=" .repeat(80))
  console.log("# Add these to your .env file:")
  console.log()

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'placeholder') {
    const crypto = await import('node:crypto')
    const jwtSecret = crypto.randomBytes(32).toString('hex')
    console.log(`JWT_SECRET="${jwtSecret}"`)
  }

  if (!process.env.PATIENT_JWT_SECRET || process.env.PATIENT_JWT_SECRET === 'placeholder') {
    const crypto = await import('node:crypto')
    const patientJwtSecret = crypto.randomBytes(32).toString('hex')
    console.log(`PATIENT_JWT_SECRET="${patientJwtSecret}"`)
  }

  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET === 'placeholder') {
    const crypto = await import('node:crypto')
    const nextAuthSecret = crypto.randomBytes(32).toString('hex')
    console.log(`NEXTAUTH_SECRET="${nextAuthSecret}"`)
  }

  console.log()
}

/**
 * Main function to run environment check
 */
async function main() {
  try {
    await checkEnvironment()
    await generateMissingEnvVars()
    process.exit(0)
  } catch (error) {
    console.error("Environment check failed:", error)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
