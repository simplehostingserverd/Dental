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
		const date = url.searchParams.get("date"); // specific date filter
		const status = url.searchParams.get("status"); // appointment status filter
		const providerId = url.searchParams.get("providerId"); // specific provider filter
		const patientId = url.searchParams.get("patientId"); // specific patient filter

		// Build where clause
		const whereClause: any = {
			practiceUser: {
				practiceId: practiceUser.practiceId,
			},
		};

		// Add date filter
		if (date) {
			const startOfDay = new Date(date);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(date);
			endOfDay.setHours(23, 59, 59, 999);

			(whereClause as { start: { gte: Date; lte: Date } }).start = {
				gte: startOfDay,
				lte: endOfDay,
			};
		}

		// Add status filter
		if (status) {
			(whereClause as { status: string }).status = status.toUpperCase();
		}

		// Add provider filter
		if (providerId) {
			(whereClause as { practiceUserId: string }).practiceUserId = providerId;
		}

		// Add patient filter
		if (patientId) {
			(whereClause as { patientId: string }).patientId = patientId;
		}

		// Get appointments for this practice
		const appointments = await db.appointment.findMany({
			where: whereClause,
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
					},
				},
				practiceUser: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
			},
			orderBy: {
				start: "asc",
			},
		});

		return NextResponse.json({
			success: true,
			appointments: appointments.map((appointment) => ({
				id: appointment.id,
				start: appointment.start?.toISOString() || "",
				end: appointment.end?.toISOString() || "",
				status: appointment.status,
				appointmentType: appointment.appointmentType,
				notes: appointment.notes,
				patient: {
					id: appointment.patient.id,
					firstName: appointment.patient.firstName,
					lastName: appointment.patient.lastName,
					phone: appointment.patient.phone,
					email: appointment.patient.email,
				},
				practiceUser: appointment.practiceUser
					? {
							id: appointment.practiceUser.id,
							firstName: appointment.practiceUser.firstName,
							lastName: appointment.practiceUser.lastName,
							role: appointment.practiceUser.role,
						}
					: null,
			})),
		});
	} catch (error) {
		console.error("Error fetching appointments:", error);
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
		const { patientId, date, time, appointmentType, providerId, notes } = body;

		// Validate required fields
		if (!patientId || !date || !time || !appointmentType || !providerId) {
			return NextResponse.json(
				{
					error:
						"Patient, date, time, appointment type, and provider are required",
				},
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

		// Verify the provider belongs to this practice
		const provider = await db.practiceUser.findFirst({
			where: {
				id: providerId,
				practiceId: practiceUser.practiceId,
			},
		});

		if (!provider) {
			return NextResponse.json(
				{ error: "Provider not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Create start and end datetime
		const [hours, minutes] = time.split(":").map(Number);
		const startDateTime = new Date(date);
		startDateTime.setHours(hours, minutes, 0, 0);

		// Default duration based on appointment type
		const durations: Record<string, number> = {
			cleaning: 60,
			checkup: 30,
			consultation: 45,
			emergency: 30,
			filling: 90,
			extraction: 60,
			"root-canal": 120,
		};

		const duration = durations[appointmentType] || 60;
		const endDateTime = new Date(startDateTime);
		endDateTime.setMinutes(endDateTime.getMinutes() + duration);

		// Check for conflicts with the selected provider
		const conflictingAppointment = await db.appointment.findFirst({
			where: {
				practiceUserId: providerId,
				OR: [
					{
						AND: [
							{ start: { lte: startDateTime } },
							{ end: { gt: startDateTime } },
						],
					},
					{
						AND: [
							{ start: { lt: endDateTime } },
							{ end: { gte: endDateTime } },
						],
					},
					{
						AND: [
							{ start: { gte: startDateTime } },
							{ end: { lte: endDateTime } },
						],
					},
				],
				status: {
					not: "CANCELED",
				},
			},
		});

		if (conflictingAppointment) {
			return NextResponse.json(
				{ error: "This time slot is not available for the selected provider" },
				{ status: 409 },
			);
		}

		// Create the appointment
		const appointment = await db.appointment.create({
			data: {
				patientId: patient.id,
				patientName: `${patient.firstName} ${patient.lastName}`,
				dentistId: provider.id,
				dentistName: `${provider.firstName} ${provider.lastName}`,
				date: startDateTime,
				time: startDateTime.toTimeString().split(" ")[0] || "09:00:00",
				duration: 60,
				type: appointmentType || "Consultation",
				status: "SCHEDULED",
				notes: notes,
				start: startDateTime,
				end: endDateTime,
				appointmentType: appointmentType,
				practiceUserId: provider.id,
			},
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true,
					},
				},
				practiceUser: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			appointment: {
				id: appointment.id,
				start: appointment.start?.toISOString() || "",
				end: appointment.end?.toISOString() || "",
				status: appointment.status,
				appointmentType: appointment.appointmentType,
				notes: appointment.notes,
				patient: {
					id: appointment.patient.id,
					firstName: appointment.patient.firstName,
					lastName: appointment.patient.lastName,
					phone: appointment.patient.phone,
					email: appointment.patient.email,
				},
				practiceUser: appointment.practiceUser
					? {
							id: appointment.practiceUser.id,
							firstName: appointment.practiceUser.firstName,
							lastName: appointment.practiceUser.lastName,
							role: appointment.practiceUser.role,
						}
					: null,
			},
		});
	} catch (error) {
		console.error("Error creating appointment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
