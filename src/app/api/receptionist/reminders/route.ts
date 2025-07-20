import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

interface SendReminderRequest {
	patientId: string;
	type: "appointment" | "payment" | "followup" | "custom";
	method: "sms" | "email" | "call";
	message: string;
	scheduleTime?: string;
}

interface ReminderResponse {
	id: string;
	patientId: string;
	patientName: string;
	type: string;
	method: string;
	message: string;
	status: "sent" | "scheduled" | "failed" | "delivered";
	scheduledFor?: Date;
	sentAt?: Date;
	sentBy: string;
	createdAt: Date;
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: SendReminderRequest = await request.json();

		// Validate required fields
		if (!body.patientId || !body.type || !body.method || !body.message) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Validate type
		const validTypes = ["appointment", "payment", "followup", "custom"];
		if (!validTypes.includes(body.type)) {
			return NextResponse.json(
				{ error: "Invalid reminder type" },
				{ status: 400 },
			);
		}

		// Validate method
		const validMethods = ["sms", "email", "call"];
		if (!validMethods.includes(body.method)) {
			return NextResponse.json(
				{ error: "Invalid reminder method" },
				{ status: 400 },
			);
		}

		// Validate message length
		if (body.message.length < 10) {
			return NextResponse.json(
				{ error: "Message must be at least 10 characters long" },
				{ status: 400 },
			);
		}

		if (body.message.length > 1000) {
			return NextResponse.json(
				{ error: "Message must be less than 1000 characters" },
				{ status: 400 },
			);
		}

		// Validate schedule time if provided
		let scheduledFor: Date | undefined;
		if (body.scheduleTime) {
			scheduledFor = new Date(body.scheduleTime);
			const now = new Date();

			if (scheduledFor <= now) {
				return NextResponse.json(
					{ error: "Scheduled time must be in the future" },
					{ status: 400 },
				);
			}

			// Don't allow scheduling more than 30 days in advance
			const maxFutureDate = new Date();
			maxFutureDate.setDate(maxFutureDate.getDate() + 30);

			if (scheduledFor > maxFutureDate) {
				return NextResponse.json(
					{ error: "Cannot schedule reminders more than 30 days in advance" },
					{ status: 400 },
				);
			}
		}

		// TODO: Fetch patient information and contact details
		// Mock patient lookup
		const mockPatients = [
			{
				id: "1",
				name: "Sarah Johnson",
				phone: "(555) 123-4567",
				email: "sarah.johnson@email.com",
			},
			{
				id: "2",
				name: "Michael Chen",
				phone: "(555) 234-5678",
				email: "michael.chen@email.com",
			},
			{
				id: "3",
				name: "Emily Davis",
				phone: "(555) 345-6789",
				email: "emily.davis@email.com",
			},
			{
				id: "4",
				name: "David Wilson",
				phone: "(555) 456-7890",
				email: "david.wilson@email.com",
			},
		];

