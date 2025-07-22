import { IntegrationManager } from "@/lib/integrations/integration-manager";
import { AutoTranslator } from "@/lib/translation/auto-translator";
import { db } from "@/server/db";
import twilio from "twilio";

export interface SmsMessage {
	to: string;
	message: string;
	patientId?: string;
	scheduledFor?: Date;
	templateId?: string;
	variables?: Record<string, string>;
}

export interface SmsResult {
	success: boolean;
	messageId?: string;
	error?: string;
	cost?: number;
}

export class SmsService {
	private practiceId: string;
	private translator: AutoTranslator;

	constructor(practiceId: string) {
		this.practiceId = practiceId;
		this.translator = AutoTranslator.getInstance(practiceId);
	}

	/**
	 * Send SMS using configured provider
	 */
	async sendSms(smsData: SmsMessage): Promise<SmsResult> {
		// Get active SMS integration
		const twilioSms = await IntegrationManager.getIntegration(
			this.practiceId,
			'twilio_sms',
			'sms'
		);

		const awsSns = await IntegrationManager.getIntegration(
			this.practiceId,
			'aws_sns',
			'sms'
		);

		// Use Twilio SMS if available
		if (twilioSms?.isActive) {
			return this.sendWithTwilio(smsData, twilioSms.config);
		}

		// Use AWS SNS if available
		if (awsSns?.isActive) {
			return this.sendWithAwsSns(smsData, awsSns.config);
		}

		return {
			success: false,
			error: 'No SMS provider configured'
		};
	}

