import { type NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: NextRequest) {
	try {
		const twiml = new VoiceResponse();

		// Create a professional greeting
		twiml.say(
			{
				voice: "alice",
				language: "en-US",
			},
			"Hello, this is a call from Cognident Dental Practice. Please hold while we connect you to our receptionist.",
		);

		// Connect the call to the receptionist's browser/device
		const dial = twiml.dial({
			timeout: 30,
			record: "record-from-answer-dual",
			recordingStatusCallback: `${process.env.NEXTAUTH_URL}/api/voice/recording`,
		});

		// Use Twilio Client to connect to browser
		dial.client("receptionist-browser");

		// If no answer, leave a voicemail option
		twiml.say(
			"We apologize, but our receptionist is currently unavailable. Please leave a message after the tone.",
		);
		twiml.record({
			timeout: 30,
			transcribe: true,
			transcribeCallback: `${process.env.NEXTAUTH_URL}/api/voice/voicemail`,
		});

		twiml.say(
			"Thank you for your message. We will get back to you soon. Goodbye.",
		);

		const response = new NextResponse(twiml.toString(), {
			headers: {
				"Content-Type": "text/xml",
			},
		});

		return response;
	} catch (error) {
		console.error("TwiML generation error:", error);

		// Fallback TwiML
		const twiml = new VoiceResponse();
		twiml.say(
			"We apologize, but we are experiencing technical difficulties. Please try calling again later.",
		);

		return new NextResponse(twiml.toString(), {
			headers: {
				"Content-Type": "text/xml",
			},
		});
	}
}
