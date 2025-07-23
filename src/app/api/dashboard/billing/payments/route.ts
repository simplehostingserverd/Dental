import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const recordPaymentSchema = z.object({
	patientId: z.string().min(1, "Patient ID is required"),
	amount: z.number().positive("Amount must be positive"),
	paymentMethod: z.enum([
		"CASH",
		"CHECK",
		"CREDIT_CARD",
		"DEBIT_CARD",
		"ACH",
		"WIRE_TRANSFER",
		"INSURANCE",
	]),
	transactionId: z.string().optional(),
	checkNumber: z.string().optional(),
	invoiceId: z.string().optional(),
	claimId: z.string().optional(),
	notes: z.string().optional(),
	paymentDate: z
		.string()
		.transform((str) => new Date(str))
		.optional(),
});

const createPaymentLinkSchema = z.object({
	patientId: z.string().min(1, "Patient ID is required"),
	amount: z.number().positive("Amount must be positive"),
	description: z.string().min(1, "Description is required"),
	expirationDate: z
		.string()
		.transform((str) => new Date(str))
		.optional(),
});

// GET /api/dashboard/billing/payments - Get payment history
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("patientId");
		const paymentMethod = searchParams.get("paymentMethod");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const limit = Number.parseInt(searchParams.get("limit") || "50");
		const offset = Number.parseInt(searchParams.get("offset") || "0");

		// Get payments from both invoice payments and ledger entries
		const whereClause: any = {
			practiceId: user.practiceId,
		};

		if (patientId) {
			whereClause.patientId = patientId;
		}

		if (startDate || endDate) {
			whereClause.transactionDate = {};
			if (startDate) {
				whereClause.transactionDate.gte = new Date(startDate);
			}
			if (endDate) {
				whereClause.transactionDate.lte = new Date(endDate);
			}
		}

		// Get payment entries from ledger
		const paymentEntries = await prisma.ledgerEntry.findMany({
			where: {
				...whereClause,
				type: {
					in: ["PAYMENT", "INSURANCE_PAYMENT"],
				},
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				transactionDate: "desc",
			},
			take: limit,
			skip: offset,
		});

		// Get invoice payments
		const invoicePayments = await prisma.invoicePayment.findMany({
			where: {
				invoice: {
					practiceId: user.practiceId,
					...(patientId && { patientId }),
				},
				...(startDate || endDate
					? {
							paymentDate: {
								...(startDate && { gte: new Date(startDate) }),
								...(endDate && { lte: new Date(endDate) }),
							},
						}
					: {}),
				...(paymentMethod && { paymentMethod }),
			},
			include: {
				invoice: {
					include: {
						patient: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
							},
						},
					},
				},
			},
			orderBy: {
				paymentDate: "desc",
			},
			take: limit,
			skip: offset,
		});

		// Combine and format payments
		const allPayments = [
			...paymentEntries.map((entry) => ({
				id: entry.id,
				type: "ledger_entry",
				patientId: entry.patientId,
				patientName: `${entry.patient.firstName} ${entry.patient.lastName}`,
				amount: Math.abs(entry.amount),
				paymentMethod:
					entry.type === "INSURANCE_PAYMENT" ? "INSURANCE" : "UNKNOWN",
				paymentDate: entry.transactionDate,
				description: entry.description,
				notes: entry.notes,
				transactionId: entry.paymentId,
			})),
			...invoicePayments.map((payment) => ({
				id: payment.id,
				type: "invoice_payment",
				patientId: payment.invoice.patientId,
				patientName: `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`,
				amount: payment.amount,
				paymentMethod: payment.paymentMethod,
				paymentDate: payment.paymentDate,
				description: `Payment for Invoice ${payment.invoice.invoiceNumber}`,
				notes: payment.notes,
				transactionId: payment.transactionId,
				invoiceId: payment.invoiceId,
			})),
		].sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());

		// Calculate payment summary
		const summary = await prisma.ledgerEntry.aggregate({
			where: {
				practiceId: user.practiceId,
				type: {
					in: ["PAYMENT", "INSURANCE_PAYMENT"],
				},
				...(startDate || endDate
					? {
							transactionDate: {
								...(startDate && { gte: new Date(startDate) }),
								...(endDate && { lte: new Date(endDate) }),
							},
						}
					: {}),
			},
			_sum: {
				amount: true,
			},
			_count: {
				id: true,
			},
		});

		return NextResponse.json({
			payments: allPayments.slice(0, limit),
			summary: {
				totalPayments: summary._count.id,
				totalAmount: Math.abs(summary._sum.amount || 0),
			},
			pagination: {
				total: allPayments.length,
				limit,
				offset,
				hasMore: offset + limit < allPayments.length,
			},
		});
	} catch (error) {
		console.error("Error fetching payments:", error);
		return NextResponse.json(
			{ error: "Failed to fetch payments" },
			{ status: 500 },
		);
	}
}

