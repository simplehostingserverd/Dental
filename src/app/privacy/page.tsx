"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { Shield, Lock, Eye, FileText, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
	const sections = [
		{
			id: "information-collection",
			title: "Information We Collect",
			icon: FileText,
		},
		{
			id: "information-use",
			title: "How We Use Your Information",
			icon: Users,
		},
		{
			id: "information-sharing",
			title: "Information Sharing and Disclosure",
			icon: Globe,
		},
		{
			id: "data-security",
			title: "Data Security",
			icon: Shield,
		},
		{
			id: "data-retention",
			title: "Data Retention",
			icon: Lock,
		},
		{
			id: "your-rights",
			title: "Your Rights and Choices",
			icon: Eye,
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-900/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<ToothIcon className="mr-3 h-8 w-8 text-blue-400" />
							<span className="font-bold text-xl">Cognident</span>
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
					<Shield className="mx-auto mb-6 h-16 w-16 text-blue-200" />
					<h1 className="mb-6 font-bold text-4xl lg:text-5xl">
						Privacy Policy
					</h1>
					<p className="mb-4 text-blue-100 text-xl">
						Your privacy and the security of your data are our top priorities.
					</p>
					<p className="text-blue-200 text-sm">
						Last updated: January 15, 2024
					</p>
				</div>
			</section>

			{/* Table of Contents */}
			<section className="py-12">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<h2 className="mb-8 font-bold text-2xl">Table of Contents</h2>
					<div className="grid gap-4 md:grid-cols-2">
						{sections.map((section, index) => {
							const IconComponent = section.icon;
							return (
								<a
									key={index}
									href={`#${section.id}`}
									className="flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:bg-gray-700"
								>
									<IconComponent className="h-5 w-5 text-blue-400" />
									<span>{section.title}</span>
								</a>
							);
						})}
					</div>
				</div>
			</section>

			{/* Privacy Policy Content */}
			<section className="py-12">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="space-y-12">
						{/* Introduction */}
						<div>
							<h2 className="mb-4 font-bold text-2xl">Introduction</h2>
							<div className="space-y-4 text-gray-300">
								<p>
									Cognident, Inc. ("Cognident," "we," "us," or "our") is
									committed to protecting the privacy and security of your
									personal information. This Privacy Policy explains how we
									collect, use, disclose, and safeguard your information when
									you use our dental practice management software and related
									services.
								</p>
								<p>
									As a healthcare technology provider, we understand the
									sensitive nature of the information we handle and are
									committed to maintaining the highest standards of data
									protection in compliance with HIPAA, state privacy laws, and
									other applicable regulations.
								</p>
							</div>
						</div>

						{/* Information Collection */}
						<div id="information-collection">
							<h2 className="mb-4 font-bold text-2xl">
								Information We Collect
							</h2>
							<div className="space-y-4 text-gray-300">
								<h3 className="font-semibold text-lg text-blue-400">
									Personal Information
								</h3>
								<p>We may collect the following types of personal information:</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>
										Contact information (name, email address, phone number,
										mailing address)
									</li>
									<li>
										Professional information (dental license number,
										specialization, practice details)
									</li>
									<li>Account credentials and authentication information</li>
									<li>Payment and billing information</li>
									<li>Communication preferences and history</li>
								</ul>

								<h3 className="font-semibold text-lg text-blue-400">
									Protected Health Information (PHI)
								</h3>
								<p>
									When you use our services to manage patient information, we
									may process PHI on your behalf as a Business Associate under
									HIPAA. This includes:
								</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>Patient demographics and contact information</li>
									<li>Medical and dental history</li>
									<li>Treatment records and clinical notes</li>
									<li>Appointment and scheduling information</li>
									<li>Insurance and billing information</li>
									<li>Digital images and radiographs</li>
								</ul>

								<h3 className="font-semibold text-lg text-blue-400">
									Technical Information
								</h3>
								<ul className="ml-6 list-disc space-y-2">
									<li>Device information and browser type</li>
									<li>IP address and location data</li>
									<li>Usage patterns and feature utilization</li>
									<li>Performance and error logs</li>
									<li>Cookies and similar tracking technologies</li>
								</ul>
							</div>
						</div>

						{/* Information Use */}
						<div id="information-use">
							<h2 className="mb-4 font-bold text-2xl">
								How We Use Your Information
							</h2>
							<div className="space-y-4 text-gray-300">
								<p>We use the information we collect for the following purposes:</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>Providing and maintaining our software services</li>
									<li>Processing payments and managing accounts</li>
									<li>Providing customer support and technical assistance</li>
									<li>Improving our products and developing new features</li>
									<li>Ensuring security and preventing fraud</li>
									<li>Complying with legal obligations</li>
									<li>
										Communicating with you about updates, security alerts, and
										administrative messages
									</li>
								</ul>
								<p>
									<strong>PHI Processing:</strong> We process PHI solely as
									directed by you and in accordance with our Business Associate
									Agreement. We do not use PHI for our own purposes or disclose
									it except as permitted by HIPAA.
								</p>
							</div>
						</div>

						{/* Information Sharing */}
						<div id="information-sharing">
							<h2 className="mb-4 font-bold text-2xl">
								Information Sharing and Disclosure
							</h2>
							<div className="space-y-4 text-gray-300">
								<p>
									We do not sell, trade, or rent your personal information to
									third parties. We may share your information only in the
									following circumstances:
								</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>
										<strong>Service Providers:</strong> With trusted third-party
										vendors who assist us in operating our business (cloud
										hosting, payment processing, customer support)
									</li>
									<li>
										<strong>Legal Requirements:</strong> When required by law,
										court order, or government regulation
									</li>
									<li>
										<strong>Business Transfers:</strong> In connection with a
										merger, acquisition, or sale of assets
									</li>
									<li>
										<strong>Consent:</strong> With your explicit consent for
										specific purposes
									</li>
									<li>
										<strong>Emergency Situations:</strong> To protect the safety
										of individuals or prevent illegal activities
									</li>
								</ul>
							</div>
						</div>

						{/* Data Security */}
						<div id="data-security">
							<h2 className="mb-4 font-bold text-2xl">Data Security</h2>
							<div className="space-y-4 text-gray-300">
								<p>
									We implement comprehensive security measures to protect your
									information:
								</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>
										<strong>Encryption:</strong> All data is encrypted in
										transit and at rest using industry-standard encryption
									</li>
									<li>
										<strong>Access Controls:</strong> Role-based access controls
										and multi-factor authentication
									</li>
									<li>
										<strong>Infrastructure:</strong> Secure cloud hosting with
										SOC 2 Type II certified providers
									</li>
									<li>
										<strong>Monitoring:</strong> 24/7 security monitoring and
										intrusion detection
									</li>
									<li>
										<strong>Regular Audits:</strong> Periodic security
										assessments and penetration testing
									</li>
									<li>
										<strong>Employee Training:</strong> Regular security
										awareness training for all staff
									</li>
								</ul>
							</div>
						</div>

						{/* Data Retention */}
						<div id="data-retention">
							<h2 className="mb-4 font-bold text-2xl">Data Retention</h2>
							<div className="space-y-4 text-gray-300">
								<p>
									We retain your information for as long as necessary to provide
									our services and comply with legal obligations:
								</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>
										<strong>Account Information:</strong> Retained while your
										account is active and for 7 years after closure
									</li>
									<li>
										<strong>PHI:</strong> Retained according to your
										instructions and applicable legal requirements
									</li>
									<li>
										<strong>Technical Logs:</strong> Typically retained for 90
										days unless required for security investigations
									</li>
									<li>
										<strong>Backup Data:</strong> May be retained for up to 1
										year for disaster recovery purposes
									</li>
								</ul>
							</div>
						</div>

						{/* Your Rights */}
						<div id="your-rights">
							<h2 className="mb-4 font-bold text-2xl">
								Your Rights and Choices
							</h2>
							<div className="space-y-4 text-gray-300">
								<p>You have the following rights regarding your information:</p>
								<ul className="ml-6 list-disc space-y-2">
									<li>
										<strong>Access:</strong> Request access to your personal
										information
									</li>
									<li>
										<strong>Correction:</strong> Request correction of
										inaccurate information
									</li>
									<li>
										<strong>Deletion:</strong> Request deletion of your
										information (subject to legal requirements)
									</li>
									<li>
										<strong>Portability:</strong> Request a copy of your data
										in a portable format
									</li>
									<li>
										<strong>Opt-out:</strong> Unsubscribe from marketing
										communications
									</li>
								</ul>
								<p>
									To exercise these rights, please contact us at{" "}
									<span className="text-blue-400">privacy@cognident.org</span>.
								</p>
							</div>
						</div>

						{/* Contact Information */}
						<div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
							<h2 className="mb-4 font-bold text-2xl">Contact Us</h2>
							<p className="mb-4 text-gray-300">
								If you have questions about this Privacy Policy or our data
								practices, please contact us:
							</p>
							<div className="space-y-2 text-gray-300">
								<p>
									<strong>Email:</strong>{" "}
									<span className="text-blue-400">privacy@cognident.org</span>
								</p>
								<p>
									<strong>Phone:</strong> 1-800-COGNIDENT
								</p>
								<p>
									<strong>Mail:</strong>
									<br />
									Cognident, Inc.
									<br />
									Attn: Privacy Officer
									<br />
									123 Innovation Drive
									<br />
									Tech Valley, CA 94025
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-gray-800 border-t bg-gray-900 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center">
								<ToothIcon className="mr-3 h-8 w-8 text-blue-400" />
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
						<p>&copy; 2024 Cognident. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
