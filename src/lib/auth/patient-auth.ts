import { db } from "@/server/db";
import { SignJWT } from "jose";
import {
	generateResetToken,
	hashPassword,
	validatePassword,
	verifyPassword,
} from "./password";
import { checkMultipleRateLimits, formatTimeRemaining } from "./rate-limiter";
import { TwoFactorService } from "./two-factor";

export interface PatientLoginCredentials {
	email: string;
	password: string;
	twoFactorToken?: string;
	rememberMe?: boolean;
}

export interface PatientLoginResult {
	success: boolean;
	user?: {
		id: string;
		email: string;
		patient?: {
			id: string;
			firstName: string;
			lastName: string;
			phone?: string;
			practiceId: string;
		};
	};
	token?: string;
	requiresTwoFactor?: boolean;
	error?: string;
	lockoutTime?: number;
}

export interface PatientRegistrationData {
	email: string;
	password: string;
	patientId: string; // Link to existing patient record
}

export const PatientAuthService = {
	JWT_SECRET: process.env.PATIENT_JWT_SECRET || "patient-secret-key",
	JWT_EXPIRES_IN: "24h",
	REMEMBER_ME_EXPIRES_IN: "30d",
	MAX_LOGIN_ATTEMPTS: 5,
	LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes

	/**
	 * Authenticate a patient user
	 */
	async login(
		credentials: PatientLoginCredentials,
		ipAddress: string,
	): Promise<PatientLoginResult> {
		const { email, password, twoFactorToken, rememberMe } = credentials;

		try {
			// Rate limiting checks
			const rateLimitResult = await checkMultipleRateLimits([
				{ type: "login", key: `patient_${ipAddress}` },
				{ type: "loginEmail", key: `patient_${email.toLowerCase()}` },
			]);

			if (!rateLimitResult.allowed) {
				return {
					success: false,
					error: `Too many login attempts. Try again in ${formatTimeRemaining(rateLimitResult.msBeforeNext || 0)}.`,
					lockoutTime: rateLimitResult.msBeforeNext,
				};
			}

			// Find patient user
			const patientUser = await db.patientUser.findUnique({
				where: { email: email.toLowerCase() },
				include: {
					patient: {
						include: {
							practice: true,
						},
					},
				},
			});

			if (!patientUser) {
				return { success: false, error: "Invalid email or password" };
			}

			// Check if user is active
			if (!patientUser.isActive) {
				return {
					success: false,
					error: "Account is deactivated. Contact your dental practice.",
				};
			}

			// Check if account is locked
			if (patientUser.lockedUntil && patientUser.lockedUntil > new Date()) {
				const lockoutTime = patientUser.lockedUntil.getTime() - Date.now();
				return {
					success: false,
					error: `Account is locked. Try again in ${formatTimeRemaining(lockoutTime)}.`,
					lockoutTime,
				};
			}

			// Verify password
			if (
				!patientUser.password ||
				!(await verifyPassword(password, patientUser.password))
			) {
				await this.handleFailedLogin(patientUser.id);
				return { success: false, error: "Invalid email or password" };
			}

			// Check 2FA if enabled
			if (patientUser.twoFactorEnabled) {
				if (!twoFactorToken) {
					return { success: false, requiresTwoFactor: true };
				}

				if (
					!patientUser.twoFactorSecret ||
					!TwoFactorService.verifyToken(
						twoFactorToken,
						patientUser.twoFactorSecret,
					)
				) {
					await this.handleFailedLogin(patientUser.id);
					return {
						success: false,
						error: "Invalid two-factor authentication code",
					};
				}
			}

			// Successful login - reset failed attempts and update last login
			await this.handleSuccessfulLogin(patientUser.id);

			// Generate JWT token
			const tokenPayload = {
				userId: patientUser.id,
				email: patientUser.email,
				patientId: patientUser.patient?.id,
				practiceId: patientUser.patient?.practiceId,
				type: "patient",
			};

			const secret = new TextEncoder().encode(this.JWT_SECRET);
			const expirationTime = rememberMe ? "30d" : "24h";

			const token = await new SignJWT(tokenPayload)
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime(expirationTime)
				.sign(secret);

			// Remove sensitive data
			const { password: _, twoFactorSecret: __, ...safeUser } = patientUser;

			return {
				success: true,
				user: {
					id: safeUser.id,
					email: safeUser.email,
					patient: safeUser.patient
						? {
								id: safeUser.patient.id,
								firstName: safeUser.patient.firstName,
								lastName: safeUser.patient.lastName,
								phone: safeUser.patient.phone || undefined,
								practiceId: safeUser.patient.practiceId,
							}
						: undefined,
				},
				token,
			};
		} catch (error) {
			console.error("Patient login error:", error);
			return { success: false, error: "An error occurred during login" };
		}
	},

	/**
	 * Register a new patient user account
	 */
	async register(
		registrationData: PatientRegistrationData,
	): Promise<{ success: boolean; user?: any; error?: string }> {
		try {
			const { email, password, patientId } = registrationData;

			// Validate password
			validatePassword(password);

			// Check if email already exists
			const existingUser = await db.patientUser.findUnique({
				where: { email: email.toLowerCase() },
			});

			if (existingUser) {
				return { success: false, error: "Email already exists" };
			}

			// Verify patient exists and doesn't already have an account
			const patient = await db.patient.findUnique({
				where: { id: patientId },
			});

			if (!patient) {
				return { success: false, error: "Invalid patient record" };
			}

			if (patient.patientUserId) {
				return { success: false, error: "Patient already has an account" };
			}

			// Hash password
			const hashedPassword = await hashPassword(password);

			// Create patient user account
			const patientUser = await db.patientUser.create({
				data: {
					email: email.toLowerCase(),
					password: hashedPassword,
				},
			});

			// Link patient to user account
			await db.patient.update({
				where: { id: patientId },
				data: { patientUserId: patientUser.id },
			});

			// Remove sensitive data
			const { password: _, ...safeUser } = patientUser;

			return {
				success: true,
				user: safeUser,
			};
		} catch (error) {
			console.error("Patient registration error:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to create account",
			};
		}
	},

	/**
	 * Handle failed login attempt
	 */
	async handleFailedLogin(userId: string): Promise<void> {
		const user = await db.patientUser.findUnique({ where: { id: userId } });
		if (!user) return;

		const newAttempts = user.loginAttempts + 1;
		const shouldLock = newAttempts >= this.MAX_LOGIN_ATTEMPTS;

		await db.patientUser.update({
			where: { id: userId },
			data: {
				loginAttempts: newAttempts,
				lockedUntil: shouldLock
					? new Date(Date.now() + this.LOCKOUT_DURATION)
					: null,
			},
		});
	},

	/**
	 * Handle successful login
	 */
	async handleSuccessfulLogin(userId: string): Promise<void> {
		await db.patientUser.update({
			where: { id: userId },
			data: {
				loginAttempts: 0,
				lockedUntil: null,
				lastLogin: new Date(),
			},
		});
	},

	/**
	 * Verify JWT token
	 */
	verifyToken(token: string): unknown {
		try {
			return jwt.verify(token, this.JWT_SECRET);
		} catch (error) {
			return null;
		}
	},

	/**
	 * Generate password reset token
	 */
	async generatePasswordResetToken(
		email: string,
	): Promise<{ success: boolean; error?: string }> {
		try {
			const user = await db.patientUser.findUnique({
				where: { email: email.toLowerCase() },
			});

			if (!user) {
				// Don't reveal if email exists
				return { success: true };
			}

			const resetToken = generateResetToken();
			const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

			await db.patientUser.update({
				where: { id: user.id },
				data: {
					resetToken,
					resetTokenExpiry,
				},
			});

			// TODO: Send email with reset token
			console.log(`Patient password reset token for ${email}: ${resetToken}`);

			return { success: true };
		} catch (error) {
			console.error("Patient password reset token generation error:", error);
			return { success: false, error: "Failed to generate reset token" };
		}
	},

	/**
	 * Reset password using token
	 */
	async resetPassword(
		token: string,
		newPassword: string,
	): Promise<{ success: boolean; error?: string }> {
		try {
			validatePassword(newPassword);

			const user = await db.patientUser.findFirst({
				where: {
					resetToken: token,
					resetTokenExpiry: { gt: new Date() },
				},
			});

			if (!user) {
				return { success: false, error: "Invalid or expired reset token" };
			}

			const hashedPassword = await hashPassword(newPassword);

			await db.patientUser.update({
				where: { id: user.id },
				data: {
					password: hashedPassword,
					resetToken: null,
					resetTokenExpiry: null,
					loginAttempts: 0,
					lockedUntil: null,
				},
			});

			return { success: true };
		} catch (error) {
			console.error("Patient password reset error:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to reset password",
			};
		}
	},
};
