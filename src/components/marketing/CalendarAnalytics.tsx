"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BarChart3,
	Calendar,
	Clock,
	Download,
	Eye,
	Heart,
	MessageCircle,
	Share2,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";

interface CalendarAnalyticsProps {
	timeframe?: "week" | "month" | "quarter" | "year";
}

interface PostingPattern {
	day: string;
	posts: number;
	engagement: number;
	reach: number;
}

interface ContentPerformance {
	category: string;
	posts: number;
	avgEngagement: number;
	totalReach: number;
	growth: number;
}

interface OptimalTime {
	time: string;
	day: string;
	engagementRate: number;
	posts: number;
}

export default function CalendarAnalytics({
	timeframe = "month",
}: CalendarAnalyticsProps) {
	const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
	const [selectedMetric, setSelectedMetric] = useState("engagement");

	// Mock analytics data
	const postingPatterns: PostingPattern[] = [
		{ day: "Monday", posts: 8, engagement: 6.2, reach: 1250 },
		{ day: "Tuesday", posts: 6, engagement: 5.8, reach: 980 },
		{ day: "Wednesday", posts: 7, engagement: 7.1, reach: 1420 },
		{ day: "Thursday", posts: 5, engagement: 6.8, reach: 1180 },
		{ day: "Friday", posts: 9, engagement: 8.3, reach: 1680 },
		{ day: "Saturday", posts: 4, engagement: 5.2, reach: 850 },
		{ day: "Sunday", posts: 3, engagement: 4.9, reach: 720 },
	];

	const contentPerformance: ContentPerformance[] = [
		{
			category: "Educational",
			posts: 15,
			avgEngagement: 6.4,
			totalReach: 4200,
			growth: 12.5,
		},
		{
			category: "Promotional",
			posts: 8,
			avgEngagement: 4.2,
			totalReach: 2800,
			growth: 8.3,
		},
		{
			category: "Testimonial",
			posts: 6,
			avgEngagement: 9.1,
			totalReach: 3600,
			growth: 18.7,
		},
		{
			category: "Seasonal",
			posts: 4,
			avgEngagement: 7.8,
			totalReach: 2200,
			growth: 15.2,
		},
		{
			category: "General",
			posts: 12,
			avgEngagement: 5.6,
			totalReach: 3400,
			growth: 9.8,
		},
	];

	const optimalTimes: OptimalTime[] = [
		{ time: "9:00 AM", day: "Monday", engagementRate: 7.2, posts: 3 },
		{ time: "1:00 PM", day: "Wednesday", engagementRate: 6.8, posts: 4 },
		{ time: "6:00 PM", day: "Friday", engagementRate: 8.9, posts: 5 },
		{ time: "11:00 AM", day: "Saturday", engagementRate: 5.4, posts: 2 },
		{ time: "3:00 PM", day: "Tuesday", engagementRate: 6.1, posts: 3 },
	];

	const monthlyStats = {
		totalPosts: 42,
		totalEngagement: 2847,
		totalReach: 18650,
		avgEngagementRate: 6.8,
		bestPerformingDay: "Friday",
		bestPerformingTime: "6:00 PM",
		topCategory: "Testimonial",
		growthRate: 12.3,
	};

	const weeklyComparison = {
		thisWeek: { posts: 12, engagement: 8.2, reach: 4200 },
		lastWeek: { posts: 10, engagement: 7.6, reach: 3800 },
		growth: { posts: 20, engagement: 7.9, reach: 10.5 },
	};

	const upcomingInsights = [
		{
			type: "opportunity",
			title: "High Engagement Window",
			description: "Friday 6-8 PM shows 35% higher engagement",
			action: "Schedule 2-3 posts for this time slot",
			priority: "high",
		},
		{
			type: "warning",
			title: "Low Weekend Activity",
			description: "Weekend posts receive 40% less engagement",
			action: "Consider reducing weekend posting frequency",
			priority: "medium",
		},
		{
			type: "success",
			title: "Testimonial Content Performing Well",
			description: "Patient stories have 9.1% engagement rate",
			action: "Increase testimonial content by 25%",
			priority: "high",
		},
	];

	const getInsightIcon = (type: string) => {
		switch (type) {
			case "opportunity":
				return <TrendingUp className="h-4 w-4 text-green-600" />;
			case "warning":
				return <Clock className="h-4 w-4 text-yellow-600" />;
			case "success":
				return <Heart className="h-4 w-4 text-blue-600" />;
			default:
				return <BarChart3 className="h-4 w-4 text-gray-600" />;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const exportAnalytics = () => {
		// TODO: Implement analytics export functionality
		console.log("Exporting analytics data...");
	};

	return (
		<div className="space-y-6">
			{/* Analytics Header */}
			<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
				<div>
					<h3 className="font-semibold text-gray-900 text-lg">
						Calendar Analytics
					</h3>
					<p className="text-gray-600 text-sm">
						Insights and performance metrics for your content calendar
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Select
						value={selectedTimeframe}
						onValueChange={(value) => setSelectedTimeframe(value as "year" | "week" | "month" | "quarter")}
					>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">This Week</SelectItem>
							<SelectItem value="month">This Month</SelectItem>
							<SelectItem value="quarter">This Quarter</SelectItem>
							<SelectItem value="year">This Year</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" size="sm" onClick={exportAnalytics}>
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Total Posts</p>
								<p className="font-semibold text-2xl">
									{monthlyStats.totalPosts}
								</p>
							</div>
							<Calendar className="h-8 w-8 text-blue-600" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-3 w-3 text-green-600" />
							<span className="text-green-600">
								+{weeklyComparison.growth.posts}%
							</span>
							<span className="ml-1 text-gray-600">vs last week</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Avg Engagement</p>
								<p className="font-semibold text-2xl">
									{monthlyStats.avgEngagementRate}%
								</p>
							</div>
							<Heart className="h-8 w-8 text-red-600" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-3 w-3 text-green-600" />
							<span className="text-green-600">
								+{weeklyComparison.growth.engagement}%
							</span>
							<span className="ml-1 text-gray-600">vs last week</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Total Reach</p>
								<p className="font-semibold text-2xl">
									{monthlyStats.totalReach.toLocaleString()}
								</p>
							</div>
							<Eye className="h-8 w-8 text-purple-600" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-3 w-3 text-green-600" />
							<span className="text-green-600">
								+{weeklyComparison.growth.reach}%
							</span>
							<span className="ml-1 text-gray-600">vs last week</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Growth Rate</p>
								<p className="font-semibold text-2xl">
									{monthlyStats.growthRate}%
								</p>
							</div>
							<TrendingUp className="h-8 w-8 text-green-600" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<span className="text-gray-600">Monthly growth</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts and Analysis */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Posting Patterns */}
				<Card>
					<CardHeader>
						<CardTitle>Posting Patterns by Day</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{postingPatterns.map((pattern) => (
								<div
									key={pattern.day}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-3">
										<span className="w-16 font-medium text-sm">
											{pattern.day}
										</span>
										<div className="h-2 flex-1 rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-blue-600"
												style={{ width: `${(pattern.posts / 10) * 100}%` }}
											/>
										</div>
									</div>
									<div className="flex items-center space-x-4 text-gray-600 text-sm">
										<span>{pattern.posts} posts</span>
										<span>{pattern.engagement}% eng</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Content Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Content Performance by Category</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{contentPerformance.map((content) => (
								<div
									key={content.category}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-3">
										<span className="w-20 font-medium text-sm">
											{content.category}
										</span>
										<div className="h-2 flex-1 rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-green-600"
												style={{
													width: `${(content.avgEngagement / 10) * 100}%`,
												}}
											/>
										</div>
									</div>
									<div className="flex items-center space-x-4 text-gray-600 text-sm">
										<span>{content.posts} posts</span>
										<span>{content.avgEngagement}% eng</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Optimal Times */}
			<Card>
				<CardHeader>
					<CardTitle>Optimal Posting Times</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
						{optimalTimes.map((time, index) => (
							<div
								key={`optimal-time-${time.time}-${index}`}
								className="rounded-lg border p-4 text-center"
							>
								<div className="font-semibold text-blue-600 text-lg">
									{time.time}
								</div>
								<div className="text-gray-600 text-sm">{time.day}</div>
								<div className="mt-2 text-sm">
									<span className="font-medium">{time.engagementRate}%</span>
									<span className="text-gray-500"> engagement</span>
								</div>
								<div className="text-gray-500 text-xs">{time.posts} posts</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Insights and Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle>Insights & Recommendations</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{upcomingInsights.map((insight, index) => (
							<div
								key={`insight-${insight.type}-${index}`}
								className="flex items-start space-x-3 rounded-lg border p-4"
							>
								<div className="mt-1 flex-shrink-0">
									{getInsightIcon(insight.type)}
								</div>
								<div className="flex-1">
									<div className="mb-1 flex items-center space-x-2">
										<h4 className="font-medium">{insight.title}</h4>
										<Badge className={getPriorityColor(insight.priority)}>
											{insight.priority}
										</Badge>
									</div>
									<p className="mb-2 text-gray-600 text-sm">
										{insight.description}
									</p>
									<p className="font-medium text-blue-600 text-sm">
										{insight.action}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
