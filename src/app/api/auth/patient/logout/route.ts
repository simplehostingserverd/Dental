import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Create response and clear the auth cookie
		const response = NextResponse.json(
			{ success: true, message: "Logged out successfully" },
			{ status: 200 },
		);

		// Clear the patient auth token cookie
		response.cookies.set("patient-auth-token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 0, // This expires the cookie immediately
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Error during logout:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
