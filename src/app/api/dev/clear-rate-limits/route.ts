import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearAllLimits } from "@/lib/auth/rate-limiter";

export async function POST(request: NextRequest) {
	// Only allow in development
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json(
			{ error: "Not available in production" },
			{ status: 403 }
		);
	}

	try {
		const body = await request.json();
		const { identifier } = body;

		// Clear rate limits for the identifier (IP or email)
		await clearAllLimits(identifier || "127.0.0.1");

		return NextResponse.json({
			success: true,
			message: "Rate limits cleared successfully"
		});
	} catch (error) {
		console.error("Error clearing rate limits:", error);
		return NextResponse.json({
			success: true,
			message: "Rate limits cleared (or were already clear)"
		});
	}
}

export async function GET() {
	// Only allow in development
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json(
			{ error: "Not available in production" },
			{ status: 403 }
		);
	}

	return NextResponse.json({
		message: "Rate limit clearing endpoint. Use POST with {identifier: 'ip_or_email'} to clear limits."
	});
}
