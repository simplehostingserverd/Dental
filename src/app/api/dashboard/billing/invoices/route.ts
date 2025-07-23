import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { z } from "zod";

const createInvoiceSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  serviceDate: z.string().transform((str) => new Date(str)),
  dueDate: z.string().transform((str) => new Date(str)),
  procedures: z.array(z.object({
    procedureCode: z.string().min(1, "Procedure code is required"),
    description: z.string().min(1, "Description is required"),
    tooth: z.string().optional(),
    quantity: z.number().int().positive().default(1),
    unitPrice: z.number().positive("Unit price must be positive"),
  })),
  notes: z.string().optional(),
});

const updateInvoiceSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "VIEWED", "PAID", "PARTIAL", "OVERDUE", "CANCELLED"]).optional(),
  sentDate: z.string().transform((str) => new Date(str)).optional(),
  viewedDate: z.string().transform((str) => new Date(str)).optional(),
  notes: z.string().optional(),
});

// GET /api/dashboard/billing/invoices - Get patient invoices
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
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

    if (startDate || endDate) {
      where.serviceDate = {};
      if (startDate) {
        where.serviceDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.serviceDate.lte = new Date(endDate);
      }
    }

    const [invoices, total] = await Promise.all([
      prisma.patientInvoice.findMany({
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
          procedures: {
            orderBy: {
              procedureCode: "asc",
            },
          },
          payments: {
            orderBy: {
              paymentDate: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.patientInvoice.count({ where }),
    ]);

    // Calculate summary statistics
    const summary = await prisma.patientInvoice.aggregate({
      where: {
        practiceId: user.practiceId,
      },
      _sum: {
        totalAmount: true,
        paidAmount: true,
        remainingBalance: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      invoices,
      summary: {
        totalInvoices: summary._count.id,
        totalAmount: summary._sum.totalAmount || 0,
        paidAmount: summary._sum.paidAmount || 0,
        remainingBalance: summary._sum.remainingBalance || 0,
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching patient invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient invoices" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/billing/invoices - Create new patient invoice
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.practiceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

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

    // Calculate total amount
    const totalAmount = validatedData.procedures.reduce(
      (sum, proc) => sum + (proc.unitPrice * proc.quantity),
      0
    );

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create invoice with procedures
    const invoice = await prisma.patientInvoice.create({
      data: {
        invoiceNumber,
        patientId: validatedData.patientId,
        practiceId: user.practiceId,
        serviceDate: validatedData.serviceDate,
        dueDate: validatedData.dueDate,
        totalAmount,
        remainingBalance: totalAmount,
        notes: validatedData.notes,
        status: "DRAFT",
        procedures: {
          create: validatedData.procedures.map(proc => ({
            ...proc,
            totalPrice: proc.unitPrice * proc.quantity,
          })),
        },
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
        procedures: true,
        payments: true,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating patient invoice:", error);
    return NextResponse.json(
      { error: "Failed to create patient invoice" },
      { status: 500 }
    );
  }
}
