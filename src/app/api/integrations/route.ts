import { NextRequest, NextResponse } from "next/server";
import { IntegrationManager } from "@/lib/integrations/integration-manager";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const practiceId = searchParams.get('practiceId');
		const service = searchParams.get('service');

		if (!practiceId) {
			return NextResponse.json(
				{ error: "Practice ID is required" },
				{ status: 400 }
			);
		}

		if (service) {
			// Get providers for specific service
			const providers = IntegrationManager.getProviders(service);
			return NextResponse.json({ providers });
		} else {
			// Get all integrations for practice
			const integrations = await IntegrationManager.getPracticeIntegrations(practiceId);
			return NextResponse.json({ integrations });
		}
	} catch (error) {
		console.error("Integration API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch integrations" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { practiceId, providerId, service, config, isActive } = body;

		if (!practiceId || !providerId || !service || !config) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const integration = await IntegrationManager.saveIntegration(
			practiceId,
			providerId,
			service,
			config,
			isActive
		);

		return NextResponse.json({ 
			success: true, 
			integration: {
				...integration,
				config: undefined // Don't return sensitive config data
			}
		});
	} catch (error) {
		console.error("Integration save error:", error);
		return NextResponse.json(
			{ error: "Failed to save integration" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const practiceId = searchParams.get('practiceId');
		const providerId = searchParams.get('providerId');
		const service = searchParams.get('service');

		if (!practiceId || !providerId || !service) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		await IntegrationManager.deleteIntegration(practiceId, providerId, service);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Integration delete error:", error);
		return NextResponse.json(
			{ error: "Failed to delete integration" },
			{ status: 500 }
		);
	}
}
