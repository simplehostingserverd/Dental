import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

interface CreateAppointmentRequest {
	patientName: string;
	phone: string;
	email?: string;
	provider: string;
	treatment: string;
	date: string;
	time: string;
	notes?: string;
}

interface AppointmentResponse {
	id: string;
	patientName: string;
	phone: string;
	email?: string;
	provider: string;
	treatment: string;
	date: string;
	time: string;
	status: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: CreateAppointmentRequest = await request.json();

		// Validate required fields
		if (
			!body.patientName ||
			!body.phone ||
			!body.provider ||
			!body.treatment ||
			!body.date ||
			!body.time
		) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Validate phone number format
		const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
		if (!phoneRegex.test(body.phone)) {
			return NextResponse.json(
				{ error: "Invalid phone number format. Use (555) 123-4567" },
				{ status: 400 },
			);
		}

		// Validate email if provided
		if (body.email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(body.email)) {
				return NextResponse.json(
					{ error: "Invalid email format" },
					{ status: 400 },
				);
			}
		}

		// Validate date (must be today or future)
		const appointmentDate = new Date(body.date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (appointmentDate < today) {
			return NextResponse.json(
				{ error: "Appointment date cannot be in the past" },
				{ status: 400 },
			);
		}

		// TODO: Check for appointment conflicts
		// TODO: Validate provider availability
		// TODO: Save to database

		// For now, create a mock response
		const newAppointment: AppointmentResponse = {
			id: `apt_${Date.now()}`,
			patientName: body.patientName,
			phone: body.phone,
			email: body.email,
			provider: body.provider,
			treatment: body.treatment,
			date: body.date,
			time: body.time,
			status: "confirmed",
			notes: body.notes,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// TODO: Send confirmation email/SMS
		// TODO: Add to provider's calendar
		// TODO: Create patient record if new patient

		return NextResponse.json({
			success: true,
			appointment: newAppointment,
			message: "Appointment booked successfully",
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
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const date = searchParams.get("date");
		const provider = searchParams.get("provider");
		const status = searchParams.get("status");

		// TODO: Fetch appointments from database with filters
		// For now, return mock data

		const mockAppointments: AppointmentResponse[] = [
			{
				id: "apt_1",
				patientName: "Sarah Johnson",
				phone: "(555) 123-4567",
				email: "sarah.johnson@email.com",
				provider: "Dr. Smith",
				treatment: "Cleaning",
				date: "2025-07-17",
				time: "2:30 PM",
				status: "confirmed",
				notes: "Regular cleaning appointment",
				createdAt: new Date("2025-07-16T10:00:00Z"),
				updatedAt: new Date("2025-07-16T10:00:00Z"),
			},
			{
				id: "apt_2",
				patientName: "Michael Chen",
				phone: "(555) 234-5678",
				email: "michael.chen@email.com",
				provider: "Dr. Johnson",
				treatment: "Consultation",
				date: "2025-07-17",
				time: "3:00 PM",
				status: "confirmed",
				notes: "New patient consultation",
				createdAt: new Date("2025-07-15T14:30:00Z"),
				updatedAt: new Date("2025-07-15T14:30:00Z"),
			},
		];

		// Apply filters
		let filteredAppointments = mockAppointments;

		if (date) {
			filteredAppointments = filteredAppointments.filter(
				(apt) => apt.date === date,
			);
		}

		if (provider) {
			filteredAppointments = filteredAppointments.filter(
				(apt) => apt.provider === provider,
			);
		}

		if (status) {
			filteredAppointments = filteredAppointments.filter(
				(apt) => apt.status === status,
			);
		}

		return NextResponse.json({
			success: true,
			appointments: filteredAppointments,
			total: filteredAppointments.length,
		});
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Appointment ID is required" },
				{ status: 400 },
			);
		}

		// TODO: Update appointment in database
		// TODO: Send update notifications
		// TODO: Update provider's calendar

		const updatedAppointment: AppointmentResponse = {
			id,
			...updateData,
			updatedAt: new Date(),
		};

		return NextResponse.json({
			success: true,
			appointment: updatedAppointment,
			message: "Appointment updated successfully",
		});
	} catch (error) {
		console.error("Error updating appointment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Appointment ID is required" },
				{ status: 400 },
			);
		}

		// TODO: Delete appointment from database
		// TODO: Send cancellation notifications
		// TODO: Update provider's calendar

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
