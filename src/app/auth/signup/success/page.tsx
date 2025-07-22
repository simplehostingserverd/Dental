"use client";

import {
	Calendar,
	CheckCircle,
	Heart,
	Mail,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="mb-8 text-center">
					<div className="mb-6 flex items-center justify-center">
						<Heart className="mr-3 h-12 w-12 text-blue-600" />
						<span className="font-bold text-3xl text-gray-900">
							DentalCloud
						</span>
					</div>

					<div className="mb-4 flex items-center justify-center">
						<CheckCircle className="h-16 w-16 text-green-500" />
					</div>

					<h1 className="mb-2 font-bold text-3xl text-gray-900">
						Welcome to DentalCloud!
					</h1>
					<p className="text-gray-600 text-lg">
						Your account has been created successfully. Let's get your practice
						set up.
					</p>
				</div>

				{/* Next Steps */}
				<div className="mb-8 rounded-lg border bg-white p-8 shadow-sm">
					<h2 className="mb-6 font-semibold text-gray-900 text-xl">
						Next Steps
					</h2>

					<div className="space-y-6">
						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
								<Mail className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold text-gray-900">
									Check Your Email
								</h3>
								<p className="text-gray-600 text-sm">
									We've sent a verification email to your work email address.
									Please click the link to verify your account.
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
								<Settings className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold text-gray-900">
									Complete Practice Setup
								</h3>
								<p className="text-gray-600 text-sm">
									Add your practice details, locations, and configure your
									preferences.
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
								<Users className="h-4 w-4 text-purple-600" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold text-gray-900">
									Invite Your Team
								</h3>
								<p className="text-gray-600 text-sm">
									Add dentists, hygienists, and staff members to your practice.
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100">
								<Calendar className="h-4 w-4 text-yellow-600" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold text-gray-900">
									Schedule Demo
								</h3>
								<p className="text-gray-600 text-sm">
									Book a personalized demo to learn about advanced features and
									best practices.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Trial Information */}
				<div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
					<h3 className="mb-2 font-semibold text-blue-900">
						Your 30-Day Free Trial
					</h3>
					<p className="mb-4 text-blue-800 text-sm">
						You have full access to all DentalCloud features for the next 30
						days. No credit card required.
					</p>
					<ul className="space-y-1 text-blue-800 text-sm">
						<li>• Complete EMR and practice management suite</li>
						<li>• AI-powered scheduling and insights</li>
						<li>• Patient portal and communication tools</li>
						<li>• Digital imaging and charting</li>
						<li>• Billing and insurance management</li>
						<li>• 24/7 customer support</li>
					</ul>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col justify-center gap-4 sm:flex-row">
					<Link
						href="/dashboard"
						className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 font-medium text-base text-gray-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Go to Dashboard
					</Link>

					<Link
						href="/onboarding"
						className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Start Setup Wizard
					</Link>

					<Link
						href="/contact"
						className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Schedule Demo
					</Link>
				</div>

				{/* Support */}
				<div className="mt-8 text-center">
					<p className="text-gray-600 text-sm">
						Need help getting started?{" "}
						<Link href="/support" className="text-blue-600 hover:text-blue-500">
							Contact our support team
						</Link>{" "}
						or{" "}
						<Link href="/help" className="text-blue-600 hover:text-blue-500">
							visit our help center
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
