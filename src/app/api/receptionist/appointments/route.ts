import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";

// Validation schemas
const CreateAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  dentistId: z.string().min(1, "Dentist ID is required"),
  appointmentType: z.enum([
    "consultation", "cleaning", "filling", "crown", "extraction", 
    "emergency", "checkup", "whitening", "orthodontics", "surgery"
  ]),
  date: z.string().datetime("Invalid date format"),
  duration: z.number().min(15).max(480), // 15 minutes to 8 hours
  notes: z.string().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  reminderEnabled: z.boolean().default(true),
  insuranceVerified: z.boolean().default(false),
});

const UpdateAppointmentSchema = CreateAppointmentSchema.partial().extend({
  id: z.string(),
  status: z.enum(["scheduled", "confirmed", "in-progress", "completed", "cancelled", "no-show"]).optional(),
});

// Mock database
let appointments: any[] = [
  {
    id: "apt-1",
    patientId: "patient-1",
    patientName: "John Smith",
    dentistId: "dentist-1",
    dentistName: "Dr. Sarah Johnson",
    appointmentType: "cleaning",
    date: new Date("2025-07-24T10:00:00Z"),
    duration: 60,
    status: "scheduled",
    notes: "Regular cleaning and checkup",
    priority: "normal",
    reminderEnabled: true,
    insuranceVerified: true,
    practiceId: "practice-1",
    createdAt: new Date("2025-07-20T09:00:00Z"),
    updatedAt: new Date("2025-07-20T09:00:00Z"),
  },
  {
    id: "apt-2",
    patientId: "patient-2",
    patientName: "Maria Garcia",
    dentistId: "dentist-1",
    dentistName: "Dr. Sarah Johnson",
    appointmentType: "filling",
    date: new Date("2025-07-24T14:30:00Z"),
    duration: 90,
    status: "confirmed",
    notes: "Cavity filling on upper left molar",
    priority: "normal",
    reminderEnabled: true,
    insuranceVerified: false,
    practiceId: "practice-1",
    createdAt: new Date("2025-07-21T11:00:00Z"),
    updatedAt: new Date("2025-07-21T11:00:00Z"),
  },
];

// GET /api/receptionist/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const dentistId = searchParams.get("dentistId");
    const patientId = searchParams.get("patientId");
    const date = searchParams.get("date");
    const appointmentType = searchParams.get("appointmentType");

    // Filter appointments
    let filteredAppointments = appointments.filter(apt => apt.practiceId === user.id);

    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }

    if (dentistId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.dentistId === dentistId);
    }

    if (patientId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.patientId === patientId);
    }

    if (date) {
      const targetDate = new Date(date);
      filteredAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === targetDate.toDateString();
      });
    }

    if (appointmentType) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentType === appointmentType);
    }

    // Sort by date (earliest first)
    filteredAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAppointments,
      pagination: {
        page,
        limit,
        total: filteredAppointments.length,
        totalPages: Math.ceil(filteredAppointments.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST /api/receptionist/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateAppointmentSchema.parse(body);

    // Check for scheduling conflicts
    const appointmentDate = new Date(validatedData.date);
    const endTime = new Date(appointmentDate.getTime() + validatedData.duration * 60000);

    const conflicts = appointments.filter(apt => {
      if (apt.practiceId !== user.id || apt.dentistId !== validatedData.dentistId) {
        return false;
      }
      
      const existingStart = new Date(apt.date);
      const existingEnd = new Date(existingStart.getTime() + apt.duration * 60000);
      
      return (
        (appointmentDate >= existingStart && appointmentDate < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (appointmentDate <= existingStart && endTime >= existingEnd)
      );
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: "Time slot conflicts with existing appointment" },
        { status: 409 }
      );
    }

    const newAppointment = {
      id: `apt-${Date.now()}`,
      ...validatedData,
      status: "scheduled",
      practiceId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      // In production, these would be fetched from the database
      patientName: "Patient Name", // Would be fetched based on patientId
      dentistName: "Dr. Name", // Would be fetched based on dentistId
    };

    appointments.push(newAppointment);

    // Send confirmation notifications (in production)
    console.log(`Appointment scheduled for ${validatedData.date}`);

    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: "Appointment scheduled successfully",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

// PUT /api/receptionist/appointments - Update appointment
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdateAppointmentSchema.parse(body);

    const appointmentIndex = appointments.findIndex(
      apt => apt.id === validatedData.id && apt.practiceId === user.id
    );

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const existingAppointment = appointments[appointmentIndex];
    
    // Check if appointment can be modified
    if (existingAppointment.status === "completed" || existingAppointment.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot modify completed or cancelled appointments" },
        { status: 400 }
      );
    }

    // If date/time is being changed, check for conflicts
    if (validatedData.date || validatedData.duration) {
      const newDate = validatedData.date ? new Date(validatedData.date) : new Date(existingAppointment.date);
      const newDuration = validatedData.duration || existingAppointment.duration;
      const endTime = new Date(newDate.getTime() + newDuration * 60000);

      const conflicts = appointments.filter(apt => {
        if (apt.id === validatedData.id || apt.practiceId !== user.id) {
          return false;
        }
        
        const existingStart = new Date(apt.date);
        const existingEnd = new Date(existingStart.getTime() + apt.duration * 60000);
        
        return (
          (newDate >= existingStart && newDate < existingEnd) ||
          (endTime > existingStart && endTime <= existingEnd) ||
          (newDate <= existingStart && endTime >= existingEnd)
        );
      });

      if (conflicts.length > 0) {
        return NextResponse.json(
          { error: "Time slot conflicts with existing appointment" },
          { status: 409 }
        );
      }
    }

    const updatedAppointment = {
      ...existingAppointment,
      ...validatedData,
      updatedAt: new Date(),
    };

    appointments[appointmentIndex] = updatedAppointment;

    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE /api/receptionist/appointments - Cancel appointment
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");
    const reason = searchParams.get("reason") || "Cancelled by practice";

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    const appointmentIndex = appointments.findIndex(
      apt => apt.id === appointmentId && apt.practiceId === user.id
    );

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const appointment = appointments[appointmentIndex];

    // Mark as cancelled instead of deleting
    appointment.status = "cancelled";
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    appointment.updatedAt = new Date();

    // Send cancellation notification (in production)
    console.log(`Appointment ${appointmentId} cancelled: ${reason}`);

    return NextResponse.json({
      success: true,
      data: appointment,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
