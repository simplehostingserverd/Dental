import { SmsService } from "@/lib/sms/sms-service";
import { AutoTranslator } from "@/lib/translation/auto-translator";
import { db } from "@/server/db";

export interface ReminderTemplate {
	id: string;
	name: string;
	type: "sms" | "email" | "call";
	timing: number; // Hours before appointment
	message: string;
	isActive: boolean;
	variables: string[];
}

export interface ReminderSchedule {
	appointmentId: string;
	reminderType: "sms" | "email" | "call";
	scheduledFor: Date;
	templateId?: string;
	customMessage?: string;
}

export class ReminderService {
	private practiceId: string;
	private smsService: SmsService;
	private translator: AutoTranslator;

	constructor(practiceId: string) {
		this.practiceId = practiceId;
		this.smsService = new SmsService(practiceId);
		this.translator = AutoTranslator.getInstance(practiceId);
	}

	/**
	 * Schedule reminders for an appointment
	 */
	async scheduleReminders(appointmentId: string): Promise<void> {
		const appointment = await db.appointment.findUnique({
			where: { id: appointmentId },
			include: {
				patient: true,
			},
		});

		if (!appointment) {
			throw new Error("Appointment not found");
		}

		// Get active reminder templates
		const templates = await this.getReminderTemplates();
		const activeTemplates = templates.filter((t) => t.isActive);

		// Schedule reminders based on templates
		for (const template of activeTemplates) {
			const scheduledFor = new Date(appointment.date);
			scheduledFor.setHours(scheduledFor.getHours() - template.timing);

			// Only schedule if the reminder time is in the future
			if (scheduledFor > new Date()) {
				await db.appointmentReminder.create({
					data: {
						appointmentId,
						reminderType: template.type,
						scheduledFor,
						message: template.message,
						status: "pending",
					},
				});
			}
		}
	}

	/**
	 * Process pending reminders
	 */
	async processPendingReminders(): Promise<void> {
		const now = new Date();

		const pendingReminders = await db.appointmentReminder.findMany({
			where: {
				status: "pending",
				scheduledFor: {
					lte: now,
				},
			},
			include: {
				appointment: {
					include: {
						patient: true,
					},
				},
			},
		});

		for (const reminder of pendingReminders) {
			try {
				await this.sendReminder(reminder);

				await db.appointmentReminder.update({
					where: { id: reminder.id },
					data: {
						status: "sent",
						sentAt: new Date(),
						attempts: reminder.attempts + 1,
					},
				});
			} catch (error) {
				console.error(`Failed to send reminder ${reminder.id}:`, error);

				await db.appointmentReminder.update({
					where: { id: reminder.id },
					data: {
						status: "failed",
						attempts: reminder.attempts + 1,
						lastAttempt: new Date(),
					},
				});
			}
		}
	}

	/**
	 * Send a specific reminder
	 */
	private async sendReminder(reminder: any): Promise<void> {
		const { appointment } = reminder;
		const patient = appointment.patient;

		// Process message with variables
		const processedMessage = await this.processReminderMessage(
			reminder.message || "",
			appointment,
			patient,
		);

		switch (reminder.reminderType) {
			case "sms":
				await this.sendSmsReminder(patient, processedMessage);
				break;
			case "email":
				await this.sendEmailReminder(patient, processedMessage);
				break;
			case "call":
				await this.scheduleCallReminder(patient, appointment);
				break;
		}
	}

	/**
	 * Send SMS reminder
	 */
	private async sendSmsReminder(patient: any, message: string): Promise<void> {
		if (!patient.phone) {
			throw new Error("Patient has no phone number");
		}

		await this.smsService.sendSms({
			to: patient.phone,
			message,
			patientId: patient.id,
		});
	}

	/**
	 * Send email reminder
	 */
	private async sendEmailReminder(
		patient: any,
		message: string,
	): Promise<void> {
		if (!patient.email) {
			throw new Error("Patient has no email address");
		}

		// Email implementation would go here
		// For now, just log it
		console.log(`Email reminder to ${patient.email}: ${message}`);
	}

	/**
	 * Schedule call reminder
	 */
	private async scheduleCallReminder(
		patient: any,
		appointment: any,
	): Promise<void> {
		// This would integrate with the VoIP system to schedule a call
		console.log(`Call reminder scheduled for ${patient.phone}`);
	}

