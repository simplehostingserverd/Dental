import { PatientAuthService } from "@/lib/auth/patient-auth";
import { PracticeAuthService } from "@/lib/auth/practice-auth";
import { QuantumCrypto } from "@/lib/quantum-crypto";
import { verifyUserLogin } from "@/lib/test-users-server";
import { type NextRequest, NextResponse } from "next/server";

interface LoginRequestBody {
	email: string;
	password: string;
	twoFactorToken?: string;
	rememberMe?: boolean;
}

/**
 * Get redirect URL based on user role
 */
function getRedirectUrl(
	role: string,
	userType: "practice" | "patient",
): string {
	if (userType === "patient") {
		return "/patient/dashboard";
	}

	switch (role.toLowerCase()) {
		case "dentist":
			return "/dashboard/dentist";
		case "receptionist":
			return "/receptionist";
		case "admin":
			return "/dashboard";
		default:
			return "/dashboard";
	}
}

/**
 * Smart login endpoint that automatically detects user type and authenticates accordingly
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = (await request.json()) as LoginRequestBody;
		const { email, password, twoFactorToken, rememberMe } = body;

		// Validate required fields
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		// Get client IP
		const forwarded = request.headers.get("x-forwarded-for");
		const realIp = request.headers.get("x-real-ip");
		const ip = forwarded
			? forwarded.split(",")[0]?.trim() || "unknown"
			: realIp || "unknown";

		// First, try test authentication (for development)
		try {
			const testUser = await verifyUserLogin(email, password);
			if (testUser) {
				// Generate secure session token
				const sessionToken = QuantumCrypto.generateSecureToken();

				// Determine redirect URL based on role
				const userType = testUser.role === "patient" ? "patient" : "practice";
				const redirectUrl =
					testUser.role === "patient"
						? "/patient/dashboard"
						: getRedirectUrl(testUser.role, userType);

				// Sign the session data for security
				const sessionData = JSON.stringify({
					userId: testUser.id,
					email: testUser.email,
					role: testUser.role,
					timestamp: Date.now(),
				});

				const signature = QuantumCrypto.signWithMLDSA(
					sessionData,
					testUser.cryptoKeys.mldsa.privateKey,
				);

				// Create response with user data
				const response = NextResponse.json({
					success: true,
					user: {
						id: testUser.id,
						email: testUser.email,
						role: testUser.role,
						profile: testUser.profile,
						sessionToken,
						signature,
					},
					redirectUrl,
					userType,
				});

				// Set appropriate cookies based on user type
				if (testUser.role === "patient") {
					response.cookies.set("test-patient-token", sessionToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						maxAge: 24 * 60 * 60, // 24 hours
						path: "/",
					});
				} else {
					response.cookies.set("test-auth-token", sessionToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						maxAge: 24 * 60 * 60, // 24 hours
						path: "/",
					});
				}

				// Set user information for middleware
				response.cookies.set("test-user-role", testUser.role, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 24 * 60 * 60, // 24 hours
					path: "/",
				});

				response.cookies.set("test-user-id", testUser.id, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 24 * 60 * 60, // 24 hours
					path: "/",
				});

				response.cookies.set("test-user-email", testUser.email, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 24 * 60 * 60, // 24 hours
					path: "/",
				});

				response.cookies.set(
					"test-user-first-name",
					testUser.profile.firstName,
					{
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						maxAge: 24 * 60 * 60, // 24 hours
						path: "/",
					},
				);

				response.cookies.set("test-user-last-name", testUser.profile.lastName, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 24 * 60 * 60, // 24 hours
					path: "/",
				});

				return response;
			}
		} catch (error) {
			// Test auth failed, continue to production auth
			console.log("Test auth failed, trying production auth");
		}

		// Try practice authentication first
		try {
			const practiceResult = await PracticeAuthService.login(
				{ email, password, twoFactorToken, rememberMe },
				ip,
			);

			if (practiceResult.success) {
				const redirectUrl = getRedirectUrl(
					practiceResult.user?.role || "",
					"practice",
				);

				const response = NextResponse.json({
					success: true,
					user: practiceResult.user,
					redirectUrl,
					userType: "practice",
				});

				if (practiceResult.token) {
					response.cookies.set("practice-auth-token", practiceResult.token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
						path: "/",
					});
				}

				return response;
			}
		} catch (error) {
			console.log("Practice auth failed, trying patient auth");
		}

		// Try patient authentication
		try {
			const patientResult = await PatientAuthService.login(
				{ email, password, twoFactorToken, rememberMe },
				ip,
			);

			if (patientResult.success) {
				const response = NextResponse.json({
					success: true,
					user: patientResult.user,
					redirectUrl: "/patient/dashboard",
					userType: "patient",
				});

				if (patientResult.token) {
					response.cookies.set("patient-auth-token", patientResult.token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
						path: "/",
					});
				}

				return response;
			}
		} catch (error) {
			console.log("Patient auth failed");
		}

		// If all authentication methods fail
		return NextResponse.json(
			{ error: "Invalid email or password" },
			{ status: 401 },
		);
	} catch (error) {
		console.error("Smart login API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function OPTIONS(): Promise<NextResponse> {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}
