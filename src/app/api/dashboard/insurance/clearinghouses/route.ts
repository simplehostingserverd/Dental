import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const createClearinghouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["DENTAL", "MEDICAL", "BOTH"]),
  apiEndpoint: z.string().url("Valid API endpoint URL is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  submitterId: z.string().min(1, "Submitter ID is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
  supportedTransactions: z.array(z.string()),
  testMode: z.boolean().default(false),
});

const updateClearinghouseSchema = createClearinghouseSchema.partial();

// GET /api/dashboard/insurance/clearinghouses - Get all clearinghouses
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

    const clearinghouses = await prisma.clearinghouse.findMany({
      where,
      include: {
        payers: {
          select: {
            id: true,
            name: true,
            payerCode: true,
          },
        },
        _count: {
          select: {
            payers: true,
            claims: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Remove sensitive data from response
    const sanitizedClearinghouses = clearinghouses.map(ch => ({
      ...ch,
      password: undefined, // Don't send password in response
    }));

    return NextResponse.json({ clearinghouses: sanitizedClearinghouses });
  } catch (error) {
    console.error("Error fetching clearinghouses:", error);
    return NextResponse.json(
      { error: "Failed to fetch clearinghouses" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/insurance/clearinghouses - Create new clearinghouse
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createClearinghouseSchema.parse(body);

    // Check if clearinghouse name already exists
    const existingClearinghouse = await prisma.clearinghouse.findFirst({
      where: {
        name: validatedData.name,
        practiceId: user.practiceId,
      },
    });

    if (existingClearinghouse) {
      return NextResponse.json(
        { error: "Clearinghouse name already exists" },
        { status: 400 }
      );
    }

    // TODO: Encrypt password before storing
    const clearinghouse = await prisma.clearinghouse.create({
      data: {
        ...validatedData,
        practiceId: user.practiceId,
        status: "DISCONNECTED", // Default status
      },
      include: {
        payers: {
          select: {
            id: true,
            name: true,
            payerCode: true,
          },
        },
        _count: {
          select: {
            payers: true,
            claims: true,
          },
        },
      },
    });

    // Remove password from response
    const { password, ...sanitizedClearinghouse } = clearinghouse;

    return NextResponse.json({ clearinghouse: sanitizedClearinghouse }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating clearinghouse:", error);
    return NextResponse.json(
      { error: "Failed to create clearinghouse" },
      { status: 500 }
    );
  }
}
