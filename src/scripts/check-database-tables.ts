import { db } from "@/server/db";

async function checkDatabaseTables() {
  console.log("🔍 Checking current database tables...\n");
  
  try {
    // Check what tables exist
    const tables = await db.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log("📋 Existing tables in database:");
    tables.forEach(table => console.log(`  ✅ ${table.table_name}`));
    
    // Check for specific tables mentioned by user
    const requiredTables = ['Payment', 'Practice'];
    console.log("\n🎯 Checking specific tables:");
    
    for (const tableName of requiredTables) {
      const tableExists = tables.some(t => t.table_name === tableName);
      if (tableExists) {
        console.log(`  ✅ ${tableName} - exists`);
        
        // Try to count records
        try {
          if (tableName === 'Payment') {
            const count = await db.payment.count();
            console.log(`     📊 ${count} records`);
          } else if (tableName === 'Practice') {
            const count = await db.practice.count();
            console.log(`     📊 ${count} records`);
          }
        } catch (error) {
          console.log(`     ⚠️  Error accessing table: ${error}`);
        }
      } else {
        console.log(`  ❌ ${tableName} - missing`);
      }
    }
    
    // Check for practiceId column in relevant tables
    console.log("\n🔍 Checking for practiceId columns:");
    const tablesWithPracticeId = ['PracticeUser', 'Patient', 'Payment'];
    
    for (const tableName of tablesWithPracticeId) {
      try {
        const columns = await db.$queryRaw<Array<{ column_name: string }>>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = ${tableName} 
          AND table_schema = 'public'
          ORDER BY column_name;
        `;
        
        const hasPracticeId = columns.some(col => col.column_name === 'practiceId');
        console.log(`  ${hasPracticeId ? '✅' : '❌'} ${tableName}.practiceId - ${hasPracticeId ? 'exists' : 'missing'}`);
        
        if (columns.length > 0) {
          console.log(`     Columns: ${columns.map(c => c.column_name).join(', ')}`);
        }
      } catch (error) {
        console.log(`  ❌ ${tableName} - table doesn't exist`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking database:", error);
  } finally {
    await db.$disconnect();
  }
}

checkDatabaseTables();
