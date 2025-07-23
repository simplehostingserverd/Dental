/**
 * Telegram Bot API Integration
 * For Mexico dental clinics patient communication
 */

interface TelegramMessage {
	chat_id: string | number;
	text?: string;
	photo?: string;
	document?: string;
	caption?: string;
	parse_mode?: "HTML" | "Markdown";
	reply_markup?: {
		inline_keyboard?: Array<
			Array<{
				text: string;
				callback_data?: string;
				url?: string;
			}>
		>;
	};
}

interface TelegramResponse {
	ok: boolean;
	result?: any;
	error_code?: number;
	description?: string;
}

interface TelegramUpdate {
	update_id: number;
	message?: {
		message_id: number;
		from: {
			id: number;
			first_name: string;
			last_name?: string;
			username?: string;
		};
		chat: {
			id: number;
			type: string;
		};
		date: number;
		text?: string;
	};
	callback_query?: {
		id: string;
		from: {
			id: number;
			first_name: string;
			last_name?: string;
			username?: string;
		};
		data: string;
	};
}

export class TelegramService {
	private botToken: string;
	private baseUrl: string;

	constructor() {
		this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
		this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;

		if (!this.botToken) {
			console.warn(
				"Telegram bot token not configured. Telegram features will be disabled.",
			);
		}
	}

	/**
	 * Check if Telegram is available
	 */
	isAvailable(): boolean {
		return !!this.botToken;
	}

	/**
	 * Send a text message
	 */
	async sendTextMessage(
		chatId: string | number,
		message: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const payload: TelegramMessage = {
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
		};

		return this.sendMessage("sendMessage", payload);
	}

