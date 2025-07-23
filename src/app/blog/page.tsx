import { HeaderLogo } from "@/components/ui/tooth-logo";
import { ArrowRight, Calendar, Heart, Search, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "DentalCloud Blog - Dental Practice Management Insights",
	description:
		"Expert insights, tips, and best practices for dental practice management, patient care, and practice growth.",
	keywords:
		"dental practice management, dental tips, practice growth, patient care, dental technology",
};

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
	{
		id: 1,
		title: "10 Ways to Improve Patient Experience in Your Dental Practice",
		excerpt:
			"Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
		author: "Dr. Sarah Johnson",
		date: "2025-01-15",
		category: "Patient Care",
		image:
			"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "5 min read",
	},
	{
		id: 2,
		title: "The Complete Guide to HIPAA Compliance for Dental Practices",
		excerpt:
			"Everything you need to know about maintaining HIPAA compliance in your dental practice, from patient records to digital communications.",
		author: "Michael Chen",
		date: "2025-01-12",
		category: "Compliance",
		image:
			"https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "8 min read",
	},
	{
		id: 3,
		title: "Digital Transformation in Dentistry: A Complete Guide",
		excerpt:
			"Learn how digital technologies are revolutionizing dental practices and how to successfully implement them in your clinic.",
		author: "Dr. Emily Rodriguez",
		date: "2025-01-10",
		category: "Technology",
		image:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "7 min read",
	},
	{
		id: 4,
		title: "Building a Successful Dental Team: Hiring and Retention Strategies",
		excerpt:
			"Discover proven methods for recruiting top talent and creating a positive workplace culture that retains excellent team members.",
		author: "Dr. Mark Thompson",
		date: "2025-01-08",
		category: "Practice Management",
		image:
			"https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "6 min read",
	},
	{
		id: 5,
		title: "Maximizing Insurance Reimbursements: A Dental Practice Guide",
		excerpt:
			"Learn effective strategies to optimize insurance claim processing and maximize reimbursements for your dental practice.",
		author: "Jennifer Walsh, RDH",
		date: "2025-01-05",
		category: "Financial Management",
		image:
			"https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "8 min read",
	},
	{
		id: 6,
		title: "Preventive Care Marketing: Educating Patients for Better Outcomes",
		excerpt:
			"Effective strategies for promoting preventive dental care and building long-term patient relationships through education.",
		author: "Dr. Lisa Park",
		date: "2025-01-03",
		category: "Patient Education",
		image:
			"https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "6 min read",
	},
];

const categories = [
	"All",
	"Patient Care",
	"Technology",
	"Practice Management",
	"Compliance",
	"Financial Management",
	"Patient Education",
];

