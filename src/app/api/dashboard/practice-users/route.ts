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
		const role = url.searchParams.get("role"); // filter by role
		const activeOnly = url.searchParams.get("activeOnly") !== "false"; // default to active only

		// Build where clause
		const whereClause: any = {
			practiceId: practiceUser.practiceId,
		};

		// Add role filter
		if (role) {
			(whereClause as { role: string }).role = role.toUpperCase();
		}

		// Add active filter
		if (activeOnly) {
			(whereClause as { isActive: boolean }).isActive = true;
		}

		// Get practice users
		const users = await db.practiceUser.findMany({
			where: whereClause,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				role: true,
				isActive: true,
			},
			orderBy: [{ role: "asc" }, { lastName: "asc" }, { firstName: "asc" }],
		});

		return NextResponse.json({
			success: true,
			users: users.map((user) => ({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
				isActive: user.isActive,
				fullName: `${user.firstName} ${user.lastName}`,
			})),
		});
	} catch (error) {
		console.error("Error fetching practice users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
