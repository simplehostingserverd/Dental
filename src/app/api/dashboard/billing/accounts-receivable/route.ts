import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateARSchema = z.object({
	collectionStatus: z
		.enum(["CURRENT", "PAST_DUE", "COLLECTIONS", "BAD_DEBT", "WRITTEN_OFF"])
		.optional(),
	paymentPlan: z.boolean().optional(),
});

// GET /api/dashboard/billing/accounts-receivable - Get accounts receivable
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const collectionStatus = searchParams.get("collectionStatus");
		const paymentPlan = searchParams.get("paymentPlan");
		const minBalance = Number.parseFloat(searchParams.get("minBalance") || "0");
		const limit = Number.parseInt(searchParams.get("limit") || "50");
		const offset = Number.parseInt(searchParams.get("offset") || "0");

		const where: any = {
			practiceId: user.practiceId,
			totalBalance: {
				gt: minBalance,
			},
		};

		if (collectionStatus) {
			where.collectionStatus = collectionStatus;
		}

		if (paymentPlan !== null) {
			where.paymentPlan = paymentPlan === "true";
		}

		const [accountsReceivable, total] = await Promise.all([
			prisma.accountsReceivable.findMany({
				where,
				include: {
					patient: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							phone: true,
							email: true,
							dateOfBirth: true,
						},
					},
				},
				orderBy: [{ totalBalance: "desc" }, { patient: { lastName: "asc" } }],
				take: limit,
				skip: offset,
			}),
			prisma.accountsReceivable.count({ where }),
		]);

		// Calculate aging summary
		const agingSummary = await prisma.accountsReceivable.aggregate({
			where: {
				practiceId: user.practiceId,
				totalBalance: { gt: 0 },
			},
			_sum: {
				totalBalance: true,
				currentBalance: true,
				days30Balance: true,
				days60Balance: true,
				days90Balance: true,
				days120PlusBalance: true,
				insuranceBalance: true,
				patientBalance: true,
			},
			_count: {
				id: true,
			},
		});

		return NextResponse.json({
			accountsReceivable,
			agingSummary: {
				totalAccounts: agingSummary._count.id,
				totalBalance: agingSummary._sum.totalBalance || 0,
				currentBalance: agingSummary._sum.currentBalance || 0,
				days30Balance: agingSummary._sum.days30Balance || 0,
				days60Balance: agingSummary._sum.days60Balance || 0,
				days90Balance: agingSummary._sum.days90Balance || 0,
				days120PlusBalance: agingSummary._sum.days120PlusBalance || 0,
				insuranceBalance: agingSummary._sum.insuranceBalance || 0,
				patientBalance: agingSummary._sum.patientBalance || 0,
			},
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
			},
		});
	} catch (error) {
		console.error("Error fetching accounts receivable:", error);
		return NextResponse.json(
			{ error: "Failed to fetch accounts receivable" },
			{ status: 500 },
		);
	}
}

// POST /api/dashboard/billing/accounts-receivable/refresh - Refresh A/R calculations
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get all patients with outstanding balances
		const patients = await prisma.patient.findMany({
			where: {
				practiceId: user.practiceId,
				outstandingBalance: {
					gt: 0,
				},
			},
			include: {
				ledgerEntries: {
					where: {
						status: "POSTED",
					},
					orderBy: {
						transactionDate: "asc",
					},
				},
			},
		});

		const arUpdates = [];

		for (const patient of patients) {
			// Calculate aging buckets
			const today = new Date();
			let currentBalance = 0;
			let days30Balance = 0;
			let days60Balance = 0;
			let days90Balance = 0;
			let days120PlusBalance = 0;
			let insuranceBalance = 0;
			let patientBalance = 0;

			// Group entries by age and type
			for (const entry of patient.ledgerEntries) {
				const daysDiff = Math.floor(
					(today.getTime() - entry.transactionDate.getTime()) /
						(1000 * 60 * 60 * 24),
				);
				const amount = entry.amount;

				if (amount > 0) {
					// Only positive amounts (charges)
					if (daysDiff <= 30) {
						currentBalance += amount;
					} else if (daysDiff <= 60) {
						days30Balance += amount;
					} else if (daysDiff <= 90) {
						days60Balance += amount;
					} else if (daysDiff <= 120) {
						days90Balance += amount;
					} else {
						days120PlusBalance += amount;
					}

					// Categorize by type
					if (entry.type === "INSURANCE_PAYMENT" || entry.type === "CHARGE") {
						insuranceBalance += amount * 0.7; // Assume 70% insurance responsibility
						patientBalance += amount * 0.3; // Assume 30% patient responsibility
					} else {
						patientBalance += amount;
					}
				}
			}

			const totalBalance =
				currentBalance +
				days30Balance +
				days60Balance +
				days90Balance +
				days120PlusBalance;

			// Determine collection status
			let collectionStatus:
				| "CURRENT"
				| "PAST_DUE"
				| "COLLECTIONS"
				| "BAD_DEBT"
				| "WRITTEN_OFF" = "CURRENT";
			if (days120PlusBalance > 0) {
				collectionStatus = "COLLECTIONS";
			} else if (days90Balance > 0) {
				collectionStatus = "PAST_DUE";
			}

			// Get last payment info
			const lastPayment = patient.ledgerEntries
				.filter((e) => e.type === "PAYMENT" || e.type === "INSURANCE_PAYMENT")
				.sort(
					(a, b) => b.transactionDate.getTime() - a.transactionDate.getTime(),
				)[0];

			arUpdates.push({
				patientId: patient.id,
				totalBalance,
				insuranceBalance,
				patientBalance,
				currentBalance,
				days30Balance,
				days60Balance,
				days90Balance,
				days120PlusBalance,
				lastPaymentDate: lastPayment?.transactionDate,
				lastPaymentAmount: lastPayment ? Math.abs(lastPayment.amount) : null,
				collectionStatus,
			});
		}

		// Batch update accounts receivable
		for (const update of arUpdates) {
			await prisma.accountsReceivable.upsert({
				where: {
					patientId_practiceId: {
						patientId: update.patientId,
						practiceId: user.practiceId,
					},
				},
				update: {
					...update,
					updatedAt: new Date(),
				},
				create: {
					...update,
					practiceId: user.practiceId,
				},
			});
		}

		return NextResponse.json({
			message: "Accounts receivable refreshed successfully",
			updatedAccounts: arUpdates.length,
		});
	} catch (error) {
		console.error("Error refreshing accounts receivable:", error);
		return NextResponse.json(
			{ error: "Failed to refresh accounts receivable" },
			{ status: 500 },
		);
	}
}
