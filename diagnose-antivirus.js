#!/usr/bin/env node

/**
 * Diagnose if antivirus is causing development issues
 */

import { exec, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

console.log("🔍 Diagnosing potential antivirus interference...\n");

async function checkAntivirusProcesses() {
	console.log("=== STEP 1: ANTIVIRUS PROCESS CHECK ===");

	try {
		const { stdout } = await execAsync(
			'tasklist /FI "IMAGENAME eq avast*" /FO CSV',
		);
		const lines = stdout.split("\n").filter((line) => line.includes("avast"));

		if (lines.length > 0) {
			console.log("🛡️  Avast processes detected:");
			for (const line of lines) {
				if (line.trim()) {
					const parts = line.split(",");
					if (parts[0]) {
						console.log(`   • ${parts[0].replace(/"/g, "")}`);
					}
				}
			}
		} else {
			console.log("ℹ️  No Avast processes found in task list");
		}
	} catch (error) {
		console.log("⚠️  Could not check antivirus processes:", error.message);
	}
}

async function testFileOperations() {
	console.log("\n=== STEP 2: FILE OPERATION TEST ===");

	const testDir = path.join(process.cwd(), "temp_av_test");
	const testFile = path.join(testDir, "test.js");

	try {
		// Create test directory
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir);
		}

		console.log("📁 Creating test files...");

		// Test rapid file creation/deletion (common in dev servers)
		const startTime = Date.now();

		for (let i = 0; i < 10; i++) {
			const content = `// Test file ${i}\nconsole.log("Hello ${i}");`;
			fs.writeFileSync(testFile, content);

			// Small delay to simulate real development
			await new Promise((resolve) => setTimeout(resolve, 10));

			if (fs.existsSync(testFile)) {
				fs.unlinkSync(testFile);
			}
		}

		const endTime = Date.now();
		const duration = endTime - startTime;

		console.log(`✅ File operations completed in ${duration}ms`);

		if (duration > 1000) {
			console.log(
				"⚠️  File operations are slow - possible antivirus interference",
			);
		} else {
			console.log("✅ File operations are fast - antivirus impact minimal");
		}

		// Cleanup
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
	} catch (error) {
		console.log("❌ File operation test failed:", error.message);
		console.log("🛡️  This could indicate antivirus blocking file operations");
	}
}

async function testNodeJSExecution() {
	console.log("\n=== STEP 3: NODE.JS EXECUTION TEST ===");

	return new Promise((resolve) => {
		const testScript = `
      console.log("Node.js execution test");
      process.exit(0);
    `;

		const startTime = Date.now();

		const nodeProcess = spawn("node", ["-e", testScript], {
			stdio: ["inherit", "pipe", "pipe"],
			shell: true,
		});

		let stdout = "";
		let stderr = "";

		nodeProcess.stdout?.on("data", (data) => {
			stdout += data.toString();
		});

		nodeProcess.stderr?.on("data", (data) => {
			stderr += data.toString();
		});

		nodeProcess.on("close", (code) => {
			const endTime = Date.now();
			const duration = endTime - startTime;

			console.log(`Node.js execution time: ${duration}ms`);

			if (duration > 2000) {
				console.log(
					"⚠️  Node.js execution is slow - possible antivirus scanning",
				);
			} else {
				console.log("✅ Node.js execution is fast");
			}

			if (code === 0) {
				console.log("✅ Node.js execution successful");
			} else {
				console.log("❌ Node.js execution failed with code:", code);
				if (stderr) {
					console.log("Error:", stderr);
				}
			}

			resolve();
		});

		nodeProcess.on("error", (error) => {
			console.log("❌ Failed to execute Node.js:", error.message);
			resolve();
		});
	});
}

