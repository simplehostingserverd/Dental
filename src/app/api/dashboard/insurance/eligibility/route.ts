import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createEligibilityCheckSchema = z.object({
	patientId: z.string().min(1, "Patient ID is required"),
	payerId: z.string().min(1, "Payer ID is required"),
	patientInsuranceId: z.string().optional(),
	serviceDate: z.string().transform((str) => new Date(str)),
});

// GET /api/dashboard/insurance/eligibility - Get eligibility checks
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("patientId");
		const payerId = searchParams.get("payerId");
		const status = searchParams.get("status");
		const limit = Number.parseInt(searchParams.get("limit") || "50");
		const offset = Number.parseInt(searchParams.get("offset") || "0");

		const where: any = {
			practiceId: user.practiceId,
		};

		if (patientId) {
			where.patientId = patientId;
		}

		if (payerId) {
			where.payerId = payerId;
		}

		if (status) {
			where.status = status;
		}

		const [eligibilityChecks, total] = await Promise.all([
			prisma.eligibilityCheck.findMany({
				where,
				include: {
					patient: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							dateOfBirth: true,
						},
					},
					payer: {
						select: {
							id: true,
							name: true,
							payerCode: true,
						},
					},
					patientInsurance: {
						select: {
							id: true,
							policyNumber: true,
							groupNumber: true,
						},
					},
				},
				orderBy: {
					requestedAt: "desc",
				},
				take: limit,
				skip: offset,
			}),
			prisma.eligibilityCheck.count({ where }),
		]);

		return NextResponse.json({
			eligibilityChecks,
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
			},
		});
	} catch (error) {
		console.error("Error fetching eligibility checks:", error);
		return NextResponse.json(
			{ error: "Failed to fetch eligibility checks" },
			{ status: 500 },
		);
	}
}

// POST /api/dashboard/insurance/eligibility - Create new eligibility check
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = createEligibilityCheckSchema.parse(body);

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

		// Verify payer belongs to practice
		const payer = await prisma.insurancePayer.findFirst({
			where: {
				id: validatedData.payerId,
				practiceId: user.practiceId,
			},
		});

		if (!payer) {
			return NextResponse.json({ error: "Payer not found" }, { status: 404 });
		}

		// Create eligibility check
		const eligibilityCheck = await prisma.eligibilityCheck.create({
			data: {
				...validatedData,
				practiceId: user.practiceId,
				status: "PENDING",
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						dateOfBirth: true,
					},
				},
				payer: {
					select: {
						id: true,
						name: true,
						payerCode: true,
						eligibilityEndpoint: true,
					},
				},
				patientInsurance: {
					select: {
						id: true,
						policyNumber: true,
						groupNumber: true,
						subscriberId: true,
					},
				},
			},
		});

		// TODO: Implement actual eligibility verification with clearinghouse
		// For now, we'll simulate the process
		setTimeout(async () => {
			try {
				// Simulate eligibility response
				const mockResponse = {
					copay: 25.0,
					deductible: 500.0,
					deductibleRemaining: 350.0,
					annualMaximum: 1500.0,
					benefitsRemaining: 1200.0,
					coveragePercentages: {
						preventive: 100,
						basic: 80,
						major: 50,
						orthodontic: 50,
					},
				};

				await prisma.eligibilityCheck.update({
					where: { id: eligibilityCheck.id },
					data: {
						status: "VERIFIED",
						respondedAt: new Date(),
						benefits: mockResponse,
						copay: mockResponse.copay,
						deductible: mockResponse.deductible,
						deductibleRemaining: mockResponse.deductibleRemaining,
						annualMaximum: mockResponse.annualMaximum,
						benefitsRemaining: mockResponse.benefitsRemaining,
						coveragePercentages: mockResponse.coveragePercentages,
					},
				});
			} catch (error) {
				console.error("Error updating eligibility check:", error);
			}
		}, 2000); // Simulate 2-second delay

		return NextResponse.json({ eligibilityCheck }, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Error creating eligibility check:", error);
		return NextResponse.json(
			{ error: "Failed to create eligibility check" },
			{ status: 500 },
		);
	}
}
