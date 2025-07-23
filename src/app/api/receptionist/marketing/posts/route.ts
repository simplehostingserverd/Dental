import { getCurrentUser } from "@/lib/auth/session";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas
const CreatePostSchema = z.object({
	content: z
		.string()
		.min(1, "Content is required")
		.max(2000, "Content too long"),
	platforms: z.array(
		z.enum([
			"facebook",
			"instagram",
			"tiktok",
			"x",
			"linkedin",
			"youtube",
			"bluesky",
			"reddit",
			"pinterest",
		]),
	),
	scheduledFor: z.string().datetime().optional(),
	imageUrl: z.string().url().optional(),
	hashtags: z.array(z.string()).default([]),
	category: z
		.enum(["educational", "promotional", "testimonial", "seasonal", "general"])
		.default("general"),
});

const UpdatePostSchema = CreatePostSchema.partial().extend({
	id: z.string(),
});

// Mock database - replace with actual database
const posts: any[] = [
	{
		id: "1",
		content:
			"🦷 Did you know that regular dental cleanings can prevent gum disease? Book your appointment today! #DentalHealth #PreventiveCare",
		platforms: ["facebook", "instagram"],
		publishedAt: new Date("2025-07-16T10:00:00Z"),
		status: "published",
		engagement: { likes: 24, comments: 8, shares: 3, views: 150 },
		hashtags: ["DentalHealth", "PreventiveCare"],
		category: "educational",
		practiceId: "practice-1",
		createdAt: new Date("2025-07-16T09:00:00Z"),
		updatedAt: new Date("2025-07-16T09:00:00Z"),
	},
	{
		id: "2",
		content:
			"✨ Transform your smile with our professional teeth whitening service! Results in just one visit. Call us today! #TeethWhitening #SmileMakeover",
		platforms: ["instagram", "tiktok"],
		scheduledFor: new Date("2025-07-24T14:00:00Z"),
		status: "scheduled",
		engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
		hashtags: ["TeethWhitening", "SmileMakeover"],
		category: "promotional",
		practiceId: "practice-1",
		createdAt: new Date("2025-07-20T10:00:00Z"),
		updatedAt: new Date("2025-07-20T10:00:00Z"),
	},
];

// GET /api/receptionist/marketing/posts - Get all posts
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");
		const platform = searchParams.get("platform");
		const status = searchParams.get("status");
		const category = searchParams.get("category");

		// Filter posts
		let filteredPosts = posts.filter((post) => post.practiceId === user.id);

		if (platform) {
			filteredPosts = filteredPosts.filter((post) =>
				post.platforms.includes(platform),
			);
		}

		if (status) {
			filteredPosts = filteredPosts.filter((post) => post.status === status);
		}

		if (category) {
			filteredPosts = filteredPosts.filter(
				(post) => post.category === category,
			);
		}

		// Sort by creation date (newest first)
		filteredPosts.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		// Pagination
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

		return NextResponse.json({
			success: true,
			data: paginatedPosts,
			pagination: {
				page,
				limit,
				total: filteredPosts.length,
				totalPages: Math.ceil(filteredPosts.length / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 },
		);
	}
}

// POST /api/receptionist/marketing/posts - Create new post
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = CreatePostSchema.parse(body);

		const newPost = {
			id: `post-${Date.now()}`,
			...validatedData,
			practiceId: user.id,
			status: validatedData.scheduledFor ? "scheduled" : "draft",
			engagement: {
				likes: 0,
				comments: 0,
				shares: 0,
				views: 0,
				reposts: 0,
				saves: 0,
			},
			createdAt: new Date(),
			updatedAt: new Date(),
			publishedAt: validatedData.scheduledFor ? null : new Date(),
		};

		posts.push(newPost);

		// Simulate social media posting
		if (!validatedData.scheduledFor) {
			// Immediate posting logic would go here
			console.log(
				`Posting to platforms: ${validatedData.platforms.join(", ")}`,
			);
			newPost.status = "published";
			newPost.publishedAt = new Date();
		}

		return NextResponse.json({
			success: true,
			data: newPost,
			message: validatedData.scheduledFor
				? "Post scheduled successfully"
				: "Post published successfully",
		});
	} catch (error) {
		console.error("Error creating post:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to create post" },
			{ status: 500 },
		);
	}
}

// PUT /api/receptionist/marketing/posts - Update post
export async function PUT(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validatedData = UpdatePostSchema.parse(body);

		const postIndex = posts.findIndex(
			(post) => post.id === validatedData.id && post.practiceId === user.id,
		);

		if (postIndex === -1) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		const existingPost = posts[postIndex];

		// Don't allow editing published posts
		if (existingPost.status === "published") {
			return NextResponse.json(
				{ error: "Cannot edit published posts" },
				{ status: 400 },
			);
		}

		const updatedPost = {
			...existingPost,
			...validatedData,
			updatedAt: new Date(),
		};

		posts[postIndex] = updatedPost;

		return NextResponse.json({
			success: true,
			data: updatedPost,
			message: "Post updated successfully",
		});
	} catch (error) {
		console.error("Error updating post:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to update post" },
			{ status: 500 },
		);
	}
}

// DELETE /api/receptionist/marketing/posts - Delete post
export async function DELETE(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const postId = searchParams.get("id");

		if (!postId) {
			return NextResponse.json(
				{ error: "Post ID is required" },
				{ status: 400 },
			);
		}

		const postIndex = posts.findIndex(
			(post) => post.id === postId && post.practiceId === user.id,
		);

		if (postIndex === -1) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		const deletedPost = posts[postIndex];

		// Don't allow deleting published posts
		if (deletedPost.status === "published") {
			return NextResponse.json(
				{ error: "Cannot delete published posts" },
				{ status: 400 },
			);
		}

		posts.splice(postIndex, 1);

		return NextResponse.json({
			success: true,
			message: "Post deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json(
			{ error: "Failed to delete post" },
			{ status: 500 },
		);
	}
}
