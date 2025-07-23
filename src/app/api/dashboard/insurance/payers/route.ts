import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const createPayerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["PRIMARY", "SECONDARY", "TERTIARY"]),
  payerCode: z.string().min(1, "Payer code is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  clearinghouseId: z.string().optional(),
  eligibilityEndpoint: z.string().url().optional(),
  claimsEndpoint: z.string().url().optional(),
  remittanceEndpoint: z.string().url().optional(),
  contractedRates: z.record(z.number()).optional(),
});

const updatePayerSchema = createPayerSchema.partial();

// GET /api/dashboard/insurance/payers - Get all insurance payers
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");

    const where: any = {
      practiceId: user.practiceId,
    };

    if (type) {
      where.type = type;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const payers = await prisma.insurancePayer.findMany({
      where,
      include: {
        clearinghouse: true,
        _count: {
          select: {
            claims: true,
            eligibilityChecks: true,
            patientInsurances: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ payers });
  } catch (error) {
    console.error("Error fetching insurance payers:", error);
    return NextResponse.json(
      { error: "Failed to fetch insurance payers" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/insurance/payers - Create new insurance payer
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPayerSchema.parse(body);

    // Check if payer code already exists
    const existingPayer = await prisma.insurancePayer.findFirst({
      where: {
        payerCode: validatedData.payerCode,
        practiceId: user.practiceId,
      },
    });

    if (existingPayer) {
      return NextResponse.json(
        { error: "Payer code already exists" },
        { status: 400 }
      );
    }

    const payer = await prisma.insurancePayer.create({
      data: {
        ...validatedData,
        practiceId: user.practiceId,
      },
      include: {
        clearinghouse: true,
        _count: {
          select: {
            claims: true,
            eligibilityChecks: true,
            patientInsurances: true,
          },
        },
      },
    });

    return NextResponse.json({ payer }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating insurance payer:", error);
    return NextResponse.json(
      { error: "Failed to create insurance payer" },
      { status: 500 }
    );
  }
}
