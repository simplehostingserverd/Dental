#!/usr/bin/env node

/**
 * Simple Node.js script to debug the Next.js build issue
 * This will generate a verbose build log to identify the syntax error
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

console.log("🔍 Starting Next.js build debugging...\n");

// Create a verbose build log
const logFile = "verbose-build-log.txt";
const logStream = fs.createWriteStream(logFile, { flags: "w" });

function log(message) {
	const timestamp = new Date().toISOString();
	const logMessage = `[${timestamp}] ${message}\n`;
	console.log(message);
	logStream.write(logMessage);
}

log("=== NEXT.JS BUILD DEBUG SESSION ===");
log(`Node.js Version: ${process.version}`);
log(`Platform: ${process.platform}`);
log(`Working Directory: ${process.cwd()}`);
log(`Environment: ${process.env.NODE_ENV || "development"}`);
log("");

// Test 1: Try to build with maximum verbosity
log("=== TEST 1: VERBOSE BUILD ===");

const buildProcess = spawn("npx", ["next", "build"], {
	stdio: ["inherit", "pipe", "pipe"],
	shell: true,
	env: {
		...process.env,
		DEBUG: "*",
		NODE_ENV: "development",
		NEXT_DEBUG: "1",
		VERBOSE: "true",
	},
});

let buildOutput = "";
let buildError = "";

buildProcess.stdout.on("data", (data) => {
	const chunk = data.toString();
	buildOutput += chunk;
	process.stdout.write(chunk);
	logStream.write(`[STDOUT] ${chunk}`);
});

buildProcess.stderr.on("data", (data) => {
	const chunk = data.toString();
	buildError += chunk;
	process.stderr.write(chunk);
	logStream.write(`[STDERR] ${chunk}`);
});

buildProcess.on("close", (code) => {
	log(`\nBuild process exited with code: ${code}`);

	if (
		buildError.includes("SyntaxError") ||
		buildError.includes("Invalid or unexpected token")
	) {
		log("\n❌ SYNTAX ERROR DETECTED!");
		log("Analyzing error output...\n");

		// Try to extract file information from error
		const lines = buildError.split("\n");
		for (const line of lines) {
			if (
				line.includes("SyntaxError") ||
				line.includes("Invalid or unexpected token")
			) {
				log(`Error line: ${line}`);
			}
			if (
				line.includes(".ts") ||
				line.includes(".tsx") ||
				line.includes(".js") ||
				line.includes(".jsx")
			) {
				log(`Potential file reference: ${line}`);
			}
		}
	}

	log("\n=== TEST 2: CHECKING INDIVIDUAL FILES ===");
	checkIndividualFiles();
});

buildProcess.on("error", (error) => {
	log(`Build process error: ${error.message}`);
	logStream.end();
});

// Function to check individual files
function checkIndividualFiles() {
	const srcDir = path.join(process.cwd(), "src");

	function getAllFiles(dir, fileList = []) {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (
				stat.isDirectory() &&
				!file.startsWith(".") &&
				file !== "node_modules"
			) {
				getAllFiles(filePath, fileList);
			} else if (
				file.endsWith(".ts") ||
				file.endsWith(".tsx") ||
				file.endsWith(".js") ||
				file.endsWith(".jsx")
			) {
				fileList.push(filePath);
			}
		}

		return fileList;
	}

	try {
		const allFiles = getAllFiles(srcDir);
		log(`Found ${allFiles.length} source files to check`);

		// Check for common issues
		for (const file of allFiles) {
			try {
				const content = fs.readFileSync(file, "utf8");
				const relativePath = path.relative(process.cwd(), file);

				// Check for binary content
				if (content.includes("\0")) {
					log(`❌ Binary content detected in: ${relativePath}`);
				}

				// Check for invalid characters (using character code checks)
				let hasInvalidChars = false;
				for (let i = 0; i < content.length; i++) {
					const code = content.charCodeAt(i);
					if (
						(code >= 0 && code <= 8) ||
						code === 11 ||
						code === 12 ||
						(code >= 14 && code <= 31) ||
						code === 127
					) {
						hasInvalidChars = true;
						break;
					}
				}
				if (hasInvalidChars) {
					log(`❌ Invalid characters detected in: ${relativePath}`);
				}

				// Check file size (suspiciously large files)
				if (content.length > 100000) {
					log(
						`⚠️  Large file detected: ${relativePath} (${content.length} bytes)`,
					);
				}

				// Check for unmatched brackets
				const openBraces = (content.match(/\{/g) || []).length;
				const closeBraces = (content.match(/\}/g) || []).length;
				if (openBraces !== closeBraces) {
					log(
						`❌ Unmatched braces in: ${relativePath} (${openBraces} open, ${closeBraces} close)`,
					);
				}
			} catch (error) {
				log(
					`❌ Could not read file: ${path.relative(process.cwd(), file)} - ${error.message}`,
				);
			}
		}
	} catch (error) {
		log(`Error scanning files: ${error.message}`);
	}

	log("\n=== TEST 3: CONFIGURATION CHECK ===");
	checkConfiguration();
}

// Function to check configuration files
function checkConfiguration() {
	const configFiles = [
		"next.config.js",
		"tsconfig.json",
		"package.json",
		".env",
	];

	for (const configFile of configFiles) {
		try {
			if (fs.existsSync(configFile)) {
				const content = fs.readFileSync(configFile, "utf8");
				log(`✅ ${configFile} exists and readable (${content.length} bytes)`);

				// Check for specific issues
				if (configFile === ".env") {
					const lines = content.split("\n");
					for (const [index, line] of lines.entries()) {
						if (line.includes("=") && !line.startsWith("#")) {
							const [key, value] = line.split("=", 2);
							if (value?.includes(".") && value.includes("eyJ")) {
								log(`⚠️  JWT-like token in .env line ${index + 1}: ${key}`);
							}
						}
					}
				}

				if (configFile === "next.config.js") {
					if (
						content.includes("import") &&
						!content.includes("export default")
					) {
						log("❌ next.config.js has import but no export default");
					}
				}
			} else {
				log(`⚠️  ${configFile} not found`);
			}
		} catch (error) {
			log(`❌ Error reading ${configFile}: ${error.message}`);
		}
	}

	log("\n=== DEBUGGING COMPLETE ===");
	log(`Full log saved to: ${logFile}`);
	log("\n💡 Next steps:");
	log("1. Review the verbose build log above");
	log("2. Look for any files marked with ❌");
	log("3. Check for binary content or invalid characters");
	log("4. Verify configuration files are correct");

	logStream.end();
}
