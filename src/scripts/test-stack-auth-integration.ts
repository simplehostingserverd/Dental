import { db } from "@/server/db";

async function testStackAuthIntegration() {
  console.log("🧪 Testing Stack Auth integration...\n");
  
  try {
    // Test 1: Check Stack Auth configuration
    console.log("1. Testing Stack Auth configuration...");
    
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
    const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
    const secretKey = process.env.STACK_SECRET_SERVER_KEY;
    
    if (!projectId || !publishableKey || !secretKey) {
      console.log("❌ Missing Stack Auth environment variables:");
      console.log(`   NEXT_PUBLIC_STACK_PROJECT_ID: ${projectId ? '✅' : '❌'}`);
      console.log(`   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: ${publishableKey ? '✅' : '❌'}`);
      console.log(`   STACK_SECRET_SERVER_KEY: ${secretKey ? '✅' : '❌'}`);
      return;
    }
    
    console.log("✅ Stack Auth environment variables configured");
    
    // Test 2: Check Stack Auth server configuration files
    console.log("\n2. Testing Stack Auth server configuration...");

    try {
      const fs = await import('fs');
      const path = await import('path');

      const stackServerPath = path.join(process.cwd(), 'src/stack.tsx');

      if (fs.existsSync(stackServerPath)) {
        console.log("✅ Stack Auth server configuration exists");

        // Check if the file contains the required configuration
        const stackContent = fs.readFileSync(stackServerPath, 'utf-8');
        if (stackContent.includes('StackServerApp') && stackContent.includes('projectId')) {
          console.log("✅ Stack Auth server app properly configured");
        } else {
          console.log("❌ Stack Auth server app configuration incomplete");
        }
      } else {
        console.log("❌ Stack Auth server configuration missing");
      }
    } catch (error) {
      console.log("❌ Error checking Stack Auth server configuration:", error);
    }
    
    // Test 3: Check database schema updates
    console.log("\n3. Testing database schema updates...");
    
    try {
      // Check if stackUserId columns exist
      const practiceUserColumns = await db.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'PracticeUser' 
        AND table_schema = 'public'
        AND column_name = 'stackUserId';
      `;
      
      const patientUserColumns = await db.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'PatientUser' 
        AND table_schema = 'public'
        AND column_name = 'stackUserId';
      `;
      
      if (practiceUserColumns.length > 0) {
        console.log("✅ PracticeUser.stackUserId column exists");
      } else {
        console.log("❌ PracticeUser.stackUserId column missing");
      }
      
      if (patientUserColumns.length > 0) {
        console.log("✅ PatientUser.stackUserId column exists");
      } else {
        console.log("❌ PatientUser.stackUserId column missing");
      }
      
    } catch (error) {
      console.log("❌ Error checking database schema:", error);
    }
    
    // Test 4: Test creating a practice user with Stack Auth integration
    console.log("\n4. Testing practice user creation with Stack Auth...");
    
    try {
      // Create a test practice first
      const testPractice = await db.practice.create({
        data: {
          name: "Test Stack Auth Practice",
          email: "test-stack@example.com",
        }
      });
      
      // Create a practice user that could be linked to Stack Auth
      const testPracticeUser = await db.practiceUser.create({
        data: {
          email: "test-stack-user@example.com",
          firstName: "Test",
          lastName: "User",
          role: "DOCTOR",
          practiceId: testPractice.id,
          stackUserId: null, // Will be populated when user signs up via Stack Auth
        }
      });
      
      console.log("✅ Practice user created with Stack Auth support");
      console.log(`   User ID: ${testPracticeUser.id}`);
      console.log(`   Email: ${testPracticeUser.email}`);
      console.log(`   Stack User ID: ${testPracticeUser.stackUserId || 'Not linked yet'}`);
      
      // Clean up test data
      await db.practiceUser.delete({ where: { id: testPracticeUser.id } });
      await db.practice.delete({ where: { id: testPractice.id } });
      console.log("✅ Test data cleaned up");
      
    } catch (error) {
      console.log("❌ Error testing practice user creation:", error);
    }
    
    // Test 5: Check API routes
    console.log("\n5. Testing Stack Auth API routes...");
    
    try {
      // Check if the Stack Auth API route exists
      const fs = await import('fs');
      const path = await import('path');
      
      const apiRoutePath = path.join(process.cwd(), 'src/app/api/v1/auth/[...stack]/route.ts');
      
      if (fs.existsSync(apiRoutePath)) {
        console.log("✅ Stack Auth API route exists at /api/v1/auth/[...stack]");
      } else {
        console.log("❌ Stack Auth API route missing");
      }
      
      const handlerPath = path.join(process.cwd(), 'src/app/handler/[...stack]/page.tsx');
      
      if (fs.existsSync(handlerPath)) {
        console.log("✅ Stack Auth handler exists at /handler/[...stack]");
      } else {
        console.log("❌ Stack Auth handler missing");
      }
      
    } catch (error) {
      console.log("❌ Error checking API routes:", error);
    }
    
    // Test 6: Check client configuration
    console.log("\n6. Testing client configuration...");
    
    try {
      const clientConfigPath = require.resolve('@/lib/stack-client');
      console.log("✅ Stack Auth client configuration exists");
    } catch (error) {
      console.log("❌ Stack Auth client configuration missing");
    }
    
    console.log("\n🎉 Stack Auth integration test completed!");
    console.log("\n📋 Next steps:");
    console.log("1. Start the development server: npm run dev");
    console.log("2. Navigate to http://localhost:3000/auth/signin");
    console.log("3. Try signing up with Stack Auth");
    console.log("4. Check that authentication works across the app");
    
  } catch (error) {
    console.error("❌ Stack Auth integration test failed:", error);
  } finally {
    await db.$disconnect();
  }
}

testStackAuthIntegration();
