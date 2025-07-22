import { NextRequest, NextResponse } from "next/server";
import { SmsService } from "@/lib/sms/sms-service";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { practiceId, to, message, patientId, templateId, variables } = body;

		if (!practiceId || !to || !message) {
			return NextResponse.json(
				{ error: "Practice ID, phone number, and message are required" },
				{ status: 400 }
			);
		}

		const smsService = new SmsService(practiceId);
		const result = await smsService.sendSms({
			to,
			message,
			patientId,
			templateId,
			variables
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("SMS send error:", error);
		return NextResponse.json(
			{ error: "Failed to send SMS" },
			{ status: 500 }
		);
	}
}

// Get SMS templates
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const practiceId = searchParams.get('practiceId');

		if (!practiceId) {
			return NextResponse.json(
				{ error: "Practice ID is required" },
				{ status: 400 }
			);
		}

		const smsService = new SmsService(practiceId);
		const templates = await smsService.getSmsTemplates();

		return NextResponse.json({ templates });
	} catch (error) {
		console.error("SMS templates error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch SMS templates" },
			{ status: 500 }
		);
	}
}
