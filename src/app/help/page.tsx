"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { CognidentTextLogo } from "@/components/icons/cognident-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Search,
	BookOpen,
	MessageCircle,
	Phone,
	Mail,
	Video,
	FileText,
	Users,
	Settings,
	Calendar,
	CreditCard,
	Shield,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const categories = [
		{
			icon: Users,
			title: "Getting Started",
			description: "Set up your practice and get familiar with Cognident",
			articles: 12,
			color: "bg-blue-600",
		},
		{
			icon: Calendar,
			title: "Scheduling & Appointments",
			description: "Manage appointments, calendar, and patient scheduling",
			articles: 18,
			color: "bg-green-600",
		},
		{
			icon: FileText,
			title: "Patient Records",
			description: "Create, manage, and organize patient information",
			articles: 15,
			color: "bg-purple-600",
		},
		{
			icon: CreditCard,
			title: "Billing & Payments",
			description: "Handle invoicing, payments, and insurance claims",
			articles: 22,
			color: "bg-yellow-600",
		},
		{
			icon: Settings,
			title: "Practice Settings",
			description: "Configure your practice preferences and settings",
			articles: 10,
			color: "bg-red-600",
		},
		{
			icon: Shield,
			title: "Security & Privacy",
			description: "Data security, HIPAA compliance, and privacy settings",
			articles: 8,
			color: "bg-indigo-600",
		},
	];

	const popularArticles = [
		{
			title: "How to Schedule Your First Appointment",
			category: "Getting Started",
			readTime: "3 min read",
		},
		{
			title: "Setting Up Patient Records and Medical History",
			category: "Patient Records",
			readTime: "5 min read",
		},
		{
			title: "Configuring Insurance and Payment Methods",
			category: "Billing & Payments",
			readTime: "4 min read",
		},
		{
			title: "Understanding HIPAA Compliance Features",
			category: "Security & Privacy",
			readTime: "6 min read",
		},
		{
			title: "Customizing Your Practice Dashboard",
			category: "Practice Settings",
			readTime: "3 min read",
		},
	];

	const supportOptions = [
		{
			icon: MessageCircle,
			title: "Live Chat",
			description: "Chat with our support team in real-time",
			availability: "24/7 Available",
			action: "Start Chat",
			color: "bg-blue-600",
		},
		{
			icon: Phone,
			title: "Phone Support",
			description: "Speak directly with a support specialist",
			availability: "Mon-Fri 8AM-6PM PST",
			action: "Call Now",
			color: "bg-green-600",
		},
		{
			icon: Mail,
			title: "Email Support",
			description: "Send us a detailed message about your issue",
			availability: "Response within 24 hours",
			action: "Send Email",
			color: "bg-purple-600",
		},
		{
			icon: Video,
			title: "Screen Sharing",
			description: "Get personalized help with screen sharing",
			availability: "By appointment",
			action: "Schedule Session",
			color: "bg-orange-600",
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-900/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<CognidentTextLogo logoSize={32} className="text-white" />
						</Link>
						<div className="hidden items-center space-x-8 md:flex">
							<Link
								href="/#features"
								className="text-gray-300 transition-colors hover:text-white"
							>
								Features
							</Link>
							<Link
								href="/#pricing"
								className="text-gray-300 transition-colors hover:text-white"
							>
								Pricing
							</Link>
							<Link
								href="/blog"
								className="text-gray-300 transition-colors hover:text-white"
							>
								Blog
							</Link>
							<Link
								href="/about"
								className="text-gray-300 transition-colors hover:text-white"
							>
								About
							</Link>
							<Link
								href="/contact"
								className="text-gray-300 transition-colors hover:text-white"
							>
								Contact
							</Link>
							<Link
								href="/auth/signin"
								className="text-gray-300 transition-colors hover:text-white"
							>
								Sign In
							</Link>
							<Link
								href="/auth/signup"
								className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition-colors hover:bg-blue-700"
							>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<BookOpen className="mx-auto mb-6 h-16 w-16 text-blue-200" />
					<h1 className="mb-6 font-bold text-4xl lg:text-5xl">
						Cognident Help Center
					</h1>
					<p className="mb-8 text-blue-100 text-xl">
						Find answers, get support, and learn how to make the most of your
						dental practice management software.
					</p>

					{/* Search Bar */}
					<div className="mx-auto max-w-2xl">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<Input
								type="text"
								placeholder="Search for help articles, guides, and FAQs..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-white/10 border-white/20 pl-12 pr-4 py-3 text-white placeholder-gray-300 backdrop-blur-sm"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Help Categories */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">Browse by Category</h2>
						<p className="text-gray-400 text-lg">
							Find help articles organized by topic
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{categories.map((category, index) => {
							const IconComponent = category.icon;
							const categorySlug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
							const categoryUrl = categorySlug === 'getting-started' ? 'getting-started' :
								categorySlug === 'scheduling-appointments' ? 'scheduling' :
								categorySlug === 'patient-records' ? 'patient-records' :
								categorySlug === 'billing-payments' ? 'billing' :
								categorySlug === 'practice-settings' ? 'settings' :
								categorySlug === 'security-privacy' ? 'security' : categorySlug;

							return (
								<Link
									key={index}
									href={`/help/${categoryUrl}`}
									className="group cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-6 transition-all hover:border-gray-600 hover:bg-gray-750 block"
								>
									<div className="flex items-start space-x-4">
										<div
											className={`rounded-lg p-3 ${category.color} flex-shrink-0`}
										>
											<IconComponent className="h-6 w-6 text-white" />
										</div>
										<div className="flex-1">
											<h3 className="mb-2 font-semibold text-lg group-hover:text-blue-400">
												{category.title}
											</h3>
											<p className="mb-3 text-gray-400 text-sm">
												{category.description}
											</p>
											<div className="flex items-center justify-between">
												<span className="text-blue-400 text-sm">
													{category.articles} articles
												</span>
												<ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			{/* Popular Articles */}
			<section className="bg-gray-800 py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">Popular Articles</h2>
						<p className="text-gray-400 text-lg">
							Most helpful articles from our knowledge base
						</p>
					</div>

					<div className="space-y-4">
						{popularArticles.map((article, index) => (
							<div
								key={index}
								className="group cursor-pointer rounded-lg border border-gray-700 bg-gray-900 p-4 transition-all hover:border-gray-600 hover:bg-gray-800"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h3 className="mb-1 font-semibold group-hover:text-blue-400">
											{article.title}
										</h3>
										<div className="flex items-center space-x-4 text-gray-400 text-sm">
											<span>{article.category}</span>
											<span>•</span>
											<span>{article.readTime}</span>
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 text-center">
						<Button
							variant="outline"
							className="border-gray-600 text-gray-300 hover:bg-gray-700"
						>
							View All Articles
						</Button>
					</div>
				</div>
			</section>

			{/* Support Options */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">Get Personal Support</h2>
						<p className="text-gray-400 text-lg">
							Can't find what you're looking for? Our support team is here to
							help.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{supportOptions.map((option, index) => {
							const IconComponent = option.icon;
							return (
								<div
									key={index}
									className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center"
								>
									<div
										className={`mx-auto mb-4 h-12 w-12 rounded-lg ${option.color} flex items-center justify-center`}
									>
										<IconComponent className="h-6 w-6 text-white" />
									</div>
									<h3 className="mb-2 font-semibold text-lg">{option.title}</h3>
									<p className="mb-3 text-gray-400 text-sm">
										{option.description}
									</p>
									<p className="mb-4 text-blue-400 text-xs">
										{option.availability}
									</p>
									<Button
										size="sm"
										className="w-full bg-blue-600 hover:bg-blue-700"
									>
										{option.action}
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Quick Links */}
			<section className="bg-gray-800 py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-6 font-bold text-3xl">Quick Links</h2>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
								<h3 className="mb-3 font-semibold text-lg">For New Users</h3>
								<ul className="space-y-2 text-gray-400 text-sm">
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• Quick Start Guide
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• Setting Up Your Practice
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• First Appointment Tutorial
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• User Account Setup
										</Link>
									</li>
								</ul>
							</div>

							<div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
								<h3 className="mb-3 font-semibold text-lg">Advanced Features</h3>
								<ul className="space-y-2 text-gray-400 text-sm">
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• API Integration Guide
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• Custom Report Builder
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• Multi-Location Setup
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="transition-colors hover:text-blue-400"
										>
											• Advanced Security Settings
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact CTA */}
			<section className="py-16">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 font-bold text-3xl">Still Need Help?</h2>
					<p className="mb-8 text-gray-400 text-lg">
						Our support team is available 24/7 to assist you with any questions
						or issues.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button className="bg-blue-600 hover:bg-blue-700">
							<MessageCircle className="mr-2 h-4 w-4" />
							Start Live Chat
						</Button>
						<Button
							variant="outline"
							className="border-gray-600 text-gray-300 hover:bg-gray-800"
						>
							<Phone className="mr-2 h-4 w-4" />
							Call Support
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-gray-800 border-t bg-gray-900 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center">
								<CognidentTextLogo logoSize={32} className="text-white" />
							</div>
							<p className="text-gray-400">
								Next-generation dental practice management software designed for
								modern practices.
							</p>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Product</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link
										href="/#features"
										className="transition-colors hover:text-white"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="/#pricing"
										className="transition-colors hover:text-white"
									>
										Pricing
									</Link>
								</li>
								<li>
									<Link
										href="/api-docs"
										className="transition-colors hover:text-white"
									>
										API Docs
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Company</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link
										href="/about"
										className="transition-colors hover:text-white"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="/blog"
										className="transition-colors hover:text-white"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="transition-colors hover:text-white"
									>
										Contact
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Support</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link
										href="/help"
										className="transition-colors hover:text-white"
									>
										Help Center
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="transition-colors hover:text-white"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="/privacy"
										className="transition-colors hover:text-white"
									>
										Privacy
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 border-gray-800 border-t pt-8 text-center text-gray-400">
						<p>&copy; 2025 Cognident. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
