import { NextRequest, NextResponse } from "next/server";
import { TogetherAIService } from "@/lib/ai/together-ai";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { message, context } = body;

		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 }
			);
		}

		const togetherAI = new TogetherAIService();
		const response = await togetherAI.generateHelpResponse(message, context);

		return NextResponse.json({ response });
	} catch (error) {
		console.error("Help chat error:", error);
		return NextResponse.json(
			{ error: "Failed to generate response" },
			{ status: 500 }
		);
	}
}
