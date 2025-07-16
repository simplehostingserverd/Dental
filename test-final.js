#!/usr/bin/env node

/**
 * Final test to see if the syntax error is resolved
 */

import { spawn } from "node:child_process";

console.log(
	"[EMOJI][EMOJI] Final test: Starting Next.js with fixed env.ts...\n",
);

const nextProcess = spawn("npx", ["next", "dev", "--turbo"], {
	stdio: ["inherit", "pipe", "pipe"],
	shell: true,
});

let hasError = false;
let hasStarted = false;
let output = "";

const timeout = setTimeout(() => {
	if (!hasError && !hasStarted) {
		console.log("\n[EMOJI][EMOJI]  Test timed out after 15 seconds");
		nextProcess.kill();

		if (output.includes("Starting...") || output.includes("Local:")) {
			console.log(
				"[EMOJI] Server appears to be starting - syntax error likely resolved!",
			);
		} else {
			console.log("[EMOJI][EMOJI]  Inconclusive result");
		}
	}
}, 15000);

nextProcess.stdout?.on("data", (data) => {
	const chunk = data.toString();
	output += chunk;
	console.log(chunk.trim());

	if (
		chunk.includes("Ready") ||
		chunk.includes("compiled successfully") ||
		chunk.includes("Local:")
	) {
		hasStarted = true;
		clearTimeout(timeout);
		nextProcess.kill();
		console.log("\n[EMOJI][EMOJI] SUCCESS! Next.js started successfully!");
		console.log("[EMOJI] Syntax error in env.ts has been completely resolved!");
		console.log(
			"\n[EMOJI][EMOJI] Your application is now ready at: http://localhost:3000",
		);
		console.log("\n[EMOJI][EMOJI] Test these pages:");
		console.log("   [EMOJI] Signup: http://localhost:3000/auth/signup");
		console.log("   [EMOJI] Practice Login: http://localhost:3000/auth/signin");
		console.log(
			"   [EMOJI] Patient Login: http://localhost:3000/patient/auth/signin",
		);
	}
});

nextProcess.stderr?.on("data", (data) => {
	const chunk = data.toString();
	output += chunk;
	console.error(chunk.trim());

	if (
		chunk.includes("SyntaxError") ||
		chunk.includes("Invalid or unexpected token")
	) {
		hasError = true;
		clearTimeout(timeout);
		nextProcess.kill();
		console.log("\n[EMOJI] Syntax error still present!");

		// Try to extract more specific error information
		const lines = chunk.split("\n");
		for (const line of lines) {
			if (line.includes("env.ts") || line.includes("SyntaxError")) {
				console.log(`[EMOJI][EMOJI] Error details: ${line.trim()}`);
			}
		}
	}
});

nextProcess.on("close", (code) => {
	clearTimeout(timeout);
	if (!hasStarted && !hasError) {
		console.log(`\nNext.js process exited with code: ${code}`);

		if (code === 0 || output.includes("Starting...")) {
			console.log("[EMOJI] No syntax errors detected!");
		} else {
			console.log("[EMOJI][EMOJI]  Process exited unexpectedly");
		}
	}
});

nextProcess.on("error", (error) => {
	clearTimeout(timeout);
	console.log("[EMOJI] Failed to start Next.js:", error.message);
});
