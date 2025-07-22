"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	BookOpen,
	Clock,
	Search,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Help articles data
const helpArticles = {
	"getting-started": {
		title: "Getting Started",
		description: "Set up your practice and get familiar with Cognident",
		articles: [
			{
				id: "first-login",
				title: "Your First Login to Cognident",
				content: `
					<h2>Welcome to Cognident!</h2>
					<p>This guide will walk you through your first login and initial setup process.</p>
					
					<h3>Step 1: Accessing Your Account</h3>
					<p>Navigate to <strong>cognident.org</strong> and click the "Login" button in the top right corner. You'll be redirected to the secure login page.</p>
					
					<h3>Step 2: Enter Your Credentials</h3>
					<p>Use the email address and temporary password provided in your welcome email. If you haven't received your credentials, contact our support team.</p>
					
					<h3>Step 3: Set Up Your New Password</h3>
					<p>For security, you'll be prompted to create a new password on your first login. Choose a strong password that includes:</p>
					<ul>
						<li>At least 8 characters</li>
						<li>Upper and lowercase letters</li>
						<li>Numbers and special characters</li>
					</ul>
					
					<h3>Step 4: Complete Your Profile</h3>
					<p>Fill in your practice information, including practice name, address, phone number, and specialties. This information will appear on patient communications.</p>
					
					<h3>Next Steps</h3>
					<p>Once logged in, you'll see the dashboard overview. We recommend starting with the "Practice Setup Wizard" to configure your essential settings.</p>
				`,
				readTime: "3 min read",
			},
			{
				id: "practice-setup",
				title: "Setting Up Your Practice Profile",
				content: `
					<h2>Practice Profile Setup</h2>
					<p>Your practice profile is the foundation of your Cognident experience. Here's how to set it up correctly.</p>
					
					<h3>Basic Information</h3>
					<p>Navigate to <strong>Settings > Practice Profile</strong> to enter:</p>
					<ul>
						<li><strong>Practice Name:</strong> The official name of your dental practice</li>
						<li><strong>Address:</strong> Complete physical address for patient directions</li>
						<li><strong>Phone & Email:</strong> Primary contact information</li>
						<li><strong>Website:</strong> Your practice website URL</li>
					</ul>
					
					<h3>Operating Hours</h3>
					<p>Set your practice hours for each day of the week. This information is used for:</p>
					<ul>
						<li>Online appointment scheduling</li>
						<li>Patient communication timing</li>
						<li>Staff scheduling templates</li>
					</ul>
					
					<h3>Services and Specialties</h3>
					<p>List all services your practice offers. This helps with:</p>
					<ul>
						<li>Treatment planning</li>
						<li>Insurance coding</li>
						<li>Patient education materials</li>
					</ul>
					
					<h3>Insurance and Payment Options</h3>
					<p>Configure accepted insurance plans and payment methods to streamline billing processes.</p>
					
					<h3>Branding</h3>
					<p>Upload your practice logo and choose brand colors to personalize patient communications and reports.</p>
				`,
				readTime: "5 min read",
			},
			{
				id: "user-roles",
				title: "Understanding User Roles and Permissions",
				content: `
					<h2>User Roles in Cognident</h2>
					<p>Cognident uses role-based access control to ensure team members have appropriate access to features and patient information.</p>
					
					<h3>Practice Owner/Administrator</h3>
					<p>Full access to all features including:</p>
					<ul>
						<li>Practice settings and configuration</li>
						<li>User management and permissions</li>
						<li>Financial reports and analytics</li>
						<li>Billing and payment processing</li>
						<li>All patient records and communications</li>
					</ul>
					
					<h3>Dentist/Doctor</h3>
					<p>Clinical and patient management access:</p>
					<ul>
						<li>Patient records and treatment plans</li>
						<li>Appointment scheduling</li>
						<li>Clinical notes and documentation</li>
						<li>Prescription management</li>
						<li>Treatment approval and billing</li>
					</ul>
					
					<h3>Dental Hygienist</h3>
					<p>Patient care and preventive treatment access:</p>
					<ul>
						<li>Patient records (read/write for assigned patients)</li>
						<li>Preventive care documentation</li>
						<li>Appointment scheduling</li>
						<li>Patient education materials</li>
					</ul>
					
					<h3>Receptionist/Front Desk</h3>
					<p>Administrative and scheduling access:</p>
					<ul>
						<li>Appointment scheduling and management</li>
						<li>Patient check-in/check-out</li>
						<li>Insurance verification</li>
						<li>Payment processing</li>
						<li>Basic patient information</li>
					</ul>
					
					<h3>Managing User Permissions</h3>
					<p>Administrators can customize permissions for each role through <strong>Settings > User Management</strong>.</p>
				`,
				readTime: "4 min read",
			},
		],
	},
	"scheduling": {
		title: "Scheduling & Appointments",
		description: "Manage appointments, calendar, and patient scheduling",
		articles: [
			{
				id: "appointment-scheduling",
				title: "How to Schedule Appointments",
				content: `
					<h2>Scheduling Appointments in Cognident</h2>
					<p>Efficient appointment scheduling is crucial for practice productivity. Here's how to master the scheduling system.</p>
					
					<h3>Quick Appointment Booking</h3>
					<p>From the main dashboard:</p>
					<ol>
						<li>Click the <strong>"New Appointment"</strong> button</li>
						<li>Search for the patient by name or phone number</li>
						<li>Select the appointment type and duration</li>
						<li>Choose an available time slot</li>
						<li>Add any special notes or instructions</li>
						<li>Click <strong>"Schedule"</strong> to confirm</li>
					</ol>
					
					<h3>Calendar View Options</h3>
					<p>Switch between different calendar views:</p>
					<ul>
						<li><strong>Day View:</strong> Detailed hourly schedule for a single day</li>
						<li><strong>Week View:</strong> Overview of the entire week</li>
						<li><strong>Month View:</strong> High-level monthly planning</li>
						<li><strong>Provider View:</strong> Individual schedules for each dentist</li>
					</ul>
					
					<h3>Appointment Types and Duration</h3>
					<p>Configure different appointment types with default durations:</p>
					<ul>
						<li>Consultation (30 minutes)</li>
						<li>Cleaning (60 minutes)</li>
						<li>Filling (45 minutes)</li>
						<li>Crown Preparation (90 minutes)</li>
						<li>Emergency (30 minutes)</li>
					</ul>
					
					<h3>Recurring Appointments</h3>
					<p>Set up recurring appointments for regular patients:</p>
					<ol>
						<li>Schedule the initial appointment</li>
						<li>Click <strong>"Make Recurring"</strong></li>
						<li>Choose frequency (weekly, monthly, quarterly)</li>
						<li>Set the number of occurrences or end date</li>
					</ol>
					
					<h3>Appointment Confirmations</h3>
					<p>Automatic confirmations are sent via email and SMS. Customize confirmation messages in <strong>Settings > Communications</strong>.</p>
				`,
				readTime: "6 min read",
			},
			{
				id: "calendar-management",
				title: "Calendar Management and Time Blocking",
				content: `
					<h2>Advanced Calendar Management</h2>
					<p>Optimize your schedule with advanced calendar features and time blocking strategies.</p>
					
					<h3>Time Blocking Strategies</h3>
					<p>Create efficient schedules by blocking time for specific activities:</p>
					<ul>
						<li><strong>Morning Block:</strong> Complex procedures requiring fresh focus</li>
						<li><strong>Afternoon Block:</strong> Routine cleanings and check-ups</li>
						<li><strong>Emergency Slots:</strong> Reserved time for urgent cases</li>
						<li><strong>Administrative Time:</strong> Chart reviews and planning</li>
					</ul>
					
					<h3>Provider Schedules</h3>
					<p>Manage multiple provider schedules:</p>
					<ol>
						<li>Go to <strong>Calendar > Provider Management</strong></li>
						<li>Set individual working hours for each provider</li>
						<li>Configure break times and lunch schedules</li>
						<li>Set vacation and time-off periods</li>
					</ol>
					
					<h3>Room and Equipment Scheduling</h3>
					<p>Track room availability and equipment usage:</p>
					<ul>
						<li>Assign specific rooms to appointments</li>
						<li>Schedule equipment maintenance</li>
						<li>Prevent double-booking of resources</li>
					</ul>
					
					<h3>Waitlist Management</h3>
					<p>Maintain a waitlist for popular time slots:</p>
					<ol>
						<li>Add patients to the waitlist when preferred times aren't available</li>
						<li>Automatically notify waitlisted patients when slots open</li>
						<li>Prioritize by urgency or patient preference</li>
					</ol>
					
					<h3>Schedule Templates</h3>
					<p>Create reusable schedule templates for consistent planning:</p>
					<ul>
						<li>Weekly templates for regular schedules</li>
						<li>Special event templates for procedures</li>
						<li>Holiday and reduced-hour templates</li>
					</ul>
				`,
				readTime: "7 min read",
			},
		],
	},
	"patient-records": {
		title: "Patient Records",
		description: "Create, manage, and organize patient information",
		articles: [
			{
				id: "creating-patient-records",
				title: "Creating and Managing Patient Records",
				content: `
					<h2>Patient Record Management</h2>
					<p>Comprehensive patient records are essential for quality care and practice efficiency.</p>
					
					<h3>Creating New Patient Records</h3>
					<p>To add a new patient:</p>
					<ol>
						<li>Click <strong>"Add New Patient"</strong> from the dashboard</li>
						<li>Enter basic demographic information</li>
						<li>Add emergency contact details</li>
						<li>Input insurance information</li>
						<li>Complete medical history questionnaire</li>
						<li>Save the record</li>
					</ol>
					
					<h3>Required Information</h3>
					<p>Essential patient data includes:</p>
					<ul>
						<li><strong>Demographics:</strong> Name, date of birth, address, phone</li>
						<li><strong>Insurance:</strong> Primary and secondary insurance details</li>
						<li><strong>Medical History:</strong> Conditions, medications, allergies</li>
						<li><strong>Emergency Contact:</strong> Name, relationship, phone number</li>
						<li><strong>Dental History:</strong> Previous treatments, preferences</li>
					</ul>
					
					<h3>Medical History Documentation</h3>
					<p>Thorough medical history is crucial for safe treatment:</p>
					<ul>
						<li>Current medications and dosages</li>
						<li>Known allergies and reactions</li>
						<li>Chronic conditions and treatments</li>
						<li>Previous surgeries and hospitalizations</li>
						<li>Family medical history</li>
					</ul>
					
					<h3>Updating Patient Information</h3>
					<p>Keep records current by:</p>
					<ul>
						<li>Reviewing information at each visit</li>
						<li>Updating insurance changes promptly</li>
						<li>Adding new medical conditions or medications</li>
						<li>Documenting changes in contact information</li>
					</ul>
					
					<h3>Record Security and Privacy</h3>
					<p>All patient records are encrypted and HIPAA-compliant. Access is logged and monitored for security.</p>
				`,
				readTime: "5 min read",
			},
		],
	},
	"billing": {
		title: "Billing & Payments",
		description: "Handle invoicing, payments, and insurance claims",
		articles: [
			{
				id: "insurance-claims",
				title: "Processing Insurance Claims",
				content: `
					<h2>Insurance Claims Processing</h2>
					<p>Streamline your insurance workflow with Cognident's integrated claims management system.</p>

					<h3>Pre-Authorization Process</h3>
					<p>For major treatments, submit pre-authorizations:</p>
					<ol>
						<li>Navigate to the patient's treatment plan</li>
						<li>Select procedures requiring pre-auth</li>
						<li>Click <strong>"Submit Pre-Authorization"</strong></li>
						<li>Include necessary documentation and X-rays</li>
						<li>Track approval status in the claims dashboard</li>
					</ol>

					<h3>Electronic Claims Submission</h3>
					<p>Submit claims electronically for faster processing:</p>
					<ul>
						<li>Claims are automatically generated from completed treatments</li>
						<li>Review claim details before submission</li>
						<li>Submit individual claims or batch process multiple claims</li>
						<li>Receive electronic acknowledgments within 24 hours</li>
					</ul>

					<h3>Claim Status Tracking</h3>
					<p>Monitor claim progress through the claims dashboard:</p>
					<ul>
						<li><strong>Submitted:</strong> Claim sent to insurance</li>
						<li><strong>Pending:</strong> Under review by insurance</li>
						<li><strong>Paid:</strong> Payment received</li>
						<li><strong>Denied:</strong> Requires review and possible resubmission</li>
					</ul>

					<h3>Handling Claim Denials</h3>
					<p>When claims are denied:</p>
					<ol>
						<li>Review the denial reason carefully</li>
						<li>Gather additional documentation if needed</li>
						<li>Correct any coding errors</li>
						<li>Resubmit the claim with corrections</li>
						<li>Appeal if the denial seems incorrect</li>
					</ol>
				`,
				readTime: "8 min read",
			},
			{
				id: "payment-processing",
				title: "Payment Processing and Methods",
				content: `
					<h2>Payment Processing</h2>
					<p>Accept and process payments efficiently with multiple payment options.</p>

					<h3>Accepted Payment Methods</h3>
					<p>Cognident supports various payment methods:</p>
					<ul>
						<li><strong>Credit/Debit Cards:</strong> Visa, MasterCard, American Express, Discover</li>
						<li><strong>ACH/Bank Transfers:</strong> Direct bank account debits</li>
						<li><strong>Cash:</strong> Traditional cash payments</li>
						<li><strong>Checks:</strong> Personal and insurance checks</li>
						<li><strong>Payment Plans:</strong> Flexible financing options</li>
					</ul>

					<h3>Processing Payments</h3>
					<p>To process a payment:</p>
					<ol>
						<li>Navigate to the patient's account</li>
						<li>Click <strong>"Process Payment"</strong></li>
						<li>Select payment method</li>
						<li>Enter payment amount</li>
						<li>Apply payment to specific charges</li>
						<li>Print or email receipt</li>
					</ol>

					<h3>Payment Plans</h3>
					<p>Set up payment plans for larger treatments:</p>
					<ol>
						<li>Create a treatment estimate</li>
						<li>Click <strong>"Create Payment Plan"</strong></li>
						<li>Set down payment amount</li>
						<li>Choose payment frequency (monthly, bi-weekly)</li>
						<li>Set automatic payment dates</li>
						<li>Send agreement to patient for signature</li>
					</ol>

					<h3>Refunds and Adjustments</h3>
					<p>Process refunds when necessary:</p>
					<ul>
						<li>Navigate to the original payment</li>
						<li>Click <strong>"Process Refund"</strong></li>
						<li>Enter refund amount and reason</li>
						<li>Choose refund method (original payment method or check)</li>
					</ul>
				`,
				readTime: "6 min read",
			},
		],
	},
	"settings": {
		title: "Practice Settings",
		description: "Configure your practice preferences and settings",
		articles: [
			{
				id: "practice-configuration",
				title: "Practice Configuration and Preferences",
				content: `
					<h2>Practice Configuration</h2>
					<p>Customize Cognident to match your practice's unique needs and workflows.</p>

					<h3>General Settings</h3>
					<p>Configure basic practice information:</p>
					<ul>
						<li><strong>Practice Details:</strong> Name, address, phone, email</li>
						<li><strong>Time Zone:</strong> Set your local time zone for accurate scheduling</li>
						<li><strong>Currency:</strong> Choose your local currency for billing</li>
						<li><strong>Language:</strong> Select primary language for the interface</li>
					</ul>

					<h3>Appointment Settings</h3>
					<p>Customize scheduling preferences:</p>
					<ul>
						<li><strong>Default Appointment Duration:</strong> Set standard appointment lengths</li>
						<li><strong>Buffer Time:</strong> Add time between appointments for cleanup</li>
						<li><strong>Booking Window:</strong> How far in advance patients can book</li>
						<li><strong>Cancellation Policy:</strong> Set cancellation notice requirements</li>
					</ul>

					<h3>Communication Preferences</h3>
					<p>Configure patient communication settings:</p>
					<ul>
						<li><strong>Appointment Reminders:</strong> Email and SMS reminder timing</li>
						<li><strong>Confirmation Messages:</strong> Customize appointment confirmation text</li>
						<li><strong>Follow-up Communications:</strong> Post-treatment care instructions</li>
					</ul>

					<h3>Billing Configuration</h3>
					<p>Set up billing and payment preferences:</p>
					<ul>
						<li><strong>Payment Terms:</strong> Due dates and late fees</li>
						<li><strong>Insurance Settings:</strong> Default insurance processing options</li>
						<li><strong>Statement Settings:</strong> Billing statement frequency and format</li>
					</ul>

					<h3>Security Settings</h3>
					<p>Configure security and access controls:</p>
					<ul>
						<li><strong>Password Requirements:</strong> Set password complexity rules</li>
						<li><strong>Session Timeouts:</strong> Automatic logout timing</li>
						<li><strong>Two-Factor Authentication:</strong> Enable additional security</li>
					</ul>
				`,
				readTime: "7 min read",
			},
		],
	},
	"security": {
		title: "Security & Privacy",
		description: "Data security, HIPAA compliance, and privacy settings",
		articles: [
			{
				id: "hipaa-compliance",
				title: "HIPAA Compliance and Data Security",
				content: `
					<h2>HIPAA Compliance in Cognident</h2>
					<p>Cognident is designed with HIPAA compliance at its core, ensuring your practice meets all regulatory requirements.</p>

					<h3>Data Encryption</h3>
					<p>All patient data is protected with industry-standard encryption:</p>
					<ul>
						<li><strong>Data at Rest:</strong> AES-256 encryption for stored data</li>
						<li><strong>Data in Transit:</strong> TLS 1.3 encryption for data transmission</li>
						<li><strong>Database Security:</strong> Encrypted database connections and storage</li>
					</ul>

					<h3>Access Controls</h3>
					<p>Strict access controls protect patient information:</p>
					<ul>
						<li><strong>Role-Based Access:</strong> Users only see information relevant to their role</li>
						<li><strong>Audit Logs:</strong> All access to patient data is logged and monitored</li>
						<li><strong>Session Management:</strong> Automatic logout after inactivity</li>
						<li><strong>Multi-Factor Authentication:</strong> Additional security layer for sensitive accounts</li>
					</ul>

					<h3>Business Associate Agreement</h3>
					<p>Cognident serves as your Business Associate under HIPAA:</p>
					<ul>
						<li>We maintain appropriate safeguards for PHI</li>
						<li>We only use PHI as permitted by our agreement</li>
						<li>We report any security incidents promptly</li>
						<li>We ensure our subcontractors also comply with HIPAA</li>
					</ul>

					<h3>Data Backup and Recovery</h3>
					<p>Your data is protected with comprehensive backup systems:</p>
					<ul>
						<li><strong>Automated Backups:</strong> Daily encrypted backups</li>
						<li><strong>Geographic Redundancy:</strong> Backups stored in multiple locations</li>
						<li><strong>Disaster Recovery:</strong> Rapid restoration capabilities</li>
						<li><strong>Data Retention:</strong> Compliant data retention policies</li>
					</ul>

					<h3>Breach Prevention and Response</h3>
					<p>Proactive measures to prevent and respond to security incidents:</p>
					<ul>
						<li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
						<li><strong>Incident Response:</strong> Immediate response to security events</li>
						<li><strong>Notification:</strong> Prompt notification of any security incidents</li>
						<li><strong>Investigation:</strong> Thorough investigation and remediation</li>
					</ul>
				`,
				readTime: "9 min read",
			},
		],
	},
};

