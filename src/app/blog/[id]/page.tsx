import {
	ArrowLeft,
	BookOpen,
	Calendar,
	Heart,
	Share2,
	User,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
	{
		id: 1,
		title: "10 Ways to Improve Patient Experience in Your Dental Practice",
		excerpt:
			"Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
		content: `
      <p>Patient experience is the cornerstone of a successful dental practice. In today's competitive healthcare landscape, providing exceptional patient care goes beyond clinical excellence—it encompasses every touchpoint of the patient journey.</p>
      
      <h2>1. Streamline Your Appointment Scheduling</h2>
      <p>Modern patients expect convenience and flexibility when booking appointments. Implement online scheduling systems that allow patients to book, reschedule, or cancel appointments 24/7. This reduces phone calls to your office and gives patients control over their scheduling preferences.</p>
      
      <h2>2. Create a Welcoming Environment</h2>
      <p>Your office environment sets the tone for the entire patient experience. Ensure your waiting area is comfortable, clean, and calming. Consider amenities like complimentary Wi-Fi, refreshments, and entertainment options to make waiting more pleasant.</p>
      
      <h2>3. Implement Clear Communication</h2>
      <p>Transparent communication builds trust and reduces patient anxiety. Explain procedures clearly, discuss treatment options thoroughly, and provide written estimates for all services. Use visual aids and models to help patients understand their treatment plans.</p>
      
      <h2>4. Reduce Wait Times</h2>
      <p>Respect your patients' time by maintaining an efficient schedule. If delays are unavoidable, communicate proactively and offer alternatives such as rescheduling or providing updates on wait times.</p>
      
      <h2>5. Personalize the Experience</h2>
      <p>Remember personal details about your patients and their preferences. Use patient management software to track important information and create personalized treatment experiences that make patients feel valued.</p>
    `,
		author: "Dr. Sarah Johnson",
		date: "2024-01-15",
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
		content: `
      <p>HIPAA compliance is not optional for dental practices—it's a legal requirement that protects patient privacy and your practice from costly violations. Understanding and implementing proper HIPAA protocols is essential for every dental professional.</p>
      
      <h2>Understanding HIPAA Basics</h2>
      <p>The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for protecting patient health information. For dental practices, this means implementing safeguards for both physical and electronic protected health information (PHI).</p>
      
      <h2>Physical Safeguards</h2>
      <p>Secure your physical environment by controlling access to areas where PHI is stored or accessed. This includes locking file cabinets, securing computer workstations, and ensuring patient information is not visible to unauthorized individuals.</p>
      
      <h2>Administrative Safeguards</h2>
      <p>Develop comprehensive policies and procedures for handling PHI. Train all staff members on HIPAA requirements and conduct regular security assessments to identify potential vulnerabilities.</p>
      
      <h2>Technical Safeguards</h2>
      <p>Implement technical controls such as access controls, audit logs, and encryption for electronic PHI. Ensure your practice management software is HIPAA-compliant and regularly update security measures.</p>
    `,
		author: "Michael Chen",
		date: "2024-01-12",
		category: "Compliance",
		image:
			"https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "8 min read",
	},
	// Add more blog posts as needed
];

