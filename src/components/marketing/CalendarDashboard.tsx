"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Calendar,
	CheckCircle,
	Clock,
	Facebook,
	Instagram,
	MoreHorizontal,
	Plus,
	Target,
	TrendingUp,
	Twitter,
	Users,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CalendarStats {
	totalScheduled: number;
	totalPublished: number;
	totalFailed: number;
	upcomingThisWeek: number;
	platformBreakdown: {
		facebook: number;
		instagram: number;
		twitter: number;
		linkedin: number;
	};
	categoryBreakdown: {
		educational: number;
		promotional: number;
		testimonial: number;
		seasonal: number;
		general: number;
	};
}

interface UpcomingPost {
	id: string;
	title: string;
	scheduledFor: Date;
	platforms: string[];
	category: string;
	status: string;
}

interface CalendarDashboardProps {
	onSchedulePost?: () => void;
	onViewCalendar?: () => void;
}

export default function CalendarDashboard({
	onSchedulePost,
	onViewCalendar,
}: CalendarDashboardProps) {
	const [stats, setStats] = useState<CalendarStats | null>(null);
	const [upcomingPosts, setUpcomingPosts] = useState<UpcomingPost[]>([]);
	const [loading, setLoading] = useState(true);

	// Mock data - in real app, this would come from API
	useEffect(() => {
		const mockStats: CalendarStats = {
			totalScheduled: 15,
			totalPublished: 42,
			totalFailed: 2,
			upcomingThisWeek: 8,
			platformBreakdown: {
				facebook: 12,
				instagram: 18,
				twitter: 8,
				linkedin: 5,
			},
			categoryBreakdown: {
				educational: 15,
				promotional: 8,
				testimonial: 6,
				seasonal: 4,
				general: 10,
			},
		};

		const mockUpcomingPosts: UpcomingPost[] = [
			{
				id: "1",
				title: "Daily Oral Hygiene Tip",
				scheduledFor: new Date(2025, 6, 18, 9, 0),
				platforms: ["facebook", "instagram"],
				category: "educational",
				status: "scheduled",
			},
			{
				id: "2",
				title: "Teeth Whitening Promotion",
				scheduledFor: new Date(2025, 6, 18, 14, 30),
				platforms: ["facebook", "instagram", "twitter"],
				category: "promotional",
				status: "scheduled",
			},
			{
				id: "3",
				title: "Patient Success Story",
				scheduledFor: new Date(2025, 6, 19, 11, 0),
				platforms: ["facebook", "linkedin"],
				category: "testimonial",
				status: "scheduled",
			},
			{
				id: "4",
				title: "Weekend Dental Care Tips",
				scheduledFor: new Date(2025, 6, 20, 10, 0),
				platforms: ["instagram", "twitter"],
				category: "educational",
				status: "scheduled",
			},
		];

		// Simulate loading
		setTimeout(() => {
			setStats(mockStats);
			setUpcomingPosts(mockUpcomingPosts);
			setLoading(false);
		}, 1000);
	}, []);

	const getPlatformIcon = (platform: string) => {
		switch (platform) {
			case "facebook":
				return <Facebook className="h-3 w-3 text-blue-600" />;
			case "instagram":
				return <Instagram className="h-3 w-3 text-pink-600" />;
			case "twitter":
				return <Twitter className="h-3 w-3 text-blue-400" />;
			case "linkedin":
				return <Users className="h-3 w-3 text-blue-700" />;
			default:
				return null;
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "educational":
				return "bg-blue-100 text-blue-800";
			case "promotional":
				return "bg-green-100 text-green-800";
			case "testimonial":
				return "bg-purple-100 text-purple-800";
			case "seasonal":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardContent className="p-6">
								<div className="animate-pulse">
									<div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
									<div className="h-8 w-1/2 rounded bg-gray-200" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (!stats) return null;

	const totalPosts =
		stats.totalScheduled + stats.totalPublished + stats.totalFailed;
	const successRate =
		totalPosts > 0 ? (stats.totalPublished / totalPosts) * 100 : 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-gray-900 text-lg">
						Content Calendar Overview
					</h3>
					<p className="text-gray-600 text-sm">
						Manage and track your scheduled social media content
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Button variant="outline" onClick={onViewCalendar}>
						<Calendar className="mr-2 h-4 w-4" />
						View Calendar
					</Button>
					<Button onClick={onSchedulePost}>
						<Plus className="mr-2 h-4 w-4" />
						Schedule Post
					</Button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Scheduled</p>
								<p className="font-semibold text-2xl text-blue-600">
									{stats.totalScheduled}
								</p>
							</div>
							<Clock className="h-8 w-8 text-blue-600" />
						</div>
						<div className="mt-2">
							<p className="text-gray-500 text-xs">
								{stats.upcomingThisWeek} this week
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Published</p>
								<p className="font-semibold text-2xl text-green-600">
									{stats.totalPublished}
								</p>
							</div>
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>
						<div className="mt-2">
							<p className="text-gray-500 text-xs">
								{successRate.toFixed(1)}% success rate
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Failed</p>
								<p className="font-semibold text-2xl text-red-600">
									{stats.totalFailed}
								</p>
							</div>
							<XCircle className="h-8 w-8 text-red-600" />
						</div>
						<div className="mt-2">
							<p className="text-gray-500 text-xs">
								{totalPosts > 0
									? ((stats.totalFailed / totalPosts) * 100).toFixed(1)
									: 0}
								% failure rate
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm">Total Posts</p>
								<p className="font-semibold text-2xl text-gray-900">
									{totalPosts}
								</p>
							</div>
							<Target className="h-8 w-8 text-gray-600" />
						</div>
						<div className="mt-2">
							<p className="text-gray-500 text-xs">All time</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Platform and Category Breakdown */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Platform Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle>Platform Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Object.entries(stats.platformBreakdown).map(
								([platform, count]) => {
									const percentage =
										totalPosts > 0 ? (count / totalPosts) * 100 : 0;
									return (
										<div
											key={platform}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-2">
												{getPlatformIcon(platform)}
												<span className="font-medium text-sm capitalize">
													{platform}
												</span>
											</div>
											<div className="flex items-center space-x-3">
												<Progress value={percentage} className="w-20" />
												<span className="w-8 text-gray-600 text-sm">
													{count}
												</span>
											</div>
										</div>
									);
								},
							)}
						</div>
					</CardContent>
				</Card>

				{/* Category Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle>Content Categories</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Object.entries(stats.categoryBreakdown).map(
								([category, count]) => {
									const percentage =
										totalPosts > 0 ? (count / totalPosts) * 100 : 0;
									return (
										<div
											key={category}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-2">
												<Badge className={getCategoryColor(category)}>
													{category}
												</Badge>
											</div>
											<div className="flex items-center space-x-3">
												<Progress value={percentage} className="w-20" />
												<span className="w-8 text-gray-600 text-sm">
													{count}
												</span>
											</div>
										</div>
									);
								},
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Upcoming Posts */}
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Posts</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{upcomingPosts.slice(0, 5).map((post) => (
							<div
								key={post.id}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div className="flex-1">
									<div className="mb-1 flex items-center space-x-2">
										<h4 className="font-medium text-sm">{post.title}</h4>
										<Badge className={getCategoryColor(post.category)}>
											{post.category}
										</Badge>
									</div>
									<div className="flex items-center space-x-4 text-gray-500 text-xs">
										<span>{new Date(post.scheduledFor).toLocaleString()}</span>
										<div className="flex items-center space-x-1">
											{post.platforms.map((platform) => (
												<span key={platform}>{getPlatformIcon(platform)}</span>
											))}
										</div>
									</div>
								</div>
								<Button variant="ghost" size="sm">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</div>
						))}

						{upcomingPosts.length === 0 && (
							<div className="py-8 text-center">
								<Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
								<p className="text-gray-600 text-sm">
									No upcoming posts scheduled
								</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-2"
									onClick={onSchedulePost}
								>
									Schedule Your First Post
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
