import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		
		if (!user || user.type !== "patient") {
			return NextResponse.json(
				{ error: "Not authenticated as patient" },
				{ status: 401 }
			);
		}

		// Fetch patient data including upcoming appointments, messages, and statistics
		const patient = await db.patient.findUnique({
			where: { patientUserId: user.id },
			include: {
				appointments: {
					where: {
						start: { gte: new Date() },
						status: { notIn: ["CANCELED", "COMPLETED"] }
					},
					include: {
						practiceUser: {
							select: {
								firstName: true,
								lastName: true
							}
						}
					},
					orderBy: { start: "asc" },
					take: 3
				},
				messages: {
					include: {
						sender: {
							select: {
								firstName: true,
								lastName: true
							}
						}
					},
					orderBy: { timestamp: "desc" },
					take: 3
				}
			}
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		// Get appointment statistics
		const totalAppointments = await db.appointment.count({
			where: {
				patientId: patient.id,
				status: "COMPLETED"
			}
		});

		const nextAppointment = await db.appointment.findFirst({
			where: {
				patientId: patient.id,
				start: { gte: new Date() },
				status: { notIn: ["CANCELED", "COMPLETED"] }
			},
			orderBy: { start: "asc" }
		});

		const lastAppointment = await db.appointment.findFirst({
			where: {
				patientId: patient.id,
				status: "COMPLETED"
			},
			orderBy: { start: "desc" }
		});

		return NextResponse.json({
			patient: {
				id: patient.id,
				firstName: patient.firstName,
				lastName: patient.lastName,
				appointments: patient.appointments,
				messages: patient.messages
			},
			stats: {
				totalAppointments,
				nextAppointment: nextAppointment?.start || null,
				lastAppointment: lastAppointment?.start || null
			}
		});
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
