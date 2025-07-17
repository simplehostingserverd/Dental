import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ScheduledPost {
	id: string;
	practiceId: string;
	title: string;
	content: string;
	platforms: string[];
	scheduledFor: Date;
	status: "scheduled" | "published" | "failed" | "draft";
	category: "educational" | "promotional" | "testimonial" | "seasonal" | "general";
	hashtags: string[];
	imageUrl?: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	engagement?: {
		likes: number;
		comments: number;
		shares: number;
		views?: number;
	};
}

interface CreateScheduledPostRequest {
	title: string;
	content: string;
	platforms: string[];
	scheduledFor: string;
	category: "educational" | "promotional" | "testimonial" | "seasonal" | "general";
	hashtags: string;
	imageUrl?: string;
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: CreateScheduledPostRequest = await request.json();

		// Validate required fields
		if (!body.title || !body.content || !body.platforms || body.platforms.length === 0 || !body.scheduledFor) {
			return NextResponse.json(
				{ error: "Title, content, platforms, and scheduled time are required" },
				{ status: 400 }
			);
		}

		// Validate title length
		if (body.title.length < 3 || body.title.length > 100) {
			return NextResponse.json(
				{ error: "Title must be between 3 and 100 characters" },
				{ status: 400 }
			);
		}

		// Validate content length
		if (body.content.length < 10 || body.content.length > 2000) {
			return NextResponse.json(
				{ error: "Content must be between 10 and 2000 characters" },
				{ status: 400 }
			);
		}

		// Validate platforms
		const validPlatforms = ["facebook", "instagram", "twitter", "linkedin", "youtube"];
		const invalidPlatforms = body.platforms.filter(p => !validPlatforms.includes(p));
		if (invalidPlatforms.length > 0) {
			return NextResponse.json(
				{ error: `Invalid platforms: ${invalidPlatforms.join(", ")}` },
				{ status: 400 }
			);
		}

		// Validate scheduled time
		const scheduledFor = new Date(body.scheduledFor);
		const now = new Date();
		
		if (scheduledFor <= now) {
			return NextResponse.json(
				{ error: "Scheduled time must be in the future" },
				{ status: 400 }
			);
		}

		// Don't allow scheduling more than 1 year in advance
		const maxFutureDate = new Date();
		maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
		
		if (scheduledFor > maxFutureDate) {
			return NextResponse.json(
				{ error: "Cannot schedule posts more than 1 year in advance" },
				{ status: 400 }
			);
		}

		// Validate category
		const validCategories = ["educational", "promotional", "testimonial", "seasonal", "general"];
		if (!validCategories.includes(body.category)) {
			return NextResponse.json(
				{ error: "Invalid category" },
				{ status: 400 }
			);
		}

		// Parse hashtags
		const hashtags = body.hashtags
			.split(/\s+/)
			.filter(tag => tag.startsWith('#'))
			.map(tag => tag.slice(1))
			.filter(tag => tag.length > 0);

