import crypto from "node:crypto";
import { db } from "@/server/db";
import type {
	LoginRequest,
	LoginResponse,
	PracticeJWTPayload,
	PracticeUser,
} from "@/types/auth";
import type { PracticeRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
	generateResetToken,
	generateSecurePassword,
	hashPassword,
	validatePassword,
	verifyPassword,
} from "./password";
import { RateLimitService } from "./rate-limiter";
import { TwoFactorService } from "./two-factor";

// Using types from @/types/auth instead of duplicating interfaces

export interface CreateUserData {
	email: string;
	firstName: string;
	lastName: string;
	role: PracticeRole;
	practiceId: string;
	phone?: string;
	licenseNumber?: string;
	specialization?: string;
	temporaryPassword?: boolean;
}

export class PracticeAuthService {
	private static readonly JWT_SECRET =
		process.env.JWT_SECRET || "your-secret-key";
	private static readonly JWT_EXPIRES_IN = "24h";
	private static readonly REMEMBER_ME_EXPIRES_IN = "30d";
	private static readonly MAX_LOGIN_ATTEMPTS = 5;
	private static readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

	/**
	 * Authenticate a practice user
	 */
	static async login(
		credentials: LoginRequest,
		ipAddress: string,
	): Promise<LoginResponse> {
		const { email, password, twoFactorToken, rememberMe } = credentials;

		try {
			// Rate limiting checks
			const rateLimitResult = await RateLimitService.checkMultipleRateLimits([
				{ type: "login", key: ipAddress },
				{ type: "loginEmail", key: email.toLowerCase() },
			]);

			if (!rateLimitResult.allowed) {
				return {
					success: false,
					error: `Too many login attempts. Try again in ${RateLimitService.formatTimeRemaining(rateLimitResult.msBeforeNext || 0)}.`,
					lockoutTime: rateLimitResult.msBeforeNext,
				};
			}

			// Find user
			const user = await db.practiceUser.findUnique({
				where: { email: email.toLowerCase() },
				include: { practice: true },
			});

			if (!user) {
				return { success: false, error: "Invalid email or password" };
			}

			// Check if user is active
			if (!user.isActive) {
				return {
					success: false,
					error: "Account is deactivated. Contact your administrator.",
				};
			}

			// Check if account is locked
			if (user.lockedUntil && user.lockedUntil > new Date()) {
				const lockoutTime = user.lockedUntil.getTime() - Date.now();
				return {
					success: false,
					error: `Account is locked. Try again in ${RateLimitService.formatTimeRemaining(lockoutTime)}.`,
					lockoutTime,
				};
			}

			// Verify password
			if (!user.password || !(await verifyPassword(password, user.password))) {
				await PracticeAuthService.handleFailedLogin(user.id);
				return { success: false, error: "Invalid email or password" };
			}

			// Check 2FA if enabled
			if (user.twoFactorEnabled) {
				if (!twoFactorToken) {
					return { success: false, requiresTwoFactor: true };
				}

				if (
					!user.twoFactorSecret ||
					!TwoFactorService.verifyToken(twoFactorToken, user.twoFactorSecret)
				) {
					await PracticeAuthService.handleFailedLogin(user.id);
					return {
						success: false,
						error: "Invalid two-factor authentication code",
					};
				}
			}

			// Successful login - reset failed attempts and update last login
			await PracticeAuthService.handleSuccessfulLogin(user.id);

			// Generate JWT token
			const tokenPayload = {
				userId: user.id,
				email: user.email,
				role: user.role,
				practiceId: user.practiceId,
				type: "practice",
			};

			const token = jwt.sign(tokenPayload, PracticeAuthService.JWT_SECRET, {
				expiresIn: rememberMe
					? PracticeAuthService.REMEMBER_ME_EXPIRES_IN
					: PracticeAuthService.JWT_EXPIRES_IN,
			});

			// Remove sensitive data
			const { password: _, twoFactorSecret: __, ...safeUser } = user;

			return {
				success: true,
				user: safeUser,
				token,
			};
		} catch (error) {
			console.error("Login error:", error);
			return { success: false, error: "An error occurred during login" };
		}
	}

