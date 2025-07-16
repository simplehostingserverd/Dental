import {
	calculatePasswordStrength,
	hashPassword,
	validatePassword,
} from "@/lib/auth/password";
import { EmailValidationService } from "@/lib/validation/email-validator";
import { db } from "@/server/db";
import { PracticeRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

interface SignupRequest {
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

export async function POST(request: NextRequest) {
	try {
		const body: SignupRequest = await request.json();

		const {
			firstName,
			lastName,
			practiceName,
			workEmail,
			phoneNumber,
			practiceSize,
			password,
			agreeToTerms,
			receiveUpdates = false,
		} = body;

		// Validate required fields
		if (
			!firstName ||
			!lastName ||
			!practiceName ||
			!workEmail ||
			!phoneNumber ||
			!practiceSize ||
			!password
		) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 },
			);
		}

		if (!agreeToTerms) {
			return NextResponse.json(
				{ error: "You must agree to the Terms of Service and Privacy Policy" },
				{ status: 400 },
			);
		}

		// Validate email thoroughly
		const emailValidation =
			EmailValidationService.validatePracticeEmail(workEmail);
		if (!emailValidation.isValid) {
			return NextResponse.json(
				{ error: emailValidation.errors[0] || "Invalid email address" },
				{ status: 400 },
			);
		}

		// Validate password strength
		const passwordStrength = calculatePasswordStrength(password);
		if (passwordStrength < 60) {
			// Require at least medium strength
			return NextResponse.json(
				{
					error:
						"Password must be at least 8 characters with uppercase letter and number",
				},
				{ status: 400 },
			);
		}

		// Check if user already exists
		const existingUser = await db.practiceUser.findUnique({
			where: { email: workEmail },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "An account with this email already exists" },
				{ status: 409 },
			);
		}

		// Check if practice name is already taken
		const existingPractice = await db.practice.findFirst({
			where: {
				name: {
					equals: practiceName,
					mode: "insensitive",
				},
			},
		});

		if (existingPractice) {
			return NextResponse.json(
				{ error: "A practice with this name already exists" },
				{ status: 409 },
			);
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create practice and admin user in a transaction
		const result = await db.$transaction(async (tx) => {
			// Create practice
			const practice = await tx.practice.create({
				data: {
					name: practiceName,
					phone: phoneNumber,
					email: workEmail,
					timezone: "America/New_York", // Default timezone
					// Additional practice details can be filled in during onboarding
				},
			});

			// Create admin user
			const practiceUser = await tx.practiceUser.create({
				data: {
					email: workEmail,
					password: hashedPassword,
					firstName,
					lastName,
					role: PracticeRole.ADMIN,
					practiceId: practice.id,
					isActive: true,
					emailVerified: false, // Will be verified via email
				},
			});

			// Create practice settings
			await tx.practiceSettings.create({
				data: {
					practiceId: practice.id,
					appointmentDuration: 30,
					workingHoursStart: "09:00",
					workingHoursEnd: "17:00",
					workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
					timeZone: "America/New_York",
					emailNotifications: true,
					smsNotifications: false,
					reminderHours: 24,
					allowOnlineBooking: false,
				},
			});

			return { practice, practiceUser };
		});

		// Generate JWT token for automatic login
		const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
		const tokenPayload = {
			userId: result.practiceUser.id,
			email: result.practiceUser.email,
			role: result.practiceUser.role,
			practiceId: result.practice.id,
			type: "practice",
		};

		const token = jwt.sign(tokenPayload, JWT_SECRET, {
			expiresIn: "24h",
		});

		// TODO: Send verification email
		// await sendVerificationEmail(workEmail, result.practiceUser.id)

		// TODO: Send welcome email with onboarding information
		// await sendWelcomeEmail(workEmail, firstName, practiceName)

		// TODO: Create audit log entry
		// await createAuditLog({
		//   action: 'PRACTICE_SIGNUP',
		//   practiceId: result.practice.id,
		//   userId: result.practiceUser.id,
		//   details: { practiceName, practiceSize }
		// })

		// Create response with authentication cookie
		const response = NextResponse.json({
			success: true,
			message: "Account created successfully",
			practice: {
				id: result.practice.id,
				name: result.practice.name,
			},
			user: {
				id: result.practiceUser.id,
				firstName: result.practiceUser.firstName,
				lastName: result.practiceUser.lastName,
				email: result.practiceUser.email,
				role: result.practiceUser.role,
			},
			nextSteps: {
				verifyEmail: true,
				completeOnboarding: true,
				inviteTeam: true,
				scheduleDemo: true,
			},
		});

		// Set HTTP-only cookie for authentication
		response.cookies.set("practice-auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Practice signup error:", error);

		// Handle specific database errors
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint")) {
				return NextResponse.json(
					{ error: "An account with this email already exists" },
					{ status: 409 },
				);
			}
		}

		return NextResponse.json(
			{
				error:
					"An error occurred while creating your account. Please try again.",
			},
			{ status: 500 },
		);
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}
