/**
 * Auth utilities and configurations
 * Re-exports commonly used auth functions and configurations
 */

// Re-export auth configuration from server
export { authConfig as authOptions } from "@/server/auth/config";

// Re-export auth services
export { PracticeAuthService } from "./practice-auth";
export { PatientAuthService } from "./patient-auth";
export { TwoFactorService } from "./two-factor";

// Re-export password utilities
export {
	hashPassword,
	verifyPassword,
	validatePassword,
	generateSecurePassword,
	calculatePasswordStrength,
	generateResetToken,
} from "./password";

// Re-export rate limiting
export { checkMultipleRateLimits, formatTimeRemaining } from "./rate-limiter";
