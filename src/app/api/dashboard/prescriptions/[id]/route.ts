import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the practice user record
		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Find the prescription and verify it belongs to this practice
		const prescription = await db.prescription.findFirst({
			where: {
				id: id,
				patient: {
					practiceId: practiceUser.practiceId,
				},
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

		if (!prescription) {
			return NextResponse.json(
				{
					error: "Prescription not found or not associated with your practice",
				},
				{ status: 404 },
			);
		}

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
		console.error("Error fetching prescription:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { drugName, dosage } = body;

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

		// Find the practice user record
		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Find the prescription and verify it belongs to this practice
		const prescription = await db.prescription.findFirst({
			where: {
				id: id,
				patient: {
					practiceId: practiceUser.practiceId,
				},
			},
		});

		if (!prescription) {
			return NextResponse.json(
				{
					error: "Prescription not found or not associated with your practice",
				},
				{ status: 404 },
			);
		}

		// Update the prescription
		const updatedPrescription = await db.prescription.update({
			where: { id: id },
			data: {
				drugName: drugName.trim(),
				dosage: dosage.trim(),
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
				id: updatedPrescription.id,
				drugName: updatedPrescription.drugName,
				dosage: updatedPrescription.dosage,
				issuedAt: updatedPrescription.issuedAt.toISOString(),
				patientId: updatedPrescription.patientId,
				patient: {
					id: updatedPrescription.patient.id,
					firstName: updatedPrescription.patient.firstName,
					lastName: updatedPrescription.patient.lastName,
					email: updatedPrescription.patient.email,
					dateOfBirth: updatedPrescription.patient.dateOfBirth.toISOString(),
				},
			},
		});
	} catch (error) {
		console.error("Error updating prescription:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the practice user record
		const practiceUser = await db.practiceUser.findFirst({
			where: { email: user.email },
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "Practice user record not found" },
				{ status: 404 },
			);
		}

		// Find the prescription and verify it belongs to this practice
		const prescription = await db.prescription.findFirst({
			where: {
				id: id,
				patient: {
					practiceId: practiceUser.practiceId,
				},
			},
		});

		if (!prescription) {
			return NextResponse.json(
				{
					error: "Prescription not found or not associated with your practice",
				},
				{ status: 404 },
			);
		}

		// Delete the prescription
		await db.prescription.delete({
			where: { id: id },
		});

		return NextResponse.json({
			success: true,
			message: "Prescription deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting prescription:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
