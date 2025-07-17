import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("patientId");
		const channel = searchParams.get("channel");
		const direction = searchParams.get("direction");
		const status = searchParams.get("status");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		const where: {
			practiceId: string;
			patientId?: string;
			channel?: string;
			direction?: string;
			status?: string;
			sentAt?: {
				gte: Date;
				lte: Date;
			};
		} = {
			practiceId: session.user.practiceId,
		};

		if (patientId) {
			where.patientId = patientId;
		}

		if (channel) {
			where.channel = channel;
		}

		if (direction) {
			where.direction = direction;
		}

		if (status) {
			where.status = status;
		}

		if (startDate && endDate) {
			where.sentAt = {
				gte: new Date(startDate),
				lte: new Date(endDate),
			};
		}

		const communications = await prisma.communicationLog.findMany({
			where,
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
					},
				},
				sentBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
				template: {
					select: {
						id: true,
						name: true,
						type: true,
					},
				},
			},
			orderBy: {
				sentAt: "desc",
			},
		});

		return NextResponse.json(communications);
	} catch (error) {
		console.error("Error fetching communications:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId || !session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			channel,
			content,
			patientId,
			templateId,
			direction = "OUTBOUND",
		} = body;

		// Validate required fields
		if (!channel || !content || !patientId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Verify patient belongs to practice
		const patient = await prisma.patient.findFirst({
			where: {
				id: patientId,
				practiceId: session.user.practiceId,
			},
		});

		if (!patient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Process template variables if template is used
		let processedContent = content;
		if (templateId) {
			const template = await prisma.communicationTemplate.findFirst({
				where: {
					id: templateId,
					practiceId: session.user.practiceId,
				},
			});

			if (template) {
				// Replace template variables with patient data
				processedContent = template.content
					.replace(
						/\{patientName\}/g,
						`${patient.firstName} ${patient.lastName}`,
					)
					.replace(/\{firstName\}/g, patient.firstName)
					.replace(/\{lastName\}/g, patient.lastName)
					.replace(/\{phone\}/g, patient.phone || "")
					.replace(/\{email\}/g, patient.email || "");

				// Add practice-specific variables
				// TODO: Add practice phone, name, etc.
			}
		}

		// Create communication log
		const communication = await prisma.communicationLog.create({
			data: {
				channel,
				direction,
				content: processedContent,
				status: "SENT", // In real implementation, this would be PENDING until actually sent
				sentAt: new Date(),
				patientId,
				sentById: session.user.id,
				practiceId: session.user.practiceId,
				templateId,
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
					},
				},
				sentBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
				template: {
					select: {
						id: true,
						name: true,
						type: true,
					},
				},
			},
		});

		// TODO: Integrate with actual SMS/Email services
		// For now, we'll simulate successful sending

		// Update status to delivered after a short delay (simulation)
		setTimeout(async () => {
			try {
				await prisma.communicationLog.update({
					where: { id: communication.id },
					data: {
						status: "DELIVERED",
						deliveredAt: new Date(),
					},
				});
			} catch (error) {
				console.error("Error updating communication status:", error);
			}
		}, 1000);

		return NextResponse.json(communication, { status: 201 });
	} catch (error) {
		console.error("Error creating communication:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { id, status, response, readAt } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Communication ID is required" },
				{ status: 400 },
			);
		}

		// Verify communication belongs to practice
		const existingCommunication = await prisma.communicationLog.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingCommunication) {
			return NextResponse.json(
				{ error: "Communication not found" },
				{ status: 404 },
			);
		}

		const updateData: {
			status?: string;
			response?: string;
			readAt?: Date;
		} = {};

		if (status) updateData.status = status;
		if (response) updateData.response = response;
		if (readAt) updateData.readAt = new Date(readAt);

		const communication = await prisma.communicationLog.update({
			where: { id },
			data: updateData,
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
					},
				},
				sentBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
				template: {
					select: {
						id: true,
						name: true,
						type: true,
					},
				},
			},
		});

		return NextResponse.json(communication);
	} catch (error) {
		console.error("Error updating communication:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