		// Create scheduled post
		const scheduledPost: ScheduledPost = {
			id: `sched_${Date.now()}`,
			practiceId: session.user.practiceId,
			title: body.title,
			content: body.content,
			platforms: body.platforms,
			scheduledFor: scheduledFor,
			status: "scheduled",
			category: body.category,
			hashtags: hashtags,
			imageUrl: body.imageUrl,
			createdBy: `${session.user.firstName} ${session.user.lastName}`,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// TODO: Save to database
		// TODO: Add to job queue for publishing at scheduled time
		// TODO: Send confirmation notification

		return NextResponse.json({
			success: true,
			post: scheduledPost,
			message: `Post scheduled for ${scheduledFor.toLocaleString()}`
		});

	} catch (error) {
		console.error("Error creating scheduled post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const platform = searchParams.get("platform");
		const category = searchParams.get("category");
		const status = searchParams.get("status");

		// TODO: Fetch scheduled posts from database with filters
		// For now, return mock data

		const mockScheduledPosts: ScheduledPost[] = [
			{
				id: "sched_1",
				practiceId: session.user.practiceId,
				title: "Daily Oral Hygiene Tip",
				content: "💡 Daily Tip: Brush your teeth for at least 2 minutes, twice a day! Use a soft-bristled toothbrush and fluoride toothpaste for best results. #DentalHealth #OralHygiene",
				platforms: ["facebook", "instagram"],
				scheduledFor: new Date(2025, 6, 18, 9, 0),
				status: "scheduled",
				category: "educational",
				hashtags: ["DentalHealth", "OralHygiene"],
				createdBy: "Jane Smith",
				createdAt: new Date("2025-07-17T10:00:00Z"),
				updatedAt: new Date("2025-07-17T10:00:00Z"),
			},
			{
				id: "sched_2",
				practiceId: session.user.practiceId,
				title: "Teeth Whitening Promotion",
				content: "✨ SPECIAL OFFER: Professional teeth whitening for just $299! Book this month and save $151! Limited time offer. #TeethWhitening #SpecialOffer",
				platforms: ["facebook", "instagram", "twitter"],
				scheduledFor: new Date(2025, 6, 19, 14, 30),
				status: "scheduled",
				category: "promotional",
				hashtags: ["TeethWhitening", "SpecialOffer"],
				createdBy: "Jane Smith",
				createdAt: new Date("2025-07-17T11:00:00Z"),
				updatedAt: new Date("2025-07-17T11:00:00Z"),
			},
			{
				id: "sched_3",
				practiceId: session.user.practiceId,
				title: "Patient Success Story",
				content: "🌟 \"Amazing experience with my dental implant! Dr. Smith made the whole process comfortable and the results are incredible!\" - Sarah M. #PatientTestimonial #DentalImplants",
				platforms: ["facebook", "linkedin"],
				scheduledFor: new Date(2025, 6, 20, 11, 0),
				status: "scheduled",
				category: "testimonial",
				hashtags: ["PatientTestimonial", "DentalImplants"],
				createdBy: "Jane Smith",
				createdAt: new Date("2025-07-17T12:00:00Z"),
				updatedAt: new Date("2025-07-17T12:00:00Z"),
			},
		];

		// Apply filters
		let filteredPosts = mockScheduledPosts;

		if (startDate) {
			const start = new Date(startDate);
			filteredPosts = filteredPosts.filter(post => 
				new Date(post.scheduledFor) >= start
			);
		}

		if (endDate) {
			const end = new Date(endDate);
			filteredPosts = filteredPosts.filter(post => 
				new Date(post.scheduledFor) <= end
			);
		}

		if (platform) {
			filteredPosts = filteredPosts.filter(post => 
				post.platforms.includes(platform)
			);
		}

		if (category) {
			filteredPosts = filteredPosts.filter(post => 
				post.category === category
			);
		}

		if (status) {
			filteredPosts = filteredPosts.filter(post => 
				post.status === status
			);
		}

		// Calculate calendar statistics
		const stats = {
			totalScheduled: filteredPosts.filter(p => p.status === "scheduled").length,
			totalPublished: filteredPosts.filter(p => p.status === "published").length,
			totalFailed: filteredPosts.filter(p => p.status === "failed").length,
			upcomingThisWeek: filteredPosts.filter(p => {
				const postDate = new Date(p.scheduledFor);
				const weekFromNow = new Date();
				weekFromNow.setDate(weekFromNow.getDate() + 7);
				return postDate <= weekFromNow && p.status === "scheduled";
			}).length,
			platformBreakdown: {
				facebook: filteredPosts.filter(p => p.platforms.includes("facebook")).length,
				instagram: filteredPosts.filter(p => p.platforms.includes("instagram")).length,
				twitter: filteredPosts.filter(p => p.platforms.includes("twitter")).length,
				linkedin: filteredPosts.filter(p => p.platforms.includes("linkedin")).length,
			},
			categoryBreakdown: {
				educational: filteredPosts.filter(p => p.category === "educational").length,
				promotional: filteredPosts.filter(p => p.category === "promotional").length,
				testimonial: filteredPosts.filter(p => p.category === "testimonial").length,
				seasonal: filteredPosts.filter(p => p.category === "seasonal").length,
				general: filteredPosts.filter(p => p.category === "general").length,
			},
		};

		return NextResponse.json({
			success: true,
			posts: filteredPosts,
			stats: stats,
			total: filteredPosts.length
		});

	} catch (error) {
		console.error("Error fetching scheduled posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
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
		const { id, ...updateData } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Post ID is required" },
				{ status: 400 }
			);
		}

		// TODO: Update scheduled post in database
		// TODO: Update job queue if schedule time changed
		// TODO: Send update notification

		return NextResponse.json({
			success: true,
			message: "Scheduled post updated successfully"
		});

	} catch (error) {
		console.error("Error updating scheduled post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
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
				{ error: "Post ID is required" },
				{ status: 400 }
			);
		}

		// TODO: Delete scheduled post from database
		// TODO: Remove from job queue
		// TODO: Send deletion notification

		return NextResponse.json({
			success: true,
			message: "Scheduled post deleted successfully"
		});

	} catch (error) {
		console.error("Error deleting scheduled post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
