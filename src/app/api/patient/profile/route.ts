import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "patient") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the patient record
		const patient = await db.patient.findUnique({
			where: { patientUserId: user.id },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient record not found" },
				{ status: 404 },
			);
		}

		// Parse JSON fields safely
		const address = patient.address as Record<string, unknown> | null;
		const emergencyContact = patient.emergencyContact as Record<
			string,
			unknown
		> | null;
		const insurance = patient.insurance as Record<string, unknown> | null;
		const medicalHistory = patient.medicalHistory as Record<
			string,
			unknown
		> | null;

		// Format the profile data
		const profile = {
			firstName: patient.firstName,
			lastName: patient.lastName,
			email: patient.email || "",
			phone: patient.phone || "",
			dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
			gender: patient.gender,
			address: address || {},
			emergencyContact: emergencyContact || {},
			insurance: insurance || {},
			medicalHistory: medicalHistory || {},
		};

		return NextResponse.json({
			success: true,
			profile,
		});
	} catch (error) {
		console.error("Error fetching profile:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "patient") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			firstName,
			lastName,
			email,
			phone,
			dateOfBirth,
			gender,
			address,
			city,
			state,
			zipCode,
			emergencyContact,
			emergencyPhone,
			insurance,
			insuranceProvider,
			insurancePolicyNumber,
		} = body;

		// Validate required fields
		if (!firstName || !lastName || !dateOfBirth || !gender) {
			return NextResponse.json(
				{
					error:
						"First name, last name, date of birth, and gender are required",
				},
				{ status: 400 },
			);
		}

		// Find the patient record
		const patient = await db.patient.findUnique({
			where: { patientUserId: user.id },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient record not found" },
				{ status: 404 },
			);
		}

		// Update the patient record
		// Prepare JSON fields
		const addressData = address
			? {
					street: address,
					city: city || "",
					state: state || "",
					zipCode: zipCode || "",
				}
			: null;

		const emergencyContactData = emergencyContact
			? {
					name: emergencyContact,
					phone: emergencyPhone || "",
				}
			: null;

		const insuranceData = insurance
			? {
					provider: insurance,
					policyNumber: insurancePolicyNumber || "",
				}
			: null;

		const updatedPatient = await db.patient.update({
			where: { id: patient.id },
			data: {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email?.trim() || null,
				phone: phone?.trim() || null,
				dateOfBirth: new Date(dateOfBirth),
				gender: gender.trim(),
				...(addressData && { address: addressData }),
				...(emergencyContactData && { emergencyContact: emergencyContactData }),
				...(insuranceData && { insurance: insuranceData }),
			},
		});

		// Also update the patient user email if it changed
		if (email && email.trim() !== user.email) {
			await db.patientUser.update({
				where: { id: user.id },
				data: {
					email: email.trim(),
				},
			});
		}

		return NextResponse.json({
			success: true,
			message: "Profile updated successfully",
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
