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
		const type = searchParams.get("type");
		const channel = searchParams.get("channel");
		const isActive = searchParams.get("isActive");

		const where: {
			practiceId: string;
			type?: string;
			channel?: string;
			isActive?: boolean;
		} = {
			practiceId: session.user.practiceId,
		};

		if (type) {
			where.type = type;
		}

		if (channel) {
			where.channel = channel;
		}

		if (isActive !== null) {
			where.isActive = isActive === "true";
		}

		const templates = await prisma.communicationTemplate.findMany({
			where,
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(templates);
	} catch (error) {
		console.error("Error fetching communication templates:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { name, type, channel, subject, content, variables, isActive } = body;

		// Validate required fields
		if (!name || !type || !channel || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Create communication template
		const template = await prisma.communicationTemplate.create({
			data: {
				name,
				type,
				channel,
				subject,
				content,
				variables: variables || null,
				isActive: isActive !== false,
				practiceId: session.user.practiceId,
			},
		});

		return NextResponse.json(template, { status: 201 });
	} catch (error) {
		console.error("Error creating communication template:", error);
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
		const { id, name, type, channel, subject, content, variables, isActive } =
			body;

		if (!id) {
			return NextResponse.json(
				{ error: "Template ID is required" },
				{ status: 400 },
			);
		}

		// Verify template belongs to practice
		const existingTemplate = await prisma.communicationTemplate.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingTemplate) {
			return NextResponse.json(
				{ error: "Template not found" },
				{ status: 404 },
			);
		}

		const updateData: {
			updatedAt: Date;
			name?: string;
			type?: string;
			channel?: string;
			subject?: string;
			content?: string;
			variables?: unknown;
			isActive?: boolean;
		} = {
			updatedAt: new Date(),
		};

		if (name) updateData.name = name;
		if (type) updateData.type = type;
		if (channel) updateData.channel = channel;
		if (subject) updateData.subject = subject;
		if (content) updateData.content = content;
		if (variables) updateData.variables = variables;
		if (typeof isActive === "boolean") updateData.isActive = isActive;

		const template = await prisma.communicationTemplate.update({
			where: { id },
			data: updateData,
		});

		return NextResponse.json(template);
	} catch (error) {
		console.error("Error updating communication template:", error);
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
				{ error: "Template ID is required" },
				{ status: 400 },
			);
		}

		// Verify template belongs to practice
		const existingTemplate = await prisma.communicationTemplate.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingTemplate) {
			return NextResponse.json(
				{ error: "Template not found" },
				{ status: 404 },
			);
		}

		await prisma.communicationTemplate.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Template deleted successfully" });
	} catch (error) {
		console.error("Error deleting communication template:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