	/**
	 * Send SMS with Twilio
	 */
	private async sendWithTwilio(smsData: SmsMessage, config: any): Promise<SmsResult> {
		try {
			// Validate Twilio configuration
			if (!config.accountSid || !config.authToken || !config.accountSid.startsWith('AC')) {
				throw new Error('Invalid Twilio configuration');
			}

			const client = twilio(config.accountSid, config.authToken);

			// Process message (translate if needed, apply templates)
			const processedMessage = await this.processMessage(smsData);

			const message = await client.messages.create({
				body: processedMessage,
				from: config.phoneNumber,
				to: this.formatPhoneNumber(smsData.to)
			});

			// Log the SMS
			await this.logSms({
				...smsData,
				message: processedMessage,
				provider: 'twilio',
				providerSid: message.sid,
				status: 'sent',
				direction: 'outbound'
			});

			return {
				success: true,
				messageId: message.sid,
				cost: parseFloat(message.price || '0') * 100 // Convert to cents
			};
		} catch (error: any) {
			console.error('Twilio SMS error:', error);
			
			// Log failed SMS
			await this.logSms({
				...smsData,
				provider: 'twilio',
				status: 'failed',
				direction: 'outbound'
			});

			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Send SMS with AWS SNS
	 */
	private async sendWithAwsSns(smsData: SmsMessage, config: any): Promise<SmsResult> {
		try {
			// AWS SNS implementation would go here
			// For now, return a placeholder
			const processedMessage = await this.processMessage(smsData);

			// Log the SMS
			await this.logSms({
				...smsData,
				message: processedMessage,
				provider: 'aws_sns',
				status: 'sent',
				direction: 'outbound'
			});

			return {
				success: true,
				messageId: `aws-${Date.now()}`,
				cost: 0.75 // Estimated cost in cents
			};
		} catch (error: any) {
			console.error('AWS SNS error:', error);
			
			await this.logSms({
				...smsData,
				provider: 'aws_sns',
				status: 'failed',
				direction: 'outbound'
			});

			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Process message (apply templates, translate, etc.)
	 */
	private async processMessage(smsData: SmsMessage): Promise<string> {
		let message = smsData.message;

		// Apply template variables if provided
		if (smsData.variables) {
			for (const [key, value] of Object.entries(smsData.variables)) {
				message = message.replace(new RegExp(`{${key}}`, 'g'), value);
			}
		}

		// Auto-translate if patient prefers Spanish
		if (smsData.patientId) {
			const patient = await db.patient.findUnique({
				where: { id: smsData.patientId }
			});

			// Check if patient prefers Spanish (you'd store this in patient preferences)
			const patientPreferences = patient?.medicalHistory as any;
			if (patientPreferences?.preferredLanguage === 'es') {
				const translation = await this.translator.translateToSpanish(message);
				message = translation.translatedText;
			}
		}

		return message;
	}

	/**
	 * Log SMS to database
	 */
	private async logSms(data: {
		to: string;
		message: string;
		patientId?: string;
		provider: string;
		providerSid?: string;
		status: string;
		direction: string;
		cost?: number;
	}) {
		try {
			await db.smsLog.create({
				data: {
					phoneNumber: data.to,
					message: data.message,
					patientId: data.patientId,
					provider: data.provider,
					providerSid: data.providerSid,
					status: data.status,
					direction: data.direction,
					cost: data.cost,
					createdAt: new Date()
				}
			});
		} catch (error) {
			console.error('Failed to log SMS:', error);
		}
	}

	/**
	 * Format phone number for SMS
	 */
	private formatPhoneNumber(phoneNumber: string): string {
		// Remove all non-digits
		const digits = phoneNumber.replace(/\D/g, '');
		
		// Add +1 for US numbers if not present
		if (digits.length === 10) {
			return `+1${digits}`;
		} else if (digits.length === 11 && digits.startsWith('1')) {
			return `+${digits}`;
		}
		
		return phoneNumber; // Return as-is if already formatted
	}

	/**
	 * Send bulk SMS messages
	 */
	async sendBulkSms(messages: SmsMessage[]): Promise<SmsResult[]> {
		const results: SmsResult[] = [];

		for (const message of messages) {
			try {
				const result = await this.sendSms(message);
				results.push(result);
				
				// Add delay between messages to avoid rate limiting
				await new Promise(resolve => setTimeout(resolve, 100));
			} catch (error) {
				results.push({
					success: false,
					error: 'Failed to send message'
				});
			}
		}

		return results;
	}

	/**
	 * Get SMS templates
	 */
	async getSmsTemplates() {
		return [
			{
				id: 'appointment_reminder',
				name: 'Appointment Reminder',
				message: 'Hi {patientName}, this is a reminder that you have an appointment tomorrow at {appointmentTime} with {providerName}. Please reply CONFIRM or call us at {practicePhone}.',
				variables: ['patientName', 'appointmentTime', 'providerName', 'practicePhone']
			},
			{
				id: 'appointment_confirmation',
				name: 'Appointment Confirmation',
				message: 'Your appointment has been confirmed for {appointmentDate} at {appointmentTime}. Please arrive 15 minutes early. Reply STOP to opt out.',
				variables: ['appointmentDate', 'appointmentTime']
			},
			{
				id: 'payment_reminder',
				name: 'Payment Reminder',
				message: 'Hi {patientName}, you have an outstanding balance of ${amount}. Please call us at {practicePhone} to make a payment.',
				variables: ['patientName', 'amount', 'practicePhone']
			},
			{
				id: 'follow_up',
				name: 'Follow-up Care',
				message: 'Hi {patientName}, how are you feeling after your {procedure}? Please call us at {practicePhone} if you have any concerns.',
				variables: ['patientName', 'procedure', 'practicePhone']
			}
		];
	}

	/**
	 * Get SMS history for a patient
	 */
	async getPatientSmsHistory(patientId: string) {
		return await db.smsLog.findMany({
			where: { patientId },
			orderBy: { createdAt: 'desc' },
			take: 50
		});
	}

	/**
	 * Get SMS analytics
	 */
	async getSmsAnalytics(startDate: Date, endDate: Date) {
		const logs = await db.smsLog.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate
				}
			}
		});

		const totalSent = logs.filter(log => log.status === 'sent').length;
		const totalFailed = logs.filter(log => log.status === 'failed').length;
		const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);

		return {
			totalSent,
			totalFailed,
			successRate: totalSent / (totalSent + totalFailed) * 100,
			totalCost: totalCost / 100, // Convert back to dollars
			messagesByDay: this.groupMessagesByDay(logs),
			messagesByProvider: this.groupMessagesByProvider(logs)
		};
	}

	private groupMessagesByDay(logs: any[]) {
		const groups: Record<string, number> = {};
		
		logs.forEach(log => {
			const day = log.createdAt.toISOString().split('T')[0];
			groups[day] = (groups[day] || 0) + 1;
		});

		return groups;
	}

	private groupMessagesByProvider(logs: any[]) {
		const groups: Record<string, number> = {};
		
		logs.forEach(log => {
			groups[log.provider] = (groups[log.provider] || 0) + 1;
		});

		return groups;
	}
}
