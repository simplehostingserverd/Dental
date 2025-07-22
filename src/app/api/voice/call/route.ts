import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { db } from "@/server/db";

// Initialize Twilio client conditionally
const getTwilioClient = () => {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;

	if (!accountSid || !authToken || !accountSid.startsWith('AC')) {
		return null;
	}

	return twilio(accountSid, authToken);
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { to, patientId, callType = "outbound", notes } = body;

		// Validate required fields
		if (!to) {
			return NextResponse.json(
				{ error: "Phone number is required" },
				{ status: 400 }
			);
		}

		// Get practice phone number from environment
		const fromNumber = process.env.TWILIO_PHONE_NUMBER;
		if (!fromNumber) {
			return NextResponse.json(
				{ error: "Practice phone number not configured" },
				{ status: 500 }
			);
		}

		// Format phone number (ensure it starts with +1 for US numbers)
		const formattedTo = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;

		// Create TwiML for the call
		const twimlUrl = `${process.env.NEXTAUTH_URL}/api/voice/twiml`;

		// Initiate the call
		const call = await twilioClient.calls.create({
			to: formattedTo,
			from: fromNumber,
			url: twimlUrl,
			statusCallback: `${process.env.NEXTAUTH_URL}/api/voice/status`,
			statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
			record: true, // Record calls for quality assurance
			recordingStatusCallback: `${process.env.NEXTAUTH_URL}/api/voice/recording`,
		});

		// Log the call in database
		if (patientId) {
			await db.callLog.create({
				data: {
					patientId,
					phoneNumber: formattedTo,
					direction: callType,
					twilioCallSid: call.sid,
					status: 'initiated',
					notes: notes || '',
					createdAt: new Date(),
				},
			});
		}

		return NextResponse.json({
			success: true,
			callSid: call.sid,
			status: call.status,
			to: formattedTo,
			from: fromNumber,
		});

	} catch (error) {
		console.error("Voice call error:", error);
		
		if (error instanceof Error) {
			// Handle specific Twilio errors
			if (error.message.includes('not a valid phone number')) {
				return NextResponse.json(
					{ error: "Invalid phone number format" },
					{ status: 400 }
				);
			}
			if (error.message.includes('insufficient funds')) {
				return NextResponse.json(
					{ error: "Insufficient Twilio account balance" },
					{ status: 402 }
				);
			}
		}

		return NextResponse.json(
			{ error: "Failed to initiate call" },
			{ status: 500 }
		);
	}
}

// Handle call status updates
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { callSid, status, duration } = body;

		// Update call log in database
		await db.callLog.updateMany({
			where: { twilioCallSid: callSid },
			data: {
				status,
				duration: duration ? parseInt(duration) : null,
				endedAt: status === 'completed' ? new Date() : null,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Call status update error:", error);
		return NextResponse.json(
			{ error: "Failed to update call status" },
			{ status: 500 }
		);
	}
}
