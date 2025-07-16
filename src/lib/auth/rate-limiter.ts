import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible";

// Rate limiter configurations
const rateLimiters = {
	// Login attempts: 5 attempts per 15 minutes per IP (disabled for development)
	login: new RateLimiterMemory({
		keyPrefix: "login_fail_ip",
		points: process.env.NODE_ENV === "development" ? 1000 : 5,
		duration: process.env.NODE_ENV === "development" ? 1 : 900, // 15 minutes
		blockDuration: process.env.NODE_ENV === "development" ? 1 : 900, // Block for 15 minutes
	}),

	// Login attempts per email: 3 attempts per 15 minutes (disabled for development)
	loginEmail: new RateLimiterMemory({
		keyPrefix: "login_fail_email",
		points: process.env.NODE_ENV === "development" ? 1000 : 3,
		duration: process.env.NODE_ENV === "development" ? 1 : 900,
		blockDuration: process.env.NODE_ENV === "development" ? 1 : 1800, // Block for 30 minutes
	}),

	// Password reset: 3 attempts per hour per IP
	passwordReset: new RateLimiterMemory({
		keyPrefix: "password_reset_ip",
		points: 3,
		duration: 3600, // 1 hour
		blockDuration: 3600,
	}),

	// 2FA attempts: 5 attempts per 5 minutes
	twoFactor: new RateLimiterMemory({
		keyPrefix: "2fa_fail",
		points: 5,
		duration: 300, // 5 minutes
		blockDuration: 600, // Block for 10 minutes
	}),

	// API requests: 100 requests per minute per IP
	api: new RateLimiterMemory({
		keyPrefix: "api_requests",
		points: 100,
		duration: 60,
		blockDuration: 60,
	}),

	// Registration: 3 registrations per hour per IP
	registration: new RateLimiterMemory({
		keyPrefix: "registration_ip",
		points: 3,
		duration: 3600,
		blockDuration: 3600,
	}),
};

/**
 * Clear all rate limits for development (bypass lockouts)
 */
export async function clearAllLimits(identifier: string): Promise<void> {
	if (process.env.NODE_ENV === "development") {
		try {
			await Promise.all([
				rateLimiters.login.delete(identifier),
				rateLimiters.loginEmail.delete(identifier),
				rateLimiters.passwordReset.delete(identifier),
				rateLimiters.twoFactor.delete(identifier),
				rateLimiters.api.delete(identifier),
				rateLimiters.registration.delete(identifier),
			]);
		} catch (error) {
			console.log("Rate limit clear error (safe to ignore):", error);
		}
	}
}

/**
 * Check if an action is rate limited
 */
export async function checkRateLimit(
	type: keyof typeof rateLimiters,
	key: string,
): Promise<{
	allowed: boolean;
	remainingPoints?: number;
	msBeforeNext?: number;
}> {
	try {
		const limiter = rateLimiters[type];
		const result = await limiter.consume(key);

		return {
			allowed: true,
			remainingPoints: result.remainingPoints,
			msBeforeNext: result.msBeforeNext,
		};
	} catch (rejRes: unknown) {
		return {
			allowed: false,
			remainingPoints:
				(rejRes as { remainingPoints?: number }).remainingPoints || 0,
			msBeforeNext: (rejRes as { msBeforeNext?: number }).msBeforeNext || 0,
		};
	}
}

/**
 * Reset rate limit for a key
 */
export async function resetRateLimit(
	type: keyof typeof rateLimiters,
	key: string,
): Promise<void> {
	try {
		const limiter = rateLimiters[type];
		await limiter.delete(key);
	} catch (error) {
		console.error(`Failed to reset rate limit for ${type}:${key}`, error);
	}
}

/**
 * Get remaining points for a key
 */
export async function getRemainingPoints(
	type: keyof typeof rateLimiters,
	key: string,
): Promise<number> {
	try {
		const limiter = rateLimiters[type];
		const result = await limiter.get(key);
		return result?.remainingPoints || rateLimiters[type].points;
	} catch (error) {
		console.error(`Failed to get remaining points for ${type}:${key}`, error);
		return 0;
	}
}

/**
 * Check multiple rate limits at once
 */
export async function checkMultipleRateLimits(
	checks: Array<{ type: keyof typeof rateLimiters; key: string }>,
): Promise<{
	allowed: boolean;
	failedCheck?: string;
	msBeforeNext?: number;
}> {
	for (const check of checks) {
		const result = await checkRateLimit(check.type, check.key);
		if (!result.allowed) {
			return {
				allowed: false,
				failedCheck: check.type,
				msBeforeNext: result.msBeforeNext,
			};
		}
	}

	return { allowed: true };
}

/**
 * Format time remaining for user display
 */
export function formatTimeRemaining(ms: number): string {
	const seconds = Math.ceil(ms / 1000);

	if (seconds < 60) {
		return `${seconds} second${seconds !== 1 ? "s" : ""}`;
	}

	const minutes = Math.ceil(seconds / 60);
	if (minutes < 60) {
		return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
	}

	const hours = Math.ceil(minutes / 60);
	return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

interface ExpressResponse {
	status: (code: number) => ExpressResponse;
	json: (data: unknown) => ExpressResponse;
	setHeader: (name: string, value: string | number | Date) => void;
}

/**
 * Create a middleware function for Next.js API routes
 */
export function createMiddleware(type: keyof typeof rateLimiters) {
	return async (req: unknown, res: unknown, next: () => void) => {
		const key =
			(req as { ip?: string; connection?: { remoteAddress?: string } }).ip ||
			(req as { connection?: { remoteAddress?: string } }).connection
				?.remoteAddress ||
			"unknown";
		const result = await checkRateLimit(type, key);

		if (!result.allowed) {
			const timeRemaining = formatTimeRemaining(result.msBeforeNext || 0);
			return (res as ExpressResponse).status(429).json({
				error: "Too many requests",
				message: `Rate limit exceeded. Try again in ${timeRemaining}.`,
				retryAfter: Math.ceil((result.msBeforeNext || 0) / 1000),
			});
		}

		// Add rate limit headers
		(res as ExpressResponse).setHeader(
			"X-RateLimit-Limit",
			rateLimiters[type].points,
		);
		(res as ExpressResponse).setHeader(
			"X-RateLimit-Remaining",
			result.remainingPoints || 0,
		);
		(res as ExpressResponse).setHeader(
			"X-RateLimit-Reset",
			new Date(Date.now() + (result.msBeforeNext || 0)),
		);

		next();
	};
}
