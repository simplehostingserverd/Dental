import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { ruleId, triggeredBy, context } = body;

		if (!ruleId) {
			return NextResponse.json(
				{ error: "Rule ID is required" },
				{ status: 400 },
			);
		}

		// Get the automation rule
		const rule = await prisma.automationRule.findFirst({
			where: {
				id: ruleId,
				practiceId: session.user.practiceId,
				isActive: true,
			},
		});

		if (!rule) {
			return NextResponse.json(
				{ error: "Automation rule not found or inactive" },
				{ status: 404 },
			);
		}

		// Create execution record
		const execution = await prisma.automationExecution.create({
			data: {
				status: "RUNNING",
				startedAt: new Date(),
				ruleId,
				triggeredBy,
				logs: [],
			},
		});

		// Execute the automation in the background
		executeAutomation(execution.id, rule, context, session.user.practiceId);

		// Update rule run count and last run
		await prisma.automationRule.update({
			where: { id: ruleId },
			data: {
				lastRun: new Date(),
				runCount: { increment: 1 },
			},
		});

		return NextResponse.json(
			{
				executionId: execution.id,
				message: "Automation execution started",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error executing automation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function executeAutomation(
	executionId: string,
	rule: { name: string; actions: unknown[] },
	context: unknown,
	practiceId: string,
) {
	const logs: string[] = [];

	try {
		logs.push(`Starting automation: ${rule.name}`);

		// Process each action in the automation
		for (const action of rule.actions) {
			try {
				await executeAction(action, context, practiceId, logs);
			} catch (actionError) {
				logs.push(`Error executing action ${action.type}: ${actionError}`);
				throw actionError;
			}
		}

		// Mark execution as completed
		await prisma.automationExecution.update({
			where: { id: executionId },
			data: {
				status: "COMPLETED",
				completedAt: new Date(),
				logs,
			},
		});

		logs.push("Automation completed successfully");
	} catch (error) {
		// Mark execution as failed
		await prisma.automationExecution.update({
			where: { id: executionId },
			data: {
				status: "FAILED",
				completedAt: new Date(),
				error: error instanceof Error ? error.message : "Unknown error",
				logs,
			},
		});
	}
}

async function executeAction(
	action: { type: string; config: Record<string, unknown> },
	context: unknown,
	practiceId: string,
	logs: string[],
) {
	switch (action.type) {
		case "SEND_MESSAGE":
			await executeSendMessage(action, context, practiceId, logs);
			break;
		case "CREATE_TASK":
			await executeCreateTask(action, context, practiceId, logs);
			break;
		case "UPDATE_PATIENT":
			await executeUpdatePatient(action, context, practiceId, logs);
			break;
		case "SCHEDULE_APPOINTMENT":
			await executeScheduleAppointment(action, context, practiceId, logs);
			break;
		case "SEND_EMAIL":
			await executeSendEmail(action, context, practiceId, logs);
			break;
		case "WAIT_DELAY":
			await executeWaitDelay(action, logs);
			break;
		default:
			logs.push(`Unknown action type: ${action.type}`);
			throw new Error(`Unknown action type: ${action.type}`);
	}
}

async function executeSendMessage(
	action: { config: Record<string, unknown> },
	context: unknown,
	practiceId: string,
	logs: string[],
) {
	const { channel, templateId, patientId, content } = action.config;

	logs.push(`Sending ${channel} message to patient ${patientId}`);

	// Create communication log
	await prisma.communicationLog.create({
		data: {
			channel,
			direction: "OUTBOUND",
			content: content || "Automated message",
			status: "SENT",
			sentAt: new Date(),
			patientId,
			sentById: context.userId || "system",
			practiceId,
			templateId,
		},
	});

	logs.push(`${channel} message sent successfully`);
}

async function executeCreateTask(
	action: { config: Record<string, unknown> },
	context: unknown,
	practiceId: string,
	logs: string[],
) {
	const { title, description, priority, assignedToId, dueDate, category } =
		action.config;

	logs.push(`Creating task: ${title}`);

	await prisma.task.create({
		data: {
			title,
			description,
			priority: priority || "MEDIUM",
			status: "PENDING",
			dueDate: dueDate
				? new Date(dueDate)
				: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
			category,
			assignedToId,
			practiceId,
		},
	});

	logs.push("Task created successfully");
}

async function executeUpdatePatient(
	action: { config: Record<string, unknown> },
	context: unknown,
	practiceId: string,
	logs: string[],
) {
	const { patientId, updates } = action.config;

	logs.push(`Updating patient ${patientId}`);

	await prisma.patient.update({
		where: {
			id: patientId,
			practiceId, // Ensure patient belongs to practice
		},
		data: updates,
	});

	logs.push("Patient updated successfully");
}

async function executeScheduleAppointment(
	action: { config: Record<string, unknown> },
	context: unknown,
	practiceId: string,
	logs: string[],
) {
	const { patientId, practiceUserId, date, time, type, duration } =
		action.config;

	logs.push(`Scheduling appointment for patient ${patientId}`);

	await prisma.appointment.create({
		data: {
			date: new Date(date),
			time,
			type,
			duration: duration || 30,
			status: "SCHEDULED",
			patientId,
			practiceUserId,
		},
	});

	logs.push("Appointment scheduled successfully");
}

async function executeSendEmail(
	action: { config: Record<string, unknown> },
	context: unknown,
	practiceId: string,
	logs: string[],
) {
	const { to, subject, content, templateId } = action.config;

	logs.push(`Sending email to ${to}`);

	// TODO: Integrate with actual email service
	// For now, just log the action

	logs.push("Email sent successfully (simulated)");
}

async function executeWaitDelay(
	action: { config: Record<string, unknown> },
	logs: string[],
) {
	const { duration } = action.config; // Duration in milliseconds

	logs.push(`Waiting for ${duration}ms`);

	await new Promise((resolve) => setTimeout(resolve, duration));

	logs.push("Wait completed");
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const ruleId = searchParams.get("ruleId");
		const status = searchParams.get("status");

		const where: {
			rule: {
				practiceId: string;
			};
			ruleId?: string;
			status?: string;
		} = {
			rule: {
				practiceId: session.user.practiceId,
			},
		};

		if (ruleId) {
			where.ruleId = ruleId;
		}

		if (status) {
			where.status = status;
		}

		const executions = await prisma.automationExecution.findMany({
			where,
			include: {
				rule: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				startedAt: "desc",
			},
			take: 50, // Limit to last 50 executions
		});

		return NextResponse.json(executions);
	} catch (error) {
		console.error("Error fetching automation executions:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