// POST /api/dashboard/billing/payments - Record new payment
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = recordPaymentSchema.parse(body);

		// Verify patient belongs to practice
		const patient = await prisma.patient.findFirst({
			where: {
				id: validatedData.patientId,
				practiceId: user.practiceId,
			},
		});

		if (!patient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Start transaction to record payment
		const result = await prisma.$transaction(async (tx) => {
			// Create ledger entry for payment
			const ledgerEntry = await tx.ledgerEntry.create({
				data: {
					patientId: validatedData.patientId,
					practiceId: user.practiceId,
					type:
						validatedData.paymentMethod === "INSURANCE"
							? "INSURANCE_PAYMENT"
							: "PAYMENT",
					description: `Payment - ${validatedData.paymentMethod}${validatedData.checkNumber ? ` (Check #${validatedData.checkNumber})` : ""}`,
					amount: -validatedData.amount, // Negative for payment
					balance: 0, // Will be calculated
					transactionDate: validatedData.paymentDate || new Date(),
					paymentId: validatedData.transactionId,
					notes: validatedData.notes,
					createdBy: user.id,
					status: "POSTED",
				},
			});

			// Update patient balance
			const currentBalance = patient.outstandingBalance || 0;
			const newBalance = currentBalance - validatedData.amount;

			await tx.patient.update({
				where: { id: validatedData.patientId },
				data: {
					outstandingBalance: Math.max(0, newBalance),
				},
			});

			// Update ledger entry with new balance
			await tx.ledgerEntry.update({
				where: { id: ledgerEntry.id },
				data: {
					balance: Math.max(0, newBalance),
				},
			});

			// If payment is for specific invoice, record invoice payment
			if (validatedData.invoiceId) {
				const invoice = await tx.patientInvoice.findFirst({
					where: {
						id: validatedData.invoiceId,
						patientId: validatedData.patientId,
						practiceId: user.practiceId,
					},
				});

				if (invoice) {
					await tx.invoicePayment.create({
						data: {
							invoiceId: validatedData.invoiceId,
							amount: validatedData.amount,
							paymentDate: validatedData.paymentDate || new Date(),
							paymentMethod: validatedData.paymentMethod,
							transactionId: validatedData.transactionId,
							notes: validatedData.notes,
						},
					});

					// Update invoice paid amount and status
					const newPaidAmount = invoice.paidAmount + validatedData.amount;
					const newRemainingBalance = invoice.totalAmount - newPaidAmount;
					const newStatus =
						newRemainingBalance <= 0
							? "PAID"
							: newPaidAmount > 0
								? "PARTIAL"
								: invoice.status;

					await tx.patientInvoice.update({
						where: { id: validatedData.invoiceId },
						data: {
							paidAmount: newPaidAmount,
							remainingBalance: Math.max(0, newRemainingBalance),
							status: newStatus,
						},
					});
				}
			}

			return ledgerEntry;
		});

		return NextResponse.json(
			{
				payment: result,
				message: "Payment recorded successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Error recording payment:", error);
		return NextResponse.json(
			{ error: "Failed to record payment" },
			{ status: 500 },
		);
	}
}
