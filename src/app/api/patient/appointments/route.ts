import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "patient") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { date, time, type, notes } = body;

		// Validate required fields
		if (!date || !time || !type) {
			return NextResponse.json(
				{ error: "Date, time, and appointment type are required" },
				{ status: 400 },
			);
		}

		// Find the patient record
		const patient = await db.patient.findUnique({
			where: { patientUserId: user.id },
			include: { practice: true },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient record not found" },
				{ status: 404 },
			);
		}

		if (!patient.practiceId) {
			return NextResponse.json(
				{ error: "Patient is not associated with a practice" },
				{ status: 400 },
			);
		}

		// Find an available practice user (dentist/staff) for the appointment
		// For now, we'll assign to the first available practice user
		const practiceUser = await db.practiceUser.findFirst({
			where: {
				practiceId: patient.practiceId,
				isActive: true,
			},
		});

		if (!practiceUser) {
			return NextResponse.json(
				{ error: "No available staff found" },
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
		};

		const duration = durations[type] || 30;
		const endDateTime = new Date(startDateTime);
		endDateTime.setMinutes(endDateTime.getMinutes() + duration);

		// Check for conflicts
		const conflictingAppointment = await db.appointment.findFirst({
			where: {
				practiceUserId: practiceUser.id,
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
				{ error: "This time slot is no longer available" },
				{ status: 409 },
			);
		}

		// Create the appointment
		const appointment = await db.appointment.create({
			data: {
				// Required fields
				patientId: patient.id,
				patientName: `${patient.firstName} ${patient.lastName}`,
				dentistId: practiceUser.id,
				dentistName: `${practiceUser.firstName} ${practiceUser.lastName}`,
				date: startDateTime,
				time: startDateTime.toTimeString().slice(0, 5), // HH:MM format
				duration: 60, // Default 60 minutes
				type: type || "Consultation",
				status: "SCHEDULED",
				notes: notes || null,
				// Legacy fields for compatibility
				start: startDateTime,
				end: endDateTime,
				appointmentType: type,
				practiceUserId: practiceUser.id,
			},
			include: {
				patient: {
					select: {
						firstName: true,
						lastName: true,
						email: true,
					},
				},
				practiceUser: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		return NextResponse.json({
			success: true,
			appointment: {
				id: appointment.id,
				start: appointment.start,
				end: appointment.end,
				type: appointment.appointmentType,
				status: appointment.status,
				notes: appointment.notes,
				provider: appointment.practiceUser
					? `${appointment.practiceUser.firstName} ${appointment.practiceUser.lastName}`
					: "Staff Member",
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

		// Get patient's appointments
		const appointments = await db.appointment.findMany({
			where: {
				patientId: patient.id,
				status: {
					not: "CANCELED",
				},
			},
			include: {
				practiceUser: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				start: "asc",
			},
		});

		const formattedAppointments = appointments.map((appointment) => ({
			id: appointment.id,
			start: appointment.start,
			end: appointment.end,
			type: appointment.appointmentType,
			status: appointment.status,
			notes: appointment.notes,
			provider: appointment.practiceUser
				? `${appointment.practiceUser.firstName} ${appointment.practiceUser.lastName}`
				: "Staff Member",
		}));

		return NextResponse.json({
			success: true,
			appointments: formattedAppointments,
		});
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
