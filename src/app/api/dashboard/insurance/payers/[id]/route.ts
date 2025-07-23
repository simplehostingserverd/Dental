import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const updatePayerSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.enum(["PRIMARY", "SECONDARY", "TERTIARY"]).optional(),
  payerCode: z.string().min(1, "Payer code is required").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  isActive: z.boolean().optional(),
  clearinghouseId: z.string().optional(),
  eligibilityEndpoint: z.string().url().optional(),
  claimsEndpoint: z.string().url().optional(),
  remittanceEndpoint: z.string().url().optional(),
  contractedRates: z.record(z.number()).optional(),
});

// GET /api/dashboard/insurance/payers/[id] - Get specific insurance payer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const payer = await prisma.insurancePayer.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
      include: {
        clearinghouse: true,
        claims: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        eligibilityChecks: {
          take: 10,
          orderBy: { requestedAt: "desc" },
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        patientInsurances: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            claims: true,
            eligibilityChecks: true,
            patientInsurances: true,
          },
        },
      },
    });

    if (!payer) {
      return NextResponse.json({ error: "Payer not found" }, { status: 404 });
    }

    return NextResponse.json({ payer });
  } catch (error) {
    console.error("Error fetching insurance payer:", error);
    return NextResponse.json(
      { error: "Failed to fetch insurance payer" },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/insurance/payers/[id] - Update insurance payer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePayerSchema.parse(body);

    const { id } = await params;

    // Check if payer exists and belongs to practice
    const existingPayer = await prisma.insurancePayer.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
    });

    if (!existingPayer) {
      return NextResponse.json({ error: "Payer not found" }, { status: 404 });
    }

    // Check if payer code is being changed and if it already exists
    if (validatedData.payerCode && validatedData.payerCode !== existingPayer.payerCode) {
      const duplicatePayer = await prisma.insurancePayer.findFirst({
        where: {
          payerCode: validatedData.payerCode,
          practiceId: user.practiceId,
          id: { not: id },
        },
      });

      if (duplicatePayer) {
        return NextResponse.json(
          { error: "Payer code already exists" },
          { status: 400 }
        );
      }
    }

    const payer = await prisma.insurancePayer.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json({ payer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating insurance payer:", error);
    return NextResponse.json(
      { error: "Failed to update insurance payer" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/insurance/payers/[id] - Delete insurance payer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if payer exists and belongs to practice
    const existingPayer = await prisma.insurancePayer.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
      include: {
        _count: {
          select: {
            claims: true,
            patientInsurances: true,
          },
        },
      },
    });

    if (!existingPayer) {
      return NextResponse.json({ error: "Payer not found" }, { status: 404 });
    }

    // Check if payer has associated data
    if (existingPayer._count.claims > 0 || existingPayer._count.patientInsurances > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete payer with associated claims or patient insurances. Deactivate instead." 
        },
        { status: 400 }
      );
    }

    await prisma.insurancePayer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Payer deleted successfully" });
  } catch (error) {
    console.error("Error deleting insurance payer:", error);
    return NextResponse.json(
      { error: "Failed to delete insurance payer" },
      { status: 500 }
    );
  }
}
