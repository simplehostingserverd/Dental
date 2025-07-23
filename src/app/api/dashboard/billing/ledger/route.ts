import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createLedgerEntrySchema = z.object({
	patientId: z.string().min(1, "Patient ID is required"),
	type: z.enum([
		"CHARGE",
		"PAYMENT",
		"ADJUSTMENT",
		"REFUND",
		"INSURANCE_PAYMENT",
		"WRITEOFF",
		"TRANSFER",
	]),
	description: z.string().min(1, "Description is required"),
	procedureCode: z.string().optional(),
	amount: z.number().refine((val) => val !== 0, "Amount cannot be zero"),
	invoiceId: z.string().optional(),
	claimId: z.string().optional(),
	paymentId: z.string().optional(),
	notes: z.string().optional(),
	transactionDate: z
		.string()
		.transform((str) => new Date(str))
		.optional(),
});

const updateLedgerEntrySchema = z.object({
	status: z.enum(["PENDING", "POSTED", "REVERSED", "VOIDED"]).optional(),
	notes: z.string().optional(),
});

// GET /api/dashboard/billing/ledger - Get ledger entries
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("patientId");
		const type = searchParams.get("type");
		const status = searchParams.get("status");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const limit = Number.parseInt(searchParams.get("limit") || "100");
		const offset = Number.parseInt(searchParams.get("offset") || "0");

		const where: any = {
			practiceId: user.practiceId,
		};

		if (patientId) {
			where.patientId = patientId;
		}

		if (type) {
			where.type = type;
		}

		if (status) {
			where.status = status;
		}

		if (startDate || endDate) {
			where.transactionDate = {};
			if (startDate) {
				where.transactionDate.gte = new Date(startDate);
			}
			if (endDate) {
				where.transactionDate.lte = new Date(endDate);
			}
		}

		const [entries, total] = await Promise.all([
			prisma.ledgerEntry.findMany({
				where,
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
			}),
			prisma.ledgerEntry.count({ where }),
		]);

		// Calculate running balance for each entry
		let runningBalance = 0;
		const entriesWithBalance = entries.map((entry) => {
			runningBalance += entry.amount;
			return {
				...entry,
				runningBalance,
			};
		});

		return NextResponse.json({
			entries: entriesWithBalance,
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
			},
		});
	} catch (error) {
		console.error("Error fetching ledger entries:", error);
		return NextResponse.json(
			{ error: "Failed to fetch ledger entries" },
			{ status: 500 },
		);
	}
}

// POST /api/dashboard/billing/ledger - Create new ledger entry
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = createLedgerEntrySchema.parse(body);

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

		// Get current patient balance
		const lastEntry = await prisma.ledgerEntry.findFirst({
			where: {
				patientId: validatedData.patientId,
				status: "POSTED",
			},
			orderBy: {
				transactionDate: "desc",
			},
		});

		const currentBalance = lastEntry?.balance || 0;
		const newBalance = currentBalance + validatedData.amount;

		// Create ledger entry
		const entry = await prisma.ledgerEntry.create({
			data: {
				...validatedData,
				practiceId: user.practiceId,
				transactionDate: validatedData.transactionDate || new Date(),
				balance: newBalance,
				createdBy: user.id,
				status: "PENDING",
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
		});

		// Update patient's outstanding balance
		await prisma.patient.update({
			where: { id: validatedData.patientId },
			data: {
				outstandingBalance: newBalance,
			},
		});

		return NextResponse.json({ entry }, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Error creating ledger entry:", error);
		return NextResponse.json(
			{ error: "Failed to create ledger entry" },
			{ status: 500 },
		);
	}
}
