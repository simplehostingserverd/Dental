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
 * Detect practice locale based on various factors
 */
function detectPracticeLocale(practiceId?: string, practiceData?: any): string {
	// Check if this is a Mexican practice (redirect to Spanish dashboard)
	const mexicanPracticeIds = [
		'beautiful-smiles-mx-001',
		'creative-smile-mx-002',
		'wizard-dental-mx-003'
	];

	// Check practice ID patterns
	if (practiceId) {
		if (mexicanPracticeIds.includes(practiceId) || practiceId.includes('-mx-')) {
			return "es";
		}
		if (practiceId.includes('-us-') || practiceId.includes('-en-')) {
			return "en";
		}
	}

	// Check practice data for locale indicators
	if (practiceData) {
		// Check country field
		if (practiceData.country === "Mexico" || practiceData.country === "MX") {
			return "es";
		}
		if (practiceData.country === "United States" || practiceData.country === "US") {
			return "en";
		}

		// Check timezone for Mexican timezones
		if (practiceData.timezone && (
			practiceData.timezone.includes("Mexico") ||
			practiceData.timezone.includes("Tijuana") ||
			practiceData.timezone.includes("Chihuahua") ||
			practiceData.timezone.includes("Mazatlan")
		)) {
			return "es";
		}

		// Check phone number patterns (Mexican numbers start with +52)
		if (practiceData.phone && practiceData.phone.startsWith("+52")) {
			return "es";
		}

		// Check address for Mexican states
		const mexicanStates = [
			"Baja California", "Sonora", "Chihuahua", "Nuevo León", "Tamaulipas",
			"Jalisco", "Ciudad de México", "CDMX", "Mexico City"
		];
		if (practiceData.state && mexicanStates.some(state =>
			practiceData.state.toLowerCase().includes(state.toLowerCase())
		)) {
			return "es";
		}
	}

	// Default to English
	return "en";
}

/**
 * Get redirect URL based on user role, practice context, and locale
 */
function getRedirectUrl(
	role: string,
	userType: "practice" | "patient",
	practiceId?: string,
	practiceData?: any,
): string {
	if (userType === "patient") {
		// For patients, detect locale and redirect accordingly
		const locale = detectPracticeLocale(practiceId, practiceData);
		return locale === "es" ? "/es/patient/dashboard" : "/dashboard/patient";
	}

	// Detect locale for practice users
	const locale = detectPracticeLocale(practiceId, practiceData);
	const baseUrl = locale === "es" ? "/es" : "";

	switch (role.toLowerCase()) {
		case "dentist":
			return `${baseUrl}/dashboard/dentist`;
		case "receptionist":
			return `${baseUrl}/dashboard/receptionist`;
		case "admin":
			return `${baseUrl}/dashboard`;
		default:
			return `${baseUrl}/dashboard`;
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

			if (practiceResult.success && practiceResult.user) {
				const redirectUrl = getRedirectUrl(
					practiceResult.user.role || "",
					"practice",
					practiceResult.user.practiceId,
					practiceResult.user.practice,
				);

				const response = NextResponse.json({
					success: true,
					user: {
						...practiceResult.user,
						practiceContext: {
							practiceId: practiceResult.user.practiceId,
							practiceName: practiceResult.user.practice?.name,
							isSpanishPractice: ['beautiful-smiles-mx-001', 'creative-smile-mx-002', 'wizard-dental-mx-003'].includes(practiceResult.user.practiceId || ''),
						}
					},
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

					// Set practice context cookie for middleware
					response.cookies.set("practice-context", JSON.stringify({
						practiceId: practiceResult.user.practiceId,
						practiceName: practiceResult.user.practice?.name,
						isSpanishPractice: ['beautiful-smiles-mx-001', 'creative-smile-mx-002', 'wizard-dental-mx-003'].includes(practiceResult.user.practiceId || ''),
					}), {
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
				const redirectUrl = getRedirectUrl(
					"patient",
					"patient",
					patientResult.user?.practiceId,
					patientResult.user?.practice,
				);

				const response = NextResponse.json({
					success: true,
					user: patientResult.user,
					redirectUrl,
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
