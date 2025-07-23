import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

// POST /api/dashboard/claims/[id]/submit - Submit claim to clearinghouse
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get claim with all required data
    const claim = await prisma.claim.findFirst({
      where: {
        id,
        practiceId: user.practiceId,
      },
      include: {
        patient: true,
        payer: {
          include: {
            clearinghouse: true,
          },
        },
        patientInsurance: true,
        clearinghouse: true,
        procedures: true,
      },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Validate claim can be submitted
    if (claim.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft claims can be submitted" },
        { status: 400 }
      );
    }

    if (!claim.clearinghouse && !claim.payer.clearinghouse) {
      return NextResponse.json(
        { error: "No clearinghouse configured for this claim" },
        { status: 400 }
      );
    }

    if (claim.procedures.length === 0) {
      return NextResponse.json(
        { error: "Claim must have at least one procedure" },
        { status: 400 }
      );
    }

    // Use claim's clearinghouse or payer's clearinghouse
    const clearinghouse = claim.clearinghouse || claim.payer.clearinghouse;

    // TODO: Implement actual claim submission to clearinghouse
    // For now, we'll simulate the submission process
    
    // Generate control number for tracking
    const controlNumber = `CTRL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Update claim status to submitted
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submissionDate: new Date(),
        controlNumber,
        clearinghouseId: clearinghouse?.id,
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

    // Simulate clearinghouse processing
    setTimeout(async () => {
      try {
        // Simulate random processing result
        const outcomes = ["APPROVED", "DENIED", "UNDER_REVIEW"];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        
        let updateData: any = {
          status: randomOutcome,
        };

        if (randomOutcome === "APPROVED") {
          // Simulate partial payment
          const paidPercentage = 0.7 + Math.random() * 0.3; // 70-100%
          updateData.paidAmount = Math.round(claim.totalAmount * paidPercentage * 100) / 100;
          updateData.patientResponsibility = claim.totalAmount - updateData.paidAmount;
          updateData.eobReceived = true;
          updateData.eobDate = new Date();
        } else if (randomOutcome === "DENIED") {
          updateData.denialReason = "Missing or invalid procedure code";
          updateData.denialCodes = ["D1234"];
          updateData.appealDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }

        await prisma.claim.update({
          where: { id },
          data: updateData,
        });

        // If approved, create payment record
        if (randomOutcome === "APPROVED" && updateData.paidAmount > 0) {
          await prisma.claimPayment.create({
            data: {
              claimId: id,
              paymentDate: new Date(),
              amount: updateData.paidAmount,
              checkNumber: `CHK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
              eobNumber: `EOB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
              paymentMethod: "ELECTRONIC",
            },
          });
        }
      } catch (error) {
        console.error("Error simulating claim processing:", error);
      }
    }, 5000); // Simulate 5-second processing delay

    return NextResponse.json({
      claim: updatedClaim,
      message: "Claim submitted successfully",
      controlNumber,
    });
  } catch (error) {
    console.error("Error submitting claim:", error);
    return NextResponse.json(
      { error: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
