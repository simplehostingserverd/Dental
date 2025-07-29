import type { PracticeRole } from "@prisma/client";

// Base user types
export interface BaseUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Practice user types
export interface PracticeUser extends BaseUser {
	role: PracticeRole;
	practiceId: string;
	emailVerified: boolean;
	lastLoginAt?: Date;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string;
	backupCodes?: string[];
}

// Patient user types
export interface PatientUser extends BaseUser {
	lastLoginAt?: Date;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string;
	backupCodes?: string[];
}

// JWT payload types
export interface PracticeJWTPayload {
	userId: string;
	practiceId: string;
	role: PracticeRole;
	type: "practice";
	iat: number;
	exp: number;
}

export interface PatientJWTPayload {
	userId: string;
	patientId: string;
	practiceId: string;
	type: "patient";
	iat: number;
	exp: number;
}

// Authentication request/response types
export interface LoginRequest {
	email: string;
	password: string;
	twoFactorToken?: string;
	rememberMe?: boolean;
}

export interface LoginResponse {
	success: boolean;
	token?: string;
	user?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		role?: PracticeRole;
		practiceId?: string;
		practice?: {
			id: string;
			name: string;
		};
	};
	requiresTwoFactor?: boolean;
	error?: string;
	lockoutTime?: number;
}

export interface SignupRequest {
	firstName: string;
	lastName: string;
	practiceName: string;
	workEmail: string;
	phoneNumber: string;
	practiceSize: string;
	password: string;
	agreeToTerms: boolean;
	receiveUpdates?: boolean;
}

export interface SignupResponse {
	success: boolean;
	message: string;
	practice?: {
		id: string;
		name: string;
	};
	user?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		role: PracticeRole;
	};
	nextSteps?: {
		verifyEmail: boolean;
		completeOnboarding: boolean;
		inviteTeam: boolean;
		scheduleDemo: boolean;
	};
	error?: string;
}

// Rate limiting types
export interface RateLimitResult {
	allowed: boolean;
	remainingPoints: number;
	resetTime: number;
}

// Two-factor authentication types
export interface TwoFactorSecret {
	secret: string;
	qrCodeUrl: string;
	backupCodes: string[];
}

export interface TwoFactorVerification {
	isValid: boolean;
	error?: string;
}

// Password strength types
export interface PasswordStrength {
	score: number;
	hasMinLength: boolean;
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasNumber: boolean;
	hasSpecialChar: boolean;
	feedback: string[];
}

// Audit log types
export interface AuditLogEntry {
	id: string;
	action: string;
	userId: string;
	practiceId: string;
	ipAddress: string;
	userAgent: string;
	details: Record<string, unknown>;
	createdAt: Date;
}

// Session types
export interface SessionData {
	userId: string;
	practiceId?: string;
	patientId?: string;
	role?: PracticeRole;
	type: "practice" | "patient";
	isActive: boolean;
	expiresAt: Date;
}

// Error types
export interface AuthError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	timestamp: string;
}

// Form validation types
export interface ValidationError {
	field: string;
	message: string;
}

export interface FormValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}

// Environment types for strict typing
export interface AuthEnvironment {
	JWT_SECRET: string;
	PATIENT_JWT_SECRET: string;
	NEXTAUTH_SECRET?: string;
	NEXTAUTH_URL?: string;
	DATABASE_URL: string;
	NODE_ENV: "development" | "test" | "production";
}
