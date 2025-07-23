import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();

		const callSid = formData.get("CallSid") as string;
		const callStatus = formData.get("CallStatus") as string;
		const callDuration = formData.get("CallDuration") as string;
		const from = formData.get("From") as string;
		const to = formData.get("To") as string;

		console.log(`Call ${callSid} status update: ${callStatus}`);

		// Update call log in database
		await db.callLog.updateMany({
			where: { twilioCallSid: callSid },
			data: {
				status: callStatus,
				duration: callDuration ? Number.parseInt(callDuration) : null,
				endedAt: ["completed", "failed", "busy", "no-answer"].includes(
					callStatus,
				)
					? new Date()
					: null,
			},
		});

		// You could also emit real-time updates to the receptionist dashboard here
		// using WebSockets or Server-Sent Events

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Call status webhook error:", error);
		return NextResponse.json(
			{ error: "Failed to process status update" },
			{ status: 500 },
		);
	}
}