	/**
	 * Create a new practice user
	 */
	static async createUser(
		userData: CreateUserData,
		createdBy: string,
	): Promise<{
		success: boolean;
		user?: any;
		temporaryPassword?: string;
		error?: string;
	}> {
		try {
			// Check if email already exists
			const existingUser = await db.practiceUser.findUnique({
				where: { email: userData.email.toLowerCase() },
			});

			if (existingUser) {
				return { success: false, error: "Email already exists" };
			}

			// Generate temporary password if needed
			const temporaryPassword =
				userData.temporaryPassword !== false
					? generateSecurePassword(12)
					: undefined;

			const hashedPassword = temporaryPassword
				? await hashPassword(temporaryPassword)
				: undefined;

			// Create user
			const user = await db.practiceUser.create({
				data: {
					email: userData.email.toLowerCase(),
					firstName: userData.firstName,
					lastName: userData.lastName,
					role: userData.role,
					practiceId: userData.practiceId,
					phone: userData.phone,
					licenseNumber: userData.licenseNumber,
					specialization: userData.specialization,
					password: hashedPassword,
				},
				include: { practice: true },
			});

			// Log user creation
			await PracticeAuthService.logAuditEvent(
				"USER_CREATED",
				"PracticeUser",
				user.id,
				createdBy,
			);

			// Remove sensitive data
			const { password: _, twoFactorSecret: __, ...safeUser } = user;

			return {
				success: true,
				user: safeUser,
				temporaryPassword,
			};
		} catch (error) {
			console.error("Create user error:", error);
			return { success: false, error: "Failed to create user" };
		}
	}

	/**
	 * Handle failed login attempt
	 */
	private static async handleFailedLogin(userId: string): Promise<void> {
		const user = await db.practiceUser.findUnique({ where: { id: userId } });
		if (!user) return;

		const newAttempts = user.loginAttempts + 1;
		const shouldLock = newAttempts >= PracticeAuthService.MAX_LOGIN_ATTEMPTS;

		await db.practiceUser.update({
			where: { id: userId },
			data: {
				loginAttempts: newAttempts,
				lockedUntil: shouldLock
					? new Date(Date.now() + PracticeAuthService.LOCKOUT_DURATION)
					: null,
			},
		});
	}

	/**
	 * Handle successful login
	 */
	private static async handleSuccessfulLogin(userId: string): Promise<void> {
		await db.practiceUser.update({
			where: { id: userId },
			data: {
				loginAttempts: 0,
				lockedUntil: null,
				lastLogin: new Date(),
			},
		});
	}

	/**
	 * Log audit event
	 */
	private static async logAuditEvent(
		action: string,
		resource: string,
		resourceId: string,
		userId: string,
		ipAddress?: string,
		userAgent?: string,
	): Promise<void> {
		try {
			await db.auditLog.create({
				data: {
					action,
					resource,
					resourceId,
					userId,
					ipAddress,
					userAgent,
				},
			});
		} catch (error) {
			console.error("Audit log error:", error);
		}
	}

	/**
	 * Verify JWT token
	 */
	static verifyToken(token: string): unknown {
		try {
			return jwt.verify(token, PracticeAuthService.JWT_SECRET);
		} catch (error) {
			return null;
		}
	}

	/**
	 * Generate password reset token
	 */
	static async generatePasswordResetToken(
		email: string,
	): Promise<{ success: boolean; error?: string }> {
		try {
			const user = await db.practiceUser.findUnique({
				where: { email: email.toLowerCase() },
			});

			if (!user) {
				// Don't reveal if email exists
				return { success: true };
			}

			const resetToken = generateResetToken();
			const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

			await db.practiceUser.update({
				where: { id: user.id },
				data: {
					resetToken,
					resetTokenExpiry,
				},
			});

			// TODO: Send email with reset token
			console.log(`Password reset token for ${email}: ${resetToken}`);

			return { success: true };
		} catch (error) {
			console.error("Password reset token generation error:", error);
			return { success: false, error: "Failed to generate reset token" };
		}
	}

	/**
	 * Reset password using token
	 */
	static async resetPassword(
		token: string,
		newPassword: string,
	): Promise<{ success: boolean; error?: string }> {
		try {
			validatePassword(newPassword);

			const user = await db.practiceUser.findFirst({
				where: {
					resetToken: token,
					resetTokenExpiry: { gt: new Date() },
				},
			});

			if (!user) {
				return { success: false, error: "Invalid or expired reset token" };
			}

			const hashedPassword = await hashPassword(newPassword);

			await db.practiceUser.update({
				where: { id: user.id },
				data: {
					password: hashedPassword,
					resetToken: null,
					resetTokenExpiry: null,
					loginAttempts: 0,
					lockedUntil: null,
				},
			});

			await PracticeAuthService.logAuditEvent(
				"PASSWORD_RESET",
				"PracticeUser",
				user.id,
				user.id,
			);

			return { success: true };
		} catch (error) {
			console.error("Password reset error:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to reset password",
			};
		}
	}
}