export default function BlogPage() {
	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-50/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<Heart className="mr-3 h-8 w-8 text-blue-600" />
							<span className="font-bold text-xl">Cognident</span>
						</Link>
						<div className="hidden items-center space-x-8 md:flex">
							<Link
								href="/#features"
								className="text-gray-300 transition-colors hover:text-gray-900"
							>
								Features
							</Link>
							<Link
								href="/#pricing"
								className="text-gray-300 transition-colors hover:text-gray-900"
							>
								Pricing
							</Link>
							<Link href="/blog" className="font-medium text-gray-900">
								Blog
							</Link>
							<Link
								href="/#contact"
								className="text-gray-300 transition-colors hover:text-gray-900"
							>
								Contact
							</Link>
							<Link
								href="/auth/signin"
								className="text-gray-300 transition-colors hover:text-gray-900"
							>
								Sign In
							</Link>
							<Link
								href="/auth/signup"
								className="rounded-md bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700"
							>
								Start Free Trial
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="bg-gradient-to-b from-gray-800 to-gray-900 py-20">
				<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
					<h1 className="mb-6 font-bold text-4xl lg:text-5xl">
						DentalCloud <span className="text-blue-600">Blog</span>
					</h1>
					<p className="mx-auto mb-8 max-w-3xl text-gray-300 text-xl">
						Expert insights, tips, and best practices for dental practice
						management, patient care, and practice growth from industry
						professionals.
					</p>

					{/* Search Bar */}
					<div className="relative mx-auto max-w-md">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-600" />
						<input
							type="text"
							placeholder="Search articles..."
							className="w-full rounded-lg border border-gray-700 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="bg-white/50 py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap justify-center gap-4">
						{categories.map((category) => (
							<button
								key={category}
								className={`rounded-full px-6 py-2 transition-colors ${
									category === "All"
										? "bg-blue-600 text-gray-900"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Blog Posts */}
			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{blogPosts.map((post) => (
							<article
								key={post.id}
								className="group overflow-hidden rounded-lg bg-white transition-colors hover:bg-gray-700"
							>
								<div className="relative h-48 overflow-hidden">
									<img
										src={post.image}
										alt={post.title}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div className="absolute top-4 left-4">
										<span className="rounded-full bg-blue-600 px-3 py-1 font-medium text-gray-900 text-sm">
											{post.category}
										</span>
									</div>
								</div>
								<div className="p-6">
									<div className="mb-3 flex items-center text-gray-600 text-sm">
										<Calendar className="mr-2 h-4 w-4" />
										<span>{new Date(post.date).toLocaleDateString()}</span>
										<span className="mx-2">•</span>
										<span>{post.readTime}</span>
									</div>
									<h3 className="mb-3 font-semibold text-xl transition-colors group-hover:text-blue-600">
										<Link href={`/blog/${post.id}`}>{post.title}</Link>
									</h3>
									<p className="mb-4 line-clamp-3 text-gray-300">
										{post.excerpt}
									</p>
									<div className="flex items-center justify-between">
										<div className="flex items-center text-gray-600 text-sm">
											<User className="mr-2 h-4 w-4" />
											<span>{post.author}</span>
										</div>
										<Link
											href={`/blog/${post.id}`}
											className="inline-flex items-center font-medium text-blue-600 text-sm hover:text-blue-700"
										>
											Read More
											<ArrowRight className="ml-1 h-4 w-4" />
										</Link>
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* Newsletter Signup */}
			<section className="bg-blue-600 py-20">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 font-bold text-3xl">
						Stay Updated with DentalCloud
					</h2>
					<p className="mb-8 text-blue-100 text-xl">
						Get the latest insights and tips delivered to your inbox weekly.
					</p>
					<div className="mx-auto flex max-w-md gap-4">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
						/>
						<button className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100">
							Subscribe
						</button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-gray-800 border-t bg-gray-50 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center">
								<HeaderLogo className="text-gray-900" />
							</div>
							<p className="text-gray-600">
								Next-generation dental practice management software designed for
								modern practices.
							</p>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Product</h3>
							<ul className="space-y-2 text-gray-600">
								<li>
									<Link
										href="/#features"
										className="transition-colors hover:text-gray-900"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="/#pricing"
										className="transition-colors hover:text-gray-900"
									>
										Pricing
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="transition-colors hover:text-gray-900"
									>
										Demo
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Resources</h3>
							<ul className="space-y-2 text-gray-600">
								<li>
									<Link
										href="/blog"
										className="transition-colors hover:text-gray-900"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href="/help"
										className="transition-colors hover:text-gray-900"
									>
										Help Center
									</Link>
								</li>
								<li>
									<Link
										href="/api"
										className="transition-colors hover:text-gray-900"
									>
										API Docs
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Company</h3>
							<ul className="space-y-2 text-gray-600">
								<li>
									<Link
										href="/about"
										className="transition-colors hover:text-gray-900"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="transition-colors hover:text-gray-900"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="/privacy"
										className="transition-colors hover:text-gray-900"
									>
										Privacy
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 border-gray-800 border-t pt-8 text-center text-gray-600">
						<p>&copy; 2025 Cognident. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
