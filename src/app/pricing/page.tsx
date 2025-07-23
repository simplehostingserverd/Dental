"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Building2, Check, Shield, Star, Users, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
	{
		name: "Starter",
		price: "$99",
		period: "/month",
		description:
			"Perfect for solo practitioners or small clinics just getting started.",
		features: [
			"Up to 2 users",
			"Appointment scheduling",
			"Patient charting & notes",
			"Email reminders",
			"Basic performance reports",
		],
		highlights: ["✅ HIPAA-compliant", "🔐 Secure cloud hosting"],
		cta: "Start your free 14-day trial",
		popular: false,
		icon: Users,
		color: "blue",
	},
	{
		name: "Growth",
		price: "$199",
		period: "/month",
		description: "For growing clinics looking to streamline operations.",
		features: [
			"Everything in Starter, plus:",
			"Up to 5 users",
			"Insurance claims & billing integration",
			"Secure intra-office messaging",
			"Advanced reporting & insights",
		],
		highlights: ["📈 Built for busy practices"],
		cta: "Start your free 14-day trial",
		popular: true,
		badge: "Most popular",
		icon: Zap,
		color: "green",
	},
	{
		name: "Pro",
		price: "$299",
		period: "/month",
		description: "Advanced tools for multi-provider, high-volume practices.",
		features: [
			"Everything in Growth, plus:",
			"Up to 10 users",
			"Automated SMS reminders",
			"Custom branding options",
			"Priority customer support",
		],
		highlights: ["⚙️ More automation, less admin"],
		cta: "Start your free 14-day trial",
		popular: false,
		icon: Star,
		color: "purple",
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "Pricing",
		description: "Tailored for DSOs and multi-location organizations.",
		features: [
			"Everything in Pro, plus:",
			"Unlimited users",
			"Multi-location support",
			"API access & integrations",
			"Dedicated account manager",
		],
		highlights: ["🏢 Built for scale, secured for compliance"],
		cta: "Contact our sales team to get started",
		popular: false,
		icon: Building2,
		color: "gray",
	},
];

const allPlansFeatures = [
	"HIPAA compliance",
	"Secure cloud hosting",
	"Daily encrypted backups",
	"99.99% uptime SLA",
];

export default function PricingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-slate-200 border-b bg-white/95 shadow-sm backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-20 items-center justify-between">
						<Link href="/" className="flex items-center">
							<HeaderLogo className="text-indigo-600" />
							<span className="ml-2 font-bold text-slate-800 text-xl">
								Cognident
							</span>
						</Link>
						<div className="hidden items-center space-x-8 md:flex">
							<Link
								href="/#features"
								className="font-medium text-slate-600 transition-all duration-300 hover:scale-105 hover:text-slate-900"
							>
								Features
							</Link>
							<Link
								href="/pricing"
								className="font-semibold text-indigo-600 transition-all duration-300 hover:scale-105 hover:text-indigo-700"
							>
								Pricing
							</Link>
							<Link
								href="/blog"
								className="font-medium text-slate-600 transition-all duration-300 hover:scale-105 hover:text-slate-900"
							>
								Blog
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
								className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
							>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="mb-6 font-bold text-4xl lg:text-6xl">
							Simple, transparent pricing
						</h1>
						<p className="mx-auto max-w-3xl text-gray-300 text-xl">
							Choose the perfect plan for your practice. All plans include a
							14-day free trial with no setup fees.
						</p>
					</div>
				</div>
			</section>

			{/* Pricing Cards */}
			<section className="pb-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-4">
						{plans.map((plan, index) => {
							const IconComponent = plan.icon;
							return (
								<div
									key={index}
									className={`relative rounded-2xl border p-8 transition-all hover:scale-105 ${
										plan.popular
											? "border-green-500 bg-green-900/20 shadow-green-500/20 shadow-lg"
											: "border-gray-700 bg-gray-800/50"
									}`}
								>
									{plan.popular && (
										<div className="-top-4 -translate-x-1/2 absolute left-1/2">
											<span className="rounded-full bg-green-500 px-4 py-1 font-medium text-sm text-white">
												{plan.badge}
											</span>
										</div>
									)}

									<div className="mb-6">
										<div className="mb-4 flex items-center">
											<IconComponent className="mr-3 h-8 w-8 text-blue-500" />
											<h3 className="font-bold text-2xl">{plan.name}</h3>
										</div>
										<div className="mb-4">
											<span className="font-bold text-4xl">{plan.price}</span>
											<span className="text-gray-400">{plan.period}</span>
										</div>
										<p className="text-gray-300">{plan.description}</p>
									</div>

									<div className="mb-6">
										<h4 className="mb-4 font-semibold">Includes:</h4>
										<ul className="space-y-3">
											{plan.features.map((feature, featureIndex) => (
												<li key={featureIndex} className="flex items-start">
													<Check className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
													<span className="text-gray-300">{feature}</span>
												</li>
											))}
										</ul>
									</div>

									<div className="mb-6">
										{plan.highlights.map((highlight, highlightIndex) => (
											<p
												key={highlightIndex}
												className="font-medium text-blue-400 text-sm"
											>
												{highlight}
											</p>
										))}
									</div>

									<button
										className={`w-full rounded-lg py-3 font-medium transition-colors ${
											plan.popular
												? "bg-green-600 text-white hover:bg-green-700"
												: plan.name === "Enterprise"
													? "bg-gray-700 text-white hover:bg-gray-600"
													: "bg-blue-600 text-white hover:bg-blue-700"
										}`}
									>
										{plan.cta}
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* All Plans Include */}
			<section className="bg-gray-800/50 py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-8 font-bold text-3xl">All Plans Include:</h2>
						<div className="grid gap-6 md:grid-cols-2">
							{allPlansFeatures.map((feature, index) => (
								<div key={index} className="flex items-center justify-center">
									<Shield className="mr-3 h-6 w-6 text-green-500" />
									<span className="text-gray-300 text-lg">{feature}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Support CTA */}
			<section className="py-16">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 font-bold text-2xl">
						Need help choosing a plan?
					</h2>
					<p className="mb-6 text-gray-300 text-lg">
						Our team is happy to guide you.
					</p>
					<Link
						href="mailto:support@cognident.org"
						className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
					>
						Contact Support
					</Link>
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
								Next-generation dental practice management software designed for
								modern practices.
							</p>
						</div>
						<div>
							<h3 className="mb-4 font-semibold text-white">Product</h3>
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
										className="transition-colors hover:text-white"
									>
										API Docs
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold text-white">Company</h3>
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
					<div className="mt-8 border-gray-700 border-t pt-8 text-center">
						<p className="text-gray-400">
							© 2024 Cognident. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
