import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const updateClaimSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "PROCESSING", "APPROVED", "DENIED", "PARTIAL", "PAID", "APPEALED", "REJECTED", "UNDER_REVIEW", "RESUBMITTED"]).optional(),
  paidAmount: z.number().min(0).optional(),
  patientResponsibility: z.number().min(0).optional(),
  denialReason: z.string().optional(),
  denialCodes: z.array(z.string()).optional(),
  eobReceived: z.boolean().optional(),
  eobDate: z.string().transform((str) => new Date(str)).optional(),
  remittanceAdvice: z.string().optional(),
  appealDeadline: z.string().transform((str) => new Date(str)).optional(),
});

// GET /api/dashboard/claims/[id] - Get specific claim
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

    const claim = await prisma.claim.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            phone: true,
            email: true,
          },
        },
        payer: {
          select: {
            id: true,
            name: true,
            payerCode: true,
            claimsEndpoint: true,
          },
        },
        patientInsurance: {
          select: {
            id: true,
            policyNumber: true,
            groupNumber: true,
            subscriberId: true,
            subscriberName: true,
            relationship: true,
          },
        },
        clearinghouse: {
          select: {
            id: true,
            name: true,
            apiEndpoint: true,
          },
        },
        procedures: {
          orderBy: {
            lineNumber: "asc",
          },
        },
        payments: {
          orderBy: {
            paymentDate: "desc",
          },
        },
        adjustments: {
          orderBy: {
            adjustmentDate: "desc",
          },
        },
        appeals: {
          select: {
            id: true,
            claimNumber: true,
            status: true,
            createdAt: true,
          },
        },
        originalClaim: {
          select: {
            id: true,
            claimNumber: true,
            status: true,
          },
        },
      },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    return NextResponse.json({ claim });
  } catch (error) {
    console.error("Error fetching claim:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/claims/[id] - Update claim
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
    const validatedData = updateClaimSchema.parse(body);

    const { id } = await params;

    // Check if claim exists and belongs to practice
    const existingClaim = await prisma.claim.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
    });

    if (!existingClaim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Update claim
    const claim = await prisma.claim.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json({ claim });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating claim:", error);
    return NextResponse.json(
      { error: "Failed to update claim" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/claims/[id] - Delete claim
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

    // Check if claim exists and belongs to practice
    const existingClaim = await prisma.claim.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
    });

    if (!existingClaim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Only allow deletion of draft claims
    if (existingClaim.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft claims can be deleted" },
        { status: 400 }
      );
    }

    await prisma.claim.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    return NextResponse.json(
      { error: "Failed to delete claim" },
      { status: 500 }
    );
  }
}
