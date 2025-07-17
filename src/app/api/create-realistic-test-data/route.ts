import { createRealisticTestData } from "@/scripts/create-realistic-test-data";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		// Only allow in development
		if (process.env.NODE_ENV !== "development") {
			return NextResponse.json(
				{ error: "This endpoint is only available in development" },
				{ status: 403 },
			);
		}

		const result = await createRealisticTestData();

		return NextResponse.json({
			success: true,
			message: "Realistic test data created successfully!",
			data: result,
		});
	} catch (error) {
		console.error("Error creating realistic test data:", error);
		return NextResponse.json(
			{
				error: "Failed to create test data",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
