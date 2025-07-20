import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

async function createMissingTablesMigration() {
  console.log("🔧 Creating migration for missing tables...");
  
  try {
    // First, let's see what Prisma thinks needs to be created
    console.log("1. Checking what migrations are needed...");
    
    // Create a migration for all the missing tables
    await execAsync("npx prisma migrate dev --name add_missing_tables --create-only");
    
    console.log("✅ Migration file created!");
    console.log("📝 Review the migration file in prisma/migrations/");
    console.log("🚀 Run 'npx prisma migrate dev' to apply it");
    
  } catch (error) {
    console.error("❌ Failed to create migration:", error);
    
    // Fallback: use db push
    console.log("\n💡 Trying alternative approach with db push...");
    try {
      await execAsync("npx prisma db push");
      console.log("✅ Schema pushed successfully!");
    } catch (pushError) {
      console.error("❌ DB push also failed:", pushError);
    }
  }
}

createMissingTablesMigration();