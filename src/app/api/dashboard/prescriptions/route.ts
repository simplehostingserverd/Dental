import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the practice user record
		const practiceUser = await db.practiceUser.findUnique({
			where: { practiceUserId: user.id },
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
		const patientId = url.searchParams.get("patientId"); // specific patient
		const limit = url.searchParams.get("limit"); // limit results

		// Build where clause
		const whereClause: unknown = {
			patient: {
				practiceId: practiceUser.practiceId,
			},
		};

		// Add patient filter
		if (patientId) {
			(whereClause as { patientId: string }).patientId = patientId;
		}

		// Get prescriptions for this practice
		const prescriptions = await db.prescription.findMany({
			where: whereClause,
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						dateOfBirth: true,
					},
				},
			},
			orderBy: {
				issuedAt: "desc",
			},
			take: limit ? Number.parseInt(limit) : undefined,
		});

		// Filter by search term if provided
		let filteredPrescriptions = prescriptions;
		if (search) {
			const searchLower = search.toLowerCase();
			filteredPrescriptions = prescriptions.filter(
				(prescription) =>
					prescription.drugName.toLowerCase().includes(searchLower) ||
					prescription.dosage.toLowerCase().includes(searchLower) ||
					prescription.patient.firstName.toLowerCase().includes(searchLower) ||
					prescription.patient.lastName.toLowerCase().includes(searchLower) ||
					prescription.patient.email?.toLowerCase().includes(searchLower),
			);
		}

		return NextResponse.json({
			success: true,
			prescriptions: filteredPrescriptions.map((prescription) => ({
				id: prescription.id,
				drugName: prescription.drugName,
				dosage: prescription.dosage,
				issuedAt: prescription.issuedAt.toISOString(),
				patientId: prescription.patientId,
				patient: {
					id: prescription.patient.id,
					firstName: prescription.patient.firstName,
					lastName: prescription.patient.lastName,
					email: prescription.patient.email,
					dateOfBirth: prescription.patient.dateOfBirth.toISOString(),
				},
			})),
		});
	} catch (error) {
		console.error("Error fetching prescriptions:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { drugName, dosage, patientId } = body;

		// Validate required fields
		if (!drugName || !drugName.trim()) {
			return NextResponse.json(
				{ error: "Drug name is required" },
				{ status: 400 },
			);
		}

		if (!dosage || !dosage.trim()) {
			return NextResponse.json(
				{ error: "Dosage is required" },
				{ status: 400 },
			);
		}

		if (!patientId) {
			return NextResponse.json(
				{ error: "Patient ID is required" },
				{ status: 400 },
			);
		}

		// Find the practice user record
		const practiceUser = await db.practiceUser.findUnique({
			where: { practiceUserId: user.id },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Verify the patient belongs to this practice
		const patient = await db.patient.findFirst({
			where: {
				id: patientId,
				practiceId: practiceUser.practiceId,
			},
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Create the prescription
		const prescription = await db.prescription.create({
			data: {
				drugName: drugName.trim(),
				dosage: dosage.trim(),
				patientId: patient.id,
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						dateOfBirth: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			prescription: {
				id: prescription.id,
				drugName: prescription.drugName,
				dosage: prescription.dosage,
				issuedAt: prescription.issuedAt.toISOString(),
				patientId: prescription.patientId,
				patient: {
					id: prescription.patient.id,
					firstName: prescription.patient.firstName,
					lastName: prescription.patient.lastName,
					email: prescription.patient.email,
					dateOfBirth: prescription.patient.dateOfBirth.toISOString(),
				},
			},
		});
	} catch (error) {
		console.error("Error creating prescription:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
