import { HeaderLogo } from "@/components/ui/tooth-logo";
import { LandingPageBody } from "@/components/ui/landing-page-body";
import {
	PremiumCursor,
	ParallaxContainer,
	FloatingElements,
	TextReveal,
	ScrollProgress,
	Premium3DCard,
	RippleEffect
} from "@/components/ui/premium-animations";
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
		<LandingPageBody>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>


			<div className="min-h-screen text-white landing-page premium-cursor">
				{/* Ultra-Premium Navigation */}
				<nav className="sticky top-0 z-50 premium-glass border-b border-white/10">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-20 items-center justify-between">
							<div className="flex items-center">
								<HeaderLogo className="text-white" />
							</div>
							<div className="hidden items-center space-x-8 md:flex">
								<Link
									href="#features"
									className="relative text-white/90 font-semibold transition-all duration-500 hover:text-white hover:scale-110 group"
								>
									<span className="relative z-10">Features</span>
									<div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
								</Link>
								<Link
									href="/pricing"
									className="relative text-white/90 font-semibold transition-all duration-500 hover:text-white hover:scale-110 group"
								>
									<span className="relative z-10">Pricing</span>
									<div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
								</Link>
								<Link
									href="/blog"
									className="relative text-white/90 font-semibold transition-all duration-500 hover:text-white hover:scale-110 group"
								>
									<span className="relative z-10">Blog</span>
									<div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
								</Link>
								<Link
									href="#contact"
									className="relative text-white/90 font-semibold transition-all duration-500 hover:text-white hover:scale-110 group"
								>
									<span className="relative z-10">Contact</span>
									<div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
								</Link>
								<Link
									href="/auth/signin"
									className="relative text-white/90 font-semibold transition-all duration-500 hover:text-white hover:scale-110 group px-4 py-2"
								>
									<span className="relative z-10">Sign In</span>
									<div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
								</Link>
								<Link
									href="/auth/signup"
									className="premium-button text-white rounded-2xl px-8 py-4 font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl relative overflow-hidden group"
								>
									<span className="relative z-10 flex items-center space-x-2">
										<span>Start Enterprise Trial</span>
										<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
									</span>
								</Link>
							</div>
						</div>
					</div>
				</nav>

				{/* Ultra-Premium Hero Section */}
				<section className="relative py-32 lg:py-48 overflow-hidden">
					{/* Simplified background elements - ULTRA FAST */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-blue-600/20 rounded-full animate-pulse" style={{animationDuration: '3s'}}></div>
						<div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-purple-500/10 to-pink-600/20 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
					</div>

					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
						<div className="grid items-center gap-16 lg:grid-cols-2">
							<div className="space-y-8">
								<div className="space-y-4">
									<div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/20 px-6 py-3">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
										<span className="text-sm font-semibold text-white/90">$10M Enterprise Platform</span>
									</div>
									<h1 className="font-black text-4xl leading-tight lg:text-6xl xl:text-7xl">
										<span>Next-Generation</span>
										<span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Dental Excellence</span>
									</h1>
								</div>

									<p className="text-white/90 text-2xl lg:text-3xl leading-relaxed font-medium max-w-4xl">
										The world's most advanced HIPAA-compliant dental platform with
										<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold"> AI-powered insights</span>,
										enterprise-grade security, and seamless patient care orchestration.
									</p>

									<div className="flex flex-col gap-8 sm:flex-row sm:items-center">
										<Link
											href="/onboarding/custom-domain"
											className="group inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-12 py-6 font-bold text-2xl text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
										>
											<span>Start Enterprise Setup</span>
											<ArrowRight className="ml-4 h-7 w-7 transition-transform group-hover:translate-x-2" />
										</Link>
										<Link
											href="/contact"
											className="group inline-flex items-center justify-center rounded-3xl border-2 border-white/30 bg-white/10 px-12 py-6 font-bold text-2xl transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50"
										>
											<Play className="mr-4 h-7 w-7 transition-transform group-hover:scale-125" />
											<span>Watch $10M Demo</span>
										</Link>
									</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90 text-lg">
									<div className="flex items-center space-x-4 premium-glass rounded-2xl px-6 py-4">
										<div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
										<span className="font-semibold">Enterprise 30-Day Trial</span>
									</div>
									<div className="flex items-center space-x-4 premium-glass rounded-2xl px-6 py-4">
										<div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
										<span className="font-semibold">$25K Setup Included</span>
									</div>
									<div className="flex items-center space-x-4 premium-glass rounded-2xl px-6 py-4">
										<div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
										<span className="font-semibold">SOC 2 + HIPAA Certified</span>
									</div>
								</div>
							</div>

							<div className="relative">
								{/* Simplified high-performance card */}
								<div className="relative">
									<div
										className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm"
										style={{
											backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
											backgroundSize: "cover",
											backgroundPosition: "center",
											height: "600px",
										}}
									>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
										<div className="absolute bottom-8 left-8 right-8">
											<h3 className="mb-4 font-bold text-white text-3xl">
												Enterprise Dashboard Preview
											</h3>
											<p className="text-white/90 text-lg leading-relaxed">
												Experience the future of dental practice management with our AI-powered platform.
											</p>
										</div>
									</div>
								</div>
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
									<h3 className="mb-4 font-bold text-purple-500 text-2xl transition-all duration-300">
										{feature.title}
									</h3>
									<p className="text-purple-400 text-lg leading-relaxed font-semibold">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Social Proof */}
				<section className="py-20">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="mb-16 text-center">
							<h2 className="mb-4 font-bold text-purple-500 text-3xl lg:text-4xl">
								Trusted by Dental Practices Worldwide
							</h2>
							<div className="mb-8 flex items-center justify-center space-x-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="h-6 w-6 fill-current text-purple-400"
									/>
								))}
								<span className="ml-2 text-purple-400 text-lg font-semibold">
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
								<Premium3DCard key={index} className="premium-glass border border-white/20 p-8 shadow-2xl">
									<TextReveal delay={index * 200}>
										<p className="mb-6 text-white text-xl italic font-medium leading-relaxed">
											"{testimonial.quote}"
										</p>
										<div>
											<p className="font-bold text-white text-lg">{testimonial.author}</p>
											<p className="text-white/70 text-base font-medium">
												{testimonial.practice}
											</p>
										</div>
									</TextReveal>
								</Premium3DCard>
							))}
						</div>
					</div>
				</section>

				{/* Premium Enterprise Pricing */}
				<section className="py-32 relative overflow-hidden">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<TextReveal>
							<div className="text-center mb-20">
								<h2 className="font-black text-5xl lg:text-7xl mb-6">
									Enterprise Investment
								</h2>
								<p className="text-white/90 text-2xl lg:text-3xl font-medium max-w-4xl mx-auto">
									A $10 million platform designed for practices that demand excellence
								</p>
							</div>
						</TextReveal>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{[
								{
									name: "Professional",
									price: "$2,500",
									period: "/month",
									setup: "$25,000 setup",
									description: "For established practices ready to scale",
									features: [
										"Custom domain & white-label branding",
										"Enterprise-grade security (SOC 2 + HIPAA)",
										"AI-powered patient insights",
										"24/7 dedicated support",
										"99.99% uptime SLA",
										"Custom integrations"
									],
									highlight: false
								},
								{
									name: "Enterprise",
									price: "$10,000",
									period: "/month",
									setup: "$100,000 setup",
									description: "For multi-location dental groups",
									features: [
										"Everything in Professional",
										"Multi-location management",
										"Advanced analytics & reporting",
										"Custom mobile applications",
										"Dedicated account manager",
										"Priority feature development",
										"On-site training & support"
									],
									highlight: true
								},
								{
									name: "Enterprise Plus",
									price: "Custom",
									period: "pricing",
									setup: "Tailored setup",
									description: "For large dental organizations",
									features: [
										"Everything in Enterprise",
										"Custom feature development",
										"White-glove implementation",
										"Regulatory compliance consulting",
										"Data migration services",
										"Custom SLA agreements"
									],
									highlight: false
								}
							].map((plan, index) => (
								<Premium3DCard key={index} className={`premium-glass border p-8 relative ${
									plan.highlight
										? 'border-purple-400 bg-gradient-to-b from-purple-600/20 to-blue-600/20'
										: 'border-white/20'
								}`}>
									{plan.highlight && (
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
											<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold">
												Most Popular
											</div>
										</div>
									)}
									<TextReveal delay={index * 200}>
										<div className="text-center mb-8">
											<h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
											<div className="mb-4">
												<span className="text-4xl font-black text-white">{plan.price}</span>
												<span className="text-white/70 text-lg">{plan.period}</span>
											</div>
											<p className="text-purple-300 font-semibold">{plan.setup}</p>
											<p className="text-white/80 mt-2">{plan.description}</p>
										</div>
										<ul className="space-y-4 mb-8">
											{plan.features.map((feature, featureIndex) => (
												<li key={featureIndex} className="flex items-start space-x-3">
													<CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
													<span className="text-white/90">{feature}</span>
												</li>
											))}
										</ul>
										<RippleEffect>
											<Link
												href="/onboarding/custom-domain"
												className={`w-full inline-flex items-center justify-center rounded-2xl px-8 py-4 font-bold text-lg transition-all duration-500 hover:scale-105 ${
													plan.highlight
														? 'premium-button text-white'
														: 'border-2 border-white/30 bg-white/10 text-white hover:bg-white/20'
												}`}
											>
												Get Started
											</Link>
										</RippleEffect>
									</TextReveal>
								</Premium3DCard>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-24 relative overflow-hidden">
					{/* Animated background - fast */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-500/20 to-purple-700/20"></div>
					<div className="absolute inset-0">
						<div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" style={{animationDuration: '3s'}}></div>
						<div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-purple-700/30 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
					</div>

					<div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 relative">
						<div className="space-y-8">
							<h2 className="font-black text-4xl lg:text-6xl animate-text text-purple-500">
								Ready to Transform Your Practice?
							</h2>
							<p className="text-purple-400 text-xl lg:text-2xl font-semibold leading-relaxed max-w-3xl mx-auto">
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
							<div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-purple-400 text-sm font-semibold">
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
									<span>Trusted by 2,000+ practices</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
									<span>99.9% uptime guarantee</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
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
									<h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
										Cognident
									</h3>
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
		</LandingPageBody>
	);
}
