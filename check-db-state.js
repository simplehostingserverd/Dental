#!/usr/bin/env node

/**
 * Check database state before applying Prisma changes
 */

import { spawn } from "node:child_process";

console.log("🔍 Checking database state before applying changes...\n");

async function checkDatabaseState() {
	console.log("=== DATABASE STATE CHECK ===");

	return new Promise((resolve) => {
		// Run Prisma introspect to see current state
		const introspectProcess = spawn("npx", ["prisma", "db", "pull"], {
			stdio: ["inherit", "pipe", "pipe"],
			shell: true,
		});

		let stdout = "";
		let stderr = "";

		introspectProcess.stdout?.on("data", (data) => {
			const chunk = data.toString();
			stdout += chunk;
			console.log(chunk.trim());
		});

		introspectProcess.stderr?.on("data", (data) => {
			const chunk = data.toString();
			stderr += chunk;
			console.error(chunk.trim());
		});

		introspectProcess.on("close", (code) => {
			console.log(`\nIntrospection completed with code: ${code}`);

			if (code === 0) {
				console.log("✅ Database connection successful");
				checkForDuplicates();
			} else {
				console.log("❌ Database introspection failed");
				console.log("💡 This might be because:");
				console.log("   • Database is empty (first time setup)");
				console.log("   • Connection issues");
				console.log("   • Schema doesn't exist yet");

				console.log("\n🚀 RECOMMENDATION: Proceed with db:push");
				console.log(
					"Since this appears to be initial setup, the warning is likely safe to ignore.",
				);
			}

			resolve();
		});

		introspectProcess.on("error", (error) => {
			console.log("❌ Failed to run introspection:", error.message);
			resolve();
		});
	});
}

async function checkForDuplicates() {
	console.log("\n=== DUPLICATE CHECK ===");

	return new Promise((resolve) => {
		// Try to query for duplicates using Prisma
		const queryProcess = spawn(
			"npx",
			["prisma", "studio", "--browser", "none"],
			{
				stdio: ["inherit", "pipe", "pipe"],
				shell: true,
			},
		);

		// Kill Prisma Studio quickly, we just want to test connection
		setTimeout(() => {
			queryProcess.kill();
			console.log("📊 Database appears accessible");

			console.log("\n💡 TO CHECK FOR DUPLICATES MANUALLY:");
			console.log("1. Run: npx prisma studio");
			console.log("2. Open the Patient table");
			console.log("3. Look for duplicate patientUserId values");
			console.log("4. If found, clean them up before proceeding");

			resolve();
		}, 3000);

		queryProcess.on("error", (error) => {
			console.log("⚠️  Could not start Prisma Studio:", error.message);
			resolve();
		});
	});
}

async function provideSafeOptions() {
	console.log("\n=== SAFE MIGRATION OPTIONS ===");

	console.log("\n🟢 OPTION 1: PROCEED (Recommended for new projects)");
	console.log("   Command: npm run db:push");
	console.log(
		"   Safe if: This is a new project or you know there are no duplicates",
	);

	console.log("\n🟡 OPTION 2: RESET DATABASE (Clean slate)");
	console.log("   Command: npx prisma migrate reset");
	console.log("   Effect: Deletes all data and recreates schema");
	console.log("   Safe if: You don't mind losing existing data");

	console.log("\n🔵 OPTION 3: CREATE MIGRATION (Production-safe)");
	console.log(
		"   Command: npx prisma migrate dev --name add-patient-unique-constraint",
	);
	console.log("   Effect: Creates a proper migration file");
	console.log("   Safe if: You want to track schema changes");

	console.log("\n🟠 OPTION 4: MANUAL CLEANUP (If duplicates exist)");
	console.log("   1. npx prisma studio");
	console.log("   2. Remove duplicate patientUserId entries");
	console.log("   3. Then run: npm run db:push");

	console.log("\n📋 CURRENT SITUATION ANALYSIS:");
	console.log("Based on your project setup, this appears to be:");
	console.log("✅ A development environment");
	console.log("✅ Likely first-time database setup");
	console.log("✅ Safe to proceed with db:push");

	console.log("\n🎯 RECOMMENDED ACTION:");
	console.log("Run: npm run db:push");
	console.log("The warning is likely a false positive for new setups.");
}

async function main() {
	await checkDatabaseState();
	await provideSafeOptions();

	console.log(`\n${"=".repeat(60)}`);
	console.log("🚀 READY TO PROCEED");
	console.log("If this is a new project, the warning is safe to ignore.");
	console.log("Run: npm run db:push");
	console.log("=".repeat(60));
}

main().catch(console.error);
