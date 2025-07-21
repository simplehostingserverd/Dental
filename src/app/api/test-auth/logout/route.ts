import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Create response
		const response = NextResponse.json({
			success: true,
			message: "Logged out successfully",
		});

		// Clear authentication cookies
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict" as const,
			maxAge: 0,
			path: "/",
		};

		response.cookies.set("test-auth-token", "", cookieOptions);
		response.cookies.set("test-user-role", "", cookieOptions);
		response.cookies.set("test-user-id", "", cookieOptions);
		response.cookies.set("test-user-email", "", cookieOptions);
		response.cookies.set("test-user-first-name", "", cookieOptions);
		response.cookies.set("test-user-last-name", "", cookieOptions);

		return response;
	} catch (error) {
		console.error("Test logout API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json(
		{ message: "Test logout endpoint" },
		{ status: 200 },
	);
}
