import { PatientAuthService } from "@/lib/auth/patient-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
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
		const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown";

		// Attempt login
		const result = await PatientAuthService.login(
			{ email, password, twoFactorToken, rememberMe },
			ip,
		);

		if (!result.success) {
			const status = result.lockoutTime ? 429 : 401;
			return NextResponse.json(
				{
					error: result.error,
					requiresTwoFactor: result.requiresTwoFactor,
					lockoutTime: result.lockoutTime,
				},
				{ status },
			);
		}

		// Set HTTP-only cookie for token
		const response = NextResponse.json({
			success: true,
			user: result.user,
		});

		if (result.token) {
			response.cookies.set("patient-auth-token", result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 24 hours
				path: "/patient",
			});
		}

		return response;
	} catch (error) {
		console.error("Patient login API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
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
