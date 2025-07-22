import { NextRequest, NextResponse } from "next/server";
import { IntegrationManager } from "@/lib/integrations/integration-manager";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { providerId, config } = body;

		if (!providerId || !config) {
			return NextResponse.json(
				{ error: "Provider ID and config are required" },
				{ status: 400 }
			);
		}

		const success = await IntegrationManager.testIntegration(providerId, config);

		return NextResponse.json({ 
			success,
			message: success ? "Connection test successful" : "Connection test failed"
		});
	} catch (error) {
		console.error("Integration test error:", error);
		return NextResponse.json(
			{ error: "Failed to test integration" },
			{ status: 500 }
		);
	}
}
