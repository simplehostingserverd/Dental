import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

// Polling endpoint for real-time updates
export async function GET(request: NextRequest) {
	try {
		// Check authentication
		const user = await getCurrentUser();
		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const lastUpdate = searchParams.get("lastUpdate");
		const types = searchParams.get("types")?.split(",") || [
			"appointments",
			"patients",
			"tasks",
		];

		interface UpdateItem {
			type: string;
			action: string;
			data: Record<string, unknown>;
			timestamp: Date;
		}

		const updates: UpdateItem[] = [];
		const since = lastUpdate
			? new Date(lastUpdate)
			: new Date(Date.now() - 60000); // Last minute

		// Get recent appointment updates
		if (types.includes("appointments")) {
			const appointments = await db.appointment.findMany({
				where: {
					practiceUser: {
						practiceId: user.practiceId,
					},
					updatedAt: { gte: since },
				},
				include: {
					patient: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							phone: true,
						},
					},
				},
				orderBy: { updatedAt: "desc" },
				take: 10,
			});

			updates.push(
				...appointments.map((apt) => ({
					type: "appointment",
					action: "update",
					data: apt,
					timestamp: apt.updatedAt,
				})),
			);
		}

		// Get recent patient updates
		if (types.includes("patients")) {
			const patients = await db.patient.findMany({
				where: {
					practiceId: user.practiceId,
					updatedAt: { gte: since },
				},
				select: {
					id: true,
					firstName: true,
					lastName: true,
					phone: true,
					updatedAt: true,
				},
				orderBy: { updatedAt: "desc" },
				take: 10,
			});

			updates.push(
				...patients.map((patient) => ({
					type: "patient",
					action: "update",
					data: patient,
					timestamp: patient.updatedAt,
				})),
			);
		}

		// Get recent task updates (if you have a tasks table)
		if (types.includes("tasks")) {
			// This would require a tasks table in your schema
			// For now, we'll return empty array
			// const tasks = await db.task.findMany({ ... });
		}

		return NextResponse.json({
			updates: updates.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
			),
			timestamp: new Date().toISOString(),
			hasMore: updates.length === 10,
		});
	} catch (error) {
		console.error("Polling endpoint error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch updates" },
			{ status: 500 },
		);
	}
}
