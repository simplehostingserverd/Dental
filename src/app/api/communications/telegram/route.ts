import { getCurrentUser } from "@/lib/auth/get-user";
import { telegramService } from "@/lib/communications/telegram";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Telegram message validation schema
const TelegramMessageSchema = z.object({
	chatId: z.union([z.string(), z.number()]),
	type: z.enum([
		"text",
		"appointment_reminder",
		"appointment_confirmation",
		"payment_reminder",
		"post_treatment",
		"promotion",
	]),
	message: z.string().optional(),
	data: z
		.object({
			patientName: z.string().optional(),
			appointmentDate: z.string().optional(),
			appointmentTime: z.string().optional(),
			doctorName: z.string().optional(),
			clinicAddress: z.string().optional(),
			treatmentType: z.string().optional(),
			amount: z.string().optional(),
			dueDate: z.string().optional(),
			invoiceNumber: z.string().optional(),
			instructions: z.string().optional(),
			promotionTitle: z.string().optional(),
			promotionDetails: z.string().optional(),
			validUntil: z.string().optional(),
		})
		.optional(),
});

// POST /api/communications/telegram - Send Telegram message
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!telegramService.isAvailable()) {
			return NextResponse.json(
				{ error: "Telegram service not configured" },
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = TelegramMessageSchema.parse(body);

		let result = null;

		switch (validatedData.type) {
			case "text":
				if (!validatedData.message) {
					return NextResponse.json(
						{ error: "Message text is required for text messages" },
						{ status: 400 },
					);
				}
				result = await telegramService.sendTextMessage(
					validatedData.chatId,
					validatedData.message,
				);
				break;

			case "appointment_reminder":
				if (
					!validatedData.data?.patientName ||
					!validatedData.data?.appointmentDate ||
					!validatedData.data?.appointmentTime ||
					!validatedData.data?.doctorName ||
					!validatedData.data?.clinicAddress
				) {
					return NextResponse.json(
						{
							error:
								"Patient name, appointment date, time, doctor name, and clinic address are required",
						},
						{ status: 400 },
					);
				}
				result = await telegramService.sendAppointmentReminder(
					validatedData.chatId,
					validatedData.data.patientName,
					validatedData.data.appointmentDate,
					validatedData.data.appointmentTime,
					validatedData.data.doctorName,
					validatedData.data.clinicAddress,
				);
				break;

			case "appointment_confirmation":
				if (
					!validatedData.data?.patientName ||
					!validatedData.data?.appointmentDate ||
					!validatedData.data?.appointmentTime ||
					!validatedData.data?.treatmentType
				) {
					return NextResponse.json(
						{
							error:
								"Patient name, appointment date, time, and treatment type are required",
						},
						{ status: 400 },
					);
				}
				result = await telegramService.sendAppointmentConfirmation(
					validatedData.chatId,
					validatedData.data.patientName,
					validatedData.data.appointmentDate,
					validatedData.data.appointmentTime,
					validatedData.data.treatmentType,
				);
				break;

			case "payment_reminder":
				if (
					!validatedData.data?.patientName ||
					!validatedData.data?.amount ||
					!validatedData.data?.dueDate ||
					!validatedData.data?.invoiceNumber
				) {
					return NextResponse.json(
						{
							error:
								"Patient name, amount, due date, and invoice number are required",
						},
						{ status: 400 },
					);
				}
				result = await telegramService.sendPaymentReminder(
					validatedData.chatId,
					validatedData.data.patientName,
					validatedData.data.amount,
					validatedData.data.dueDate,
					validatedData.data.invoiceNumber,
				);
				break;

			case "post_treatment":
				if (
					!validatedData.data?.patientName ||
					!validatedData.data?.treatmentType ||
					!validatedData.data?.instructions
				) {
					return NextResponse.json(
						{
							error:
								"Patient name, treatment type, and instructions are required",
						},
						{ status: 400 },
					);
				}
				result = await telegramService.sendPostTreatmentCare(
					validatedData.chatId,
					validatedData.data.patientName,
					validatedData.data.treatmentType,
					validatedData.data.instructions,
				);
				break;

			case "promotion":
				if (
					!validatedData.data?.patientName ||
					!validatedData.data?.promotionTitle ||
					!validatedData.data?.promotionDetails ||
					!validatedData.data?.validUntil
				) {
					return NextResponse.json(
						{
							error:
								"Patient name, promotion title, details, and valid until date are required",
						},
						{ status: 400 },
					);
				}
				result = await telegramService.sendPromotion(
					validatedData.chatId,
					validatedData.data.patientName,
					validatedData.data.promotionTitle,
					validatedData.data.promotionDetails,
					validatedData.data.validUntil,
				);
				break;

			default:
				return NextResponse.json(
					{ error: "Invalid message type" },
					{ status: 400 },
				);
		}

		if (!result) {
			return NextResponse.json(
				{ error: "Failed to send Telegram message" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Telegram message sent successfully",
			data: result,
		});
	} catch (error) {
		console.error("Error sending Telegram message:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to send Telegram message" },
			{ status: 500 },
		);
	}
}

// GET /api/communications/telegram - Get Telegram status
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json({
			available: telegramService.isAvailable(),
			status: telegramService.isAvailable() ? "configured" : "not_configured",
		});
	} catch (error) {
		console.error("Error checking Telegram status:", error);
		return NextResponse.json(
			{ error: "Failed to check Telegram status" },
			{ status: 500 },
		);
	}
}
