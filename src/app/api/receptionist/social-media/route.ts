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
		const type = searchParams.get("type") || "posts";

		switch (type) {
			case "posts":
				return await getSocialPosts(session.user.practiceId, searchParams);
			case "accounts":
				return await getSocialAccounts(session.user.practiceId);
			case "campaigns":
				return await getMarketingCampaigns(
					session.user.practiceId,
					searchParams,
				);
			default:
				return NextResponse.json({ error: "Invalid type" }, { status: 400 });
		}
	} catch (error) {
		console.error("Error fetching social media data:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function getSocialPosts(
	practiceId: string,
	searchParams: URLSearchParams,
) {
	const status = searchParams.get("status");
	const platform = searchParams.get("platform");

	const where: {
		practiceId: string;
		status?: string;
		account?: {
			platform: string;
		};
	} = {
		practiceId,
	};

	if (status) {
		where.status = status;
	}

	if (platform) {
		where.account = {
			platform,
		};
	}

	const posts = await prisma.socialPost.findMany({
		where,
		include: {
			account: {
				select: {
					id: true,
					platform: true,
					accountName: true,
				},
			},
			createdBy: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
		orderBy: {
			scheduledAt: "desc",
		},
	});

	return NextResponse.json(posts);
}

async function getSocialAccounts(practiceId: string) {
	const accounts = await prisma.socialMediaAccount.findMany({
		where: { practiceId },
		include: {
			posts: {
				take: 5,
				orderBy: { publishedAt: "desc" },
			},
		},
	});

	return NextResponse.json(accounts);
}

async function getMarketingCampaigns(
	practiceId: string,
	searchParams: URLSearchParams,
) {
	const status = searchParams.get("status");
	const type = searchParams.get("campaignType");

	const where: {
		practiceId: string;
		status?: string;
		type?: string;
	} = {
		practiceId,
	};

	if (status) {
		where.status = status;
	}

	if (type) {
		where.type = type;
	}

	const campaigns = await prisma.marketingCampaign.findMany({
		where,
		include: {
			createdBy: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return NextResponse.json(campaigns);
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId || !session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { type } = body;

		switch (type) {
			case "post":
				return await createSocialPost(
					body,
					session.user.practiceId,
					session.user.id,
				);
			case "account":
				return await createSocialAccount(body, session.user.practiceId);
			case "campaign":
				return await createMarketingCampaign(
					body,
					session.user.practiceId,
					session.user.id,
				);
			default:
				return NextResponse.json({ error: "Invalid type" }, { status: 400 });
		}
	} catch (error) {
		console.error("Error creating social media content:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function createSocialPost(
	body: Record<string, unknown>,
	practiceId: string,
	userId: string,
) {
	const { content, imageUrls, accountId, scheduledAt, status = "DRAFT" } = body;

	// Validate required fields
	if (!content || !accountId) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 },
		);
	}

	// Verify account belongs to practice
	const account = await prisma.socialMediaAccount.findFirst({
		where: {
			id: accountId,
			practiceId,
		},
	});

	if (!account) {
		return NextResponse.json(
			{ error: "Social media account not found" },
			{ status: 404 },
		);
	}

	const post = await prisma.socialPost.create({
		data: {
			content,
			imageUrls: imageUrls || null,
			status,
			scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
			accountId,
			createdById: userId,
			practiceId,
		},
		include: {
			account: {
				select: {
					id: true,
					platform: true,
					accountName: true,
				},
			},
			createdBy: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
	});

	return NextResponse.json(post, { status: 201 });
}

async function createSocialAccount(
	body: Record<string, unknown>,
	practiceId: string,
) {
	const { platform, accountName, accessToken, isActive = true } = body;

	// Validate required fields
	if (!platform || !accountName) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 },
		);
	}

	const account = await prisma.socialMediaAccount.create({
		data: {
			platform,
			accountName,
			accessToken, // In production, this should be encrypted
			isActive,
			practiceId,
		},
	});

	return NextResponse.json(account, { status: 201 });
}

async function createMarketingCampaign(
	body: Record<string, unknown>,
	practiceId: string,
	userId: string,
) {
	const {
		name,
		type,
		startDate,
		endDate,
		budget,
		config,
		status = "DRAFT",
	} = body;

	// Validate required fields
	if (!name || !type || !config) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 },
		);
	}

	const campaign = await prisma.marketingCampaign.create({
		data: {
			name,
			type,
			status,
			startDate: startDate ? new Date(startDate) : null,
			endDate: endDate ? new Date(endDate) : null,
			budget: budget ? Number.parseFloat(budget) : null,
			config,
			createdById: userId,
			practiceId,
		},
		include: {
			createdBy: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
	});

	return NextResponse.json(campaign, { status: 201 });
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { type, id } = body;

		if (!id) {
			return NextResponse.json({ error: "ID is required" }, { status: 400 });
		}

		switch (type) {
			case "post":
				return await updateSocialPost(body, session.user.practiceId);
			case "account":
				return await updateSocialAccount(body, session.user.practiceId);
			case "campaign":
				return await updateMarketingCampaign(body, session.user.practiceId);
			default:
				return NextResponse.json({ error: "Invalid type" }, { status: 400 });
		}
	} catch (error) {
		console.error("Error updating social media content:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function updateSocialPost(
	body: Record<string, unknown>,
	practiceId: string,
) {
	const { id, content, imageUrls, status, scheduledAt, engagement } = body;

	// Verify post belongs to practice
	const existingPost = await prisma.socialPost.findFirst({
		where: {
			id,
			practiceId,
		},
	});

	if (!existingPost) {
		return NextResponse.json(
			{ error: "Social post not found" },
			{ status: 404 },
		);
	}

	const updateData: {
		content?: string;
		imageUrls?: string[];
		status?: string;
		scheduledAt?: Date;
		publishedAt?: Date;
		engagement?: unknown;
	} = {};

	if (content) updateData.content = content;
	if (imageUrls) updateData.imageUrls = imageUrls;
	if (status) {
		updateData.status = status;
		if (status === "PUBLISHED" && !existingPost.publishedAt) {
			updateData.publishedAt = new Date();
		}
	}
	if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
	if (engagement) updateData.engagement = engagement;

	const post = await prisma.socialPost.update({
		where: { id },
		data: updateData,
		include: {
			account: {
				select: {
					id: true,
					platform: true,
					accountName: true,
				},
			},
			createdBy: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
	});

	return NextResponse.json(post);
}

async function updateSocialAccount(
	body: Record<string, unknown>,
	practiceId: string,
) {
	const { id, accountName, accessToken, isActive, lastSync } = body;

	// Verify account belongs to practice
	const existingAccount = await prisma.socialMediaAccount.findFirst({
		where: {
			id,
			practiceId,
		},
	});

	if (!existingAccount) {
		return NextResponse.json(
			{ error: "Social media account not found" },
			{ status: 404 },
		);
	}

	const updateData: {
		accountName?: string;
		accessToken?: string;
		isActive?: boolean;
		lastSync?: Date;
	} = {};

	if (accountName) updateData.accountName = accountName;
	if (accessToken) updateData.accessToken = accessToken;
	if (typeof isActive === "boolean") updateData.isActive = isActive;
	if (lastSync) updateData.lastSync = new Date(lastSync);

	const account = await prisma.socialMediaAccount.update({
		where: { id },
		data: updateData,
	});

	return NextResponse.json(account);
}

async function updateMarketingCampaign(
	body: Record<string, unknown>,
	practiceId: string,
) {
	const {
		id,
		name,
		status,
		startDate,
		endDate,
		budget,
		spent,
		metrics,
		config,
	} = body;

	// Verify campaign belongs to practice
	const existingCampaign = await prisma.marketingCampaign.findFirst({
		where: {
			id,
			practiceId,
		},
	});

	if (!existingCampaign) {
		return NextResponse.json(
			{ error: "Marketing campaign not found" },
			{ status: 404 },
		);
	}

	const updateData: {
		updatedAt: Date;
		name?: string;
		status?: string;
		startDate?: Date;
		endDate?: Date;
		budget?: number;
		spent?: number;
		metrics?: unknown;
		config?: unknown;
	} = {
		updatedAt: new Date(),
	};

	if (name) updateData.name = name;
	if (status) updateData.status = status;
	if (startDate) updateData.startDate = new Date(startDate);
	if (endDate) updateData.endDate = new Date(endDate);
	if (budget) updateData.budget = Number.parseFloat(budget);
	if (spent) updateData.spent = Number.parseFloat(spent);
	if (metrics) updateData.metrics = metrics;
	if (config) updateData.config = config;

	const campaign = await prisma.marketingCampaign.update({
		where: { id },
		data: updateData,
		include: {
			createdBy: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		},
	});

	return NextResponse.json(campaign);
}
