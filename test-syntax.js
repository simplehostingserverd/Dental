#!/usr/bin/env node

/**
 * Simple syntax test script
 */

import fs from "node:fs";
import path from "node:path";

console.log("[EMOJI][EMOJI] Testing syntax error fix...\n");

// Function to check for unmatched braces
function checkBraces(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf8");
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

		return brackets;
	} catch (error) {
		return null;
	}
}

// Check the previously problematic file
const problematicFile = "src/scripts/debug-syntax-error.ts";
console.log(`Checking: ${problematicFile}`);

const brackets = checkBraces(problematicFile);
if (brackets) {
	const hasIssues = Object.values(brackets).some((count) => count !== 0);

	if (hasIssues) {
		console.log("[EMOJI] Still has unmatched brackets:");
		for (const [bracket, count] of Object.entries(brackets)) {
			if (count !== 0) {
				console.log(
					`   ${bracket}: ${count} (${count > 0 ? "missing closing" : "extra closing"})`,
				);
			}
		}
	} else {
		console.log("[EMOJI] All brackets are properly matched!");
	}

	console.log(
		`\nBracket counts: { "(": ${brackets["("]}, "[": ${brackets["["]}, "{": ${brackets["{"]} }`,
	);
} else {
	console.log("[EMOJI] Could not read file");
}

// Check a few other key files
const filesToCheck = [
	"src/app/layout.tsx",
	"src/app/page.tsx",
	"next.config.js",
	"tsconfig.json",
];

console.log("\n[EMOJI][EMOJI] Checking other key files...");
for (const file of filesToCheck) {
	if (fs.existsSync(file)) {
		const brackets = checkBraces(file);
		if (brackets) {
			const hasIssues = Object.values(brackets).some((count) => count !== 0);
			console.log(`${hasIssues ? "[EMOJI]" : "[EMOJI]"} ${file}`);
		} else {
			console.log(`[EMOJI][EMOJI]  ${file} (could not read)`);
		}
	} else {
		console.log(`[EMOJI][EMOJI]  ${file} (not found)`);
	}
}

console.log("\n[EMOJI] Syntax check complete!");