	/**
	 * Send appointment reminder
	 */
	async sendAppointmentReminder(
		chatId: string | number,
		patientName: string,
		appointmentDate: string,
		appointmentTime: string,
		doctorName: string,
		clinicAddress: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const message = `🦷 <b>Recordatorio de Cita Dental</b>

¡Hola ${patientName}!

Te recordamos tu próxima cita:

📅 <b>Fecha:</b> ${appointmentDate}
🕐 <b>Hora:</b> ${appointmentTime}
👨‍⚕️ <b>Doctor:</b> ${doctorName}
📍 <b>Ubicación:</b> ${clinicAddress}

Por favor, llega 15 minutos antes de tu cita.

Si necesitas reprogramar, contáctanos lo antes posible.

¡Te esperamos! 😊`;

		const payload: TelegramMessage = {
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{ text: "✅ Confirmar Cita", callback_data: "confirm_appointment" },
						{ text: "📞 Llamar Clínica", url: "tel:+525512345678" },
					],
					[
						{
							text: "📍 Ver Ubicación",
							url: `https://maps.google.com/?q=${encodeURIComponent(clinicAddress)}`,
						},
					],
				],
			},
		};

		return this.sendMessage("sendMessage", payload);
	}

	/**
	 * Send appointment confirmation
	 */
	async sendAppointmentConfirmation(
		chatId: string | number,
		patientName: string,
		appointmentDate: string,
		appointmentTime: string,
		treatmentType: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const message = `✅ <b>Cita Confirmada</b>

¡Hola ${patientName}!

Tu cita ha sido confirmada exitosamente:

📅 <b>Fecha:</b> ${appointmentDate}
🕐 <b>Hora:</b> ${appointmentTime}
🦷 <b>Tratamiento:</b> ${treatmentType}

<b>Instrucciones importantes:</b>
• Llega 15 minutos antes
• Trae tu identificación oficial
• Si tienes seguro dental, trae tu tarjeta
• Evita comer 2 horas antes si es un procedimiento

¡Nos vemos pronto! 😊

<i>Clínica Dental Cognident</i>`;

		return this.sendTextMessage(chatId, message);
	}

	/**
	 * Send payment reminder
	 */
	async sendPaymentReminder(
		chatId: string | number,
		patientName: string,
		amount: string,
		dueDate: string,
		invoiceNumber: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const message = `💳 <b>Recordatorio de Pago</b>

Estimado/a ${patientName},

Te recordamos que tienes un pago pendiente:

💰 <b>Monto:</b> $${amount} MXN
📅 <b>Fecha límite:</b> ${dueDate}
📄 <b>Factura:</b> #${invoiceNumber}

<b>Métodos de pago disponibles:</b>
• Efectivo en clínica
• Transferencia bancaria
• Tarjeta de crédito/débito

Para cualquier duda, no dudes en contactarnos.

¡Gracias por tu preferencia! 🙏`;

		const payload: TelegramMessage = {
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{ text: "💳 Pagar Ahora", url: "https://cognident.org/es/payment" },
						{ text: "📞 Contactar", url: "tel:+525512345678" },
					],
				],
			},
		};

		return this.sendMessage("sendMessage", payload);
	}

	/**
	 * Send post-treatment care instructions
	 */
	async sendPostTreatmentCare(
		chatId: string | number,
		patientName: string,
		treatmentType: string,
		instructions: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const message = `🩺 <b>Cuidados Post-Tratamiento</b>

Hola ${patientName},

Esperamos que te encuentres bien después de tu ${treatmentType}.

<b>Instrucciones de cuidado:</b>
${instructions}

<b>Recomendaciones generales:</b>
• Mantén una buena higiene oral
• Evita alimentos muy duros o pegajosos
• Toma los medicamentos según las indicaciones
• Aplica hielo si hay inflamación

<b>⚠️ Contacta inmediatamente si experimentas:</b>
• Dolor severo que no mejora
• Sangrado excesivo
• Fiebre alta
• Inflamación que empeora

¡Que tengas una pronta recuperación! 💪

<i>Clínica Dental Cognident</i>`;

		const payload: TelegramMessage = {
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{ text: "🆘 Emergencia", url: "tel:+525512345678" },
						{ text: "💬 Consulta", callback_data: "post_treatment_question" },
					],
				],
			},
		};

		return this.sendMessage("sendMessage", payload);
	}

	/**
	 * Send promotional message
	 */
	async sendPromotion(
		chatId: string | number,
		patientName: string,
		promotionTitle: string,
		promotionDetails: string,
		validUntil: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const message = `🎉 <b>${promotionTitle}</b>

¡Hola ${patientName}!

Tenemos una oferta especial para ti:

${promotionDetails}

⏰ <b>Válida hasta:</b> ${validUntil}

¡No dejes pasar esta oportunidad de cuidar tu sonrisa!

<i>Clínica Dental Cognident</i>`;

		const payload: TelegramMessage = {
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "📅 Agendar Cita",
							url: "https://cognident.org/es/appointments/book",
						},
						{ text: "📞 Llamar", url: "tel:+525512345678" },
					],
				],
			},
		};

		return this.sendMessage("sendMessage", payload);
	}

	/**
	 * Send image (X-rays, treatment photos, etc.)
	 */
	async sendPhoto(
		chatId: string | number,
		photoUrl: string,
		caption?: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const payload: TelegramMessage = {
			chat_id: chatId,
			photo: photoUrl,
			caption: caption,
			parse_mode: "HTML",
		};

		return this.sendMessage("sendPhoto", payload);
	}

	/**
	 * Send document (treatment plans, invoices, etc.)
	 */
	async sendDocument(
		chatId: string | number,
		documentUrl: string,
		caption?: string,
	): Promise<TelegramResponse | null> {
		if (!this.isAvailable()) {
			console.warn("Telegram not available");
			return null;
		}

		const payload: TelegramMessage = {
			chat_id: chatId,
			document: documentUrl,
			caption: caption,
			parse_mode: "HTML",
		};

		return this.sendMessage("sendDocument", payload);
	}

	/**
	 * Process incoming webhook update
	 */
	async processUpdate(update: TelegramUpdate): Promise<void> {
		try {
			if (update.message) {
				await this.handleMessage(update.message);
			} else if (update.callback_query) {
				await this.handleCallbackQuery(update.callback_query);
			}
		} catch (error) {
			console.error("Error processing Telegram update:", error);
		}
	}

	/**
	 * Handle incoming text message
	 */
	private async handleMessage(message: any): Promise<void> {
		const chatId = message.chat.id;
		const text = message.text?.toLowerCase() || "";
		const userName = message.from.first_name;

		console.log(
			`Telegram message from ${userName} (${chatId}): ${message.text}`,
		);

		// Auto-reply for common queries
		if (text.includes("/start")) {
			await this.sendTextMessage(
				chatId,
				`¡Hola ${userName}! 👋

Bienvenido a <b>Clínica Dental Cognident</b>.

Estoy aquí para ayudarte con:
• 📅 Información sobre citas
• 🕐 Horarios de atención
• 📍 Ubicación de la clínica
• 💳 Información de pagos

¿En qué puedo ayudarte hoy?`,
			);
		} else if (text.includes("cita") || text.includes("appointment")) {
			await this.sendTextMessage(
				chatId,
				`📅 <b>Información de Citas</b>

Para agendar una cita puedes:
• Llamarnos al (55) 1234-5678
• Visitar nuestra página web
• Enviarnos un mensaje aquí

<b>Horarios disponibles:</b>
Lunes a Viernes: 8:00 AM - 7:00 PM
Sábados: 9:00 AM - 3:00 PM

¿Te gustaría que te ayude a agendar una cita?`,
			);
		} else if (text.includes("horario") || text.includes("hours")) {
			await this.sendTextMessage(
				chatId,
				`🕐 <b>Horarios de Atención</b>

<b>Lunes a Viernes:</b> 8:00 AM - 7:00 PM
<b>Sábados:</b> 9:00 AM - 3:00 PM
<b>Domingos:</b> Cerrado

<b>Emergencias:</b> 24/7 al (55) 1234-5678

¿Necesitas algo más?`,
			);
		} else if (text.includes("ubicación") || text.includes("location")) {
			await this.sendTextMessage(
				chatId,
				`📍 <b>Nuestra Ubicación</b>

Av. Reforma 123, Col. Centro
Ciudad de México, CDMX
CP 06000

<b>Referencias:</b>
• Frente al Metro Bellas Artes
• A 2 cuadras del Palacio de Bellas Artes

¿Necesitas indicaciones específicas?`,
			);
		} else {
			await this.sendTextMessage(
				chatId,
				`Gracias por tu mensaje, ${userName}. 

Un miembro de nuestro equipo te responderá pronto. 

Para atención inmediata, puedes llamarnos al (55) 1234-5678.

¡Que tengas un excelente día! 😊`,
			);
		}
	}

	/**
	 * Handle callback query (button presses)
	 */
	private async handleCallbackQuery(callbackQuery: any): Promise<void> {
		const chatId = callbackQuery.from.id;
		const data = callbackQuery.data;

		switch (data) {
			case "confirm_appointment":
				await this.sendTextMessage(
					chatId,
					"✅ ¡Perfecto! Tu cita ha sido confirmada. Te esperamos puntualmente. Si necesitas hacer algún cambio, contáctanos lo antes posible.",
				);
				break;
			case "post_treatment_question":
				await this.sendTextMessage(
					chatId,
					"💬 Por favor describe tu consulta y un especialista te responderá pronto. Para emergencias, llama inmediatamente al (55) 1234-5678.",
				);
				break;
		}

		// Answer the callback query to remove the loading state
		await this.answerCallbackQuery(callbackQuery.id);
	}

	/**
	 * Answer callback query
	 */
	private async answerCallbackQuery(callbackQueryId: string): Promise<void> {
		if (!this.isAvailable()) return;

		try {
			await fetch(`${this.baseUrl}/answerCallbackQuery`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					callback_query_id: callbackQueryId,
				}),
			});
		} catch (error) {
			console.error("Error answering callback query:", error);
		}
	}

	/**
	 * Send message to Telegram API
	 */
	private async sendMessage(
		method: string,
		payload: any,
	): Promise<TelegramResponse | null> {
		try {
			const response = await fetch(`${this.baseUrl}/${method}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (!result.ok) {
				throw new Error(`Telegram API error: ${result.description}`);
			}

			console.log("Telegram message sent successfully");
			return result;
		} catch (error) {
			console.error("Error sending Telegram message:", error);
			return null;
		}
	}
}

// Singleton instance
export const telegramService = new TelegramService();
