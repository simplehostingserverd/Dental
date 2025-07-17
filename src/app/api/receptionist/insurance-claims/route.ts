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
		const status = searchParams.get("status");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		const where: {
			practiceId: string;
			patientId?: string;
			status?: string;
			submittedAt?: {
				gte: Date;
				lte: Date;
			};
		} = {
			practiceId: session.user.practiceId,
		};

		if (patientId) {
			where.patientId = patientId;
		}

		if (status) {
			where.status = status;
		}

		if (startDate && endDate) {
			where.submittedAt = {
				gte: new Date(startDate),
				lte: new Date(endDate),
			};
		}

		const claims = await prisma.insuranceClaim.findMany({
			where,
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
						insuranceProvider: true,
						insurancePolicyNumber: true,
					},
				},
				appointment: {
					select: {
						id: true,
						date: true,
						time: true,
						type: true,
					},
				},
			},
			orderBy: {
				submittedAt: "desc",
			},
		});

		return NextResponse.json(claims);
	} catch (error) {
		console.error("Error fetching insurance claims:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			claimNumber,
			amount,
			patientId,
			appointmentId,
			procedureCodes,
			diagnosisCodes,
			notes,
		} = body;

		// Validate required fields
		if (!claimNumber || !amount || !patientId) {
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

		// Check if claim number already exists
		const existingClaim = await prisma.insuranceClaim.findUnique({
			where: { claimNumber },
		});

		if (existingClaim) {
			return NextResponse.json(
				{ error: "Claim number already exists" },
				{ status: 400 },
			);
		}

		// Create insurance claim
		const claim = await prisma.insuranceClaim.create({
			data: {
				claimNumber,
				amount: Number.parseFloat(amount),
				status: "SUBMITTED",
				submittedAt: new Date(),
				notes,
				patientId,
				appointmentId,
				practiceId: session.user.practiceId,
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
						insuranceProvider: true,
						insurancePolicyNumber: true,
					},
				},
				appointment: {
					select: {
						id: true,
						date: true,
						time: true,
						type: true,
					},
				},
			},
		});

		return NextResponse.json(claim, { status: 201 });
	} catch (error) {
		console.error("Error creating insurance claim:", error);
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
		const { id, status, deniedReason, processedAt, notes } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Claim ID is required" },
				{ status: 400 },
			);
		}

		// Verify claim belongs to practice
		const existingClaim = await prisma.insuranceClaim.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingClaim) {
			return NextResponse.json(
				{ error: "Insurance claim not found" },
				{ status: 404 },
			);
		}

		const updateData: {
			status?: string;
			processedAt?: Date;
			deniedReason?: string;
			notes?: string;
		} = {};

		if (status) {
			updateData.status = status;
			if (status === "APPROVED" || status === "DENIED") {
				updateData.processedAt = new Date();
			}
		}

		if (deniedReason) {
			updateData.deniedReason = deniedReason;
		}

		if (processedAt) {
			updateData.processedAt = new Date(processedAt);
		}

		if (notes) {
			updateData.notes = notes;
		}

		const claim = await prisma.insuranceClaim.update({
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
						insuranceProvider: true,
						insurancePolicyNumber: true,
					},
				},
				appointment: {
					select: {
						id: true,
						date: true,
						time: true,
						type: true,
					},
				},
			},
		});

		return NextResponse.json(claim);
	} catch (error) {
		console.error("Error updating insurance claim:", error);
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
				{ error: "Claim ID is required" },
				{ status: 400 },
			);
		}

		// Verify claim belongs to practice
		const existingClaim = await prisma.insuranceClaim.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingClaim) {
			return NextResponse.json(
				{ error: "Insurance claim not found" },
				{ status: 404 },
			);
		}

		await prisma.insuranceClaim.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Insurance claim deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting insurance claim:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
