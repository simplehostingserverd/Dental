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
		const whereClause: any = {
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
