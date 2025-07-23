"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	Award,
	CheckCircle,
	Globe,
	Heart,
	Shield,
	Target,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
	const stats = [
		{ label: "Dental Practices", value: "10,000+", icon: Users },
		{ label: "Patients Served", value: "2M+", icon: Heart },
		{ label: "Countries", value: "25+", icon: Globe },
		{ label: "Years of Innovation", value: "8+", icon: Award },
	];

	const values = [
		{
			icon: Shield,
			title: "Security First",
			description:
				"We prioritize the security and privacy of patient data with enterprise-grade encryption and HIPAA compliance.",
		},
		{
			icon: Zap,
			title: "Innovation",
			description:
				"Continuously pushing the boundaries of dental technology to provide cutting-edge solutions for modern practices.",
		},
		{
			icon: Heart,
			title: "Patient-Centered",
			description:
				"Everything we build is designed to improve patient care and enhance the patient experience.",
		},
		{
			icon: Target,
			title: "Results-Driven",
			description:
				"We measure our success by the success of our clients and their ability to grow their practices.",
		},
	];

	const team = [
		{
			name: "Dr. Sarah Chen",
			role: "CEO & Co-Founder",
			bio: "Former practicing dentist with 15 years of clinical experience. Led the digital transformation of three major dental practices.",
			image: "/team/sarah-chen.jpg",
		},
		{
			name: "Michael Rodriguez",
			role: "CTO & Co-Founder",
			bio: "Former healthcare technology executive with expertise in HIPAA-compliant systems and dental practice workflows.",
			image: "/team/michael-rodriguez.jpg",
		},
		{
			name: "Dr. James Wilson",
			role: "Chief Dental Officer",
			bio: "Board-certified oral surgeon and practice management consultant with 20+ years of experience.",
			image: "/team/james-wilson.jpg",
		},
		{
			name: "Lisa Thompson",
			role: "VP of Customer Success",
			bio: "Former dental practice administrator who understands the daily challenges of running a successful practice.",
			image: "/team/lisa-thompson.jpg",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-50/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<HeaderLogo className="text-blue-600" />
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
							<Link
								href="/blog"
								className="text-gray-300 transition-colors hover:text-gray-900"
							>
								Blog
							</Link>
							<Link
								href="/about"
								className="text-blue-600 transition-colors hover:text-blue-700"
							>
								About
							</Link>
							<Link
								href="/contact"
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
					<h1 className="mb-6 font-bold text-4xl lg:text-5xl">
						Transforming Dental Care Through Technology
					</h1>
					<p className="mb-8 text-blue-100 text-xl">
						We're on a mission to empower dental practices with innovative
						technology that improves patient care and streamlines operations.
					</p>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						{stats.map((stat, index) => {
							const IconComponent = stat.icon;
							return (
								<div key={index} className="text-center">
									<IconComponent className="mx-auto mb-4 h-12 w-12 text-blue-600" />
									<div className="mb-2 font-bold text-3xl text-blue-600">
										{stat.value}
									</div>
									<div className="text-gray-600">{stat.label}</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-6 font-bold text-3xl">Our Mission</h2>
						<p className="mb-8 text-gray-300 text-lg leading-relaxed">
							At Cognident, we believe that exceptional dental care starts with
							exceptional technology. Our mission is to provide dental practices
							with the most advanced, user-friendly, and secure practice
							management software available. We're committed to helping dentists
							focus on what they do best – providing outstanding patient care –
							while we handle the technology that makes it all possible.
						</p>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="bg-white py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">Our Values</h2>
						<p className="text-gray-600 text-lg">
							The principles that guide everything we do
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{values.map((value, index) => {
							const IconComponent = value.icon;
							return (
								<div
									key={index}
									className="rounded-lg border border-gray-700 bg-gray-50 p-6 text-center"
								>
									<IconComponent className="mx-auto mb-4 h-12 w-12 text-blue-600" />
									<h3 className="mb-3 font-semibold text-xl">{value.title}</h3>
									<p className="text-gray-600 text-sm">{value.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-6 font-bold text-3xl">Our Story</h2>
						<div className="space-y-6 text-gray-300 text-lg leading-relaxed">
							<p>
								Cognident was founded in 2016 by Dr. Sarah Chen and Michael
								Rodriguez, who recognized the need for modern, intuitive
								practice management software in the dental industry. As a
								practicing dentist, Dr. Chen experienced firsthand the
								frustrations of outdated systems that hindered rather than
								helped patient care.
							</p>
							<p>
								Starting with a small team of dental professionals and software
								engineers, we set out to build something different – a platform
								that would actually make dentists' lives easier while improving
								patient outcomes. Today, we're proud to serve over 10,000 dental
								practices worldwide, from solo practitioners to large
								multi-location groups.
							</p>
							<p>
								Our commitment to innovation continues to drive us forward. We
								invest heavily in research and development, working closely with
								dental professionals to ensure our solutions meet the evolving
								needs of modern practices.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Leadership Team */}
			<section className="bg-white py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">Leadership Team</h2>
						<p className="text-gray-600 text-lg">
							Meet the experts leading Cognident's mission
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{team.map((member, index) => (
							<div
								key={index}
								className="rounded-lg border border-gray-700 bg-gray-50 p-6 text-center"
							>
								<div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-700" />
								<h3 className="mb-1 font-semibold text-lg">{member.name}</h3>
								<p className="mb-3 text-blue-600 text-sm">{member.role}</p>
								<p className="text-gray-600 text-sm">{member.bio}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Achievements */}
			<section className="py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-6 font-bold text-3xl">Recognition & Awards</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div className="flex items-center space-x-4 rounded-lg border border-gray-700 bg-white p-4">
								<CheckCircle className="h-8 w-8 text-green-400" />
								<div className="text-left">
									<h3 className="font-semibold">HIPAA Compliant</h3>
									<p className="text-gray-600 text-sm">
										Certified for healthcare data security
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 rounded-lg border border-gray-700 bg-white p-4">
								<CheckCircle className="h-8 w-8 text-green-400" />
								<div className="text-left">
									<h3 className="font-semibold">SOC 2 Type II</h3>
									<p className="text-gray-600 text-sm">
										Audited for security and availability
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 rounded-lg border border-gray-700 bg-white p-4">
								<CheckCircle className="h-8 w-8 text-green-400" />
								<div className="text-left">
									<h3 className="font-semibold">
										Best Practice Management Software
									</h3>
									<p className="text-gray-600 text-sm">
										Dental Industry Awards 2023
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 rounded-lg border border-gray-700 bg-white p-4">
								<CheckCircle className="h-8 w-8 text-green-400" />
								<div className="text-left">
									<h3 className="font-semibold">Top Rated Software</h3>
									<p className="text-gray-600 text-sm">
										4.9/5 stars from 5,000+ reviews
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-gray-800 border-t bg-gray-50 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center">
								<HeaderLogo className="text-blue-600" />
								<span className="font-bold text-xl">Cognident</span>
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
										href="/blog"
										className="transition-colors hover:text-gray-900"
									>
										Blog
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
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Support</h3>
							<ul className="space-y-2 text-gray-600">
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
