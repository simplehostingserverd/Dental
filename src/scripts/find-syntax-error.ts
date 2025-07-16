#!/usr/bin/env node

/**
 * Quick syntax error finder
 * Uses binary search approach to isolate the problematic file
 */

import { spawn } from "node:child_process";
import { mkdir, readdir, rename, stat } from "node:fs/promises";
import { basename, join } from "node:path";

interface TestResult {
	success: boolean;
	output: string;
	error?: string;
}

/**
 * Test if Next.js dev server starts successfully
 */
async function testNextJSStart(): Promise<TestResult> {
	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			nextProcess.kill();
			resolve({
				success: false,
				output: "Timeout - server took too long to start",
				error: "TIMEOUT",
			});
		}, 15000); // 15 second timeout

		const nextProcess = spawn("npx", ["next", "dev", "--turbo"], {
			stdio: ["inherit", "pipe", "pipe"],
			shell: true,
		});

		let stdout = "";
		let stderr = "";
		let hasStarted = false;

		nextProcess.stdout?.on("data", (data) => {
			const chunk = data.toString();
			stdout += chunk;

			// Check for successful start indicators
			if (chunk.includes("Ready") || chunk.includes("compiled successfully")) {
				hasStarted = true;
				clearTimeout(timeout);
				nextProcess.kill();
				resolve({
					success: true,
					output: stdout,
				});
			}
		});

		nextProcess.stderr?.on("data", (data) => {
			const chunk = data.toString();
			stderr += chunk;

			// Check for syntax errors
			if (
				chunk.includes("SyntaxError") ||
				chunk.includes("Invalid or unexpected token")
			) {
				clearTimeout(timeout);
				nextProcess.kill();
				resolve({
					success: false,
					output: stdout + stderr,
					error: "SYNTAX_ERROR",
				});
			}
		});

		nextProcess.on("close", (code) => {
			clearTimeout(timeout);
			if (!hasStarted) {
				resolve({
					success: code === 0,
					output: stdout + stderr,
					error: code !== 0 ? `Exit code: ${code}` : undefined,
				});
			}
		});

		nextProcess.on("error", (error) => {
			clearTimeout(timeout);
			resolve({
				success: false,
				output: "",
				error: error.message,
			});
		});
	});
}

/**
 * Get all source files
 */
async function getAllSourceFiles(dir = "src"): Promise<string[]> {
	const files: string[] = [];
	const extensions = [".ts", ".tsx", ".js", ".jsx"];

	async function scanDirectory(dirPath: string): Promise<void> {
		try {
			const entries = await readdir(dirPath);

			for (const entry of entries) {
				const fullPath = join(dirPath, entry);
				const stats = await stat(fullPath);

				if (
					stats.isDirectory() &&
					!entry.startsWith(".") &&
					entry !== "node_modules"
				) {
					await scanDirectory(fullPath);
				} else if (extensions.some((ext) => entry.endsWith(ext))) {
					files.push(fullPath);
				}
			}
		} catch (error) {
			console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
		}
	}

	await scanDirectory(dir);
	return files;
}

/**
 * Binary search to find problematic file
 */
async function binarySearchProblematicFile(
	files: string[],
): Promise<string | null> {
	console.log(
		`🔍 Using binary search to find problematic file among ${files.length} files...\n`,
	);

	// Create backup directory
	const backupDir = "temp_file_backup";
	await mkdir(backupDir, { recursive: true });

	async function moveFiles(
		filesToMove: string[],
		toBackup: boolean,
	): Promise<void> {
		for (const file of filesToMove) {
			const fileName = basename(file);
			const backupPath = join(backupDir, fileName);

			if (toBackup) {
				try {
					await rename(file, backupPath);
				} catch (error) {
					console.warn(`Could not move ${file}:`, error);
				}
			} else {
				try {
					await rename(backupPath, file);
				} catch (error) {
					console.warn(`Could not restore ${file}:`, error);
				}
			}
		}
	}

	let left = 0;
	let right = files.length - 1;
	let problematicFile: string | null = null;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const leftHalf = files.slice(left, mid + 1);
		const rightHalf = files.slice(mid + 1, right + 1);

		console.log(`Testing files ${left}-${mid} (${leftHalf.length} files)...`);

		// Move right half to backup
		await moveFiles(rightHalf, true);

		// Test with left half
		const result = await testNextJSStart();

		if (result.success) {
			// Problem is in right half
			console.log("✅ Left half is clean, problem is in right half");
			await moveFiles(rightHalf, false); // Restore right half
			left = mid + 1;
		} else {
			// Problem is in left half
			console.log("❌ Problem found in left half");
			await moveFiles(rightHalf, false); // Restore right half

			if (leftHalf.length === 1) {
				problematicFile = leftHalf[0];
				break;
			}

			right = mid;
		}
	}

	return problematicFile;
}

