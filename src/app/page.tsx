import { ToothIcon } from "@/components/icons/tooth-icon";
import { CognidentTextLogo } from "@/components/icons/cognident-logo";
import {
	ArrowRight,
	BarChart3,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Play,
	Shield,
	Star,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Cognident - Next-Gen Dental Practice Management Software",
	description:
		"HIPAA-compliant cloud platform with AI-powered insights, smart scheduling, and seamless patient care. Transform your dental practice with our comprehensive management solution.",
	keywords:
		"dental practice management, dental software, HIPAA compliant, dental scheduling, patient management, dental charting, dental billing",
	openGraph: {
		title: "Cognident - Next-Gen Dental Practice Management Software",
		description:
			"Transform your dental practice with our comprehensive management platform featuring AI-powered insights and smart scheduling.",
		type: "website",
		url: "https://cognident.org",
		images: [
			{
				url: "https://cognident.org/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Cognident - Dental Practice Management Software",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Cognident - Next-Gen Dental Practice Management Software",
		description:
			"Transform your dental practice with our comprehensive management platform.",
		images: ["https://cognident.org/og-image.jpg"],
	},
};

export default function LandingPage() {
	// Structured data for SEO
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Cognident",
		description:
			"HIPAA-compliant cloud platform with AI-powered insights, smart scheduling, and seamless patient care for dental practices.",
		url: "https://cognident.org",
		applicationCategory: "HealthApplication",
		operatingSystem: "Web",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			description: "14-day free trial",
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.9",
			ratingCount: "2000",
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<div className="min-h-screen bg-gray-900 text-white">
				{/* Navigation */}
				<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-900/95 backdrop-blur-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center">
								<CognidentTextLogo logoSize={32} />
							</div>
							<div className="hidden items-center space-x-8 md:flex">
								<Link
									href="#features"
									className="text-gray-300 transition-colors hover:text-white"
								>
									Features
								</Link>
								<Link
									href="#pricing"
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
									href="#contact"
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

				{/* Hero Section */}
				<section className="relative py-20 lg:py-32">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="grid items-center gap-12 lg:grid-cols-2">
							<div>
								<h1 className="mb-6 font-bold text-4xl leading-tight lg:text-6xl">
									Next-Gen Dental Practice
									<span className="text-blue-400"> Management</span>
								</h1>
								<p className="mb-8 text-gray-300 text-xl leading-relaxed">
									HIPAA-compliant cloud platform with AI-powered insights, smart
									scheduling, and seamless patient care. Transform your practice
									with our comprehensive management solution.
								</p>
								<div className="flex flex-col gap-4 sm:flex-row">
									<Link
										href="/auth/signup"
										className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-lg transition-colors hover:bg-blue-700"
									>
										Start Free Trial
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
									<Link
										href="/contact"
										className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-8 py-4 font-semibold text-lg transition-colors hover:border-gray-500"
									>
										<Play className="mr-2 h-5 w-5" />
										Watch Demo
									</Link>
								</div>
								<div className="mt-8 flex items-center space-x-6 text-gray-400 text-sm">
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4 text-green-400" />
										14-day free trial
									</div>
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4 text-green-400" />
										No credit card required
									</div>
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4 text-green-400" />
										HIPAA compliant
									</div>
								</div>
							</div>
							<div className="relative">
								<div
									className="overflow-hidden rounded-lg shadow-2xl"
									style={{
										backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										height: "400px",
									}}
								>
									<div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="bg-gray-800/50 py-20">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="mb-16 text-center">
							<h2 className="mb-4 font-bold text-3xl lg:text-4xl">
								Everything Your Practice Needs
							</h2>
							<p className="mx-auto max-w-3xl text-gray-300 text-xl">
								Streamline operations, improve patient care, and grow your
								practice with our comprehensive suite of tools.
							</p>
						</div>

						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									icon: Calendar,
									title: "Smart Scheduling",
									description:
										"AI-powered appointment optimization with automated reminders and conflict resolution.",
								},
								{
									icon: FileText,
									title: "Digital Charting",
									description:
										"Interactive odontogram with real-time collaboration and comprehensive treatment planning.",
								},
								{
									icon: Shield,
									title: "HIPAA Compliant",
									description:
										"Enterprise-grade security with encrypted data storage and secure patient communications.",
								},
								{
									icon: Users,
									title: "Patient Management",
									description:
										"Complete patient profiles with treatment history, insurance, and communication preferences.",
								},
								{
									icon: BarChart3,
									title: "Analytics & Reports",
									description:
										"Detailed insights into practice performance, revenue tracking, and growth opportunities.",
								},
								{
									icon: Clock,
									title: "24/7 Support",
									description:
										"Round-the-clock technical support and training to keep your practice running smoothly.",
								},
							].map((feature, index) => (
								<div
									key={index}
									className="rounded-lg bg-gray-800 p-6 transition-colors hover:bg-gray-700"
								>
									<feature.icon className="mb-4 h-12 w-12 text-blue-400" />
									<h3 className="mb-2 font-semibold text-xl">
										{feature.title}
									</h3>
									<p className="text-gray-300">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Social Proof */}
				<section className="py-20">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="mb-16 text-center">
							<h2 className="mb-4 font-bold text-3xl lg:text-4xl">
								Trusted by Dental Practices Worldwide
							</h2>
							<div className="mb-8 flex items-center justify-center space-x-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="h-6 w-6 fill-current text-yellow-400"
									/>
								))}
								<span className="ml-2 text-gray-300 text-lg">
									4.9/5 from 2,000+ practices
								</span>
							</div>
						</div>

						<div className="grid gap-8 md:grid-cols-3">
							{[
								{
									quote:
										"Cognident transformed our practice efficiency. We've reduced scheduling conflicts by 90% and improved patient satisfaction significantly.",
									author: "Dr. Sarah Johnson",
									practice: "Smile Dental Clinic",
								},
								{
									quote:
										"The AI-powered insights helped us identify revenue opportunities we never knew existed. Our practice revenue increased by 35% in the first year.",
									author: "Dr. Michael Chen",
									practice: "Pacific Dental Group",
								},
								{
									quote:
										"HIPAA compliance was our biggest concern, but Cognident made it seamless. The security features give us and our patients peace of mind.",
									author: "Dr. Emily Rodriguez",
									practice: "Downtown Dental Care",
								},
							].map((testimonial, index) => (
								<div key={index} className="rounded-lg bg-gray-800 p-6">
									<p className="mb-4 text-gray-300 italic">
										"{testimonial.quote}"
									</p>
									<div>
										<p className="font-semibold">{testimonial.author}</p>
										<p className="text-gray-400 text-sm">
											{testimonial.practice}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-blue-600 py-20">
					<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
						<h2 className="mb-4 font-bold text-3xl lg:text-4xl">
							Ready to Transform Your Practice?
						</h2>
						<p className="mb-8 text-blue-100 text-xl">
							Join thousands of dental practices already using Cognident to
							streamline operations and improve patient care.
						</p>
						<Link
							href="/auth/signup"
							className="inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 text-lg transition-colors hover:bg-gray-100"
						>
							Start Your Free Trial Today
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>
				</section>

				{/* Footer */}
				<footer className="border-gray-800 border-t bg-gray-900 py-12">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="grid gap-8 md:grid-cols-4">
							<div>
								<div className="mb-4 flex items-center">
									<CognidentTextLogo logoSize={32} />
								</div>
								<p className="text-gray-400">
									Next-generation dental practice management software designed
									for modern practices.
								</p>
							</div>
							<div>
								<h3 className="mb-4 font-semibold">Product</h3>
								<ul className="space-y-2 text-gray-400">
									<li>
										<Link
											href="#features"
											className="transition-colors hover:text-white"
										>
											Features
										</Link>
									</li>
									<li>
										<Link
											href="#pricing"
											className="transition-colors hover:text-white"
										>
											Pricing
										</Link>
									</li>
									<li>
										<Link
											href="/contact"
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
		</>
	);
}
