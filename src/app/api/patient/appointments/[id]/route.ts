import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "patient") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { action, date, time } = body;

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

		// Find the appointment
		const appointment = await db.appointment.findFirst({
			where: {
				id: id,
				patientId: patient.id,
			},
		});

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 },
			);
		}

		// Check if appointment can be modified (not in the past or already completed/cancelled)
		if (
			(appointment.start && appointment.start < new Date()) ||
			appointment.status === "COMPLETED" ||
			appointment.status === "CANCELED"
		) {
			return NextResponse.json(
				{ error: "This appointment cannot be modified" },
				{ status: 400 },
			);
		}

		if (action === "cancel") {
			// Cancel the appointment
			const updatedAppointment = await db.appointment.update({
				where: { id: id },
				data: {
					status: "CANCELED",
				},
			});

			return NextResponse.json({
				success: true,
				message: "Appointment cancelled successfully",
				appointment: updatedAppointment,
			});
		}

		if (action === "reschedule") {
			// Validate reschedule data
			if (!date || !time) {
				return NextResponse.json(
					{ error: "Date and time are required for rescheduling" },
					{ status: 400 },
				);
			}

			// Create new start and end datetime
			const [hours, minutes] = time.split(":").map(Number);
			const newStartDateTime = new Date(date);
			newStartDateTime.setHours(hours, minutes, 0, 0);

			// Calculate duration from original appointment
			const originalDuration =
				appointment.end && appointment.start
					? appointment.end.getTime() - appointment.start.getTime()
					: 60 * 60 * 1000; // Default 1 hour if times are null
			const newEndDateTime = new Date(
				newStartDateTime.getTime() + originalDuration,
			);

			// Check for conflicts with the same practice user
			const conflictingAppointment = await db.appointment.findFirst({
				where: {
					practiceUserId: appointment.practiceUserId,
					id: { not: id }, // Exclude current appointment
					OR: [
						{
							AND: [
								{ start: { lte: newStartDateTime } },
								{ end: { gt: newStartDateTime } },
							],
						},
						{
							AND: [
								{ start: { lt: newEndDateTime } },
								{ end: { gte: newEndDateTime } },
							],
						},
						{
							AND: [
								{ start: { gte: newStartDateTime } },
								{ end: { lte: newEndDateTime } },
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

			// Update the appointment
			const updatedAppointment = await db.appointment.update({
				where: { id: id },
				data: {
					start: newStartDateTime,
					end: newEndDateTime,
					status: "RESCHEDULED",
				},
			});

			return NextResponse.json({
				success: true,
				message: "Appointment rescheduled successfully",
				appointment: updatedAppointment,
			});
		}

		return NextResponse.json({ error: "Invalid action" }, { status: 400 });
	} catch (error) {
		console.error("Error updating appointment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
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

		// Find and cancel the appointment
		const appointment = await db.appointment.findFirst({
			where: {
				id: id,
				patientId: patient.id,
			},
		});

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 },
			);
		}

		// Check if appointment can be cancelled
		if (
			(appointment.start && appointment.start < new Date()) ||
			appointment.status === "COMPLETED" ||
			appointment.status === "CANCELED"
		) {
			return NextResponse.json(
				{ error: "This appointment cannot be cancelled" },
				{ status: 400 },
			);
		}

		// Cancel the appointment
		const updatedAppointment = await db.appointment.update({
			where: { id: id },
			data: {
				status: "CANCELED",
			},
		});

		return NextResponse.json({
			success: true,
			message: "Appointment cancelled successfully",
		});
	} catch (error) {
		console.error("Error cancelling appointment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
