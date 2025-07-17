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
		const type = searchParams.get("type") || "dashboard";
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		const dateFilter =
			startDate && endDate
				? {
						gte: new Date(startDate),
						lte: new Date(endDate),
					}
				: {
						gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
						lte: new Date(),
					};

		switch (type) {
			case "dashboard":
				return await getDashboardAnalytics(session.user.practiceId, dateFilter);
			case "financial":
				return await getFinancialAnalytics(session.user.practiceId, dateFilter);
			case "appointments":
				return await getAppointmentAnalytics(
					session.user.practiceId,
					dateFilter,
				);
			case "communications":
				return await getCommunicationAnalytics(
					session.user.practiceId,
					dateFilter,
				);
			case "tasks":
				return await getTaskAnalytics(session.user.practiceId, dateFilter);
			default:
				return NextResponse.json(
					{ error: "Invalid analytics type" },
					{ status: 400 },
				);
		}
	} catch (error) {
		console.error("Error fetching analytics:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function getDashboardAnalytics(
	practiceId: string,
	dateFilter: { gte: Date; lte: Date },
) {
	const [
		totalPatients,
		totalAppointments,
		totalRevenue,
		pendingTasks,
		completedTasks,
		sentMessages,
		deliveredMessages,
		pendingClaims,
		approvedClaims,
	] = await Promise.all([
		// Total patients
		prisma.patient.count({
			where: { practiceId },
		}),

		// Total appointments in date range
		prisma.appointment.count({
			where: {
				practiceId,
				date: dateFilter,
			},
		}),

		// Total revenue in date range
		prisma.payment.aggregate({
			where: {
				practiceId,
				status: "COMPLETED",
				createdAt: dateFilter,
			},
			_sum: { amount: true },
		}),

		// Pending tasks
		prisma.task.count({
			where: {
				practiceId,
				status: "PENDING",
			},
		}),

		// Completed tasks in date range
		prisma.task.count({
			where: {
				practiceId,
				status: "COMPLETED",
				completedAt: dateFilter,
			},
		}),

		// Sent messages in date range
		prisma.communicationLog.count({
			where: {
				practiceId,
				direction: "OUTBOUND",
				sentAt: dateFilter,
			},
		}),

		// Delivered messages in date range
		prisma.communicationLog.count({
			where: {
				practiceId,
				direction: "OUTBOUND",
				status: "DELIVERED",
				sentAt: dateFilter,
			},
		}),

		// Pending insurance claims
		prisma.insuranceClaim.count({
			where: {
				practiceId,
				status: { in: ["SUBMITTED", "PROCESSING"] },
			},
		}),

		// Approved claims in date range
		prisma.insuranceClaim.count({
			where: {
				practiceId,
				status: "APPROVED",
				processedAt: dateFilter,
			},
		}),
	]);

	const analytics = {
		overview: {
			totalPatients,
			totalAppointments,
			totalRevenue: totalRevenue._sum.amount || 0,
			pendingTasks,
			completedTasks,
		},
		communications: {
			sentMessages,
			deliveredMessages,
			deliveryRate:
				sentMessages > 0 ? (deliveredMessages / sentMessages) * 100 : 0,
		},
		billing: {
			pendingClaims,
			approvedClaims,
			approvalRate:
				pendingClaims + approvedClaims > 0
					? (approvedClaims / (pendingClaims + approvedClaims)) * 100
					: 0,
		},
		productivity: {
			taskCompletionRate:
				pendingTasks + completedTasks > 0
					? (completedTasks / (pendingTasks + completedTasks)) * 100
					: 0,
		},
	};

	return NextResponse.json(analytics);
}

async function getFinancialAnalytics(
	practiceId: string,
	dateFilter: { gte: Date; lte: Date },
) {
	const [dailyRevenue, paymentMethods, outstandingBalances, claimStatuses] =
		await Promise.all([
			// Daily revenue breakdown
			prisma.payment.groupBy({
				by: ["createdAt"],
				where: {
					practiceId,
					status: "COMPLETED",
					createdAt: dateFilter,
				},
				_sum: { amount: true },
				orderBy: { createdAt: "asc" },
			}),

			// Payment methods breakdown
			prisma.payment.groupBy({
				by: ["paymentMethod"],
				where: {
					practiceId,
					status: "COMPLETED",
					createdAt: dateFilter,
				},
				_sum: { amount: true },
				_count: true,
			}),

			// Outstanding balances by patient
			prisma.patient.findMany({
				where: {
					practiceId,
					invoices: {
						some: {
							paid: false,
						},
					},
				},
				include: {
					invoices: {
						where: { paid: false },
						select: { total: true },
					},
				},
			}),

			// Insurance claim statuses
			prisma.insuranceClaim.groupBy({
				by: ["status"],
				where: { practiceId },
				_sum: { amount: true },
				_count: true,
			}),
		]);

	const analytics = {
		dailyRevenue,
		paymentMethods,
		outstandingBalances: outstandingBalances.map((patient) => ({
			patientId: patient.id,
			patientName: `${patient.firstName} ${patient.lastName}`,
			totalOutstanding: patient.invoices.reduce(
				(sum, invoice) => sum + invoice.total,
				0,
			),
		})),
		claimStatuses,
	};

	return NextResponse.json(analytics);
}

async function getAppointmentAnalytics(
	practiceId: string,
	dateFilter: { gte: Date; lte: Date },
) {
	const [appointmentStatuses, appointmentTypes, dailyAppointments, noShowRate] =
		await Promise.all([
			// Appointment statuses
			prisma.appointment.groupBy({
				by: ["status"],
				where: {
					practiceId,
					date: dateFilter,
				},
				_count: true,
			}),

			// Appointment types
			prisma.appointment.groupBy({
				by: ["type"],
				where: {
					practiceId,
					date: dateFilter,
				},
				_count: true,
			}),

			// Daily appointments
			prisma.appointment.groupBy({
				by: ["date"],
				where: {
					practiceId,
					date: dateFilter,
				},
				_count: true,
				orderBy: { date: "asc" },
			}),

			// No-show rate calculation
			prisma.appointment.aggregate({
				where: {
					practiceId,
					date: dateFilter,
					status: "NO_SHOW",
				},
				_count: true,
			}),
		]);

	const totalAppointments = await prisma.appointment.count({
		where: {
			practiceId,
			date: dateFilter,
		},
	});

	const analytics = {
		appointmentStatuses,
		appointmentTypes,
		dailyAppointments,
		noShowRate:
			totalAppointments > 0 ? (noShowRate._count / totalAppointments) * 100 : 0,
	};

	return NextResponse.json(analytics);
}

async function getCommunicationAnalytics(
	practiceId: string,
	dateFilter: { gte: Date; lte: Date },
) {
	const [channelBreakdown, messageStatuses, templateUsage, responseRates] =
		await Promise.all([
			// Communication channels
			prisma.communicationLog.groupBy({
				by: ["channel"],
				where: {
					practiceId,
					sentAt: dateFilter,
				},
				_count: true,
			}),

			// Message statuses
			prisma.communicationLog.groupBy({
				by: ["status"],
				where: {
					practiceId,
					sentAt: dateFilter,
				},
				_count: true,
			}),

			// Template usage
			prisma.communicationLog.groupBy({
				by: ["templateId"],
				where: {
					practiceId,
					sentAt: dateFilter,
					templateId: { not: null },
				},
				_count: true,
			}),

			// Response rates
			prisma.communicationLog.aggregate({
				where: {
					practiceId,
					sentAt: dateFilter,
					response: { not: null },
				},
				_count: true,
			}),
		]);

	const totalSent = await prisma.communicationLog.count({
		where: {
			practiceId,
			sentAt: dateFilter,
		},
	});

	const analytics = {
		channelBreakdown,
		messageStatuses,
		templateUsage,
		responseRate: totalSent > 0 ? (responseRates._count / totalSent) * 100 : 0,
	};

	return NextResponse.json(analytics);
}

async function getTaskAnalytics(
	practiceId: string,
	dateFilter: { gte: Date; lte: Date },
) {
	const [taskStatuses, taskPriorities, taskCategories, completionTimes] =
		await Promise.all([
			// Task statuses
			prisma.task.groupBy({
				by: ["status"],
				where: { practiceId },
				_count: true,
			}),

			// Task priorities
			prisma.task.groupBy({
				by: ["priority"],
				where: { practiceId },
				_count: true,
			}),

			// Task categories
			prisma.task.groupBy({
				by: ["category"],
				where: { practiceId },
				_count: true,
			}),

			// Average completion times
			prisma.task.findMany({
				where: {
					practiceId,
					status: "COMPLETED",
					completedAt: dateFilter,
				},
				select: {
					createdAt: true,
					completedAt: true,
				},
			}),
		]);

	const avgCompletionTime =
		completionTimes.length > 0
			? completionTimes.reduce((sum, task) => {
					const diff = task.completedAt!.getTime() - task.createdAt.getTime();
					return sum + diff;
				}, 0) /
				completionTimes.length /
				(1000 * 60 * 60) // Convert to hours
			: 0;

	const analytics = {
		taskStatuses,
		taskPriorities,
		taskCategories,
		avgCompletionTime,
	};

	return NextResponse.json(analytics);
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId || !session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { eventType, eventData, patientId } = body;

		// Create analytics event
		const event = await prisma.analyticsEvent.create({
			data: {
				eventType,
				eventData,
				timestamp: new Date(),
				userId: session.user.id,
				patientId,
				practiceId: session.user.practiceId,
			},
		});

		return NextResponse.json(event, { status: 201 });
	} catch (error) {
		console.error("Error creating analytics event:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
