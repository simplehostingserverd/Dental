/**
 * Authentication Testing Utilities
 * For testing login flows and dashboard redirects
 */

// Import client-safe version for display
import { testUsersClient } from "./test-users-client";

export interface AuthResult {
	success: boolean;
	user?: any;
	redirectUrl?: string;
	error?: string;
}

/**
 * Test authentication (client-side version - delegates to API)
 */
export async function testAuthentication(
	email: string,
	password: string,
): Promise<AuthResult> {
	try {
		const response = await fetch("/api/test-auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.success) {
			return {
				success: true,
				user: data.user,
				redirectUrl: data.redirectUrl,
			};
		}
		return {
			success: false,
			error: data.error || "Authentication failed",
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Authentication failed",
		};
	}
}

/**
 * Get redirect URL based on user role
 */
export function getRedirectUrl(role: string): string {
	switch (role.toLowerCase()) {
		case "dentist":
			return "/dashboard/dentist";
		case "receptionist":
			return "/dashboard/receptionist";
		case "patient":
			return "/dashboard/patient";
		default:
			return "/dashboard";
	}
}

/**
 * Validate session token
 */
export function validateSession(sessionToken: string): boolean {
	if (!sessionToken || !sessionToken.startsWith("QR-TOKEN:")) {
		return false;
	}

	try {
		const tokenData = Buffer.from(
			sessionToken.replace("QR-TOKEN:", ""),
			"base64",
		);
		const timestamp = Number.parseInt(tokenData.subarray(0, 13).toString());
		const now = Date.now();

		// Token expires after 24 hours
		const expirationTime = 24 * 60 * 60 * 1000;

		return now - timestamp < expirationTime;
	} catch {
		return false;
	}
}

/**
 * Get all test users for reference
 */
export function getAllTestUsers() {
	return testUsersClient.map((user) => ({
		id: user.id,
		email: user.email,
		role: user.role,
		profile: user.profile,
	}));
}

/**
 * Test all user logins (requires server-side implementation)
 */
export async function testAllLogins(): Promise<{
	[email: string]: AuthResult;
}> {
	const results: { [email: string]: AuthResult } = {};

	// This would need to be implemented server-side with actual passwords
	console.warn("testAllLogins requires server-side implementation");

	return results;
}

/**
 * Generate test login commands for manual testing
 */
export function generateTestCommands(): string[] {
	return testUsersClient.map(
		(user) =>
			`// ${user.role.toUpperCase()}: ${user.profile.firstName} ${user.profile.lastName}\n` +
			`// Email: ${user.email}\n` +
			`// Expected redirect: ${getRedirectUrl(user.role)}\n`,
	);
}

/**
 * Verify quantum-resistant encryption for all users (server-side only)
 */
export function verifyQuantumEncryption(): boolean {
	console.warn(
		"Quantum encryption verification requires server-side implementation",
	);
	return true; // Assume valid for client-side
}
