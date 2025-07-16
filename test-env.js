#!/usr/bin/env node

/**
 * Test the env.ts file specifically for syntax errors
 */

import { spawn } from "node:child_process";
import fs from "node:fs";

console.log("🔍 Testing src/env.ts for syntax errors...\n");

// Step 1: Check if env.ts exists and is readable
console.log("=== STEP 1: FILE CHECK ===");
try {
	const envContent = fs.readFileSync("src/env.ts", "utf8");
	console.log("✅ src/env.ts exists and is readable");
	console.log(`📏 File size: ${envContent.length} characters`);
	console.log(`📄 Lines: ${envContent.split("\n").length}`);
} catch (error) {
	console.log("❌ Cannot read src/env.ts:", error.message);
	process.exit(1);
}

// Step 2: Try to compile env.ts with TypeScript
console.log("\n=== STEP 2: TYPESCRIPT COMPILATION ===");

const tscProcess = spawn(
	"npx",
	["tsc", "--noEmit", "--skipLibCheck", "src/env.ts"],
	{
		stdio: ["inherit", "pipe", "pipe"],
		shell: true,
	},
);

let stdout = "";
let stderr = "";

tscProcess.stdout?.on("data", (data) => {
	const chunk = data.toString();
	stdout += chunk;
	console.log(chunk.trim());
});

tscProcess.stderr?.on("data", (data) => {
	const chunk = data.toString();
	stderr += chunk;
	console.error(chunk.trim());
});

tscProcess.on("close", (code) => {
	console.log(`\nTypeScript compilation exit code: ${code}`);

	if (code === 0) {
		console.log("✅ TypeScript compilation successful!");
		testNextJSImport();
	} else {
		console.log("❌ TypeScript compilation failed!");
		console.log("\n📋 Error Analysis:");
		if (stderr) {
			console.log("STDERR:", stderr);
		}
		if (stdout) {
			console.log("STDOUT:", stdout);
		}

		// Try to identify specific syntax issues
		analyzeSyntaxErrors();
	}
});

tscProcess.on("error", (error) => {
	console.log("❌ Failed to run TypeScript compiler:", error.message);
	analyzeSyntaxErrors();
});

// Step 3: Test Next.js import
function testNextJSImport() {
	console.log("\n=== STEP 3: NEXT.JS IMPORT TEST ===");

	const nextProcess = spawn("npx", ["next", "dev", "--turbo"], {
		stdio: ["inherit", "pipe", "pipe"],
		shell: true,
	});

	let hasError = false;
	let hasStarted = false;

	const timeout = setTimeout(() => {
		if (!hasError && !hasStarted) {
			console.log("⏱️  Next.js test timed out (10s)");
			nextProcess.kill();
			console.log("✅ No immediate syntax errors detected in env.ts!");
		}
	}, 10000);

	nextProcess.stdout?.on("data", (data) => {
		const chunk = data.toString();
		console.log(chunk.trim());

		if (
			chunk.includes("Ready") ||
			chunk.includes("compiled successfully") ||
			chunk.includes("Local:")
		) {
			hasStarted = true;
			clearTimeout(timeout);
			nextProcess.kill();
			console.log("✅ Next.js started successfully - env.ts is working!");
		}
	});

	nextProcess.stderr?.on("data", (data) => {
		const chunk = data.toString();
		console.error(chunk.trim());

		if (
			chunk.includes("SyntaxError") ||
			chunk.includes("Invalid or unexpected token")
		) {
			hasError = true;
			clearTimeout(timeout);
			nextProcess.kill();
			console.log("❌ Syntax error detected when importing env.ts!");

			// Extract line number if possible
			const lines = chunk.split("\n");
			for (const line of lines) {
				if (
					line.includes("env.ts") &&
					(line.includes(":") || line.includes("line"))
				) {
					console.log(`🎯 Error location: ${line.trim()}`);
				}
			}
		}
	});

	nextProcess.on("close", (code) => {
		clearTimeout(timeout);
		if (!hasStarted && !hasError) {
			console.log(`Next.js process exited with code: ${code}`);
		}
	});

	nextProcess.on("error", (error) => {
		clearTimeout(timeout);
		console.log("❌ Failed to start Next.js:", error.message);
	});
}

// Analyze syntax errors manually
function analyzeSyntaxErrors() {
	console.log("\n=== MANUAL SYNTAX ANALYSIS ===");

	try {
		const content = fs.readFileSync("src/env.ts", "utf8");
		const lines = content.split("\n");

		console.log("🔍 Checking for common syntax issues...\n");

		// Check for common issues
		let issueFound = false;

		lines.forEach((line, index) => {
			const lineNum = index + 1;
			const trimmed = line.trim();

			// Check for missing semicolons
			if (
				trimmed.length > 0 &&
				!trimmed.endsWith(";") &&
				!trimmed.endsWith(",") &&
				!trimmed.endsWith("{") &&
				!trimmed.endsWith("}") &&
				!trimmed.startsWith("//") &&
				!trimmed.startsWith("/*") &&
				!trimmed.startsWith("*") &&
				!trimmed.startsWith("import") &&
				!trimmed.startsWith("export") &&
				!trimmed.includes("=>") &&
				trimmed !== ""
			) {
				console.log(`⚠️  Line ${lineNum}: Possible missing semicolon`);
				console.log(`   ${trimmed}`);
				issueFound = true;
			}

			// Check for unmatched quotes
			const singleQuotes = (line.match(/'/g) || []).length;
			const doubleQuotes = (line.match(/"/g) || []).length;
			const backticks = (line.match(/`/g) || []).length;

			if (
				singleQuotes % 2 !== 0 ||
				doubleQuotes % 2 !== 0 ||
				backticks % 2 !== 0
			) {
				console.log(`❌ Line ${lineNum}: Unmatched quotes`);
				console.log(`   ${trimmed}`);
				issueFound = true;
			}

			// Check for invalid characters
			if (/[^\x00-\x7F]/.test(line)) {
				console.log(`❌ Line ${lineNum}: Non-ASCII characters detected`);
				console.log(`   ${trimmed}`);
				issueFound = true;
			}
		});

		// Check bracket matching
		const brackets = { "(": 0, "[": 0, "{": 0 };
		for (let i = 0; i < content.length; i++) {
			const char = content[i];
			if (char === "(") brackets["("]++;
			else if (char === ")") brackets["("]--;
			else if (char === "[") brackets["["]++;
			else if (char === "]") brackets["["]--;
			else if (char === "{") brackets["{"]++;
			else if (char === "}") brackets["{"]--;
		}

		Object.entries(brackets).forEach(([bracket, count]) => {
			if (count !== 0) {
				console.log(
					`❌ Unmatched ${bracket} brackets: ${count} (${count > 0 ? "missing closing" : "extra closing"})`,
				);
				issueFound = true;
			}
		});

		if (!issueFound) {
			console.log("✅ No obvious syntax issues found in manual analysis");
			console.log(
				"💡 The issue might be more subtle or in the environment validation logic",
			);
		}
	} catch (error) {
		console.log("❌ Failed to analyze env.ts:", error.message);
	}
}
