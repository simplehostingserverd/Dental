import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Patient update schema (partial)
const PatientUpdateSchema = z.object({
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().min(10).optional(),
	dateOfBirth: z.string().optional(),
	address: z
		.object({
			street: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			zipCode: z.string().optional(),
		})
		.optional(),
	emergencyContact: z
		.object({
			name: z.string().optional(),
			relationship: z.string().optional(),
			phone: z.string().optional(),
		})
		.optional(),
	insurance: z
		.object({
			provider: z.string().optional(),
			policyNumber: z.string().optional(),
			groupNumber: z.string().optional(),
		})
		.optional(),
	medicalHistory: z
		.object({
			allergies: z.array(z.string()).optional(),
			medications: z.array(z.string()).optional(),
			conditions: z.array(z.string()).optional(),
		})
		.optional(),
});

// GET /api/dashboard/patients/[id] - Get single patient
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
			include: { practice: true },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		const patient = await db.patient.findFirst({
			where: {
				id,
				practiceId: practiceUser.practiceId,
			},
			include: {
				appointments: {
					orderBy: { date: "desc" },
					take: 10,
				},
				treatments: {
					orderBy: { date: "desc" },
					take: 10,
				},
			},
		});

		if (!patient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		return NextResponse.json({ patient });
	} catch (error) {
		console.error("Error fetching patient:", error);
		return NextResponse.json(
			{ error: "Failed to fetch patient" },
			{ status: 500 },
		);
	}
}

// PUT /api/dashboard/patients/[id] - Update single patient
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
			include: { practice: true },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		const body = await request.json();

		// Validate input
		const validatedData = PatientUpdateSchema.parse(body);

		// Check if patient exists and belongs to practice
		const existingPatient = await db.patient.findFirst({
			where: {
				id,
				practiceId: practiceUser.practiceId,
			},
		});

		if (!existingPatient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Update patient
		const updatedPatient = await db.patient.update({
			where: { id },
			data: validatedData,
		});

		return NextResponse.json({
			message: "Patient updated successfully",
			patient: updatedPatient,
		});
	} catch (error) {
		console.error("Error updating patient:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to update patient" },
			{ status: 500 },
		);
	}
}

// DELETE /api/dashboard/patients/[id] - Delete single patient
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
			include: { practice: true },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Check if patient exists and belongs to practice
		const existingPatient = await db.patient.findFirst({
			where: {
				id,
				practiceId: practiceUser.practiceId,
			},
		});

		if (!existingPatient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Delete patient (this will cascade to related records)
		await db.patient.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Patient deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting patient:", error);
		return NextResponse.json(
			{ error: "Failed to delete patient" },
			{ status: 500 },
		);
	}
}
