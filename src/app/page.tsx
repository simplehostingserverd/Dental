import { HeaderLogo } from "@/components/ui/tooth-logo";
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
			<div className="min-h-screen text-white">
				{/* Navigation */}
				<nav className="sticky top-0 z-50">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-20 items-center justify-between">
							<div className="flex items-center animate-text">
								<HeaderLogo className="text-white" />
							</div>
							<div className="hidden items-center space-x-8 md:flex">
								<Link
									href="#features"
									className="text-white/80 font-medium transition-all duration-300 hover:text-white hover:scale-105"
								>
									Features
								</Link>
								<Link
									href="/pricing"
									className="text-white/80 font-medium transition-all duration-300 hover:text-white hover:scale-105"
								>
									Pricing
								</Link>
								<Link
									href="/blog"
									className="text-white/80 font-medium transition-all duration-300 hover:text-white hover:scale-105"
								>
									Blog
								</Link>
								<Link
									href="#contact"
									className="text-white/80 font-medium transition-all duration-300 hover:text-white hover:scale-105"
								>
									Contact
								</Link>
								<Link
									href="/auth/signin"
									className="text-white/80 font-medium transition-all duration-300 hover:text-white hover:scale-105"
								>
									Sign In
								</Link>
								<Link
									href="/auth/signup"
									className="bg-blue-600 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 pulse-glow"
								>
									Start Free Trial
								</Link>
							</div>
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<section className="relative py-24 lg:py-40 overflow-hidden">
					{/* Animated background elements */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
						<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
					</div>

					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
						<div className="grid items-center gap-16 lg:grid-cols-2">
							<div className="space-y-8">
								<div className="space-y-6">
									<h1 className="font-black text-5xl leading-tight lg:text-7xl animate-text">
										Next-Gen Dental Practice
										<span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"> Management</span>
									</h1>
									<p className="text-white/90 text-xl lg:text-2xl leading-relaxed font-medium">
										HIPAA-compliant cloud platform with AI-powered insights, smart
										scheduling, and seamless patient care. Transform your practice
										with our comprehensive management solution.
									</p>
								</div>

								<div className="flex flex-col gap-6 sm:flex-row">
									<Link
										href="/auth/signup"
										className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-10 py-5 font-bold text-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
									>
										Start Free Trial
										<ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
									</Link>
									<Link
										href="/contact"
										className="group inline-flex items-center justify-center rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-10 py-5 font-bold text-xl transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/40"
									>
										<Play className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
										Watch Demo
									</Link>
								</div>

								<div className="flex flex-wrap items-center gap-8 text-white/70 text-base">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
										<span className="font-medium">14-day free trial</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
										<span className="font-medium">No credit card required</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
										<span className="font-medium">HIPAA compliant</span>
									</div>
								</div>
							</div>

							<div className="relative float">
								<div className="relative">
									{/* Glowing border effect */}
									<div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-75 animate-pulse"></div>
									<div
										className="relative overflow-hidden rounded-3xl shadow-2xl"
										style={{
											backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
											backgroundSize: "cover",
											backgroundPosition: "center",
											height: "500px",
										}}
									>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
										<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
									</div>
								</div>

								{/* Floating elements */}
								<div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl opacity-80 blur-sm animate-pulse"></div>
								<div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl opacity-60 blur-sm animate-pulse" style={{animationDelay: '1.5s'}}></div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="py-24 relative">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="mb-20 text-center">
							<h2 className="mb-6 font-black text-4xl lg:text-6xl animate-text">
								Everything Your Practice Needs
							</h2>
							<p className="mx-auto max-w-4xl text-white/80 text-xl lg:text-2xl font-medium leading-relaxed">
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
									gradient: "from-indigo-500 to-purple-500"
								},
								{
									icon: FileText,
									title: "Digital Charting",
									description:
										"Interactive odontogram with real-time collaboration and comprehensive treatment planning.",
									gradient: "from-purple-500 to-pink-500"
								},
								{
									icon: Shield,
									title: "HIPAA Compliant",
									description:
										"Enterprise-grade security with encrypted data storage and secure patient communications.",
									gradient: "from-blue-500 to-cyan-500"
								},
								{
									icon: Users,
									title: "Patient Management",
									description:
										"Complete patient profiles with treatment history, insurance, and communication preferences.",
									gradient: "from-green-500 to-teal-500"
								},
								{
									icon: BarChart3,
									title: "Analytics & Reports",
									description:
										"Detailed insights into practice performance, revenue tracking, and growth opportunities.",
									gradient: "from-orange-500 to-red-500"
								},
								{
									icon: Clock,
									title: "24/7 Support",
									description:
										"Round-the-clock technical support and training to keep your practice running smoothly.",
									gradient: "from-violet-500 to-purple-500"
								},
							].map((feature, index) => (
								<div
									key={index}
									className="group feature-card p-8 transition-all duration-500 hover:scale-105"
									style={{animationDelay: `${index * 0.1}s`}}
								>
									<div className={`mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
										<feature.icon className="w-full h-full text-white" />
									</div>
									<h3 className="mb-4 font-bold text-white text-2xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 group-hover:bg-clip-text transition-all duration-300">
										{feature.title}
									</h3>
									<p className="text-white/70 text-lg leading-relaxed font-medium">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Social Proof */}
				<section className="py-20">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="mb-16 text-center">
							<h2 className="mb-4 font-bold text-white text-3xl lg:text-4xl">
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
										<p className="font-semibold text-white">{testimonial.author}</p>
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
				<section className="py-24 relative overflow-hidden">
					{/* Animated background */}
					<div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-blue-600/20"></div>
					<div className="absolute inset-0">
						<div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
						<div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
					</div>

					<div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 relative">
						<div className="space-y-8">
							<h2 className="font-black text-4xl lg:text-6xl animate-text">
								Ready to Transform Your Practice?
							</h2>
							<p className="text-white/90 text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
								Join thousands of dental practices already using Cognident to
								streamline operations and improve patient care.
							</p>
							<div className="pt-4">
								<Link
									href="/auth/signup"
									className="group inline-flex items-center rounded-2xl bg-gradient-to-r from-white to-gray-100 px-12 py-6 font-bold text-gray-900 text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-white/25"
								>
									Start Your Free Trial Today
									<ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
								</Link>
							</div>

							{/* Trust indicators */}
							<div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm font-medium">
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
									<span>Trusted by 2,000+ practices</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
									<span>99.9% uptime guarantee</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
									<span>Enterprise-grade security</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="border-gray-700 border-t bg-gray-900 py-12">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="grid gap-8 md:grid-cols-4">
							<div>
								<div className="mb-4 flex items-center">
									<HeaderLogo className="text-white" />
								</div>
								<p className="text-gray-400">
									Next-generation dental practice management software designed
									for modern practices.
								</p>
							</div>
							<div>
								<h3 className="mb-4 font-semibold text-white">Product</h3>
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
											href="/pricing"
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
								<h3 className="mb-4 font-semibold text-white">Resources</h3>
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
		</>
	);
}