		const patient = mockPatients.find((p) => p.id === body.patientId);
		if (!patient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Validate contact method availability
		if (body.method === "email" && !patient.email) {
			return NextResponse.json(
				{ error: "Patient email not available" },
				{ status: 400 },
			);
		}

		if (body.method === "sms" && !patient.phone) {
			return NextResponse.json(
				{ error: "Patient phone number not available" },
				{ status: 400 },
			);
		}

		// Create reminder record
		const reminder: ReminderResponse = {
			id: `rem_${Date.now()}`,
			patientId: body.patientId,
			patientName: patient.name,
			type: body.type,
			method: body.method,
			message: body.message,
			status: scheduledFor ? "scheduled" : "sent",
			scheduledFor: scheduledFor,
			sentAt: scheduledFor ? undefined : new Date(),
			sentBy: `${session.user.firstName} ${session.user.lastName}`,
			createdAt: new Date(),
		};

		// TODO: Send reminder immediately or schedule it
		if (!scheduledFor) {
			// Send immediately
			const success = await sendReminderNow(reminder, patient);
			if (!success) {
				reminder.status = "failed";
			}
		} else {
			// Schedule for later
			await scheduleReminder(reminder);
		}

		// TODO: Save reminder to database
		// TODO: Log reminder activity

		return NextResponse.json({
			success: true,
			reminder: reminder,
			message: scheduledFor
				? `Reminder scheduled for ${scheduledFor.toLocaleString()}`
				: "Reminder sent successfully",
		});
	} catch (error) {
		console.error("Error sending reminder:", error);
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
		const patientId = searchParams.get("patientId");
		const type = searchParams.get("type");
		const status = searchParams.get("status");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		// TODO: Fetch reminders from database with filters
		// For now, return mock data

		const mockReminders: ReminderResponse[] = [
			{
				id: "rem_1",
				patientId: "1",
				patientName: "Sarah Johnson",
				type: "appointment",
				method: "sms",
				message:
					"Hi Sarah! This is a reminder about your dental appointment tomorrow at 2:30 PM with Dr. Smith.",
				status: "delivered",
				sentAt: new Date("2025-07-16T16:00:00Z"),
				sentBy: "Jane Smith",
				createdAt: new Date("2025-07-16T16:00:00Z"),
			},
			{
				id: "rem_2",
				patientId: "2",
				patientName: "Michael Chen",
				type: "payment",
				method: "email",
				message:
					"Dear Michael, this is a friendly reminder about your outstanding balance of $180.00.",
				status: "sent",
				sentAt: new Date("2025-07-17T10:00:00Z"),
				sentBy: "Jane Smith",
				createdAt: new Date("2025-07-17T10:00:00Z"),
			},
		];

		// Apply filters
		let filteredReminders = mockReminders;

		if (patientId) {
			filteredReminders = filteredReminders.filter(
				(reminder) => reminder.patientId === patientId,
			);
		}

		if (type) {
			filteredReminders = filteredReminders.filter(
				(reminder) => reminder.type === type,
			);
		}

		if (status) {
			filteredReminders = filteredReminders.filter(
				(reminder) => reminder.status === status,
			);
		}

		if (startDate) {
			const start = new Date(startDate);
			filteredReminders = filteredReminders.filter(
				(reminder) => new Date(reminder.createdAt) >= start,
			);
		}

		if (endDate) {
			const end = new Date(endDate);
			filteredReminders = filteredReminders.filter(
				(reminder) => new Date(reminder.createdAt) <= end,
			);
		}

		return NextResponse.json({
			success: true,
			reminders: filteredReminders,
			total: filteredReminders.length,
		});
	} catch (error) {
		console.error("Error fetching reminders:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Helper function to send reminder immediately
async function sendReminderNow(
	reminder: ReminderResponse,
	patient: { phone: string; email: string },
): Promise<boolean> {
	try {
		switch (reminder.method) {
			case "sms":
				// TODO: Integrate with SMS service (Twilio, etc.)
				console.log(`Sending SMS to ${patient.phone}: ${reminder.message}`);
				break;
			case "email":
				// TODO: Integrate with email service (SendGrid, etc.)
				console.log(`Sending email to ${patient.email}: ${reminder.message}`);
				break;
			case "call":
				// TODO: Schedule phone call or integrate with calling service
				console.log(
					`Scheduling call to ${patient.phone} for: ${reminder.message}`,
				);
				break;
		}

		// Simulate success (90% success rate for demo)
		return Math.random() > 0.1;
	} catch (error) {
		console.error("Error sending reminder:", error);
		return false;
	}
}

// Helper function to schedule reminder for later
async function scheduleReminder(reminder: ReminderResponse): Promise<void> {
	// TODO: Add to job queue or scheduler
	console.log(
		`Scheduling reminder ${reminder.id} for ${reminder.scheduledFor}`,
	);
}
