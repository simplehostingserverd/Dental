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
			createdAt?: {
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
			where.createdAt = {
				gte: new Date(startDate),
				lte: new Date(endDate),
			};
		}

		const payments = await prisma.payment.findMany({
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
				invoice: {
					select: {
						id: true,
						total: true,
						status: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(payments);
	} catch (error) {
		console.error("Error fetching payments:", error);
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
			amount,
			paymentMethod,
			patientId,
			invoiceId,
			transactionId,
			notes,
		} = body;

		// Validate required fields
		if (!amount || !paymentMethod || !patientId) {
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

		// Create payment
		const payment = await prisma.payment.create({
			data: {
				amount: Number.parseFloat(amount),
				paymentMethod,
				status: "COMPLETED",
				transactionId,
				notes,
				patientId,
				invoiceId,
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
					},
				},
				invoice: {
					select: {
						id: true,
						total: true,
						status: true,
					},
				},
			},
		});

		// Update invoice status if payment is linked to an invoice
		if (invoiceId) {
			const invoice = await prisma.invoice.findUnique({
				where: { id: invoiceId },
				include: { payments: true },
			});

			if (invoice) {
				const totalPaid = invoice.payments.reduce(
					(sum, p) => sum + p.amount,
					0,
				);

				if (totalPaid >= invoice.total) {
					await prisma.invoice.update({
						where: { id: invoiceId },
						data: { paid: true, status: "PAID" },
					});
				}
			}
		}

		return NextResponse.json(payment, { status: 201 });
	} catch (error) {
		console.error("Error creating payment:", error);
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
		const { id, status, notes } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Payment ID is required" },
				{ status: 400 },
			);
		}

		// Verify payment belongs to practice
		const existingPayment = await prisma.payment.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingPayment) {
			return NextResponse.json({ error: "Payment not found" }, { status: 404 });
		}

		const payment = await prisma.payment.update({
			where: { id },
			data: {
				...(status && { status }),
				...(notes && { notes }),
				updatedAt: new Date(),
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
				invoice: {
					select: {
						id: true,
						total: true,
						status: true,
					},
				},
			},
		});

		return NextResponse.json(payment);
	} catch (error) {
		console.error("Error updating payment:", error);
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
				{ error: "Payment ID is required" },
				{ status: 400 },
			);
		}

		// Verify payment belongs to practice
		const existingPayment = await prisma.payment.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingPayment) {
			return NextResponse.json({ error: "Payment not found" }, { status: 404 });
		}

		await prisma.payment.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Payment deleted successfully" });
	} catch (error) {
		console.error("Error deleting payment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
