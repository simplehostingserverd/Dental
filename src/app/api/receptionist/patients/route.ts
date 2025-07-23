import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";

// Validation schemas
const CreatePatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().datetime("Invalid date format"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().default("US"),
  }),
  insurance: z.object({
    provider: z.string().optional(),
    policyNumber: z.string().optional(),
    groupNumber: z.string().optional(),
    subscriberName: z.string().optional(),
    relationship: z.enum(["self", "spouse", "child", "other"]).optional(),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Emergency contact phone is required"),
  }),
  medicalHistory: z.object({
    allergies: z.array(z.string()).default([]),
    medications: z.array(z.string()).default([]),
    conditions: z.array(z.string()).default([]),
    notes: z.string().optional(),
  }).optional(),
  preferences: z.object({
    preferredContactMethod: z.enum(["phone", "email", "sms", "whatsapp"]).default("phone"),
    reminderEnabled: z.boolean().default(true),
    marketingOptIn: z.boolean().default(false),
  }).optional(),
});

const UpdatePatientSchema = CreatePatientSchema.partial().extend({
  id: z.string(),
});

// Mock database
let patients: any[] = [
  {
    id: "patient-1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    dateOfBirth: "1985-03-15T00:00:00Z",
    gender: "male",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "US",
    },
    insurance: {
      provider: "Delta Dental",
      policyNumber: "DD123456789",
      groupNumber: "GRP001",
      subscriberName: "John Smith",
      relationship: "self",
    },
    emergencyContact: {
      name: "Jane Smith",
      relationship: "spouse",
      phone: "+1-555-0124",
    },
    medicalHistory: {
      allergies: ["Penicillin"],
      medications: ["Lisinopril"],
      conditions: ["Hypertension"],
      notes: "Patient has anxiety about dental procedures",
    },
    preferences: {
      preferredContactMethod: "email",
      reminderEnabled: true,
      marketingOptIn: true,
    },
    status: "active",
    practiceId: "practice-1",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2025-07-20T14:30:00Z"),
    lastVisit: new Date("2025-06-15T09:00:00Z"),
    nextAppointment: new Date("2025-07-24T10:00:00Z"),
  },
  {
    id: "patient-2",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@email.com",
    phone: "+1-555-0125",
    dateOfBirth: "1992-08-22T00:00:00Z",
    gender: "female",
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "TX",
      zipCode: "67890",
      country: "US",
    },
    emergencyContact: {
      name: "Carlos Garcia",
      relationship: "husband",
      phone: "+1-555-0126",
    },
    preferences: {
      preferredContactMethod: "sms",
      reminderEnabled: true,
      marketingOptIn: false,
    },
    status: "active",
    practiceId: "practice-1",
    createdAt: new Date("2024-03-20T11:00:00Z"),
    updatedAt: new Date("2025-07-21T16:00:00Z"),
    lastVisit: new Date("2025-05-10T14:00:00Z"),
    nextAppointment: new Date("2025-07-24T14:30:00Z"),
  },
];

// GET /api/receptionist/patients - Get all patients
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "lastName";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Filter patients
    let filteredPatients = patients.filter(patient => patient.practiceId === user.id);

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = filteredPatients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phone.includes(search)
      );
    }

    if (status) {
      filteredPatients = filteredPatients.filter(patient => patient.status === status);
    }

    // Sort patients
    filteredPatients.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedPatients,
      pagination: {
        page,
        limit,
        total: filteredPatients.length,
        totalPages: Math.ceil(filteredPatients.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// POST /api/receptionist/patients - Create new patient
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreatePatientSchema.parse(body);

    // Check for duplicate email or phone
    const existingPatient = patients.find(patient =>
      patient.practiceId === user.id &&
      (patient.email === validatedData.email || patient.phone === validatedData.phone)
    );

    if (existingPatient) {
      return NextResponse.json(
        { error: "Patient with this email or phone already exists" },
        { status: 409 }
      );
    }

    const newPatient = {
      id: `patient-${Date.now()}`,
      ...validatedData,
      status: "active",
      practiceId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastVisit: null,
      nextAppointment: null,
    };

    patients.push(newPatient);

    // Send welcome message (in production)
    console.log(`New patient registered: ${validatedData.firstName} ${validatedData.lastName}`);

    return NextResponse.json({
      success: true,
      data: newPatient,
      message: "Patient registered successfully",
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}

// PUT /api/receptionist/patients - Update patient
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdatePatientSchema.parse(body);

    const patientIndex = patients.findIndex(
      patient => patient.id === validatedData.id && patient.practiceId === user.id
    );

    if (patientIndex === -1) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check for duplicate email or phone (excluding current patient)
    if (validatedData.email || validatedData.phone) {
      const existingPatient = patients.find(patient =>
        patient.practiceId === user.id &&
        patient.id !== validatedData.id &&
        (
          (validatedData.email && patient.email === validatedData.email) ||
          (validatedData.phone && patient.phone === validatedData.phone)
        )
      );

      if (existingPatient) {
        return NextResponse.json(
          { error: "Another patient with this email or phone already exists" },
          { status: 409 }
        );
      }
    }

    const updatedPatient = {
      ...patients[patientIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    patients[patientIndex] = updatedPatient;

    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: "Patient updated successfully",
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

// DELETE /api/receptionist/patients - Deactivate patient
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("id");

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }

    const patientIndex = patients.findIndex(
      patient => patient.id === patientId && patient.practiceId === user.id
    );

    if (patientIndex === -1) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Mark as inactive instead of deleting
    patients[patientIndex].status = "inactive";
    patients[patientIndex].deactivatedAt = new Date();
    patients[patientIndex].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: "Patient deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating patient:", error);
    return NextResponse.json(
      { error: "Failed to deactivate patient" },
      { status: 500 }
    );
  }
}
