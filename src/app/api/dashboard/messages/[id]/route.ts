import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { isRead } = body;

		// Validate required fields
		if (typeof isRead !== "boolean") {
			return NextResponse.json(
				{ error: "isRead field is required and must be a boolean" },
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

		// Find the message and verify it belongs to this practice
		const message = await db.message.findFirst({
			where: {
				id: id,
				patient: {
					practiceId: practiceUser.practiceId,
				},
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

		if (!message) {
			return NextResponse.json(
				{ error: "Message not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Update the message
		const updatedMessage = await db.message.update({
			where: { id: id },
			data: { isRead },
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
				id: updatedMessage.id,
				content: updatedMessage.content,
				timestamp: updatedMessage.timestamp.toISOString(),
				senderId: updatedMessage.senderId,
				patientId: updatedMessage.patientId,
				isRead: updatedMessage.isRead,
				patient: {
					firstName: updatedMessage.patient.firstName,
					lastName: updatedMessage.patient.lastName,
					email: updatedMessage.patient.email,
				},
				sender: {
					firstName: updatedMessage.sender.firstName,
					lastName: updatedMessage.sender.lastName,
				},
			},
		});
	} catch (error) {
		console.error("Error updating message:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

		// Find the message and verify it belongs to this practice
		const message = await db.message.findFirst({
			where: {
				id: id,
				patient: {
					practiceId: practiceUser.practiceId,
				},
			},
		});

		if (!message) {
			return NextResponse.json(
				{ error: "Message not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Delete the message
		await db.message.delete({
			where: { id: id },
		});

		return NextResponse.json({
			success: true,
			message: "Message deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting message:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
