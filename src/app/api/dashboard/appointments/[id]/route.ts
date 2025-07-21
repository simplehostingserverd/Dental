import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

		// Find the appointment and verify it belongs to this practice
		const appointment = await db.appointment.findFirst({
			where: {
				id: id,
				practiceUser: {
					practiceId: practiceUser.practiceId,
				},
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

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found or not associated with your practice" },
				{ status: 404 },
			);
		}

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
		console.error("Error fetching appointment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { status, date, time, appointmentType, providerId, notes } = body;

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

		// Find the appointment and verify it belongs to this practice
		const appointment = await db.appointment.findFirst({
			where: {
				id: id,
				practiceUser: {
					practiceId: practiceUser.practiceId,
				},
			},
		});

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Prepare update data
		const updateData: any = {};

		// Update status if provided
		if (status) {
			(updateData as { status: string }).status = status.toUpperCase();
		}

		// Update appointment type if provided
		if (appointmentType) {
			(updateData as { appointmentType: string }).appointmentType =
				appointmentType;
		}

		// Update notes if provided
		if (notes !== undefined) {
			(updateData as { notes: string | null }).notes = notes || null;
		}

		// Update provider if provided
		if (providerId) {
			// Verify the new provider belongs to this practice
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

			(updateData as { practiceUserId: string }).practiceUserId = providerId;
		}

		// Update date and time if provided
		if (date && time) {
			const [hours, minutes] = time.split(":").map(Number);
			const startDateTime = new Date(date);
			startDateTime.setHours(hours, minutes, 0, 0);

			// Calculate duration based on appointment type
			const durations: Record<string, number> = {
				cleaning: 60,
				checkup: 30,
				consultation: 45,
				emergency: 30,
				filling: 90,
				extraction: 60,
				"root-canal": 120,
			};

			const currentType = appointmentType || appointment.appointmentType;
			const duration = durations[currentType || ""] || 60;
			const endDateTime = new Date(startDateTime);
			endDateTime.setMinutes(endDateTime.getMinutes() + duration);

			// Check for conflicts (excluding current appointment)
			const conflictingAppointment = await db.appointment.findFirst({
				where: {
					practiceUserId: providerId || appointment.practiceUserId,
					id: { not: id },
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
					{
						error: "This time slot is not available for the selected provider",
					},
					{ status: 409 },
				);
			}

			(updateData as { start: Date; end: Date }).start = startDateTime;
			(updateData as { start: Date; end: Date }).end = endDateTime;
		}

		// Update the appointment
		const updatedAppointment = await db.appointment.update({
			where: { id: id },
			data: updateData,
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
				id: updatedAppointment.id,
				start: updatedAppointment.start?.toISOString() || "",
				end: updatedAppointment.end?.toISOString() || "",
				status: updatedAppointment.status,
				appointmentType: updatedAppointment.appointmentType,
				notes: updatedAppointment.notes,
				patient: {
					id: updatedAppointment.patient.id,
					firstName: updatedAppointment.patient.firstName,
					lastName: updatedAppointment.patient.lastName,
					phone: updatedAppointment.patient.phone,
					email: updatedAppointment.patient.email,
				},
				practiceUser: updatedAppointment.practiceUser
					? {
							id: updatedAppointment.practiceUser.id,
							firstName: updatedAppointment.practiceUser.firstName,
							lastName: updatedAppointment.practiceUser.lastName,
							role: updatedAppointment.practiceUser.role,
						}
					: null,
			},
		});
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

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

		// Find the appointment and verify it belongs to this practice
		const appointment = await db.appointment.findFirst({
			where: {
				id: id,
				practiceUser: {
					practiceId: practiceUser.practiceId,
				},
			},
		});

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found or not associated with your practice" },
				{ status: 404 },
			);
		}

		// Instead of deleting, mark as canceled
		await db.appointment.update({
			where: { id: id },
			data: { status: "CANCELED" },
		});

		return NextResponse.json({
			success: true,
			message: "Appointment canceled successfully",
		});
	} catch (error) {
		console.error("Error canceling appointment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
