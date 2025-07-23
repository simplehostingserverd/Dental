"use client";

import CalendarAnalytics from "@/components/marketing/CalendarAnalytics";
import CalendarDashboard from "@/components/marketing/CalendarDashboard";
import ContentCalendar from "@/components/marketing/ContentCalendar";
import ContentLibrary from "@/components/marketing/ContentLibrary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
	BarChart3,
	Calendar,
	Camera,
	Cloud,
	Eye,
	Facebook,
	Heart,
	Image,
	Instagram,
	MessageCircle,
	Plus,
	RefreshCw,
	Send,
	Share2,
	Star,
	TrendingUp,
	Twitter,
	Users,
	Video,
	Youtube,
} from "lucide-react";
import { useState, useEffect } from "react";

// TypeScript interfaces
interface SocialPost {
	id: string;
	platform: "facebook" | "instagram" | "tiktok" | "x" | "linkedin" | "youtube" | "bluesky" | "reddit" | "pinterest";
	content: string;
	imageUrl?: string;
	scheduledFor?: Date;
	publishedAt?: Date;
	status: "draft" | "scheduled" | "published" | "failed";
	engagement: {
		likes: number;
		comments: number;
		shares: number;
		views?: number;
		reposts?: number;
		saves?: number;
	};
	hashtags: string[];
}

interface SocialMetrics {
	platform: string;
	followers: number;
	engagement: number;
	reach: number;
	impressions: number;
	growth: number;
}

interface PostTemplate {
	id: string;
	title: string;
	content: string;
	category:
		| "educational"
		| "promotional"
		| "testimonial"
		| "seasonal"
		| "general";
	hashtags: string[];
}

