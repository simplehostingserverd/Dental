import { QuantumCrypto } from "@/lib/quantum-crypto";
import { verifyUserLogin } from "@/lib/test-users-server";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Get redirect URL based on user role
 */
function getRedirectUrl(role: string): string {
	switch (role.toLowerCase()) {
		case "dentist":
			return "/dashboard/dentist";
		case "receptionist":
			return "/receptionist";
		case "patient":
			return "/dashboard/patient";
		default:
			return "/dashboard";
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password } = body;

		// Validate required fields
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		// Attempt authentication using server-side verification
		const user = verifyUserLogin(email, password);

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 },
			);
		}

		// Generate secure session token
		const sessionToken = QuantumCrypto.generateSecureToken();

		// Determine redirect URL based on role
		const redirectUrl = getRedirectUrl(user.role);

		// Sign the session data for security
		const sessionData = JSON.stringify({
			userId: user.id,
			email: user.email,
			role: user.role,
			timestamp: Date.now(),
		});

		const signature = QuantumCrypto.signWithMLDSA(
			sessionData,
			user.cryptoKeys.mldsa.privateKey,
		);

		// Create response with user data
		const response = NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				profile: user.profile,
				sessionToken,
				signature,
			},
			redirectUrl,
		});

		// Set HTTP-only cookie for session
		response.cookies.set("test-auth-token", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		// Set user information for middleware
		response.cookies.set("test-user-role", user.role, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		response.cookies.set("test-user-id", user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		response.cookies.set("test-user-email", user.email, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		response.cookies.set("test-user-first-name", user.profile.firstName, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		response.cookies.set("test-user-last-name", user.profile.lastName, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 24 * 60 * 60, // 24 hours
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Test auth API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json(
		{ message: "Test authentication endpoint" },
		{ status: 200 },
	);
}
