import { NextRequest, NextResponse } from "next/server";
import { ReminderService } from "@/lib/reminders/reminder-service";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { practiceId, appointmentId, action } = body;

		if (!practiceId || !appointmentId) {
			return NextResponse.json(
				{ error: "Practice ID and appointment ID are required" },
				{ status: 400 }
			);
		}

		const reminderService = new ReminderService(practiceId);

		switch (action) {
			case 'schedule':
				await reminderService.scheduleReminders(appointmentId);
				return NextResponse.json({ success: true, message: "Reminders scheduled" });

			case 'cancel':
				await reminderService.cancelReminders(appointmentId);
				return NextResponse.json({ success: true, message: "Reminders cancelled" });

			case 'reschedule':
				const { newDate } = body;
				if (!newDate) {
					return NextResponse.json(
						{ error: "New date is required for rescheduling" },
						{ status: 400 }
					);
				}
				await reminderService.rescheduleReminders(appointmentId, new Date(newDate));
				return NextResponse.json({ success: true, message: "Reminders rescheduled" });

			default:
				return NextResponse.json(
					{ error: "Invalid action" },
					{ status: 400 }
				);
		}
	} catch (error) {
		console.error("Reminder API error:", error);
		return NextResponse.json(
			{ error: "Failed to process reminder request" },
			{ status: 500 }
		);
	}
}

// Get reminder templates
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const practiceId = searchParams.get('practiceId');

		if (!practiceId) {
			return NextResponse.json(
				{ error: "Practice ID is required" },
				{ status: 400 }
			);
		}

		const reminderService = new ReminderService(practiceId);
		const templates = await reminderService.getReminderTemplates();

		return NextResponse.json({ templates });
	} catch (error) {
		console.error("Reminder templates error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch reminder templates" },
			{ status: 500 }
		);
	}
}
