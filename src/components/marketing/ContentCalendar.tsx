"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Edit,
	Facebook,
	Filter,
	Instagram,
	MoreHorizontal,
	Plus,
	Search,
	Twitter,
	Users,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface ScheduledPost {
	id: string;
	title: string;
	content: string;
	platforms: string[];
	scheduledFor: Date;
	status: "scheduled" | "published" | "failed" | "draft";
	category:
		| "educational"
		| "promotional"
		| "testimonial"
		| "seasonal"
		| "general";
	hashtags: string[];
	imageUrl?: string;
	engagement?: {
		likes: number;
		comments: number;
		shares: number;
	};
}

interface ContentCalendarProps {
	onCreatePost?: (post: Omit<ScheduledPost, "id">) => void;
	onEditPost?: (post: ScheduledPost) => void;
	onDeletePost?: (postId: string) => void;
}

export default function ContentCalendar({
	onCreatePost,
	onEditPost,
	onDeletePost,
}: ContentCalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
	const [filterPlatform, setFilterPlatform] = useState("all");
	const [filterCategory, setFilterCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	// Form state for creating/editing posts
	const [postForm, setPostForm] = useState({
		title: "",
		content: "",
		platforms: [] as string[],
		scheduledFor: "",
		category: "general" as const,
		hashtags: "",
		imageUrl: "",
	});

	// Mock scheduled posts data
	const scheduledPosts: ScheduledPost[] = [
		{
			id: "1",
			title: "Daily Oral Hygiene Tip",
			content:
				"💡 Daily Tip: Brush your teeth for at least 2 minutes, twice a day! #DentalHealth #OralHygiene",
			platforms: ["facebook", "instagram"],
			scheduledFor: new Date(2025, 6, 18, 9, 0), // July 18, 2025, 9:00 AM
			status: "scheduled",
			category: "educational",
			hashtags: ["DentalHealth", "OralHygiene"],
		},
		{
			id: "2",
			title: "Teeth Whitening Promotion",
			content:
				"✨ SPECIAL OFFER: Professional teeth whitening for just $299! Book this month and save! #TeethWhitening #SpecialOffer",
			platforms: ["facebook", "instagram", "twitter"],
			scheduledFor: new Date(2025, 6, 19, 14, 30), // July 19, 2025, 2:30 PM
			status: "scheduled",
			category: "promotional",
			hashtags: ["TeethWhitening", "SpecialOffer"],
		},
		{
			id: "3",
			title: "Patient Success Story",
			content:
				'🌟 "Amazing experience with my dental implant!" - Sarah M. We\'re here to help you achieve your perfect smile! #PatientTestimonial',
			platforms: ["facebook", "linkedin"],
			scheduledFor: new Date(2025, 6, 20, 11, 0), // July 20, 2025, 11:00 AM
			status: "scheduled",
			category: "testimonial",
			hashtags: ["PatientTestimonial", "DentalImplants"],
		},
		{
			id: "4",
			title: "Weekend Dental Care Tips",
			content:
				"🦷 Weekend reminder: Don't forget to floss! It's just as important as brushing. #WeekendTips #DentalCare",
			platforms: ["instagram", "twitter"],
			scheduledFor: new Date(2025, 6, 21, 10, 0), // July 21, 2025, 10:00 AM
			status: "scheduled",
			category: "educational",
			hashtags: ["WeekendTips", "DentalCare"],
		},
		{
			id: "5",
			title: "Monday Motivation",
			content:
				"💪 Start your week with a healthy smile! Remember to schedule your next cleaning appointment. #MondayMotivation #HealthySmile",
			platforms: ["facebook", "instagram", "linkedin"],
			scheduledFor: new Date(2025, 6, 22, 8, 30), // July 22, 2025, 8:30 AM
			status: "scheduled",
			category: "general",
			hashtags: ["MondayMotivation", "HealthySmile"],
		},
	];

	// Filter posts based on current filters
	const filteredPosts = useMemo(() => {
		return scheduledPosts.filter((post) => {
			const matchesPlatform =
				filterPlatform === "all" || post.platforms.includes(filterPlatform);
			const matchesCategory =
				filterCategory === "all" || post.category === filterCategory;
			const matchesSearch =
				searchTerm === "" ||
				post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.hashtags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase()),
				);

			return matchesPlatform && matchesCategory && matchesSearch;
		});
	}, [filterPlatform, filterCategory, searchTerm]);

	// Get posts for a specific date
	const getPostsForDate = (date: Date) => {
		return filteredPosts.filter((post) => {
			const postDate = new Date(post.scheduledFor);
			return postDate.toDateString() === date.toDateString();
		});
	};

	// Generate calendar days for current month
	const generateCalendarDays = () => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());

		const days = [];
		const currentDay = new Date(startDate);

		for (let i = 0; i < 42; i++) {
			// 6 weeks * 7 days
			days.push(new Date(currentDay));
			currentDay.setDate(currentDay.getDate() + 1);
		}

		return days;
	};

	// Navigation functions
	const navigateMonth = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
		setCurrentDate(newDate);
	};

	const navigateToToday = () => {
		setCurrentDate(new Date());
	};

	// Platform icon helper
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

	// Status color helper
	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "published":
				return "bg-green-100 text-green-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "draft":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Category color helper
	const getCategoryColor = (category: string) => {
		switch (category) {
			case "educational":
				return "bg-blue-50 border-blue-200";
			case "promotional":
				return "bg-green-50 border-green-200";
			case "testimonial":
				return "bg-purple-50 border-purple-200";
			case "seasonal":
				return "bg-orange-50 border-orange-200";
			default:
				return "bg-gray-50 border-gray-200";
		}
	};

	// Handle form submission
	const handleCreatePost = () => {
		if (
			!postForm.title ||
			!postForm.content ||
			!postForm.scheduledFor ||
			postForm.platforms.length === 0
		) {
			return;
		}

		const newPost: Omit<ScheduledPost, "id"> = {
			title: postForm.title,
			content: postForm.content,
			platforms: postForm.platforms,
			scheduledFor: new Date(postForm.scheduledFor),
			status: "scheduled",
			category: postForm.category,
			hashtags: postForm.hashtags
				.split(/\s+/)
				.filter((tag) => tag.startsWith("#"))
				.map((tag) => tag.slice(1)),
			imageUrl: postForm.imageUrl || undefined,
		};

		onCreatePost?.(newPost);

		// Reset form
		setPostForm({
			title: "",
			content: "",
			platforms: [],
			scheduledFor: "",
			category: "general",
			hashtags: "",
			imageUrl: "",
		});
		setShowCreateDialog(false);
	};

	const calendarDays = generateCalendarDays();
	const today = new Date();
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return (
		<div className="space-y-6">
			{/* Calendar Header */}
			<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
				<div className="flex items-center space-x-4">
					<h2 className="font-semibold text-2xl text-gray-900">
						{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
					</h2>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigateMonth("prev")}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={navigateToToday}>
							Today
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigateMonth("next")}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div className="flex items-center space-x-3">
					<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Schedule Post
							</Button>
						</DialogTrigger>
					</Dialog>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
				<div className="flex-1">
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search posts..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				<Select value={filterPlatform} onValueChange={setFilterPlatform}>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="Platform" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Platforms</SelectItem>
						<SelectItem value="facebook">Facebook</SelectItem>
						<SelectItem value="instagram">Instagram</SelectItem>
						<SelectItem value="twitter">Twitter</SelectItem>
						<SelectItem value="linkedin">LinkedIn</SelectItem>
					</SelectContent>
				</Select>

				<Select value={filterCategory} onValueChange={setFilterCategory}>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						<SelectItem value="educational">Educational</SelectItem>
						<SelectItem value="promotional">Promotional</SelectItem>
						<SelectItem value="testimonial">Testimonial</SelectItem>
						<SelectItem value="seasonal">Seasonal</SelectItem>
						<SelectItem value="general">General</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Calendar Grid */}
			<Card>
				<CardContent className="p-0">
					{/* Calendar Header */}
					<div className="grid grid-cols-7 border-b">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								className="border-r p-3 text-center font-medium text-gray-500 text-sm last:border-r-0"
							>
								{day}
							</div>
						))}
					</div>

					{/* Calendar Body */}
					<div className="grid grid-cols-7">
						{calendarDays.map((day, index) => {
							const isCurrentMonth = day.getMonth() === currentDate.getMonth();
							const isToday = day.toDateString() === today.toDateString();
							const postsForDay = getPostsForDate(day);

							return (
								<div
									key={index}
									className={`min-h-[120px] cursor-pointer border-r border-b p-2 last:border-r-0 hover:bg-gray-50 transition-colors${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
										${isToday ? "bg-blue-50" : ""}
									`}
									onClick={() => setSelectedDate(day)}
								>
									<div
										className={`font-medium text-sm mb-2${isToday ? "text-blue-600" : isCurrentMonth ? "text-gray-900" : "text-gray-400"}
									`}
									>
										{day.getDate()}
									</div>

									<div className="space-y-1">
										{postsForDay.slice(0, 3).map((post) => (
											<div
												key={post.id}
												className={`cursor-pointer rounded border p-1 text-xs hover:shadow-sm transition-shadow${getCategoryColor(post.category)}
												`}
												onClick={(e) => {
													e.stopPropagation();
													setSelectedPost(post);
												}}
											>
												<div className="mb-1 flex items-center justify-between">
													<span className="truncate font-medium">
														{post.title}
													</span>
													<Badge
														className={`text-xs ${getStatusColor(post.status)}`}
													>
														{post.status}
													</Badge>
												</div>
												<div className="flex items-center space-x-1">
													{post.platforms.slice(0, 3).map((platform) => (
														<span key={platform}>
															{getPlatformIcon(platform)}
														</span>
													))}
													<span className="text-gray-500">
														{new Date(post.scheduledFor).toLocaleTimeString(
															[],
															{
																hour: "2-digit",
																minute: "2-digit",
															},
														)}
													</span>
												</div>
											</div>
										))}

										{postsForDay.length > 3 && (
											<div className="py-1 text-center text-gray-500 text-xs">
												+{postsForDay.length - 3} more
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Create Post Dialog */}
			<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Schedule New Post</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="title">Post Title *</Label>
								<Input
									id="title"
									value={postForm.title}
									onChange={(e) =>
										setPostForm((prev) => ({ ...prev, title: e.target.value }))
									}
									placeholder="Enter post title"
								/>
							</div>
							<div>
								<Label htmlFor="category">Category *</Label>
								<Select
									value={postForm.category}
									onValueChange={(value: any) =>
										setPostForm((prev) => ({ ...prev, category: value }))
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="educational">Educational</SelectItem>
										<SelectItem value="promotional">Promotional</SelectItem>
										<SelectItem value="testimonial">Testimonial</SelectItem>
										<SelectItem value="seasonal">Seasonal</SelectItem>
										<SelectItem value="general">General</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div>
							<Label htmlFor="content">Post Content *</Label>
							<Textarea
								id="content"
								value={postForm.content}
								onChange={(e) =>
									setPostForm((prev) => ({ ...prev, content: e.target.value }))
								}
								placeholder="Write your post content..."
								rows={4}
							/>
						</div>

						<div>
							<Label>Platforms *</Label>
							<div className="mt-2 grid grid-cols-2 gap-3">
								{[
									{ id: "facebook", name: "Facebook", icon: Facebook },
									{ id: "instagram", name: "Instagram", icon: Instagram },
									{ id: "twitter", name: "Twitter", icon: Twitter },
									{ id: "linkedin", name: "LinkedIn", icon: Users },
								].map((platform) => (
									<div
										key={platform.id}
										className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors${
											postForm.platforms.includes(platform.id)
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}
										`}
										onClick={() => {
											setPostForm((prev) => ({
												...prev,
												platforms: prev.platforms.includes(platform.id)
													? prev.platforms.filter((p) => p !== platform.id)
													: [...prev.platforms, platform.id],
											}));
										}}
									>
										<platform.icon className="h-5 w-5" />
										<span className="font-medium">{platform.name}</span>
										{postForm.platforms.includes(platform.id) && (
											<div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
										)}
									</div>
								))}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="scheduledFor">Schedule Date & Time *</Label>
								<Input
									id="scheduledFor"
									type="datetime-local"
									value={postForm.scheduledFor}
									onChange={(e) =>
										setPostForm((prev) => ({
											...prev,
											scheduledFor: e.target.value,
										}))
									}
									min={new Date().toISOString().slice(0, 16)}
								/>
							</div>
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
									placeholder="#DentalHealth #SmileTransformation"
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowCreateDialog(false)}
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleCreatePost}
								disabled={
									!postForm.title ||
									!postForm.content ||
									!postForm.scheduledFor ||
									postForm.platforms.length === 0
								}
							>
								<Calendar className="mr-2 h-4 w-4" />
								Schedule Post
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Post Details Modal */}
			{selectedPost && (
				<Dialog
					open={!!selectedPost}
					onOpenChange={() => setSelectedPost(null)}
				>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle className="flex items-center justify-between">
								<span>{selectedPost.title}</span>
								<div className="flex items-center space-x-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onEditPost?.(selectedPost);
											setSelectedPost(null);
										}}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => setSelectedPost(null)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Badge className={getStatusColor(selectedPost.status)}>
									{selectedPost.status}
								</Badge>
								<Badge variant="outline">{selectedPost.category}</Badge>
							</div>

							<div>
								<Label className="font-medium text-sm">Content</Label>
								<p className="mt-1 text-gray-700 text-sm">
									{selectedPost.content}
								</p>
							</div>

							<div>
								<Label className="font-medium text-sm">Platforms</Label>
								<div className="mt-1 flex items-center space-x-2">
									{selectedPost.platforms.map((platform) => (
										<div key={platform} className="flex items-center space-x-1">
											{getPlatformIcon(platform)}
											<span className="text-sm capitalize">{platform}</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<Label className="font-medium text-sm">Scheduled For</Label>
								<div className="mt-1 flex items-center space-x-2">
									<Clock className="h-4 w-4 text-gray-500" />
									<span className="text-sm">
										{new Date(selectedPost.scheduledFor).toLocaleString()}
									</span>
								</div>
							</div>

							{selectedPost.hashtags.length > 0 && (
								<div>
									<Label className="font-medium text-sm">Hashtags</Label>
									<div className="mt-1 flex flex-wrap gap-1">
										{selectedPost.hashtags.map((tag) => (
											<span key={tag} className="text-blue-600 text-xs">
												#{tag}
											</span>
										))}
									</div>
								</div>
							)}

							{selectedPost.engagement && (
								<div>
									<Label className="font-medium text-sm">Engagement</Label>
									<div className="mt-1 flex items-center space-x-4 text-gray-600 text-sm">
										<span>{selectedPost.engagement.likes} likes</span>
										<span>{selectedPost.engagement.comments} comments</span>
										<span>{selectedPost.engagement.shares} shares</span>
									</div>
								</div>
							)}

							<div className="flex justify-end space-x-2 pt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										onDeletePost?.(selectedPost.id);
										setSelectedPost(null);
									}}
								>
									Delete
								</Button>
								<Button
									size="sm"
									onClick={() => {
										onEditPost?.(selectedPost);
										setSelectedPost(null);
									}}
								>
									Edit Post
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