interface HelpCategoryPageProps {
	params: Promise<{
		category: string;
	}>;
}

export default async function HelpCategoryPage({ params }: HelpCategoryPageProps) {
	const { category } = await params;
	const categoryData = helpArticles[category as keyof typeof helpArticles];

	if (!categoryData) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			{/* Header */}
			<header className="border-b border-gray-800 bg-gray-50/50 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link href="/" className="flex items-center space-x-2">
								<HeaderLogo className="text-gray-900" />
							</Link>
						</div>
						<nav className="hidden md:flex items-center space-x-8">
							<Link href="/blog" className="hover:text-blue-600 transition-colors">
								Blog
							</Link>
							<Link href="/help" className="hover:text-blue-600 transition-colors">
								Help Center
							</Link>
							<Link href="/contact" className="hover:text-blue-600 transition-colors">
								Contact
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Breadcrumb */}
			<div className="bg-white/50 py-4">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center space-x-2 text-sm">
						<Link href="/help" className="text-blue-600 hover:text-blue-700">
							Help Center
						</Link>
						<ChevronRight className="h-4 w-4 text-gray-600" />
						<span className="text-gray-300">{categoryData.title}</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/help"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Help Center
					</Link>
					<h1 className="text-4xl font-bold mb-4">{categoryData.title}</h1>
					<p className="text-xl text-gray-300">{categoryData.description}</p>
				</div>

				{/* Articles List */}
				<div className="space-y-6">
					{categoryData.articles.map((article) => (
						<div
							key={article.id}
							className="bg-white rounded-lg p-6 hover:bg-gray-700 transition-colors"
						>
							<div className="flex items-start justify-between mb-4">
								<h2 className="text-2xl font-semibold text-gray-900">
									{article.title}
								</h2>
								<div className="flex items-center text-sm text-gray-600">
									<Clock className="mr-1 h-4 w-4" />
									{article.readTime}
								</div>
							</div>
							<div
								className="prose prose-invert max-w-none"
								dangerouslySetInnerHTML={{ __html: article.content }}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-gray-800 bg-gray-50 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
						<div className="md:col-span-2">
							<div className="flex items-center space-x-2 mb-4">
								<HeaderLogo className="text-gray-900" />
							</div>
							<p className="text-gray-600 mb-4">
								The complete dental practice management solution designed for modern dental professionals.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								<li>
									<Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
										Help Center
									</Link>
								</li>
								<li>
									<Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
										Contact Support
									</Link>
								</li>
								<li>
									<Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
										Blog
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Support</h3>
							<ul className="space-y-2">
								<li className="text-gray-600">Email: support@cognident.org</li>
								<li className="text-gray-600">Phone: 1-800-COGNIDENT</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-600">
						<p>&copy; 2025 Cognident. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
