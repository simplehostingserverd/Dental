"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	BookOpen,
	Calendar,
	Copy,
	Edit,
	Filter,
	Heart,
	Search,
	Star,
	Tag,
	TrendingUp,
} from "lucide-react";

interface ContentTemplate {
	id: string;
	title: string;
	content: string;
	category: "educational" | "promotional" | "testimonial" | "seasonal" | "general" | "emergency";
	hashtags: string[];
	platforms: string[];
	engagement: {
		avgLikes: number;
		avgComments: number;
		avgShares: number;
		usageCount: number;
	};
	lastUsed?: Date;
	isPopular: boolean;
	difficulty: "easy" | "medium" | "advanced";
}

interface ContentLibraryProps {
	onUseTemplate: (template: ContentTemplate) => void;
}

export default function ContentLibrary({ onUseTemplate }: ContentLibraryProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedPlatform, setSelectedPlatform] = useState("all");

	// Mock content templates
	const contentTemplates: ContentTemplate[] = [
		{
			id: "1",
			title: "Daily Oral Hygiene Tip",
			content: "💡 Daily Tip: Brush your teeth for at least 2 minutes, twice a day! Use a soft-bristled toothbrush and fluoride toothpaste for best results. Your smile will thank you! 😊 #DentalHealth #OralHygiene #HealthySmile #DentalTips",
			category: "educational",
			hashtags: ["DentalHealth", "OralHygiene", "HealthySmile", "DentalTips"],
			platforms: ["facebook", "instagram", "twitter"],
			engagement: { avgLikes: 28, avgComments: 6, avgShares: 4, usageCount: 15 },
			lastUsed: new Date("2025-07-15"),
			isPopular: true,
			difficulty: "easy",
		},
		{
			id: "2",
			title: "Teeth Whitening Promotion",
			content: "✨ SPECIAL OFFER: Professional teeth whitening for just $299 (reg. $450)! Transform your smile in just one visit. Book your appointment this month and save $151! Limited time offer. Call us today! 📞 #TeethWhitening #SpecialOffer #SmileTransformation #LimitedTime",
			category: "promotional",
			hashtags: ["TeethWhitening", "SpecialOffer", "SmileTransformation", "LimitedTime"],
			platforms: ["facebook", "instagram"],
			engagement: { avgLikes: 45, avgComments: 12, avgShares: 8, usageCount: 8 },
			lastUsed: new Date("2025-07-10"),
			isPopular: true,
			difficulty: "medium",
		},
		{
			id: "3",
			title: "Patient Success Story",
			content: "🌟 \"I was so nervous about my root canal, but Dr. Smith made the whole experience comfortable and pain-free. I can't believe how easy it was!\" - Sarah M. We're thrilled to help our patients achieve optimal oral health! #PatientTestimonial #RootCanal #ComfortableCare #HappyPatients",
			category: "testimonial",
			hashtags: ["PatientTestimonial", "RootCanal", "ComfortableCare", "HappyPatients"],
			platforms: ["facebook", "instagram", "linkedin"],
			engagement: { avgLikes: 52, avgComments: 18, avgShares: 12, usageCount: 6 },
			lastUsed: new Date("2025-07-12"),
			isPopular: true,
			difficulty: "easy",
		},
		{
			id: "4",
			title: "Holiday Dental Care",
			content: "🎃 Enjoying Halloween treats? Here are 3 tips to protect your teeth: 1) Eat candy with meals, not as snacks 2) Choose chocolate over sticky candies 3) Rinse with water after eating sweets. Have a spook-tacular Halloween! 👻 #Halloween #DentalCare #HealthyTreats #SeasonalTips",
			category: "seasonal",
			hashtags: ["Halloween", "DentalCare", "HealthyTreats", "SeasonalTips"],
			platforms: ["facebook", "instagram", "twitter"],
			engagement: { avgLikes: 35, avgComments: 8, avgShares: 6, usageCount: 3 },
			isPopular: false,
			difficulty: "easy",
		},
		{
			id: "5",
			title: "Dental Emergency Guide",
			content: "🚨 DENTAL EMERGENCY? Here's what to do: Knocked out tooth → Keep it moist, see us ASAP. Severe toothache → Rinse with warm salt water, take pain reliever. Broken tooth → Save pieces, rinse mouth. We offer emergency appointments! Call: [PHONE] #DentalEmergency #EmergencyCare #ToothPain",
			category: "emergency",
			hashtags: ["DentalEmergency", "EmergencyCare", "ToothPain"],
			platforms: ["facebook", "twitter", "linkedin"],
			engagement: { avgLikes: 22, avgComments: 4, avgShares: 8, usageCount: 4 },
			lastUsed: new Date("2025-07-08"),
			isPopular: false,
			difficulty: "advanced",
		},
		{
			id: "6",
			title: "Preventive Care Reminder",
			content: "📅 When was your last dental cleaning? Regular cleanings every 6 months help prevent cavities, gum disease, and keep your smile bright! Book your next appointment today. Prevention is always better than treatment! 🦷 #PreventiveCare #DentalCleaning #HealthySmile #BookNow",
			category: "general",
			hashtags: ["PreventiveCare", "DentalCleaning", "HealthySmile", "BookNow"],
			platforms: ["facebook", "instagram", "linkedin"],
			engagement: { avgLikes: 31, avgComments: 7, avgShares: 5, usageCount: 12 },
			lastUsed: new Date("2025-07-14"),
			isPopular: true,
			difficulty: "easy",
		},
	];

	// Filter templates based on search and filters
	const filteredTemplates = contentTemplates.filter(template => {
		const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
		
		const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
		const matchesPlatform = selectedPlatform === "all" || template.platforms.includes(selectedPlatform);
		
		return matchesSearch && matchesCategory && matchesPlatform;
	});

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
			case "emergency":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "text-green-600";
			case "medium":
				return "text-yellow-600";
			case "advanced":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const copyToClipboard = (content: string) => {
		navigator.clipboard.writeText(content);
		// You could add a toast notification here
	};

	return (
		<div className="space-y-6">
			{/* Search and Filters */}
			<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search templates, hashtags, or content..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>
				
				<Select value={selectedCategory} onValueChange={setSelectedCategory}>
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						<SelectItem value="educational">Educational</SelectItem>
						<SelectItem value="promotional">Promotional</SelectItem>
						<SelectItem value="testimonial">Testimonial</SelectItem>
						<SelectItem value="seasonal">Seasonal</SelectItem>
						<SelectItem value="emergency">Emergency</SelectItem>
						<SelectItem value="general">General</SelectItem>
					</SelectContent>
				</Select>

				<Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
					<SelectTrigger className="w-full sm:w-48">
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
			</div>

			{/* Results Summary */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-600">
					Showing {filteredTemplates.length} of {contentTemplates.length} templates
				</p>
				<div className="flex items-center space-x-2">
					<Filter className="h-4 w-4 text-gray-400" />
					<span className="text-sm text-gray-600">
						{selectedCategory !== "all" && `${selectedCategory} • `}
						{selectedPlatform !== "all" && `${selectedPlatform} • `}
						{searchTerm && `"${searchTerm}"`}
					</span>
				</div>
			</div>

			{/* Template Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{filteredTemplates.map((template) => (
					<Card key={template.id} className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<CardTitle className="text-lg">{template.title}</CardTitle>
										{template.isPopular && (
											<Badge variant="outline" className="text-xs">
												<Star className="mr-1 h-3 w-3" />
												Popular
											</Badge>
										)}
									</div>
									<div className="flex items-center space-x-2">
										<Badge className={getCategoryColor(template.category)}>
											{template.category}
										</Badge>
										<span className={`text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
											{template.difficulty}
										</span>
									</div>
								</div>
							</div>
						</CardHeader>
						
						<CardContent className="space-y-4">
							<p className="text-sm text-gray-700 line-clamp-4">
								{template.content}
							</p>
							
							<div className="flex flex-wrap gap-1">
								{template.hashtags.slice(0, 4).map((tag) => (
									<span key={tag} className="inline-flex items-center text-xs text-blue-600">
										<Tag className="mr-1 h-3 w-3" />
										{tag}
									</span>
								))}
								{template.hashtags.length > 4 && (
									<span className="text-xs text-gray-500">
										+{template.hashtags.length - 4} more
									</span>
								)}
							</div>
							
							<div className="flex items-center justify-between text-xs text-gray-500">
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-1">
										<Heart className="h-3 w-3" />
										<span>{template.engagement.avgLikes}</span>
									</div>
									<div className="flex items-center space-x-1">
										<TrendingUp className="h-3 w-3" />
										<span>Used {template.engagement.usageCount}x</span>
									</div>
								</div>
								{template.lastUsed && (
									<span>Last used {template.lastUsed.toLocaleDateString()}</span>
								)}
							</div>
							
							<div className="flex items-center space-x-2 pt-2">
								<Button
									size="sm"
									onClick={() => onUseTemplate(template)}
									className="flex-1"
								>
									<Edit className="mr-2 h-4 w-4" />
									Use Template
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => copyToClipboard(template.content)}
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredTemplates.length === 0 && (
				<div className="text-center py-12">
					<BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No templates found
					</h3>
					<p className="text-gray-600">
						Try adjusting your search terms or filters to find more templates.
					</p>
				</div>
			)}
		</div>
	);
}
