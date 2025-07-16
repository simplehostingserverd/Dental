import { getCurrentUser } from "@/lib/auth/get-user";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 }
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error getting current user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
