import { createSampleUsers } from "@/scripts/create-sample-users";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Only allow in development
		if (process.env.NODE_ENV !== "development") {
			return NextResponse.json(
				{ error: "Sample user creation only available in development" },
				{ status: 403 },
			);
		}

		console.log("👥 Creating sample users...");
		await createSampleUsers();

		return NextResponse.json({
			success: true,
			message: "Sample users created successfully",
			practiceLogins: [
				{
					role: "ADMIN",
					email: "admin@dentalcloud.com",
					password: "Admin123!",
				},
				{
					role: "DOCTOR",
					email: "doctor@dentalcloud.com",
					password: "Doctor123!",
				},
				{
					role: "HYGIENIST",
					email: "hygienist@dentalcloud.com",
					password: "Hygienist123!",
				},
				{
					role: "STAFF",
					email: "staff@dentalcloud.com",
					password: "Staff123!",
				},
				{
					role: "RECEPTIONIST",
					email: "receptionist@dentalcloud.com",
					password: "Reception123!",
				},
			],
			patientLogins: [
				{ email: "patient1@example.com", password: "Patient123!" },
				{ email: "patient2@example.com", password: "Patient123!" },
			],
			urls: {
				practiceLogin: "/auth/signin",
				patientLogin: "/patient/auth/signin",
			},
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Sample user creation error:", error);
		return NextResponse.json(
			{
				error: "Failed to create sample users",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
