import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const baseFinancingOptionSchema = z.object({
  provider: z.enum(["CARECREDIT", "LENDING_CLUB", "ALPHAEON", "INTERNAL"]),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["PROMOTIONAL", "STANDARD", "PAYMENT_PLAN"]),
  minAmount: z.number().positive("Minimum amount must be positive"),
  maxAmount: z.number().positive("Maximum amount must be positive"),
  termMonths: z.number().int().positive("Term months must be positive"),
  interestRate: z.number().min(0).max(100, "Interest rate must be between 0 and 100"),
  promotionalRate: z.number().min(0).max(100).optional(),
  promotionalMonths: z.number().int().positive().optional(),
  applicationUrl: z.string().url().optional(),
  apiEndpoint: z.string().url().optional(),
  apiKey: z.string().optional(),
});

const createFinancingOptionSchema = baseFinancingOptionSchema.refine((data) => data.maxAmount >= data.minAmount, {
  message: "Maximum amount must be greater than or equal to minimum amount",
  path: ["maxAmount"],
});

const updateFinancingOptionSchema = baseFinancingOptionSchema.partial();

// GET /api/dashboard/financing/options - Get all financing options
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");

    const where: any = {
      practiceId: user.practiceId,
    };

    if (provider) {
      where.provider = provider;
    }

    if (type) {
      where.type = type;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const financingOptions = await prisma.financingOption.findMany({
      where,
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: [
        { provider: "asc" },
        { name: "asc" },
      ],
    });

    // Remove sensitive data from response
    const sanitizedOptions = financingOptions.map(option => ({
      ...option,
      apiKey: undefined, // Don't send API key in response
    }));

    return NextResponse.json({ financingOptions: sanitizedOptions });
  } catch (error) {
    console.error("Error fetching financing options:", error);
    return NextResponse.json(
      { error: "Failed to fetch financing options" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/financing/options - Create new financing option
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createFinancingOptionSchema.parse(body);

    // Check if financing option name already exists for this practice
    const existingOption = await prisma.financingOption.findFirst({
      where: {
        name: validatedData.name,
        practiceId: user.practiceId,
      },
    });

    if (existingOption) {
      return NextResponse.json(
        { error: "Financing option name already exists" },
        { status: 400 }
      );
    }

    // TODO: Encrypt API key before storing
    const financingOption = await prisma.financingOption.create({
      data: {
        ...validatedData,
        practiceId: user.practiceId,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    // Remove API key from response
    const { apiKey, ...sanitizedOption } = financingOption;

    return NextResponse.json({ financingOption: sanitizedOption }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating financing option:", error);
    return NextResponse.json(
      { error: "Failed to create financing option" },
      { status: 500 }
    );
  }
}