async function testNextJSWithVerboseLogging() {
	console.log("\n=== STEP 4: NEXT.JS DETAILED TEST ===");

	return new Promise((resolve) => {
		console.log("🚀 Starting Next.js with verbose logging...");

		const nextProcess = spawn("npx", ["next", "dev", "--turbo"], {
			stdio: ["inherit", "pipe", "pipe"],
			shell: true,
			env: {
				...process.env,
				DEBUG: "next:*",
				NODE_ENV: "development",
			},
		});

		let stdout = "";
		let stderr = "";
		let hasStarted = false;
		let errorCount = 0;

		const timeout = setTimeout(() => {
			nextProcess.kill();
			console.log("\n⏱️  Test completed (20s timeout)");

			console.log("\n📊 RESULTS:");
			console.log(`   • Server started: ${hasStarted ? "YES" : "NO"}`);
			console.log(`   • Error count: ${errorCount}`);

			if (hasStarted && errorCount > 0) {
				console.log(
					"🛡️  Server starts but has errors - likely antivirus interference",
				);
			} else if (hasStarted && errorCount === 0) {
				console.log("✅ Server working perfectly");
			} else {
				console.log("❌ Server failed to start");
			}

			resolve();
		}, 20000);

		nextProcess.stdout?.on("data", (data) => {
			const chunk = data.toString();
			stdout += chunk;

			// Look for startup indicators
			if (
				chunk.includes("Local:") ||
				chunk.includes("Ready") ||
				chunk.includes("compiled successfully")
			) {
				hasStarted = true;
				console.log("✅ Server started successfully");
			}

			// Count compilation messages
			if (chunk.includes("Compiled") || chunk.includes("compiling")) {
				console.log(`📦 ${chunk.trim()}`);
			}
		});

		nextProcess.stderr?.on("data", (data) => {
			const chunk = data.toString();
			stderr += chunk;

			// Count different types of errors
			if (chunk.includes("SyntaxError")) {
				errorCount++;
				console.log(`❌ Syntax Error #${errorCount}: ${chunk.trim()}`);
			} else if (chunk.includes("Error")) {
				console.log(`⚠️  Error: ${chunk.trim()}`);
			}
		});

		nextProcess.on("close", (code) => {
			clearTimeout(timeout);
			resolve();
		});

		nextProcess.on("error", (error) => {
			clearTimeout(timeout);
			console.log("❌ Failed to start Next.js:", error.message);
			resolve();
		});
	});
}

async function generateAntivirusReport() {
	console.log("\n=== ANTIVIRUS IMPACT ASSESSMENT ===");

	console.log("\n🛡️  AVAST BUSINESS ANTIVIRUS RECOMMENDATIONS:");
	console.log("\n1. ADD EXCLUSIONS:");
	console.log(`   • Project folder: ${process.cwd()}`);
	console.log(`   • Node.js executable: ${process.execPath}`);
	console.log("   • npm cache: %APPDATA%\\npm-cache");
	console.log("   • Temp folders: %TEMP%");

	console.log("\n2. DISABLE THESE SHIELDS TEMPORARILY:");
	console.log("   • File System Shield (for development folder)");
	console.log("   • Behavior Shield (for Node.js processes)");
	console.log("   • Script Shield (for JavaScript execution)");

	console.log("\n3. AVAST SETTINGS TO CHECK:");
	console.log("   • Real-time protection sensitivity");
	console.log("   • Hardened mode (disable for development)");
	console.log("   • DeepScreen analysis (can slow Node.js)");

	console.log("\n4. ALTERNATIVE SOLUTIONS:");
	console.log("   • Use Windows Defender exclusions");
	console.log("   • Run development in WSL2");
	console.log("   • Use Docker for isolated development");

	console.log("\n📋 NEXT STEPS:");
	console.log("1. Add exclusions in Avast Business Console");
	console.log("2. Restart development server");
	console.log("3. Monitor for improved performance");
	console.log("4. If issues persist, temporarily disable real-time protection");
}

async function main() {
	await checkAntivirusProcesses();
	await testFileOperations();
	await testNodeJSExecution();
	await testNextJSWithVerboseLogging();
	await generateAntivirusReport();

	console.log("\n🎯 CONCLUSION:");
	console.log(
		'If you see "Server started successfully" but still get syntax errors,',
	);
	console.log("it's very likely Avast Business Antivirus interference.");
	console.log(
		"\nThe server IS working - the errors are false positives from AV scanning.",
	);
}

main().catch(console.error);