/**
 * Test individual files one by one
 */
async function testIndividualFiles(files: string[]): Promise<string[]> {
	console.log("🔍 Testing individual files...\n");

	const problematicFiles: string[] = [];
	const backupDir = "temp_individual_backup";
	await mkdir(backupDir, { recursive: true });

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const fileName = basename(file);
		const backupPath = join(backupDir, `${i}_${fileName}`);

		console.log(`Testing ${i + 1}/${files.length}: ${file}`);

		try {
			// Move file to backup
			await rename(file, backupPath);

			// Test without this file
			const result = await testNextJSStart();

			if (result.success) {
				console.log(`❌ File ${file} is causing the issue!`);
				problematicFiles.push(file);
			}

			// Restore file
			await rename(backupPath, file);
		} catch (error) {
			console.warn(`Could not test file ${file}:`, error);
			// Try to restore if backup exists
			try {
				await rename(backupPath, file);
			} catch (restoreError) {
				console.error(`Failed to restore ${file}:`, restoreError);
			}
		}
	}

	return problematicFiles;
}

/**
 * Main function
 */
async function main(): Promise<void> {
	console.log("🚀 Starting syntax error detection...\n");

	try {
		// First, test if the error exists
		console.log("=== INITIAL TEST ===");
		const initialTest = await testNextJSStart();

		if (initialTest.success) {
			console.log("✅ No syntax error detected! Server starts successfully.");
			return;
		}

		console.log("❌ Syntax error confirmed. Starting investigation...\n");
		console.log("Error output:");
		console.log(initialTest.output);
		console.log(`\n${"=".repeat(50)}\n`);

		// Get all source files
		const allFiles = await getAllSourceFiles();
		console.log(`Found ${allFiles.length} source files to analyze\n`);

		// Try binary search first (faster for large codebases)
		if (allFiles.length > 10) {
			console.log("=== BINARY SEARCH APPROACH ===");
			const problematicFile = await binarySearchProblematicFile(allFiles);

			if (problematicFile) {
				console.log(`\n🎯 FOUND PROBLEMATIC FILE: ${problematicFile}`);
				console.log("\n💡 Next steps:");
				console.log(`   1. Examine the file: ${problematicFile}`);
				console.log(
					"   2. Look for syntax errors, encoding issues, or invalid characters",
				);
				console.log("   3. Consider regenerating the file if it's corrupted");
				return;
			}
		}

		// Fallback to individual file testing
		console.log("=== INDIVIDUAL FILE TESTING ===");
		const problematicFiles = await testIndividualFiles(allFiles.slice(0, 20)); // Test first 20 files

		if (problematicFiles.length > 0) {
			console.log(`\n🎯 FOUND ${problematicFiles.length} PROBLEMATIC FILE(S):`);
			problematicFiles.forEach((file, index) => {
				console.log(`   ${index + 1}. ${file}`);
			});
		} else {
			console.log("\n🤔 No individual problematic files found.");
			console.log("💡 The issue might be:");
			console.log("   • In the interaction between multiple files");
			console.log(
				"   • In configuration files (next.config.js, tsconfig.json)",
			);
			console.log("   • In environment variables or dependencies");
			console.log("   • In Next.js internal compilation process");
		}
	} catch (error) {
		console.error("❌ Error detection failed:", error);
		process.exit(1);
	}
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
