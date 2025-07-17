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
		const isActive = searchParams.get("isActive");

		const where: {
			practiceId: string;
			isActive?: boolean;
		} = {
			practiceId: session.user.practiceId,
		};

		if (isActive !== null) {
			where.isActive = isActive === "true";
		}

		const rules = await prisma.automationRule.findMany({
			where,
			include: {
				executions: {
					take: 5,
					orderBy: { startedAt: "desc" },
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(rules);
	} catch (error) {
		console.error("Error fetching automation rules:", error);
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
		const { name, description, trigger, actions, isActive = true } = body;

		// Validate required fields
		if (!name || !trigger || !actions) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Validate trigger and actions structure
		if (typeof trigger !== "object" || !Array.isArray(actions)) {
			return NextResponse.json(
				{ error: "Invalid trigger or actions format" },
				{ status: 400 },
			);
		}

		// Create automation rule
		const rule = await prisma.automationRule.create({
			data: {
				name,
				description,
				trigger,
				actions,
				isActive,
				practiceId: session.user.practiceId,
			},
		});

		return NextResponse.json(rule, { status: 201 });
	} catch (error) {
		console.error("Error creating automation rule:", error);
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
		const { id, name, description, trigger, actions, isActive } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Rule ID is required" },
				{ status: 400 },
			);
		}

		// Verify rule belongs to practice
		const existingRule = await prisma.automationRule.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingRule) {
			return NextResponse.json(
				{ error: "Automation rule not found" },
				{ status: 404 },
			);
		}

		const updateData: {
			updatedAt: Date;
			name?: string;
			description?: string;
			trigger?: unknown;
			actions?: unknown;
			isActive?: boolean;
		} = {
			updatedAt: new Date(),
		};

		if (name) updateData.name = name;
		if (description) updateData.description = description;
		if (trigger) updateData.trigger = trigger;
		if (actions) updateData.actions = actions;
		if (typeof isActive === "boolean") updateData.isActive = isActive;

		const rule = await prisma.automationRule.update({
			where: { id },
			data: updateData,
		});

		return NextResponse.json(rule);
	} catch (error) {
		console.error("Error updating automation rule:", error);
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
				{ error: "Rule ID is required" },
				{ status: 400 },
			);
		}

		// Verify rule belongs to practice
		const existingRule = await prisma.automationRule.findFirst({
			where: {
				id,
				practiceId: session.user.practiceId,
			},
		});

		if (!existingRule) {
			return NextResponse.json(
				{ error: "Automation rule not found" },
				{ status: 404 },
			);
		}

		// Delete all executions first
		await prisma.automationExecution.deleteMany({
			where: { ruleId: id },
		});

		// Delete the rule
		await prisma.automationRule.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Automation rule deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting automation rule:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
