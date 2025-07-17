import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("patientId");
		const type = searchParams.get("type");
		const status = searchParams.get("status");

		const where: {
			practiceId: string;
			patientId?: string;
			type?: string;
		} = {
			practiceId: session.user.practiceId,
		};

		if (patientId) {
			where.patientId = patientId;
		}

		if (type) {
			where.type = type;
		}

		const documents = await prisma.document.findMany({
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
				uploadedBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
			},
			orderBy: {
				uploadedAt: "desc",
			},
		});

		return NextResponse.json(documents);
	} catch (error) {
		console.error("Error fetching documents:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId || !session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			name,
			type,
			fileUrl,
			fileSize,
			mimeType,
			patientId,
			isRequired,
			expiresAt,
		} = body;

		// Validate required fields
		if (!name || !type || !fileUrl) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Verify patient belongs to practice if patientId is provided
		if (patientId) {
			const patient = await prisma.patient.findFirst({
				where: {
					id: patientId,
					practiceId: session.user.practiceId,
				},
			});

			if (!patient) {
				return NextResponse.json(
					{ error: "Patient not found" },
					{ status: 404 },
				);
			}
		}

		// Create document
		const document = await prisma.document.create({
			data: {
				name,
				type,
				fileUrl,
				fileSize: fileSize ? Number.parseInt(fileSize) : null,
				mimeType,
				uploadedAt: new Date(),
				expiresAt: expiresAt ? new Date(expiresAt) : null,
				isRequired: isRequired || false,
				isSigned: false,
				patientId,
				practiceId: session.user.practiceId,
				uploadedById: session.user.id,
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
				uploadedBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
			},
		});

		return NextResponse.json(document, { status: 201 });
	} catch (error) {
		console.error("Error creating document:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { id, name, isRequired, isSigned, signedAt, expiresAt } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Document ID is required" },
				{ status: 400 },
			);
		}

		// Verify document belongs to practice
		const existingDocument = await prisma.document.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingDocument) {
			return NextResponse.json(
				{ error: "Document not found" },
				{ status: 404 },
			);
		}

		const updateData: {
			name?: string;
			isRequired?: boolean;
			isSigned?: boolean;
			signedAt?: Date;
			expiresAt?: Date;
		} = {};

		if (name) updateData.name = name;
		if (typeof isRequired === "boolean") updateData.isRequired = isRequired;
		if (typeof isSigned === "boolean") {
			updateData.isSigned = isSigned;
			if (isSigned && !existingDocument.signedAt) {
				updateData.signedAt = new Date();
			}
		}
		if (signedAt) updateData.signedAt = new Date(signedAt);
		if (expiresAt) updateData.expiresAt = new Date(expiresAt);

		const document = await prisma.document.update({
			where: { id },
			data: updateData,
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
				uploadedBy: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
					},
				},
			},
		});

		return NextResponse.json(document);
	} catch (error) {
		console.error("Error updating document:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Document ID is required" },
				{ status: 400 },
			);
		}

		// Verify document belongs to practice
		const existingDocument = await prisma.document.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingDocument) {
			return NextResponse.json(
				{ error: "Document not found" },
				{ status: 404 },
			);
		}

		await prisma.document.delete({
			where: { id },
		});

		// TODO: Also delete the actual file from storage

		return NextResponse.json({ message: "Document deleted successfully" });
	} catch (error) {
		console.error("Error deleting document:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
