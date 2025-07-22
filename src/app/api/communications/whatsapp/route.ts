import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/communications/whatsapp";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

// WhatsApp message validation schema
const WhatsAppMessageSchema = z.object({
  to: z.string().min(10, "Valid phone number is required"),
  type: z.enum(['text', 'appointment_reminder', 'appointment_confirmation', 'payment_reminder', 'post_treatment']),
  message: z.string().optional(),
  data: z.object({
    patientName: z.string().optional(),
    appointmentDate: z.string().optional(),
    appointmentTime: z.string().optional(),
    doctorName: z.string().optional(),
    clinicName: z.string().optional(),
    amount: z.string().optional(),
    dueDate: z.string().optional(),
    treatmentType: z.string().optional(),
    instructions: z.string().optional(),
  }).optional(),
});

// POST /api/communications/whatsapp - Send WhatsApp message
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!whatsappService.isAvailable()) {
      return NextResponse.json(
        { error: "WhatsApp service not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validatedData = WhatsAppMessageSchema.parse(body);

    let result = null;

    switch (validatedData.type) {
      case 'text':
        if (!validatedData.message) {
          return NextResponse.json(
            { error: "Message text is required for text messages" },
            { status: 400 }
          );
        }
        result = await whatsappService.sendTextMessage(
          validatedData.to,
          validatedData.message
        );
        break;

      case 'appointment_reminder':
        if (!validatedData.data?.patientName || !validatedData.data?.appointmentDate || 
            !validatedData.data?.appointmentTime || !validatedData.data?.doctorName) {
          return NextResponse.json(
            { error: "Patient name, appointment date, time, and doctor name are required" },
            { status: 400 }
          );
        }
        result = await whatsappService.sendAppointmentReminder(
          validatedData.to,
          validatedData.data.patientName,
          validatedData.data.appointmentDate,
          validatedData.data.appointmentTime,
          validatedData.data.doctorName
        );
        break;

      case 'appointment_confirmation':
        if (!validatedData.data?.patientName || !validatedData.data?.appointmentDate || 
            !validatedData.data?.appointmentTime || !validatedData.data?.clinicName) {
          return NextResponse.json(
            { error: "Patient name, appointment date, time, and clinic name are required" },
            { status: 400 }
          );
        }
        result = await whatsappService.sendAppointmentConfirmation(
          validatedData.to,
          validatedData.data.patientName,
          validatedData.data.appointmentDate,
          validatedData.data.appointmentTime,
          validatedData.data.clinicName
        );
        break;

      case 'payment_reminder':
        if (!validatedData.data?.patientName || !validatedData.data?.amount || 
            !validatedData.data?.dueDate) {
          return NextResponse.json(
            { error: "Patient name, amount, and due date are required" },
            { status: 400 }
          );
        }
        result = await whatsappService.sendPaymentReminder(
          validatedData.to,
          validatedData.data.patientName,
          validatedData.data.amount,
          validatedData.data.dueDate
        );
        break;

      case 'post_treatment':
        if (!validatedData.data?.patientName || !validatedData.data?.treatmentType || 
            !validatedData.data?.instructions) {
          return NextResponse.json(
            { error: "Patient name, treatment type, and instructions are required" },
            { status: 400 }
          );
        }
        result = await whatsappService.sendPostTreatmentCare(
          validatedData.to,
          validatedData.data.patientName,
          validatedData.data.treatmentType,
          validatedData.data.instructions
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid message type" },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        { error: "Failed to send WhatsApp message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp message sent successfully",
      data: result
    });

  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}

// GET /api/communications/whatsapp - Get WhatsApp status
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      available: whatsappService.isAvailable(),
      status: whatsappService.isAvailable() ? "configured" : "not_configured"
    });

  } catch (error) {
    console.error("Error checking WhatsApp status:", error);
    return NextResponse.json(
      { error: "Failed to check WhatsApp status" },
      { status: 500 }
    );
  }
}