export default function MarketingPage() {
	const { showToast } = useToast();

	// State management
	const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
	const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
	const [isPosting, setIsPosting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState<SocialPost[]>([]);
	const [analytics, setAnalytics] = useState<any>(null);

	// Form state
	const [postForm, setPostForm] = useState({
		content: "",
		platforms: [] as string[],
		scheduledFor: "",
		imageUrl: "",
		hashtags: "",
	});

	// API Functions
	const fetchPosts = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/receptionist/marketing/posts");
			const data = await response.json();

			if (data.success) {
				setPosts(data.data);
			} else {
				showToast("Error fetching posts", "error");
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
			showToast("Failed to fetch posts", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchAnalytics = async () => {
		try {
			const response = await fetch("/api/receptionist/marketing/analytics");
			const data = await response.json();

			if (data.success) {
				setAnalytics(data.data);
			} else {
				showToast("Error fetching analytics", "error");
			}
		} catch (error) {
			console.error("Error fetching analytics:", error);
			showToast("Failed to fetch analytics", "error");
		}
	};

	const createPost = async () => {
		try {
			setIsPosting(true);
			const postData = {
				content: postForm.content,
				platforms: selectedPlatforms,
				scheduledFor: postForm.scheduledFor || undefined,
				hashtags: postForm.hashtags.split(" ").filter(tag => tag.startsWith("#")),
				imageUrl: postForm.imageUrl || undefined,
			};

			const response = await fetch("/api/receptionist/marketing/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(postData),
			});

			const data = await response.json();

			if (data.success) {
				showToast(data.message || "Post created successfully", "success");
				await fetchPosts(); // Refresh posts
				setShowCreatePostDialog(false);
				resetForm();
			} else {
				showToast(data.error || "Failed to create post", "error");
			}
		} catch (error) {
			console.error("Error creating post:", error);
			showToast("Failed to create post", "error");
		} finally {
			setIsPosting(false);
		}
	};

	const refreshAnalytics = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/receptionist/marketing/analytics", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ platforms: ["all"] }),
			});

			const data = await response.json();

			if (data.success) {
				setAnalytics(data.data);
				showToast("Analytics refreshed successfully", "success");
			} else {
				showToast("Failed to refresh analytics", "error");
			}
		} catch (error) {
			console.error("Error refreshing analytics:", error);
			showToast("Failed to refresh analytics", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setPostForm({
			content: "",
			platforms: [],
			scheduledFor: "",
			imageUrl: "",
			hashtags: "",
		});
		setSelectedPlatforms([]);
	};

	// Load data on component mount
	useEffect(() => {
		fetchPosts();
		fetchAnalytics();
	}, []);

	// Mock data
	const socialMetrics: SocialMetrics[] = [
		{
			platform: "Facebook",
			followers: 1250,
			engagement: 4.2,
			reach: 3500,
			impressions: 8200,
			growth: 12.5,
		},
		{
			platform: "Instagram",
			followers: 890,
			engagement: 6.8,
			reach: 2800,
			impressions: 5600,
			growth: 18.3,
		},
		{
			platform: "TikTok",
			followers: 2150,
			engagement: 12.4,
			reach: 8500,
			impressions: 15200,
			growth: 45.8,
		},
		{
			platform: "X (Twitter)",
			followers: 420,
			engagement: 3.1,
			reach: 1200,
			impressions: 2400,
			growth: 8.7,
		},
		{
			platform: "LinkedIn",
			followers: 180,
			engagement: 5.4,
			reach: 650,
			impressions: 1300,
			growth: 15.2,
		},
		{
			platform: "BlueSky",
			followers: 95,
			engagement: 8.9,
			reach: 320,
			impressions: 680,
			growth: 28.4,
		},
		{
			platform: "Reddit",
			followers: 340,
			engagement: 7.2,
			reach: 1100,
			impressions: 2200,
			growth: 22.1,
		},
		{
			platform: "Pinterest",
			followers: 560,
			engagement: 5.8,
			reach: 1800,
			impressions: 3600,
			growth: 16.7,
		},
	];

	const recentPosts: SocialPost[] = [
		{
			id: "1",
			platform: "facebook",
			content:
				"🦷 Did you know that regular dental cleanings can prevent gum disease? Book your appointment today! #DentalHealth #PreventiveCare",
			publishedAt: new Date("2025-07-16T10:00:00Z"),
			status: "published",
			engagement: { likes: 24, comments: 8, shares: 3 },
			hashtags: ["DentalHealth", "PreventiveCare"],
		},
		{
			id: "2",
			platform: "instagram",
			content:
				"✨ Transform your smile with our professional teeth whitening service! Before and after results speak for themselves. #SmileTransformation #TeethWhitening",
			imageUrl: "/images/teeth-whitening.jpg",
			publishedAt: new Date("2025-07-15T14:30:00Z"),
			status: "published",
			engagement: { likes: 45, comments: 12, shares: 8, views: 320 },
			hashtags: ["SmileTransformation", "TeethWhitening"],
		},
		{
			id: "3",
			platform: "twitter",
			content:
				"Quick tip: Brush your teeth for at least 2 minutes, twice a day! ⏰🦷 #DentalTips #OralHealth",
			scheduledFor: new Date("2025-07-18T09:00:00Z"),
			status: "scheduled",
			engagement: { likes: 0, comments: 0, shares: 0 },
			hashtags: ["DentalTips", "OralHealth"],
		},
	];

	const postTemplates: PostTemplate[] = [
		{
			id: "1",
			title: "Dental Health Tip",
			content:
				"💡 Dental Health Tip: [Insert tip here]. Remember, prevention is always better than treatment! #DentalHealth #PreventiveCare #HealthySmile",
			category: "educational",
			hashtags: ["DentalHealth", "PreventiveCare", "HealthySmile"],
		},
		{
			id: "2",
			title: "Service Promotion",
			content:
				"✨ Special offer on [Service Name]! Book your appointment this month and save [Amount/Percentage]. Limited time offer! #SpecialOffer #DentalCare",
			category: "promotional",
			hashtags: ["SpecialOffer", "DentalCare", "LimitedTime"],
		},
		{
			id: "3",
			title: "Patient Testimonial",
			content:
				'🌟 "[Patient testimonial quote]" - [Patient Name]. We\'re thrilled to help our patients achieve their perfect smile! #PatientTestimonial #HappyPatients #SmileTransformation',
			category: "testimonial",
			hashtags: ["PatientTestimonial", "HappyPatients", "SmileTransformation"],
		},
		{
			id: "4",
			title: "Seasonal Reminder",
			content:
				"🎃 As we enjoy [Season/Holiday] treats, don't forget to maintain your oral health! Here are some tips: [Tips]. #SeasonalCare #DentalHealth",
			category: "seasonal",
			hashtags: ["SeasonalCare", "DentalHealth", "OralHealth"],
		},
	];

	// Handler functions
	const handleCreatePost = async () => {
		setIsPosting(true);
		try {
			const response = await fetch("/api/receptionist/marketing/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: postForm.content,
					platforms: selectedPlatforms,
					scheduledFor: postForm.scheduledFor || undefined,
					imageUrl: postForm.imageUrl || undefined,
					hashtags: postForm.hashtags,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create post");
			}

			// Reset form and close dialog
			setPostForm({
				content: "",
				platforms: [],
				scheduledFor: "",
				imageUrl: "",
				hashtags: "",
			});
			setSelectedPlatforms([]);
			setShowCreatePostDialog(false);

			showToast({
				type: "success",
				title: "Post Created",
				message: data.message || "Post created successfully!",
			});
		} catch (error) {
			console.error("Error creating post:", error);
			showToast({
				type: "error",
				title: "Post Failed",
				message:
					error instanceof Error
						? error.message
						: "Failed to create post. Please try again.",
			});
		} finally {
			setIsPosting(false);
		}
	};

	const handleUseTemplate = (
		template: PostTemplate | { content: string; hashtags: string[] },
	) => {
		setPostForm((prev) => ({
			...prev,
			content: template.content,
			hashtags: Array.isArray(template.hashtags)
				? template.hashtags.join(" ")
				: template.hashtags,
		}));
		setShowCreatePostDialog(true);
	};

	const getPlatformIcon = (platform: string) => {
		switch (platform.toLowerCase()) {
			case "facebook":
				return <Facebook className="h-5 w-5 text-blue-600" />;
			case "instagram":
				return <Instagram className="h-5 w-5 text-pink-600" />;
			case "tiktok":
				return <Video className="h-5 w-5 text-black" />;
			case "x":
			case "x (twitter)":
			case "twitter":
				return <Twitter className="h-5 w-5 text-black" />;
			case "linkedin":
				return <Users className="h-5 w-5 text-blue-700" />;
			case "bluesky":
				return <Cloud className="h-5 w-5 text-sky-500" />;
			case "reddit":
				return <MessageCircle className="h-5 w-5 text-orange-600" />;
			case "pinterest":
				return <Image className="h-5 w-5 text-red-600" />;
			case "youtube":
				return <Youtube className="h-5 w-5 text-red-600" />;
			default:
				return <Share2 className="h-5 w-5 text-gray-600" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "bg-green-100 text-green-800";
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "draft":
				return "bg-gray-100 text-gray-800";
			case "failed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Social Media Marketing
					</h1>
					<p className="text-gray-600">
						Manage your practice's social media presence and patient engagement
					</p>
				</div>
				<Dialog
					open={showCreatePostDialog}
					onOpenChange={setShowCreatePostDialog}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create Post
						</Button>
					</DialogTrigger>
				</Dialog>
			</div>

			{/* Social Media Metrics */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{socialMetrics.map((metric) => (
					<Card key={metric.platform}>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								{getPlatformIcon(metric.platform)}
								<Badge variant="outline" className="text-xs">
									{metric.growth > 0 ? "+" : ""}
									{metric.growth}%
								</Badge>
							</div>
							<CardTitle className="text-lg">{metric.platform}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">Followers</span>
									<span className="font-medium">
										{metric.followers.toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">Engagement</span>
									<span className="font-medium">{metric.engagement}%</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">Reach</span>
									<span className="font-medium">
										{metric.reach.toLocaleString()}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Main Content Tabs */}
			<Tabs defaultValue="posts" className="space-y-4">
				<TabsList>
					<TabsTrigger value="posts">Recent Posts</TabsTrigger>
					<TabsTrigger value="templates">Post Templates</TabsTrigger>
					<TabsTrigger value="library">Content Library</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="calendar">Content Calendar</TabsTrigger>
				</TabsList>

				{/* Recent Posts Tab */}
				<TabsContent value="posts">
					<Card>
						<CardHeader>
							<CardTitle>Recent Posts</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentPosts.map((post) => (
									<div key={post.id} className="rounded-lg border p-4">
										<div className="mb-3 flex items-start justify-between">
											<div className="flex items-center space-x-2">
												{getPlatformIcon(post.platform)}
												<span className="font-medium capitalize">
													{post.platform}
												</span>
												<Badge className={getStatusColor(post.status)}>
													{post.status}
												</Badge>
											</div>
											<span className="text-gray-500 text-sm">
												{post.publishedAt
													? post.publishedAt.toLocaleDateString()
													: post.scheduledFor?.toLocaleDateString()}
											</span>
										</div>

										<p className="mb-3 text-gray-700">{post.content}</p>

										{post.imageUrl && (
											<div className="mb-3">
												<img
													src={post.imageUrl}
													alt="Social media post content"
													className="h-32 max-w-xs rounded-lg object-cover"
												/>
											</div>
										)}

										<div className="flex items-center space-x-6 text-gray-600 text-sm">
											<div className="flex items-center space-x-1">
												<Heart className="h-4 w-4" />
												<span>{post.engagement.likes}</span>
											</div>
											<div className="flex items-center space-x-1">
												<MessageCircle className="h-4 w-4" />
												<span>{post.engagement.comments}</span>
											</div>
											<div className="flex items-center space-x-1">
												<Share2 className="h-4 w-4" />
												<span>{post.engagement.shares}</span>
											</div>
											{post.engagement.views && (
												<div className="flex items-center space-x-1">
													<Eye className="h-4 w-4" />
													<span>{post.engagement.views}</span>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Post Templates Tab */}
				<TabsContent value="templates">
					<Card>
						<CardHeader>
							<CardTitle>Post Templates</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{postTemplates.map((template) => (
									<div key={template.id} className="rounded-lg border p-4">
										<div className="mb-2 flex items-center justify-between">
											<h3 className="font-medium">{template.title}</h3>
											<Badge variant="outline" className="text-xs">
												{template.category}
											</Badge>
										</div>
										<p className="mb-3 line-clamp-3 text-gray-600 text-sm">
											{template.content}
										</p>
										<div className="flex items-center justify-between">
											<div className="flex flex-wrap gap-1">
												{template.hashtags.slice(0, 3).map((tag) => (
													<span key={tag} className="text-blue-600 text-xs">
														#{tag}
													</span>
												))}
												{template.hashtags.length > 3 && (
													<span className="text-gray-500 text-xs">
														+{template.hashtags.length - 3} more
													</span>
												)}
											</div>
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleUseTemplate(template)}
											>
												Use Template
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Content Library Tab */}
				<TabsContent value="library">
					<Card>
						<CardHeader>
							<CardTitle>Content Library</CardTitle>
						</CardHeader>
						<CardContent>
							<ContentLibrary onUseTemplate={handleUseTemplate} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value="analytics">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-2xl font-bold">Social Media Analytics</h2>
						<Button
							onClick={refreshAnalytics}
							disabled={isLoading}
							variant="outline"
							size="sm"
						>
							<RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
							Refresh Data
						</Button>
					</div>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Engagement Overview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{socialMetrics.map((metric) => (
										<div
											key={metric.platform}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-2">
												{getPlatformIcon(metric.platform)}
												<span>{metric.platform}</span>
											</div>
											<div className="text-right">
												<div className="font-medium">{metric.engagement}%</div>
												<div className="text-gray-500 text-sm">
													{metric.impressions.toLocaleString()} impressions
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Growth Trends</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{socialMetrics.map((metric) => (
										<div
											key={metric.platform}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-2">
												{getPlatformIcon(metric.platform)}
												<span>{metric.platform}</span>
											</div>
											<div className="flex items-center space-x-2">
												<TrendingUp
													className={`h-4 w-4 ${metric.growth > 0 ? "text-green-600" : "text-red-600"}`}
												/>
												<span
													className={`font-medium ${metric.growth > 0 ? "text-green-600" : "text-red-600"}`}
												>
													{metric.growth > 0 ? "+" : ""}
													{metric.growth}%
												</span>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Content Calendar Tab */}
				<TabsContent value="calendar">
					<div className="space-y-6">
						<CalendarDashboard
							onSchedulePost={() => setShowCreatePostDialog(true)}
							onViewCalendar={() => {
								// Scroll to calendar section or switch to calendar view
								console.log("Viewing calendar");
							}}
						/>
						<ContentCalendar
							onCreatePost={(post) => {
								console.log("Creating scheduled post:", post);
								showToast({
									type: "success",
									title: "Post Scheduled",
									message: `Post scheduled for ${new Date(post.scheduledFor).toLocaleString()}`,
								});
							}}
							onEditPost={(post) => {
								console.log("Editing post:", post);
								showToast({
									type: "info",
									title: "Edit Post",
									message: "Post editing functionality coming soon!",
								});
							}}
							onDeletePost={(postId) => {
								console.log("Deleting post:", postId);
								showToast({
									type: "success",
									title: "Post Deleted",
									message: "Scheduled post has been deleted.",
								});
							}}
						/>
						<CalendarAnalytics />
					</div>
				</TabsContent>
			</Tabs>

			{/* Create Post Dialog */}
			<Dialog
				open={showCreatePostDialog}
				onOpenChange={setShowCreatePostDialog}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Create Social Media Post</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{/* Platform Selection */}
						<div>
							<Label>Select Platforms *</Label>
							<div className="mt-2 grid grid-cols-3 gap-3">
								{[
									{
										id: "facebook",
										name: "Facebook",
										icon: Facebook,
										color: "text-blue-600",
									},
									{
										id: "instagram",
										name: "Instagram",
										icon: Instagram,
										color: "text-pink-600",
									},
									{
										id: "tiktok",
										name: "TikTok",
										icon: Video,
										color: "text-black",
									},
									{
										id: "x",
										name: "X",
										icon: Twitter,
										color: "text-black",
									},
									{
										id: "linkedin",
										name: "LinkedIn",
										icon: Users,
										color: "text-blue-700",
									},
									{
										id: "bluesky",
										name: "BlueSky",
										icon: Cloud,
										color: "text-sky-500",
									},
									{
										id: "reddit",
										name: "Reddit",
										icon: MessageCircle,
										color: "text-orange-600",
									},
									{
										id: "pinterest",
										name: "Pinterest",
										icon: Image,
										color: "text-red-600",
									},
								].map((platform) => (
									<div
										key={platform.id}
										className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors${
											selectedPlatforms.includes(platform.id)
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}
										`}
										onClick={() => {
											setSelectedPlatforms((prev) =>
												prev.includes(platform.id)
													? prev.filter((p) => p !== platform.id)
													: [...prev, platform.id],
											);
											setPostForm((prev) => ({
												...prev,
												platforms: selectedPlatforms.includes(platform.id)
													? selectedPlatforms.filter((p) => p !== platform.id)
													: [...selectedPlatforms, platform.id],
											}));
										}}
									>
										<platform.icon className={`h-5 w-5 ${platform.color}`} />
										<span className="font-medium">{platform.name}</span>
										{selectedPlatforms.includes(platform.id) && (
											<div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
										)}
									</div>
								))}
							</div>
						</div>

						{/* Post Content */}
						<div>
							<Label htmlFor="content">Post Content *</Label>
							<Textarea
								id="content"
								value={postForm.content}
								onChange={(e) =>
									setPostForm((prev) => ({
										...prev,
										content: e.target.value,
									}))
								}
								placeholder="What would you like to share with your patients?"
								rows={6}
								className="mt-2"
							/>
							<div className="mt-1 flex justify-between">
								<span className="text-gray-500 text-sm">
									{postForm.content.length}/280 characters
								</span>
								<span className="text-gray-500 text-sm">
									Tip: Use emojis and hashtags to increase engagement
								</span>
							</div>
						</div>

						{/* Image Upload */}
						<div>
							<Label htmlFor="image">Image (Optional)</Label>
							<div className="mt-2 rounded-lg border-2 border-gray-300 border-dashed p-6 text-center transition-colors hover:border-gray-400">
								<Camera className="mx-auto mb-2 h-8 w-8 text-gray-400" />
								<p className="mb-2 text-gray-600 text-sm">
									Click to upload an image or drag and drop
								</p>
								<p className="text-gray-500 text-xs">
									PNG, JPG, GIF up to 10MB
								</p>
								<Input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										// TODO: Handle file upload
										console.log("File selected:", e.target.files?.[0]);
									}}
								/>
							</div>
						</div>

						{/* Hashtags */}
						<div>
							<Label htmlFor="hashtags">Hashtags</Label>
							<Input
								id="hashtags"
								value={postForm.hashtags}
								onChange={(e) =>
									setPostForm((prev) => ({
										...prev,
										hashtags: e.target.value,
									}))
								}
								placeholder="#DentalHealth #SmileTransformation #OralCare"
								className="mt-2"
							/>
							<p className="mt-1 text-gray-500 text-sm">
								Separate hashtags with spaces. Recommended: 3-5 hashtags per
								post
							</p>
						</div>

						{/* Scheduling */}
						<div>
							<Label htmlFor="schedule">Schedule Post (Optional)</Label>
							<Input
								id="schedule"
								type="datetime-local"
								value={postForm.scheduledFor}
								onChange={(e) =>
									setPostForm((prev) => ({
										...prev,
										scheduledFor: e.target.value,
									}))
								}
								className="mt-2"
								min={new Date().toISOString().slice(0, 16)}
							/>
							<p className="mt-1 text-gray-500 text-sm">
								Leave empty to publish immediately
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end space-x-3 border-t pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowCreatePostDialog(false)}
								disabled={isPosting}
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleCreatePost}
								disabled={
									isPosting ||
									!postForm.content ||
									selectedPlatforms.length === 0
								}
							>
								{isPosting ? (
									<>
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
										{postForm.scheduledFor ? "Scheduling..." : "Publishing..."}
									</>
								) : (
									<>
										{postForm.scheduledFor ? (
											<>
												<Calendar className="mr-2 h-4 w-4" />
												Schedule Post
											</>
										) : (
											<>
												<Send className="mr-2 h-4 w-4" />
												Publish Now
											</>
										)}
									</>
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