	/**
	 * Process reminder message with variables
	 */
	private async processReminderMessage(
		template: string,
		appointment: any,
		patient: any,
	): Promise<string> {
		const practice = await db.practice.findUnique({
			where: { id: this.practiceId },
		});

		const variables = {
			patientName: `${patient.firstName} ${patient.lastName}`,
			appointmentDate: appointment.date.toLocaleDateString(),
			appointmentTime: appointment.time,
			providerName: appointment.dentistName,
			practiceName: practice?.name || "Dental Practice",
			practicePhone: practice?.phone || "",
			appointmentType: appointment.type,
		};

		let message = template;
		for (const [key, value] of Object.entries(variables)) {
			message = message.replace(new RegExp(`{${key}}`, "g"), value);
		}

		// Auto-translate if patient prefers Spanish
		const patientPreferences = patient.medicalHistory as any;
		if (patientPreferences?.preferredLanguage === "es") {
			const translation = await this.translator.translateToSpanish(message);
			message = translation.translatedText;
		}

		return message;
	}

	/**
	 * Get reminder templates
	 */
	async getReminderTemplates(): Promise<ReminderTemplate[]> {
		// For now, return default templates
		// In a real implementation, these would be stored in the database
		return [
			{
				id: "sms_24h",
				name: "24 Hour SMS Reminder",
				type: "sms",
				timing: 24,
				message:
					"Hi {patientName}, this is a reminder that you have an appointment tomorrow at {appointmentTime} with {providerName}. Please reply CONFIRM or call us at {practicePhone}.",
				isActive: true,
				variables: [
					"patientName",
					"appointmentTime",
					"providerName",
					"practicePhone",
				],
			},
			{
				id: "sms_2h",
				name: "2 Hour SMS Reminder",
				type: "sms",
				timing: 2,
				message:
					"Hi {patientName}, your appointment with {providerName} is in 2 hours at {appointmentTime}. Please arrive 15 minutes early.",
				isActive: true,
				variables: ["patientName", "providerName", "appointmentTime"],
			},
			{
				id: "email_24h",
				name: "24 Hour Email Reminder",
				type: "email",
				timing: 24,
				message:
					"Dear {patientName}, this is a reminder that you have an appointment scheduled for {appointmentDate} at {appointmentTime} with {providerName}.",
				isActive: false,
				variables: [
					"patientName",
					"appointmentDate",
					"appointmentTime",
					"providerName",
				],
			},
		];
	}

	/**
	 * Update reminder template
	 */
	async updateReminderTemplate(
		templateId: string,
		updates: Partial<ReminderTemplate>,
	): Promise<void> {
		// In a real implementation, this would update the database
		console.log(`Updating template ${templateId}:`, updates);
	}

	/**
	 * Cancel reminders for an appointment
	 */
	async cancelReminders(appointmentId: string): Promise<void> {
		await db.appointmentReminder.updateMany({
			where: {
				appointmentId,
				status: "pending",
			},
			data: {
				status: "cancelled",
			},
		});
	}

	/**
	 * Reschedule reminders for an appointment
	 */
	async rescheduleReminders(
		appointmentId: string,
		newDate: Date,
	): Promise<void> {
		// Cancel existing reminders
		await this.cancelReminders(appointmentId);

		// Update appointment date
		await db.appointment.update({
			where: { id: appointmentId },
			data: { date: newDate },
		});

		// Schedule new reminders
		await this.scheduleReminders(appointmentId);
	}

	/**
	 * Get reminder statistics
	 */
	async getReminderStats(startDate: Date, endDate: Date) {
		const reminders = await db.appointmentReminder.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		const totalScheduled = reminders.length;
		const totalSent = reminders.filter((r) => r.status === "sent").length;
		const totalFailed = reminders.filter((r) => r.status === "failed").length;
		const totalPending = reminders.filter((r) => r.status === "pending").length;

		return {
			totalScheduled,
			totalSent,
			totalFailed,
			totalPending,
			successRate: (totalSent / (totalSent + totalFailed)) * 100,
			remindersByType: this.groupRemindersByType(reminders),
			remindersByDay: this.groupRemindersByDay(reminders),
		};
	}

	private groupRemindersByType(reminders: any[]) {
		const groups: Record<string, number> = {};

		reminders.forEach((reminder) => {
			groups[reminder.reminderType] = (groups[reminder.reminderType] || 0) + 1;
		});

		return groups;
	}

	private groupRemindersByDay(reminders: any[]) {
		const groups: Record<string, number> = {};

		reminders.forEach((reminder) => {
			const day = reminder.createdAt.toISOString().split("T")[0];
			groups[day] = (groups[day] || 0) + 1;
		});

		return groups;
	}

	/**
	 * Start the reminder processor (would run as a cron job)
	 */
	static async startReminderProcessor() {
		// This would be called by a cron job or background task
		const practices = await db.practice.findMany({
			where: { isActive: true },
		});

		for (const practice of practices) {
			const reminderService = new ReminderService(practice.id);
			await reminderService.processPendingReminders();
		}
	}
}
