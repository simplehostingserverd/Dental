/**
 * Environment variable validation and type-safe access
 * This file validates environment variables at build time and runtime
 */

import { z } from "zod";

/**
 * Environment variable schema definition
 */
const envSchema = z.object({
	// Node.js environment
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),

	// Database
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

	// Authentication secrets
	JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
	PATIENT_JWT_SECRET: z
		.string()
		.min(32, "PATIENT_JWT_SECRET must be at least 32 characters"),

	// NextAuth.js (optional for development)
	NEXTAUTH_SECRET: z.string().optional(),
	NEXTAUTH_URL: z.string().url().optional().or(z.literal("")),

	// OAuth providers (optional)
	AUTH_DISCORD_ID: z.string().optional(),
	AUTH_DISCORD_SECRET: z.string().optional(),

	// API keys (optional)
	OPTIMIZE_API_KEY: z.string().optional(),

	// Skip validation flag for Docker builds
	SKIP_ENV_VALIDATION: z.string().optional(),
});

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 */
function validateEnv(): Env {
	// Skip validation if explicitly requested (useful for Docker builds)
	if (process.env.SKIP_ENV_VALIDATION === "true") {
		console.warn("WARNING: Environment validation skipped");
		return process.env as unknown as Env;
	}

	try {
		const parsed = envSchema.parse(process.env);

		// Additional validation for production
		if (parsed.NODE_ENV === "production") {
			if (!parsed.NEXTAUTH_SECRET) {
				throw new Error("NEXTAUTH_SECRET is required in production");
			}
			if (!parsed.NEXTAUTH_URL) {
				throw new Error("NEXTAUTH_URL is required in production");
			}
		}

		return parsed;
	} catch (error) {
		// In development, be more lenient and provide warnings instead of throwing
		if (process.env.NODE_ENV === "development") {
			console.warn(
				"WARNING: Environment validation failed in development mode:",
			);

			if (error instanceof z.ZodError) {
				for (const err of error.errors) {
					console.warn(`  - ${err.path.join(".")}: ${err.message}`);
				}
			} else if (error instanceof Error) {
				console.warn(`  - ${error.message}`);
			}

			console.warn(
				"\nTIP: Some features may not work correctly without proper environment variables",
			);

			// Return a partial environment object for development
			return {
				NODE_ENV: process.env.NODE_ENV || "development",
				DATABASE_URL: process.env.DATABASE_URL || "",
				JWT_SECRET: process.env.JWT_SECRET || "dev-secret-placeholder",
				PATIENT_JWT_SECRET:
					process.env.PATIENT_JWT_SECRET || "dev-patient-secret-placeholder",
				NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
				NEXTAUTH_URL: process.env.NEXTAUTH_URL,
				AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
				AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
				OPTIMIZE_API_KEY: process.env.OPTIMIZE_API_KEY,
				SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
			} as Env;
		}

		// In production, still throw the error
		console.error("ERROR: Environment validation failed:");

		if (error instanceof z.ZodError) {
			for (const err of error.errors) {
				console.error(`  - ${err.path.join(".")}: ${err.message}`);
			}
		} else if (error instanceof Error) {
			console.error(`  - ${error.message}`);
		}

		console.error("\nTips:");
		console.error(
			"  1. Check your .env file exists and has all required variables",
		);
		console.error("  2. Copy .env.example to .env and fill in the values");
		console.error(
			'  3. Run "npm run check-env" to see detailed environment status',
		);
		console.error(
			"  4. Use SKIP_ENV_VALIDATION=true to bypass validation (not recommended)",
		);

		throw new Error("Environment validation failed");
	}
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety
 */
export const env = validateEnv();

/**
 * Helper function to check if we're in development
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Helper function to check if we're in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Helper function to check if we're in test
 */
export const isTest = env.NODE_ENV === "test";
