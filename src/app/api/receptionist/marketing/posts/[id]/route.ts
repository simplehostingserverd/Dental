import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";

// Mock database - in production, this would be a real database
let posts: any[] = [
  {
    id: "1",
    content: "🦷 Did you know that regular dental cleanings can prevent gum disease? Book your appointment today! #DentalHealth #PreventiveCare",
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
];

// GET /api/receptionist/marketing/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = posts.find(
      p => p.id === params.id && p.practiceId === user.id
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/receptionist/marketing/posts/[id] - Update specific post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const postIndex = posts.findIndex(
      p => p.id === params.id && p.practiceId === user.id
    );

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingPost = posts[postIndex];

    // Don't allow editing published posts
    if (existingPost.status === "published") {
      return NextResponse.json(
        { error: "Cannot edit published posts" },
        { status: 400 }
      );
    }

    const updatedPost = {
      ...existingPost,
      ...body,
      id: params.id, // Ensure ID doesn't change
      practiceId: user.id, // Ensure practiceId doesn't change
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
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/receptionist/marketing/posts/[id] - Delete specific post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postIndex = posts.findIndex(
      p => p.id === params.id && p.practiceId === user.id
    );

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = posts[postIndex];

    // Don't allow deleting published posts
    if (post.status === "published") {
      return NextResponse.json(
        { error: "Cannot delete published posts" },
        { status: 400 }
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
      { status: 500 }
    );
  }
}

// PATCH /api/receptionist/marketing/posts/[id] - Partial update (e.g., publish, schedule)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...updateData } = body;

    const postIndex = posts.findIndex(
      p => p.id === params.id && p.practiceId === user.id
    );

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = posts[postIndex];

    switch (action) {
      case "publish":
        if (post.status === "published") {
          return NextResponse.json(
            { error: "Post is already published" },
            { status: 400 }
          );
        }
        post.status = "published";
        post.publishedAt = new Date();
        post.updatedAt = new Date();
        break;

      case "schedule":
        if (!updateData.scheduledFor) {
          return NextResponse.json(
            { error: "scheduledFor is required for scheduling" },
            { status: 400 }
          );
        }
        post.status = "scheduled";
        post.scheduledFor = new Date(updateData.scheduledFor);
        post.updatedAt = new Date();
        break;

      case "draft":
        if (post.status === "published") {
          return NextResponse.json(
            { error: "Cannot convert published post to draft" },
            { status: 400 }
          );
        }
        post.status = "draft";
        post.scheduledFor = null;
        post.updatedAt = new Date();
        break;

      default:
        // General update
        Object.assign(post, updateData, {
          id: params.id,
          practiceId: user.id,
          updatedAt: new Date(),
        });
    }

    posts[postIndex] = post;

    return NextResponse.json({
      success: true,
      data: post,
      message: `Post ${action || "updated"} successfully`,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
