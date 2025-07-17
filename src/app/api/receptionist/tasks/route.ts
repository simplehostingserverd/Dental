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
		const assignedTo = searchParams.get("assignedTo");
		const status = searchParams.get("status");
		const priority = searchParams.get("priority");
		const category = searchParams.get("category");
		const patientId = searchParams.get("patientId");

		const where: {
			practiceId: string;
			assignedToId?: string;
			status?: string;
			priority?: string;
			category?: string;
			patientId?: string;
		} = {
			practiceId: session.user.practiceId,
		};

		if (assignedTo) {
			where.assignedToId = assignedTo;
		}

		if (status) {
			where.status = status;
		}

		if (priority) {
			where.priority = priority;
		}

		if (category) {
			where.category = category;
		}

		if (patientId) {
			where.patientId = patientId;
		}

		const tasks = await prisma.task.findMany({
			where,
			include: {
				assignedTo: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
					},
				},
			},
			orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
		});

		return NextResponse.json(tasks);
	} catch (error) {
		console.error("Error fetching tasks:", error);
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
			title,
			description,
			priority,
			assignedToId,
			dueDate,
			category,
			patientId,
		} = body;

		// Validate required fields
		if (!title || !priority || !assignedToId || !dueDate) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Verify assigned user belongs to practice
		const assignedUser = await prisma.practiceUser.findFirst({
			where: {
				id: assignedToId,
				practiceId: session.user.practiceId,
			},
		});

		if (!assignedUser) {
			return NextResponse.json(
				{ error: "Assigned user not found" },
				{ status: 404 },
			);
		}

		// Verify patient belongs to practice if patientId is provided
		if (patientId) {
			const patient = await prisma.patient.findFirst({
				where: {
					id: patientId,
					practiceId: session.user.practiceId,
				},
			});

			if (!patient) {
				return NextResponse.json(
					{ error: "Patient not found" },
					{ status: 404 },
				);
			}
		}

		// Create task
		const task = await prisma.task.create({
			data: {
				title,
				description,
				priority,
				status: "PENDING",
				dueDate: new Date(dueDate),
				category,
				assignedToId,
				patientId,
				practiceId: session.user.practiceId,
			},
			include: {
				assignedTo: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
					},
				},
			},
		});

		return NextResponse.json(task, { status: 201 });
	} catch (error) {
		console.error("Error creating task:", error);
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
		const {
			id,
			title,
			description,
			priority,
			status,
			assignedToId,
			dueDate,
			category,
			completedAt,
		} = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Task ID is required" },
				{ status: 400 },
			);
		}

		// Verify task belongs to practice
		const existingTask = await prisma.task.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingTask) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		const updateData: {
			updatedAt: Date;
			title?: string;
			description?: string;
			priority?: string;
			status?: string;
			assignedToId?: string;
			dueDate?: Date;
			category?: string;
			completedAt?: Date;
		} = {
			updatedAt: new Date(),
		};

		if (title) updateData.title = title;
		if (description) updateData.description = description;
		if (priority) updateData.priority = priority;
		if (status) {
			updateData.status = status;
			if (status === "COMPLETED" && !existingTask.completedAt) {
				updateData.completedAt = new Date();
			}
		}
		if (assignedToId) updateData.assignedToId = assignedToId;
		if (dueDate) updateData.dueDate = new Date(dueDate);
		if (category) updateData.category = category;
		if (completedAt) updateData.completedAt = new Date(completedAt);

		const task = await prisma.task.update({
			where: { id },
			data: updateData,
			include: {
				assignedTo: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
					},
				},
			},
		});

		return NextResponse.json(task);
	} catch (error) {
		console.error("Error updating task:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Task ID is required" },
				{ status: 400 },
			);
		}

		// Verify task belongs to practice
		const existingTask = await prisma.task.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingTask) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		await prisma.task.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Task deleted successfully" });
	} catch (error) {
		console.error("Error deleting task:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
