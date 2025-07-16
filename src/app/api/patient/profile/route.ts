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

		// Format the profile data
		const profile = {
			firstName: patient.firstName,
			lastName: patient.lastName,
			email: patient.email || "",
			phone: patient.phone || "",
			dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
			gender: patient.gender,
			address: patient.address || "",
			city: patient.city || "",
			state: patient.state || "",
			zipCode: patient.zipCode || "",
			emergencyContact: patient.emergencyContact || "",
			emergencyPhone: patient.emergencyPhone || "",
			insurance: patient.insurance || "",
			insuranceProvider: patient.insuranceProvider || "",
			insurancePolicyNumber: patient.insurancePolicyNumber || "",
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
		const updatedPatient = await db.patient.update({
			where: { id: patient.id },
			data: {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email?.trim() || null,
				phone: phone?.trim() || null,
				dateOfBirth: new Date(dateOfBirth),
				gender: gender.trim(),
				address: address?.trim() || null,
				city: city?.trim() || null,
				state: state?.trim() || null,
				zipCode: zipCode?.trim() || null,
				emergencyContact: emergencyContact?.trim() || null,
				emergencyPhone: emergencyPhone?.trim() || null,
				insurance: insurance?.trim() || null,
				insuranceProvider: insuranceProvider?.trim() || null,
				insurancePolicyNumber: insurancePolicyNumber?.trim() || null,
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
