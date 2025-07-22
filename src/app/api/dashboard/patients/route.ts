import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Patient validation schema
const PatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Emergency contact phone is required"),
  }).optional(),
  insurance: z.object({
    provider: z.string().optional(),
    policyNumber: z.string().optional(),
    groupNumber: z.string().optional(),
  }).optional(),
  medicalHistory: z.object({
    allergies: z.array(z.string()).default([]),
    medications: z.array(z.string()).default([]),
    conditions: z.array(z.string()).default([]),
  }).optional(),
});

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the practice user record
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

		// Get URL search parameters for filtering
		const url = new URL(request.url);
		const search = url.searchParams.get("search"); // search term
		const limit = url.searchParams.get("limit"); // limit results

		// Build where clause
		const whereClause: {
			practiceId: string;
		} = {
			practiceId: practiceUser.practiceId,
		};

		// Get patients for this practice
		let patients = await db.patient.findMany({
			where: whereClause,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true,
				dateOfBirth: true,
			},
			orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
			take: limit ? Number.parseInt(limit) : undefined,
		});

		// Filter by search term if provided
		if (search) {
			const searchLower = search.toLowerCase();
			patients = patients.filter(
				(patient) =>
					patient.firstName.toLowerCase().includes(searchLower) ||
					patient.lastName.toLowerCase().includes(searchLower) ||
					patient.email?.toLowerCase().includes(searchLower) ||
					patient.phone?.toLowerCase().includes(searchLower),
			);
		}

		return NextResponse.json({
			success: true,
			patients: patients.map((patient) => ({
				id: patient.id,
				firstName: patient.firstName,
				lastName: patient.lastName,
				email: patient.email,
				phone: patient.phone,
				dateOfBirth: patient.dateOfBirth,
			})),
		});
	} catch (error) {
		console.error("Error fetching patients:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// POST /api/dashboard/patients - Create new patient
export async function POST(request: NextRequest) {
	try {
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
		const validatedData = PatientSchema.parse(body);

		// Check if patient already exists
		const existingPatient = await db.patient.findFirst({
			where: {
				email: validatedData.email,
				practiceId: practiceUser.practiceId
			},
		});

		if (existingPatient) {
			return NextResponse.json(
				{ error: "Patient with this email already exists" },
				{ status: 400 }
			);
		}

		// Create new patient
		const newPatient = await db.patient.create({
			data: {
				...validatedData,
				practiceId: practiceUser.practiceId,
			},
		});

		return NextResponse.json(
			{
				message: "Patient created successfully",
				patient: newPatient
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating patient:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: error.errors
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to create patient" },
			{ status: 500 }
		);
	}
}

// PUT /api/dashboard/patients - Update patients (bulk update)
export async function PUT(request: NextRequest) {
	try {
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
		const { patientIds, updates } = body;

		if (!patientIds || !Array.isArray(patientIds)) {
			return NextResponse.json(
				{ error: "Patient IDs array is required" },
				{ status: 400 }
			);
		}

		// Update patients
		const updatedPatients = await db.patient.updateMany({
			where: {
				id: { in: patientIds },
				practiceId: practiceUser.practiceId,
			},
			data: updates,
		});

		return NextResponse.json({
			message: `Updated ${updatedPatients.count} patients`,
			count: updatedPatients.count,
		});
	} catch (error) {
		console.error("Error updating patients:", error);
		return NextResponse.json(
			{ error: "Failed to update patients" },
			{ status: 500 }
		);
	}
}

// DELETE /api/dashboard/patients - Delete patients (bulk delete)
export async function DELETE(request: NextRequest) {
	try {
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
		const { patientIds } = body;

		if (!patientIds || !Array.isArray(patientIds)) {
			return NextResponse.json(
				{ error: "Patient IDs array is required" },
				{ status: 400 }
			);
		}

		// Delete patients
		const deletedPatients = await db.patient.deleteMany({
			where: {
				id: { in: patientIds },
				practiceId: practiceUser.practiceId,
			},
		});

		return NextResponse.json({
			message: `Deleted ${deletedPatients.count} patients`,
			deletedCount: deletedPatients.count,
		});
	} catch (error) {
		console.error("Error deleting patients:", error);
		return NextResponse.json(
			{ error: "Failed to delete patients" },
			{ status: 500 }
		);
	}
}
