import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	ArrowRight,
	BarChart3,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Shield,
	Star,
	Users,
	Phone,
	Mail,
	MapPin,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Cognident - Professional Dental Practice Management Software",
	description:
		"HIPAA-compliant dental practice management software with smart scheduling, patient management, and digital charting. Trusted by dental professionals worldwide.",
	keywords:
		"dental practice management, dental software, HIPAA compliant, dental scheduling, patient management, dental charting, dental billing",
	openGraph: {
		title: "Cognident - Professional Dental Practice Management Software",
		description:
			"HIPAA-compliant dental practice management software with smart scheduling, patient management, and digital charting.",
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
		title: "Cognident - Professional Dental Practice Management Software",
		description:
			"HIPAA-compliant dental practice management software with smart scheduling and patient management.",
		images: ["https://cognident.org/og-image.jpg"],
	},
};

export default function LandingPage() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Cognident",
		description:
			"HIPAA-compliant dental practice management software with smart scheduling, patient management, and digital charting.",
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
		<div className="min-h-screen bg-white">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<HeaderLogo />
						<div className="hidden items-center space-x-8 md:flex">
							<Link href="#features" className="font-medium text-gray-700 hover:text-blue-600">
								Features
							</Link>
							<Link href="/pricing" className="font-medium text-gray-700 hover:text-blue-600">
								Pricing
							</Link>
							<Link href="/blog" className="font-medium text-gray-700 hover:text-blue-600">
								Blog
							</Link>
							<Link href="#contact" className="font-medium text-gray-700 hover:text-blue-600">
								Contact
							</Link>
							<Link href="/auth/signin" className="font-medium text-gray-700 hover:text-blue-600">
								Sign In
							</Link>
							<Link
								href="/auth/signup"
								className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
							>
								Start Free Trial
							</Link>
						</div>
					</div>
				</nav>
			</header>

			{/* Hero Section */}
			<section className="bg-gradient-to-b from-blue-50 to-white py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
							Professional Dental Practice
							<span className="text-blue-600"> Management Software</span>
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
							HIPAA-compliant cloud platform with smart scheduling, patient management,
							and digital charting. Trusted by dental professionals worldwide.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Link
								href="/auth/signup"
								className="bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 rounded-lg"
							>
								Start 14-Day Free Trial
							</Link>
							<Link
								href="#demo"
								className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600"
							>
								Watch Demo <span aria-hidden="true">→</span>
							</Link>
						</div>
						<div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								No Setup Fees
							</div>
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								HIPAA Compliant
							</div>
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								24/7 Support
							</div>
						</div>
					</div>
				</div>
			</section>

		{/* Features Section */}
		<section id="features" className="py-20 bg-gray-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Everything Your Dental Practice Needs
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Comprehensive practice management tools designed for dental professionals
					</p>
				</div>

				<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
							<Calendar className="h-6 w-6 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
						<p className="text-gray-600">
							Intelligent appointment scheduling with automated reminders and conflict resolution
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
							<Users className="h-6 w-6 text-green-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Management</h3>
						<p className="text-gray-600">
							Complete patient records, treatment history, and communication tools
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
							<FileText className="h-6 w-6 text-purple-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Charting</h3>
						<p className="text-gray-600">
							Intuitive digital dental charts with treatment planning and progress tracking
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 mb-4">
							<Shield className="h-6 w-6 text-red-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">HIPAA Compliance</h3>
						<p className="text-gray-600">
							Bank-level security with end-to-end encryption and compliance monitoring
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 mb-4">
							<BarChart3 className="h-6 w-6 text-yellow-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
						<p className="text-gray-600">
							Real-time insights into practice performance and patient satisfaction
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 mb-4">
							<Clock className="h-6 w-6 text-indigo-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
						<p className="text-gray-600">
							Round-the-clock technical support and training for your team
						</p>
					</div>
				</div>
			</div>
		</section>

		{/* CTA Section */}
		<section className="bg-blue-600 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Ready to Transform Your Practice?
					</h2>
					<p className="mt-4 text-lg text-blue-100">
						Join thousands of dental professionals who trust Cognident
					</p>
					<div className="mt-8">
						<Link
							href="/auth/signup"
							className="bg-white text-blue-600 px-8 py-3 text-lg font-semibold rounded-lg hover:bg-gray-100"
						>
							Start Your Free Trial Today
						</Link>
					</div>
				</div>
			</div>
		</section>

		{/* Footer */}
		<footer id="contact" className="bg-gray-900 text-white py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-8 md:grid-cols-4">
					<div>
						<HeaderLogo className="text-white mb-4" />
						<p className="text-gray-400">
							Professional dental practice management software trusted worldwide.
						</p>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-2 text-gray-400">
							<li><Link href="#features" className="hover:text-white">Features</Link></li>
							<li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
							<li><Link href="/api-docs" className="hover:text-white">API</Link></li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-2 text-gray-400">
							<li><Link href="/blog" className="hover:text-white">Blog</Link></li>
							<li><Link href="/contact" className="hover:text-white">Contact</Link></li>
							<li><Link href="/about" className="hover:text-white">About</Link></li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Contact</h3>
						<div className="space-y-2 text-gray-400">
							<div className="flex items-center">
								<Mail className="h-4 w-4 mr-2" />
								<span>support@cognident.org</span>
							</div>
							<div className="flex items-center">
								<Phone className="h-4 w-4 mr-2" />
								<span>1-800-DENTAL</span>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
					<p>&copy; 2025 Cognident. All rights reserved.</p>
				</div>
			</div>
		</footer>
	</div>
);
}
