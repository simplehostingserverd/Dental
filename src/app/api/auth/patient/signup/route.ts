import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { EmailValidationService } from "@/lib/validation/email-validator";
import jwt from "jsonwebtoken";

interface PatientSignupRequest {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	password: string;
	confirmPassword: string;
	practiceId?: string; // Optional for now, can be set later
	agreeToTerms: boolean;
	allowMarketing: boolean;
}

export async function POST(request: NextRequest) {
	try {
		const body: PatientSignupRequest = await request.json();
		const {
			firstName,
			lastName,
			email,
			phone,
			dateOfBirth,
			password,
			confirmPassword,
			practiceId,
			agreeToTerms,
			allowMarketing,
		} = body;

		// Validation
		if (!firstName || !lastName || !email || !phone || !dateOfBirth || !password) {
			return NextResponse.json(
				{ error: "All required fields must be provided" },
				{ status: 400 }
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ error: "Passwords do not match" },
				{ status: 400 }
			);
		}

		if (!agreeToTerms) {
			return NextResponse.json(
				{ error: "You must agree to the terms of service" },
				{ status: 400 }
			);
		}

		// Validate email thoroughly
		const emailValidation = EmailValidationService.validatePatientEmail(email);
		if (!emailValidation.isValid) {
			return NextResponse.json(
				{ error: emailValidation.errors[0] || "Invalid email address" },
				{ status: 400 }
			);
		}

		// Validate password strength
		try {
			validatePassword(password);
		} catch (error) {
			return NextResponse.json(
				{ error: error instanceof Error ? error.message : "Invalid password" },
				{ status: 400 }
			);
		}

		// Check if email already exists
		const existingUser = await db.patientUser.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "An account with this email already exists" },
				{ status: 409 }
			);
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Parse date of birth
		const dob = new Date(dateOfBirth);
		if (isNaN(dob.getTime())) {
			return NextResponse.json(
				{ error: "Invalid date of birth" },
				{ status: 400 }
			);
		}

		// Single-tenant mode: automatically associate with the first practice
		// This will be updated for multi-tenant support later
		let defaultPracticeId = practiceId;

		if (!defaultPracticeId) {
			// Find the first available practice (single-tenant mode)
			const firstPractice = await db.practice.findFirst({
				select: { id: true, name: true }
			});

			if (!firstPractice) {
				return NextResponse.json(
					{ error: "Practice not found. Please contact support to set up your account." },
					{ status: 500 }
				);
			}

			defaultPracticeId = firstPractice.id;
		}

		// Create patient and user in a transaction
		const result = await db.$transaction(async (tx) => {
			// Create patient user account
			const patientUser = await tx.patientUser.create({
				data: {
					email: email.toLowerCase(),
					password: hashedPassword,
					isActive: true,
				},
			});

			// Create patient record
			const patient = await tx.patient.create({
				data: {
					firstName,
					lastName,
					dateOfBirth: dob,
					gender: "Not specified", // Default value, can be updated later
					phone,
					email: email.toLowerCase(),
					practiceId: defaultPracticeId,
					patientUserId: patientUser.id,
				},
			});

			return { patientUser, patient };
		});

		// Generate JWT token for automatic login
		const JWT_SECRET = process.env.PATIENT_JWT_SECRET || "patient-secret-key";
		const tokenPayload = {
			userId: result.patientUser.id,
			email: result.patientUser.email,
			patientId: result.patient.id,
			practiceId: result.patient.practiceId,
			type: "patient",
		};

		const token = jwt.sign(tokenPayload, JWT_SECRET, {
			expiresIn: "24h",
		});

		// TODO: Send verification email
		// await sendVerificationEmail(email, result.patientUser.id)

		// TODO: Send welcome email
		// await sendWelcomeEmail(email, firstName)

		// Create response with authentication cookie
		const response = NextResponse.json({
			success: true,
			message: "Patient account created successfully",
			patient: {
				id: result.patient.id,
				firstName: result.patient.firstName,
				lastName: result.patient.lastName,
				email: result.patient.email,
			},
			user: {
				id: result.patientUser.id,
				email: result.patientUser.email,
			},
			nextSteps: {
				verifyEmail: true,
				completeProfile: true,
				bookAppointment: true,
			},
		});

		// Set HTTP-only cookie for authentication
		response.cookies.set("patient-auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/patient",
		});

		return response;
	} catch (error) {
		console.error("Patient signup error:", error);

		// Handle specific database errors
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint")) {
				return NextResponse.json(
					{ error: "An account with this email already exists" },
					{ status: 409 }
				);
			}
		}

		return NextResponse.json(
			{
				error: "An error occurred while creating your account. Please try again.",
			},
			{ status: 500 }
		);
	}
}