interface BlogPostPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { id } = await params;
	const post = blogPosts.find((p) => p.id === Number.parseInt(id));

	if (!post) {
		return {
			title: "Post Not Found - DentalCloud Blog",
		};
	}

	return {
		title: `${post.title} - DentalCloud Blog`,
		description: post.excerpt,
		keywords: `dental practice, ${post.category.toLowerCase()}, dental management`,
		openGraph: {
			title: post.title,
			description: post.excerpt,
			type: "article",
			images: [post.image],
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { id } = await params;
	const post = blogPosts.find((p) => p.id === Number.parseInt(id));

	if (!post) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-900/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<Heart className="mr-3 h-8 w-8 text-blue-400" />
							<span className="font-bold text-xl">DentalCloud</span>
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
							<Link href="/blog" className="font-medium text-white">
								Blog
							</Link>
							<Link
								href="/#contact"
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
								className="rounded-md bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700"
							>
								Start Free Trial
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Back to Blog */}
			<div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
				<Link
					href="/blog"
					className="inline-flex items-center text-blue-400 transition-colors hover:text-blue-300"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Blog
				</Link>
			</div>

			{/* Article Header */}
			<article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<header className="mb-8">
					<div className="mb-4">
						<span className="rounded-full bg-blue-600 px-3 py-1 font-medium text-sm text-white">
							{post.category}
						</span>
					</div>
					<h1 className="mb-6 font-bold text-4xl leading-tight lg:text-5xl">
						{post.title}
					</h1>
					<div className="flex flex-wrap items-center justify-between gap-4 text-gray-400">
						<div className="flex items-center space-x-6">
							<div className="flex items-center">
								<User className="mr-2 h-4 w-4" />
								<span>{post.author}</span>
							</div>
							<div className="flex items-center">
								<Calendar className="mr-2 h-4 w-4" />
								<span>{new Date(post.date).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center">
								<BookOpen className="mr-2 h-4 w-4" />
								<span>{post.readTime}</span>
							</div>
						</div>
						<button className="flex items-center text-blue-400 transition-colors hover:text-blue-300">
							<Share2 className="mr-2 h-4 w-4" />
							Share
						</button>
					</div>
				</header>

				{/* Featured Image */}
				<div className="mb-8 overflow-hidden rounded-lg">
					<img
						src={post.image}
						alt={post.title}
						className="h-64 w-full object-cover lg:h-96"
					/>
				</div>

				{/* Article Content */}
				<div
					className="prose prose-lg prose-invert max-w-none"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				{/* Article Footer */}
				<footer className="mt-12 border-gray-800 border-t pt-8">
					<div className="flex items-center justify-between">
						<div className="text-gray-400">
							<p>
								Written by{" "}
								<span className="font-medium text-white">{post.author}</span>
							</p>
						</div>
						<button className="flex items-center text-blue-400 transition-colors hover:text-blue-300">
							<Share2 className="mr-2 h-4 w-4" />
							Share this article
						</button>
					</div>
				</footer>
			</article>

			{/* Related Articles */}
			<section className="bg-gray-800/50 py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h2 className="mb-8 text-center font-bold text-3xl">
						Related Articles
					</h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{blogPosts
							.filter((p) => p.id !== post.id)
							.slice(0, 3)
							.map((relatedPost) => (
								<article
									key={relatedPost.id}
									className="group overflow-hidden rounded-lg bg-gray-800 transition-colors hover:bg-gray-700"
								>
									<div className="relative h-48 overflow-hidden">
										<img
											src={relatedPost.image}
											alt={relatedPost.title}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="p-6">
										<h3 className="mb-3 font-semibold text-xl transition-colors group-hover:text-blue-400">
											<Link href={`/blog/${relatedPost.id}`}>
												{relatedPost.title}
											</Link>
										</h3>
										<p className="mb-4 line-clamp-2 text-gray-300">
											{relatedPost.excerpt}
										</p>
										<div className="flex items-center text-gray-400 text-sm">
											<span>{relatedPost.readTime}</span>
										</div>
									</div>
								</article>
							))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-gray-800 border-t bg-gray-900 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center">
								<Heart className="mr-3 h-8 w-8 text-blue-400" />
								<span className="font-bold text-xl">Cognident</span>
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
										href="/demo"
										className="transition-colors hover:text-white"
									>
										Demo
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Resources</h3>
							<ul className="space-y-2 text-gray-400">
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
										href="/help"
										className="transition-colors hover:text-white"
									>
										Help Center
									</Link>
								</li>
								<li>
									<Link
										href="/api"
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
						<p>&copy; 2024 Cognident. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
