import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "patient") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the patient record
		const patient = await db.patient.findUnique({
			where: { patientUserId: user.id },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient record not found" },
				{ status: 404 },
			);
		}

		// Get messages for this patient
		const messages = await db.message.findMany({
			where: {
				patientId: patient.id,
			},
			include: {
				sender: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				timestamp: "asc",
			},
		});

		const formattedMessages = messages.map((message) => ({
			id: message.id,
			content: message.content,
			timestamp: message.timestamp,
			senderId: message.senderId,
			senderName: `${message.sender.firstName} ${message.sender.lastName}`,
			senderType: "staff" as const,
			isRead: message.isRead,
		}));

		return NextResponse.json({
			success: true,
			messages: formattedMessages,
		});
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "patient") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { content } = body;

		// Validate required fields
		if (!content || !content.trim()) {
			return NextResponse.json(
				{ error: "Message content is required" },
				{ status: 400 },
			);
		}

		// Find the patient record
		const patient = await db.patient.findUnique({
			where: { patientUserId: user.id },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient record not found" },
				{ status: 404 },
			);
		}

		if (!patient.practiceId) {
			return NextResponse.json(
				{ error: "Patient is not associated with a practice" },
				{ status: 400 },
			);
		}

		// Find a practice user to send the message to (for now, use the first available)
		const practiceUser = await db.practiceUser.findFirst({
			where: {
				practiceId: patient.practiceId,
				isActive: true,
			},
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "No available staff found" },
				{ status: 404 },
			);
		}

		// Create the message
		const message = await db.message.create({
			data: {
				content: content.trim(),
				patientId: patient.id,
				senderId: practiceUser.id, // This is a bit of a hack - in reality, we'd need a different model for patient-sent messages
				isRead: false,
			},
			include: {
				sender: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		// For now, we'll simulate this as a patient message by returning it with patient type
		const formattedMessage = {
			id: message.id,
			content: message.content,
			timestamp: message.timestamp,
			senderId: user.id,
			senderName: `${user.firstName} ${user.lastName}`,
			senderType: "patient" as const,
			isRead: message.isRead,
		};

		return NextResponse.json({
			success: true,
			message: formattedMessage,
		});
	} catch (error) {
		console.error("Error creating message:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
