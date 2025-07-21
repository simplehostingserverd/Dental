import { db } from "@/server/db";
import { hashPassword } from "@/lib/auth/password";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		// Only allow in development
		if (process.env.NODE_ENV !== "development") {
			return NextResponse.json(
				{ error: "This endpoint is only available in development" },
				{ status: 403 }
			);
		}

		// First, create a default practice if it doesn't exist
		let practice = await db.practice.findFirst();
		if (!practice) {
			practice = await db.practice.create({
				data: {
					name: "Cognident Demo Practice",
					email: "demo@cognident.org",
					phone: "(555) 123-4567",
					timezone: "America/New_York",
				},
			});
		}

		// Hash passwords for test users
		const johnPassword = await hashPassword("PatientPass123!");
		const alicePassword = await hashPassword("PatientPass456!");
		const robertPassword = await hashPassword("PatientPass789!");

		// Create test patient users and patients
		const testUsers = [
			{
				email: "john.doe@email.com",
				password: johnPassword,
				firstName: "John",
				lastName: "Doe",
				dateOfBirth: new Date("1985-06-15"),
				phone: "(555) 301-4001",
			},
			{
				email: "alice.johnson@email.com",
				password: alicePassword,
				firstName: "Alice",
				lastName: "Johnson",
				dateOfBirth: new Date("1992-03-22"),
				phone: "(555) 301-4003",
			},
			{
				email: "robert.smith@email.com",
				password: robertPassword,
				firstName: "Robert",
				lastName: "Smith",
				dateOfBirth: new Date("1978-11-08"),
				phone: "(555) 301-4005",
			},
		];

		const createdUsers = [];

		for (const userData of testUsers) {
			// Check if user already exists
			const existingUser = await db.patientUser.findUnique({
				where: { email: userData.email },
			});

			if (!existingUser) {
				// Create patient user and patient in a transaction
				const result = await db.$transaction(async (tx) => {
					// Create patient user account
					const patientUser = await tx.patientUser.create({
						data: {
							email: userData.email,
							password: userData.password,
							isActive: true,
						},
					});

					// Create patient record
					const patient = await tx.patient.create({
						data: {
							firstName: userData.firstName,
							lastName: userData.lastName,
							dateOfBirth: userData.dateOfBirth,
							gender: "Not specified",
							phone: userData.phone,
							email: userData.email,
							practiceId: practice.id,
							patientUserId: patientUser.id,
						},
					});

					return { patientUser, patient };
				});

				createdUsers.push({
					email: userData.email,
					firstName: userData.firstName,
					lastName: userData.lastName,
					patientId: result.patient.id,
					userId: result.patientUser.id,
				});
			}
		}

		return NextResponse.json({
			success: true,
			message: `Created ${createdUsers.length} test patient users`,
			users: createdUsers,
			practice: {
				id: practice.id,
				name: practice.name,
			},
		});
	} catch (error) {
		console.error("Error creating sample users:", error);
		return NextResponse.json(
			{
				error: "Failed to create sample users",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
