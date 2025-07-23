import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

// Mock analytics data - in production, this would come from actual social media APIs
const mockAnalytics = {
  "practice-1": {
    platforms: [
      {
        platform: "Facebook",
        followers: 1250,
        engagement: 4.2,
        reach: 3500,
        impressions: 8200,
        growth: 12.5,
        posts: 15,
        avgLikes: 18,
        avgComments: 5,
        avgShares: 2,
      },
      {
        platform: "Instagram",
        followers: 890,
        engagement: 6.8,
        reach: 2800,
        impressions: 5600,
        growth: 18.3,
        posts: 12,
        avgLikes: 32,
        avgComments: 8,
        avgShares: 4,
      },
      {
        platform: "TikTok",
        followers: 2150,
        engagement: 12.4,
        reach: 8500,
        impressions: 15200,
        growth: 45.8,
        posts: 8,
        avgLikes: 125,
        avgComments: 25,
        avgShares: 15,
      },
      {
        platform: "X (Twitter)",
        followers: 420,
        engagement: 3.1,
        reach: 1200,
        impressions: 2400,
        growth: 8.7,
        posts: 20,
        avgLikes: 8,
        avgComments: 2,
        avgShares: 3,
      },
      {
        platform: "LinkedIn",
        followers: 180,
        engagement: 5.4,
        reach: 650,
        impressions: 1300,
        growth: 15.2,
        posts: 6,
        avgLikes: 12,
        avgComments: 3,
        avgShares: 2,
      },
      {
        platform: "BlueSky",
        followers: 95,
        engagement: 8.9,
        reach: 320,
        impressions: 680,
        growth: 28.4,
        posts: 4,
        avgLikes: 15,
        avgComments: 4,
        avgShares: 2,
      },
      {
        platform: "Reddit",
        followers: 340,
        engagement: 7.2,
        reach: 1100,
        impressions: 2200,
        growth: 22.1,
        posts: 10,
        avgLikes: 25,
        avgComments: 12,
        avgShares: 5,
      },
      {
        platform: "Pinterest",
        followers: 560,
        engagement: 5.8,
        reach: 1800,
        impressions: 3600,
        growth: 16.7,
        posts: 18,
        avgLikes: 22,
        avgComments: 3,
        avgShares: 8,
      },
    ],
    overview: {
      totalFollowers: 5885,
      totalPosts: 93,
      totalEngagement: 1247,
      avgEngagementRate: 7.8,
      topPerformingPlatform: "TikTok",
      bestPostingTime: "2:00 PM",
      bestPostingDay: "Wednesday",
    },
    trends: {
      followerGrowth: [
        { date: "2025-07-01", followers: 5200 },
        { date: "2025-07-08", followers: 5350 },
        { date: "2025-07-15", followers: 5520 },
        { date: "2025-07-22", followers: 5885 },
      ],
      engagementTrend: [
        { date: "2025-07-01", engagement: 6.2 },
        { date: "2025-07-08", engagement: 7.1 },
        { date: "2025-07-15", engagement: 7.5 },
        { date: "2025-07-22", engagement: 7.8 },
      ],
    },
    topPosts: [
      {
        id: "1",
        platform: "TikTok",
        content: "Quick dental tip: Brush for 2 minutes! ⏰🦷",
        engagement: { likes: 245, comments: 32, shares: 18, views: 1200 },
        publishedAt: "2025-07-20T14:00:00Z",
      },
      {
        id: "2",
        platform: "Instagram",
        content: "Before & After: Amazing smile transformation! ✨",
        engagement: { likes: 89, comments: 15, shares: 12, views: 450 },
        publishedAt: "2025-07-18T16:30:00Z",
      },
      {
        id: "3",
        platform: "Facebook",
        content: "5 Foods That Are Great for Your Teeth 🥕🧀🥛",
        engagement: { likes: 56, comments: 23, shares: 8, views: 320 },
        publishedAt: "2025-07-16T10:00:00Z",
      },
    ],
  },
};

// GET /api/receptionist/marketing/analytics - Get social media analytics
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const timeRange = searchParams.get("timeRange") || "30d"; // 7d, 30d, 90d, 1y
    const metric = searchParams.get("metric"); // followers, engagement, reach, etc.

    const analytics = mockAnalytics[user.id as keyof typeof mockAnalytics] || mockAnalytics["practice-1"];

    // Filter by platform if specified
    if (platform) {
      const platformData = analytics.platforms.find(
        p => p.platform.toLowerCase() === platform.toLowerCase()
      );
      
      if (!platformData) {
        return NextResponse.json({ error: "Platform not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          platform: platformData,
          trends: analytics.trends,
          topPosts: analytics.topPosts.filter(
            post => post.platform.toLowerCase() === platform.toLowerCase()
          ),
        },
      });
    }

    // Filter by specific metric if requested
    if (metric) {
      const metricData = analytics.platforms.map(platform => ({
        platform: platform.platform,
        value: platform[metric as keyof typeof platform],
      }));

      return NextResponse.json({
        success: true,
        data: {
          metric,
          timeRange,
          platforms: metricData,
          trends: analytics.trends,
        },
      });
    }

    // Return full analytics
    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        timeRange,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// POST /api/receptionist/marketing/analytics - Refresh analytics data
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { platforms } = body;

    // Simulate refreshing data from social media APIs
    console.log(`Refreshing analytics for platforms: ${platforms?.join(", ") || "all"}`);

    // In production, this would:
    // 1. Fetch fresh data from social media APIs
    // 2. Update the database
    // 3. Return the updated analytics

    const analytics = mockAnalytics[user.id as keyof typeof mockAnalytics] || mockAnalytics["practice-1"];

    // Simulate some random variation in the data
    const refreshedAnalytics = {
      ...analytics,
      platforms: analytics.platforms.map(platform => ({
        ...platform,
        followers: platform.followers + Math.floor(Math.random() * 10),
        engagement: +(platform.engagement + (Math.random() - 0.5) * 0.5).toFixed(1),
        reach: platform.reach + Math.floor(Math.random() * 100),
        impressions: platform.impressions + Math.floor(Math.random() * 200),
      })),
      overview: {
        ...analytics.overview,
        totalFollowers: analytics.overview.totalFollowers + Math.floor(Math.random() * 50),
        totalEngagement: analytics.overview.totalEngagement + Math.floor(Math.random() * 20),
      },
      lastRefreshed: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: refreshedAnalytics,
      message: "Analytics refreshed successfully",
    });
  } catch (error) {
    console.error("Error refreshing analytics:", error);
    return NextResponse.json(
      { error: "Failed to refresh analytics" },
      { status: 500 }
    );
  }
}

// PUT /api/receptionist/marketing/analytics - Update analytics settings
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      autoRefresh, 
      refreshInterval, 
      enabledPlatforms, 
      trackingMetrics 
    } = body;

    // In production, this would update user preferences in the database
    const settings = {
      autoRefresh: autoRefresh ?? true,
      refreshInterval: refreshInterval ?? 3600, // seconds
      enabledPlatforms: enabledPlatforms ?? [
        "facebook", "instagram", "tiktok", "x", "linkedin", 
        "bluesky", "reddit", "pinterest"
      ],
      trackingMetrics: trackingMetrics ?? [
        "followers", "engagement", "reach", "impressions", "growth"
      ],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: "Analytics settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating analytics settings:", error);
    return NextResponse.json(
      { error: "Failed to update analytics settings" },
      { status: 500 }
    );
  }
}
