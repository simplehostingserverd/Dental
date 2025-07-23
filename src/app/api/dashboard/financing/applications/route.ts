import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const createFinancingApplicationSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  financingOptionId: z.string().min(1, "Financing option ID is required"),
  amount: z.number().positive("Amount must be positive"),
  termMonths: z.number().int().positive("Term months must be positive"),
});

const updateFinancingApplicationSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "DECLINED", "ACTIVE", "COMPLETED", "DEFAULTED"]).optional(),
  approvedAmount: z.number().positive().optional(),
  approvedDate: z.string().transform((str) => new Date(str)).optional(),
  declinedReason: z.string().optional(),
  firstPaymentDate: z.string().transform((str) => new Date(str)).optional(),
  monthlyPayment: z.number().positive().optional(),
  remainingBalance: z.number().min(0).optional(),
});

// GET /api/dashboard/financing/applications - Get all financing applications
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");
    const provider = searchParams.get("provider");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      practiceId: user.practiceId,
    };

    if (patientId) {
      where.patientId = patientId;
    }

    if (status) {
      where.status = status;
    }

    if (provider) {
      where.financingOption = {
        provider: provider,
      };
    }

    const [applications, total] = await Promise.all([
      prisma.patientFinancing.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
          financingOption: {
            select: {
              id: true,
              provider: true,
              name: true,
              type: true,
              interestRate: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              paymentDate: true,
              status: true,
            },
            orderBy: {
              paymentDate: "desc",
            },
            take: 5,
          },
          _count: {
            select: {
              payments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.patientFinancing.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching financing applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch financing applications" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/financing/applications - Create new financing application
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createFinancingApplicationSchema.parse(body);

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

    // Verify financing option belongs to practice
    const financingOption = await prisma.financingOption.findFirst({
      where: {
        id: validatedData.financingOptionId,
        practiceId: user.practiceId,
        isActive: true,
      },
    });

    if (!financingOption) {
      return NextResponse.json({ error: "Financing option not found" }, { status: 404 });
    }

    // Validate amount is within limits
    if (validatedData.amount < financingOption.minAmount || validatedData.amount > financingOption.maxAmount) {
      return NextResponse.json(
        { 
          error: `Amount must be between $${financingOption.minAmount} and $${financingOption.maxAmount}` 
        },
        { status: 400 }
      );
    }

    // Calculate monthly payment
    const monthlyInterestRate = financingOption.interestRate / 100 / 12;
    const monthlyPayment = monthlyInterestRate > 0 
      ? (validatedData.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, validatedData.termMonths)) / 
        (Math.pow(1 + monthlyInterestRate, validatedData.termMonths) - 1)
      : validatedData.amount / validatedData.termMonths;

    // Generate application ID for external tracking
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    const application = await prisma.patientFinancing.create({
      data: {
        ...validatedData,
        practiceId: user.practiceId,
        applicationId,
        interestRate: financingOption.interestRate,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        status: "PENDING",
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        financingOption: {
          select: {
            id: true,
            provider: true,
            name: true,
            type: true,
            interestRate: true,
            applicationUrl: true,
          },
        },
        payments: true,
      },
    });

    // TODO: Implement actual application submission to financing provider
    // For now, we'll simulate the approval process
    setTimeout(async () => {
      try {
        // Simulate random approval/decline
        const isApproved = Math.random() > 0.3; // 70% approval rate
        
        if (isApproved) {
          // Simulate approved amount (might be less than requested)
          const approvalPercentage = 0.8 + Math.random() * 0.2; // 80-100%
          const approvedAmount = Math.round(validatedData.amount * approvalPercentage * 100) / 100;
          
          await prisma.patientFinancing.update({
            where: { id: application.id },
            data: {
              status: "APPROVED",
              approvedAmount,
              approvedDate: new Date(),
              remainingBalance: approvedAmount,
            },
          });
        } else {
          await prisma.patientFinancing.update({
            where: { id: application.id },
            data: {
              status: "DECLINED",
              declinedReason: "Insufficient credit score",
            },
          });
        }
      } catch (error) {
        console.error("Error simulating financing approval:", error);
      }
    }, 3000); // Simulate 3-second processing delay

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating financing application:", error);
    return NextResponse.json(
      { error: "Failed to create financing application" },
      { status: 500 }
    );
  }
}
