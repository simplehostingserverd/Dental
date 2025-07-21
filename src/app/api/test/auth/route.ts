import { runAllAuthTests } from "@/lib/auth/test-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Only allow in development
		if (process.env.NODE_ENV !== "development") {
			return NextResponse.json(
				{ error: "Test endpoint only available in development" },
				{ status: 403 },
			);
		}

		// Running authentication tests
		await runAllAuthTests();

		return NextResponse.json({
			success: true,
			message: "Authentication tests completed successfully",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Authentication test error:", error);
		return NextResponse.json(
			{
				error: "Authentication test failed",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
