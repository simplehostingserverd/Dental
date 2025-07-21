import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the practice user record
		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
			include: { practice: true },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Get URL search parameters for filtering
		const url = new URL(request.url);
		const status = url.searchParams.get("status"); // "read", "unread", or null for all
		const search = url.searchParams.get("search"); // search term
		const patientId = url.searchParams.get("patientId"); // specific patient

		// Build where clause
		const whereClause: {
			patient: {
				practiceId: string;
			};
			isRead?: boolean;
			patientId?: string;
		} = {
			patient: {
				practiceId: practiceUser.practiceId,
			},
		};

		// Add status filter
		if (status === "read") {
			whereClause.isRead = true;
		} else if (status === "unread") {
			whereClause.isRead = false;
		}

		// Add patient filter
		if (patientId) {
			whereClause.patientId = patientId;
		}

		// Get messages for this practice
		const messages = await db.message.findMany({
			where: whereClause,
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
					},
				},
				sender: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				timestamp: "desc",
			},
		});

		// Filter by search term if provided
		let filteredMessages = messages;
		if (search) {
			const searchLower = search.toLowerCase();
			filteredMessages = messages.filter(
				(message) =>
					message.patient.firstName.toLowerCase().includes(searchLower) ||
					message.patient.lastName.toLowerCase().includes(searchLower) ||
					message.patient.email?.toLowerCase().includes(searchLower) ||
					message.content.toLowerCase().includes(searchLower),
			);
		}

		return NextResponse.json({
			success: true,
			messages: filteredMessages.map((message) => ({
				id: message.id,
				content: message.content,
				timestamp: message.timestamp.toISOString(),
				senderId: message.senderId,
				patientId: message.patientId,
				isRead: message.isRead,
				patient: {
					id: message.patient.id,
					firstName: message.patient.firstName,
					lastName: message.patient.lastName,
					email: message.patient.email,
				},
				sender: {
					firstName: message.sender.firstName,
					lastName: message.sender.lastName,
				},
			})),
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

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { content, patientId } = body;

		// Validate required fields
		if (!content || !content.trim()) {
			return NextResponse.json(
				{ error: "Message content is required" },
				{ status: 400 },
			);
		}

		if (!patientId) {
			return NextResponse.json(
				{ error: "Patient ID is required" },
				{ status: 400 },
			);
		}

		// Find the practice user record
		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Verify the patient belongs to this practice
		const patient = await db.patient.findFirst({
			where: {
				id: patientId,
				practiceId: practiceUser.practiceId,
			},
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Create the message
		const message = await db.message.create({
			data: {
				content: content.trim(),
				patientId: patient.id,
				senderId: practiceUser.id,
				isRead: false,
			},
			include: {
				patient: {
					select: {
						firstName: true,
						lastName: true,
						email: true,
					},
				},
				sender: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			message: {
				id: message.id,
				content: message.content,
				timestamp: message.timestamp.toISOString(),
				senderId: message.senderId,
				patientId: message.patientId,
				isRead: message.isRead,
				patient: {
					firstName: message.patient.firstName,
					lastName: message.patient.lastName,
					email: message.patient.email,
				},
				sender: {
					firstName: message.sender.firstName,
					lastName: message.sender.lastName,
				},
			},
		});
	} catch (error) {
		console.error("Error creating message:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
