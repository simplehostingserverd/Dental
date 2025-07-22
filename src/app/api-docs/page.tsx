"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { Button } from "@/components/ui/button";
import {
	Code,
	Key,
	Shield,
	Zap,
	Database,
	Globe,
	BookOpen,
	Download,
	ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function ApiDocsPage() {
	const endpoints = [
		{
			method: "GET",
			path: "/api/patients",
			description: "Retrieve patient list with filtering and pagination",
			auth: "Required",
		},
		{
			method: "POST",
			path: "/api/patients",
			description: "Create a new patient record",
			auth: "Required",
		},
		{
			method: "GET",
			path: "/api/appointments",
			description: "Get appointments with date range filtering",
			auth: "Required",
		},
		{
			method: "POST",
			path: "/api/appointments",
			description: "Schedule a new appointment",
			auth: "Required",
		},
		{
			method: "GET",
			path: "/api/treatments",
			description: "Retrieve treatment records and history",
			auth: "Required",
		},
		{
			method: "POST",
			path: "/api/treatments",
			description: "Create new treatment record",
			auth: "Required",
		},
	];

	const features = [
		{
			icon: Shield,
			title: "HIPAA Compliant",
			description:
				"All API endpoints are designed with healthcare data security in mind, ensuring full HIPAA compliance.",
		},
		{
			icon: Key,
			title: "Secure Authentication",
			description:
				"OAuth 2.0 and API key authentication with role-based access controls for maximum security.",
		},
		{
			icon: Zap,
			title: "High Performance",
			description:
				"Optimized endpoints with caching and rate limiting to ensure fast, reliable access to your data.",
		},
		{
			icon: Database,
			title: "Real-time Data",
			description:
				"Access live practice data with webhooks and real-time updates for seamless integrations.",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-50/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<ToothIcon className="mr-3 h-8 w-8 text-blue-600" />
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
								className="text-gray-300 transition-colors hover:text-gray-900"
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
					<Code className="mx-auto mb-6 h-16 w-16 text-blue-200" />
					<h1 className="mb-6 font-bold text-4xl lg:text-5xl">
						Cognident API Documentation
					</h1>
					<p className="mb-8 text-blue-100 text-xl">
						Integrate your dental practice with powerful APIs designed for
						healthcare workflows and HIPAA compliance.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button className="bg-white text-blue-600 hover:bg-gray-100">
							<BookOpen className="mr-2 h-4 w-4" />
							Get Started
						</Button>
						<Button
							variant="outline"
							className="border-blue-200 text-blue-200 hover:bg-blue-200 hover:text-blue-800"
						>
							<Download className="mr-2 h-4 w-4" />
							Download SDK
						</Button>
					</div>
				</div>
			</section>

			{/* API Features */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">API Features</h2>
						<p className="text-gray-600 text-lg">
							Built for developers, designed for healthcare
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{features.map((feature, index) => {
							const IconComponent = feature.icon;
							return (
								<div
									key={index}
									className="rounded-lg border border-gray-700 bg-white p-6 text-center"
								>
									<IconComponent className="mx-auto mb-4 h-12 w-12 text-blue-600" />
									<h3 className="mb-3 font-semibold text-xl">{feature.title}</h3>
									<p className="text-gray-600 text-sm">{feature.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Quick Start */}
			<section className="bg-white py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="mb-6 font-bold text-3xl">Quick Start</h2>
						<p className="mb-8 text-gray-600 text-lg">
							Get up and running with the Cognident API in minutes
						</p>
					</div>

					<div className="space-y-8">
						{/* Step 1 */}
						<div className="rounded-lg border border-gray-700 bg-gray-50 p-6">
							<h3 className="mb-4 font-semibold text-xl">
								1. Get Your API Key
							</h3>
							<p className="mb-4 text-gray-600">
								Sign up for a Cognident account and generate your API key from
								the developer dashboard.
							</p>
							<div className="rounded bg-white p-4">
								<code className="text-green-400 text-sm">
									curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
									&nbsp;&nbsp;&nbsp;&nbsp;https://api.cognident.org/v1/patients
								</code>
							</div>
						</div>

						{/* Step 2 */}
						<div className="rounded-lg border border-gray-700 bg-gray-50 p-6">
							<h3 className="mb-4 font-semibold text-xl">
								2. Make Your First Request
							</h3>
							<p className="mb-4 text-gray-600">
								Retrieve your patient list with a simple GET request.
							</p>
							<div className="rounded bg-white p-4">
								<code className="text-green-400 text-sm">
									{`{
  "patients": [
    {
      "id": "pat_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@email.com",
      "phone": "(555) 123-4567"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}`}
								</code>
							</div>
						</div>

						{/* Step 3 */}
						<div className="rounded-lg border border-gray-700 bg-gray-50 p-6">
							<h3 className="mb-4 font-semibold text-xl">3. Explore Endpoints</h3>
							<p className="mb-4 text-gray-600">
								Browse our comprehensive API reference to discover all available
								endpoints and capabilities.
							</p>
							<Button className="bg-blue-600 hover:bg-blue-700">
								<ExternalLink className="mr-2 h-4 w-4" />
								View Full Documentation
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* API Endpoints */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">Popular Endpoints</h2>
						<p className="text-gray-600 text-lg">
							Most commonly used API endpoints for dental practice integration
						</p>
					</div>

					<div className="space-y-4">
						{endpoints.map((endpoint, index) => (
							<div
								key={index}
								className="flex items-center justify-between rounded-lg border border-gray-700 bg-white p-4"
							>
								<div className="flex items-center space-x-4">
									<span
										className={`rounded px-2 py-1 font-mono text-xs font-semibold ${
											endpoint.method === "GET"
												? "bg-green-900 text-green-300"
												: "bg-blue-900 text-blue-300"
										}`}
									>
										{endpoint.method}
									</span>
									<code className="font-mono text-gray-300">
										{endpoint.path}
									</code>
									<span className="text-gray-600 text-sm">
										{endpoint.description}
									</span>
								</div>
								<span className="rounded bg-yellow-900 px-2 py-1 text-yellow-300 text-xs">
									{endpoint.auth}
								</span>
							</div>
						))}
					</div>

					<div className="mt-8 text-center">
						<Button
							variant="outline"
							className="border-gray-600 text-gray-300 hover:bg-white"
						>
							View All Endpoints
						</Button>
					</div>
				</div>
			</section>

			{/* SDKs and Libraries */}
			<section className="bg-white py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl">SDKs & Libraries</h2>
						<p className="text-gray-600 text-lg">
							Official SDKs for popular programming languages
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-lg border border-gray-700 bg-gray-50 p-6 text-center">
							<div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
								<Code className="h-6 w-6 text-gray-900" />
							</div>
							<h3 className="mb-2 font-semibold">JavaScript/Node.js</h3>
							<p className="mb-4 text-gray-600 text-sm">
								Official JavaScript SDK with TypeScript support
							</p>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								npm install cognident
							</Button>
						</div>

						<div className="rounded-lg border border-gray-700 bg-gray-50 p-6 text-center">
							<div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
								<Code className="h-6 w-6 text-gray-900" />
							</div>
							<h3 className="mb-2 font-semibold">Python</h3>
							<p className="mb-4 text-gray-600 text-sm">
								Python SDK with async support and type hints
							</p>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								pip install cognident
							</Button>
						</div>

						<div className="rounded-lg border border-gray-700 bg-gray-50 p-6 text-center">
							<div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
								<Code className="h-6 w-6 text-gray-900" />
							</div>
							<h3 className="mb-2 font-semibold">PHP</h3>
							<p className="mb-4 text-gray-600 text-sm">
								PHP SDK compatible with modern frameworks
							</p>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								composer require cognident
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Support */}
			<section className="py-16">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-6 font-bold text-3xl">Developer Support</h2>
					<p className="mb-8 text-gray-600 text-lg">
						Get help from our developer community and support team
					</p>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-lg border border-gray-700 bg-white p-6">
							<Globe className="mx-auto mb-4 h-8 w-8 text-blue-600" />
							<h3 className="mb-2 font-semibold">Community Forum</h3>
							<p className="mb-4 text-gray-600 text-sm">
								Connect with other developers and share solutions
							</p>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								Join Forum
							</Button>
						</div>

						<div className="rounded-lg border border-gray-700 bg-white p-6">
							<BookOpen className="mx-auto mb-4 h-8 w-8 text-blue-600" />
							<h3 className="mb-2 font-semibold">Documentation</h3>
							<p className="mb-4 text-gray-600 text-sm">
								Comprehensive guides and API reference
							</p>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								Read Docs
							</Button>
						</div>

						<div className="rounded-lg border border-gray-700 bg-white p-6">
							<Shield className="mx-auto mb-4 h-8 w-8 text-blue-600" />
							<h3 className="mb-2 font-semibold">Support Team</h3>
							<p className="mb-4 text-gray-600 text-sm">
								Direct access to our technical support team
							</p>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								Contact Support
							</Button>
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
								<ToothIcon className="mr-3 h-8 w-8 text-blue-600" />
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
