import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const createClaimSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  payerId: z.string().min(1, "Payer ID is required"),
  patientInsuranceId: z.string().optional(),
  clearinghouseId: z.string().optional(),
  serviceDate: z.string().transform((str) => new Date(str)),
  totalAmount: z.number().positive("Total amount must be positive"),
  procedures: z.array(z.object({
    procedureCode: z.string().min(1, "Procedure code is required"),
    description: z.string().min(1, "Description is required"),
    tooth: z.string().optional(),
    surface: z.string().optional(),
    quantity: z.number().int().positive().default(1),
    chargedAmount: z.number().positive("Charged amount must be positive"),
  })),
});

const updateClaimSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "PROCESSING", "APPROVED", "DENIED", "PARTIAL", "PAID", "APPEALED", "REJECTED", "UNDER_REVIEW", "RESUBMITTED"]).optional(),
  paidAmount: z.number().min(0).optional(),
  patientResponsibility: z.number().min(0).optional(),
  denialReason: z.string().optional(),
  denialCodes: z.array(z.string()).optional(),
  eobReceived: z.boolean().optional(),
  eobDate: z.string().transform((str) => new Date(str)).optional(),
  remittanceAdvice: z.string().optional(),
});

// GET /api/dashboard/claims - Get all claims
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const payerId = searchParams.get("payerId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      practiceId: user.practiceId,
    };

    if (patientId) {
      where.patientId = patientId;
    }

    if (payerId) {
      where.payerId = payerId;
    }

    if (status) {
      where.status = status;
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
            },
          },
          payer: {
            select: {
              id: true,
              name: true,
              payerCode: true,
            },
          },
          patientInsurance: {
            select: {
              id: true,
              policyNumber: true,
              groupNumber: true,
            },
          },
          clearinghouse: {
            select: {
              id: true,
              name: true,
            },
          },
          procedures: true,
          payments: true,
          adjustments: true,
          _count: {
            select: {
              appeals: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.claim.count({ where }),
    ]);

    return NextResponse.json({
      claims,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json(
      { error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/claims - Create new claim
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createClaimSchema.parse(body);

    // Verify patient belongs to practice
    const patient = await prisma.patient.findFirst({
      where: {
        id: validatedData.patientId,
        practiceId: user.practiceId,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Verify payer belongs to practice
    const payer = await prisma.insurancePayer.findFirst({
      where: {
        id: validatedData.payerId,
        practiceId: user.practiceId,
      },
    });

    if (!payer) {
      return NextResponse.json({ error: "Payer not found" }, { status: 404 });
    }

    // Generate claim number
    const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create claim with procedures
    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        patientId: validatedData.patientId,
        payerId: validatedData.payerId,
        patientInsuranceId: validatedData.patientInsuranceId,
        clearinghouseId: validatedData.clearinghouseId,
        serviceDate: validatedData.serviceDate,
        totalAmount: validatedData.totalAmount,
        practiceId: user.practiceId,
        status: "DRAFT",
        procedures: {
          create: validatedData.procedures.map((proc, index) => ({
            ...proc,
            lineNumber: index + 1,
            allowedAmount: proc.chargedAmount, // Default to charged amount
          })),
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
          },
        },
        payer: {
          select: {
            id: true,
            name: true,
            payerCode: true,
          },
        },
        patientInsurance: {
          select: {
            id: true,
            policyNumber: true,
            groupNumber: true,
          },
        },
        clearinghouse: {
          select: {
            id: true,
            name: true,
          },
        },
        procedures: true,
        payments: true,
        adjustments: true,
      },
    });

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating claim:", error);
    return NextResponse.json(
      { error: "Failed to create claim" },
      { status: 500 }
    );
  }
}
