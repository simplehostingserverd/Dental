import { db } from "@/server/db";

async function checkRLSPolicies() {
  console.log("🔍 Checking RLS policies in database...\n");
  
  try {
    // Check if RLS is enabled on tables
    const rlsStatus = await db.$queryRaw<Array<{ 
      tablename: string, 
      rowsecurity: boolean 
    }>>`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('Practice', 'PracticeUser', 'Patient', 'Payment')
      ORDER BY tablename;
    `;
    
    console.log("📋 RLS Status for key tables:");
    rlsStatus.forEach(table => {
      console.log(`  ${table.rowsecurity ? '✅' : '❌'} ${table.tablename} - RLS ${table.rowsecurity ? 'enabled' : 'disabled'}`);
    });
    
    // Check what policies exist
    const policies = await db.$queryRaw<Array<{
      tablename: string,
      policyname: string,
      permissive: string,
      roles: string[],
      cmd: string,
      qual: string
    }>>`
      SELECT 
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual
      FROM pg_policies 
      WHERE schemaname = 'public'
      AND tablename IN ('Practice', 'PracticeUser', 'Patient', 'Payment')
      ORDER BY tablename, policyname;
    `;
    
    console.log("\n📋 Existing RLS Policies:");
    if (policies.length === 0) {
      console.log("  ❌ No RLS policies found!");
    } else {
      policies.forEach(policy => {
        console.log(`  ✅ ${policy.tablename}.${policy.policyname}`);
        console.log(`     Command: ${policy.cmd}, Permissive: ${policy.permissive}`);
        console.log(`     Condition: ${policy.qual || 'No condition'}`);
        console.log(`     Roles: ${policy.roles?.join(', ') || 'All roles'}`);
        console.log();
      });
    }
    
    // Check if the RLS functions exist
    const functions = await db.$queryRaw<Array<{
      proname: string,
      prosrc: string
    }>>`
      SELECT proname, prosrc
      FROM pg_proc 
      WHERE proname IN ('get_current_practice_user', 'get_current_patient_user')
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `;
    
    console.log("📋 RLS Helper Functions:");
    if (functions.length === 0) {
      console.log("  ❌ No RLS helper functions found!");
    } else {
      functions.forEach(func => {
        console.log(`  ✅ ${func.proname}()`);
      });
    }
    
    // Test the functions if they exist
    if (functions.length > 0) {
      console.log("\n🧪 Testing RLS helper functions:");
      try {
        const practiceUserResult = await db.$queryRaw`SELECT * FROM get_current_practice_user()`;
        console.log("  ✅ get_current_practice_user() works:", practiceUserResult);
      } catch (error) {
        console.log("  ❌ get_current_practice_user() failed:", error);
      }
      
      try {
        const patientUserResult = await db.$queryRaw`SELECT * FROM get_current_patient_user()`;
        console.log("  ✅ get_current_patient_user() works:", patientUserResult);
      } catch (error) {
        console.log("  ❌ get_current_patient_user() failed:", error);
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking RLS policies:", error);
  } finally {
    await db.$disconnect();
  }
}

checkRLSPolicies();
