import {
	ArrowLeft,
	BookOpen,
	Calendar,
	Heart,
	Share2,
	User,
} from "lucide-react";
import { CognidentTextLogo } from "@/components/icons/cognident-logo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
	{
		id: 1,
		title: "10 Ways to Improve Patient Experience in Your Dental Practice",
		excerpt:
			"Discover proven strategies to enhance patient satisfaction and build lasting relationships that drive practice growth.",
		content: `
      <p>Patient experience is the cornerstone of a successful dental practice. In today's competitive healthcare landscape, providing exceptional patient care goes beyond clinical excellence—it encompasses every touchpoint of the patient journey.</p>
      
      <h2>1. Streamline Your Appointment Scheduling</h2>
      <p>Modern patients expect convenience and flexibility when booking appointments. Implement online scheduling systems that allow patients to book, reschedule, or cancel appointments 24/7. This reduces phone calls to your office and gives patients control over their scheduling preferences.</p>
      
      <h2>2. Create a Welcoming Environment</h2>
      <p>Your office environment sets the tone for the entire patient experience. Ensure your waiting area is comfortable, clean, and calming. Consider amenities like complimentary Wi-Fi, refreshments, and entertainment options to make waiting more pleasant.</p>
      
      <h2>3. Implement Clear Communication</h2>
      <p>Transparent communication builds trust and reduces patient anxiety. Explain procedures clearly, discuss treatment options thoroughly, and provide written estimates for all services. Use visual aids and models to help patients understand their treatment plans.</p>
      
      <h2>4. Reduce Wait Times</h2>
      <p>Respect your patients' time by maintaining an efficient schedule. If delays are unavoidable, communicate proactively and offer alternatives such as rescheduling or providing updates on wait times.</p>
      
      <h2>5. Personalize the Experience</h2>
      <p>Remember personal details about your patients and their preferences. Use patient management software to track important information and create personalized treatment experiences that make patients feel valued.</p>
    `,
		author: "Dr. Sarah Johnson",
		date: "2024-01-15",
		category: "Patient Care",
		image:
			"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "5 min read",
	},
	{
		id: 2,
		title: "The Complete Guide to HIPAA Compliance for Dental Practices",
		excerpt:
			"Everything you need to know about maintaining HIPAA compliance in your dental practice, from patient records to digital communications.",
		content: `
      <p>HIPAA compliance is not optional for dental practices—it's a legal requirement that protects patient privacy and your practice from costly violations. Understanding and implementing proper HIPAA protocols is essential for every dental professional.</p>
      
      <h2>Understanding HIPAA Basics</h2>
      <p>The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for protecting patient health information. For dental practices, this means implementing safeguards for both physical and electronic protected health information (PHI).</p>
      
      <h2>Physical Safeguards</h2>
      <p>Secure your physical environment by controlling access to areas where PHI is stored or accessed. This includes locking file cabinets, securing computer workstations, and ensuring patient information is not visible to unauthorized individuals.</p>
      
      <h2>Administrative Safeguards</h2>
      <p>Develop comprehensive policies and procedures for handling PHI. Train all staff members on HIPAA requirements and conduct regular security assessments to identify potential vulnerabilities.</p>
      
      <h2>Technical Safeguards</h2>
      <p>Implement technical controls such as access controls, audit logs, and encryption for electronic PHI. Ensure your practice management software is HIPAA-compliant and regularly update security measures.</p>
    `,
		author: "Michael Chen",
		date: "2024-01-12",
		category: "Compliance",
		image:
			"https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "8 min read",
	},
	{
		id: 3,
		title: "Digital Transformation in Dentistry: A Complete Guide",
		excerpt:
			"Learn how digital technologies are revolutionizing dental practices and how to successfully implement them in your clinic.",
		content: `
			<p>The dental industry is experiencing a digital revolution that's transforming how practices operate, treat patients, and manage their business. From digital imaging to AI-powered diagnostics, technology is reshaping every aspect of dental care.</p>

			<h2>The Current State of Digital Dentistry</h2>
			<p>Digital dentistry encompasses a wide range of technologies including digital radiography, CAD/CAM systems, 3D printing, and practice management software. These tools are no longer luxury items—they're becoming essential for competitive practices.</p>

			<h2>Key Digital Technologies for Dental Practices</h2>
			<p><strong>Digital Imaging:</strong> Digital X-rays provide instant results with reduced radiation exposure. Intraoral cameras help patients visualize their oral health and understand treatment needs.</p>

			<p><strong>Practice Management Software:</strong> Comprehensive systems that handle scheduling, billing, patient records, and communication in one integrated platform.</p>

			<p><strong>CAD/CAM Technology:</strong> Computer-aided design and manufacturing systems enable same-day crowns, bridges, and other restorations.</p>

			<h2>Implementation Strategy</h2>
			<p>Start with essential technologies that provide immediate ROI, such as digital radiography and practice management software. Gradually expand to more advanced systems as your team becomes comfortable with digital workflows.</p>

			<h2>Staff Training and Adoption</h2>
			<p>Successful digital transformation requires comprehensive staff training and change management. Invest in proper training programs and allow time for your team to adapt to new technologies.</p>

			<h2>Patient Benefits</h2>
			<p>Digital technologies improve patient experience through faster treatment times, better diagnostic accuracy, and enhanced communication. Patients appreciate the convenience and quality improvements that digital dentistry provides.</p>
		`,
		author: "Dr. Emily Rodriguez",
		date: "2024-01-10",
		category: "Technology",
		image:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "7 min read",
	},
	{
		id: 4,
		title: "Building a Successful Dental Team: Hiring and Retention Strategies",
		excerpt:
			"Discover proven methods for recruiting top talent and creating a positive workplace culture that retains excellent team members.",
		content: `
			<p>Your dental team is the backbone of your practice's success. Building and maintaining a skilled, motivated team requires strategic planning, effective leadership, and a commitment to creating an exceptional workplace culture.</p>

			<h2>Defining Your Ideal Team Member</h2>
			<p>Before hiring, clearly define the skills, experience, and personality traits that align with your practice values. Consider both technical competencies and soft skills like communication, empathy, and teamwork.</p>

			<h2>Effective Recruitment Strategies</h2>
			<p><strong>Professional Networks:</strong> Leverage dental associations, continuing education events, and professional referrals to find qualified candidates.</p>

			<p><strong>Online Platforms:</strong> Use specialized dental job boards and professional social media platforms to reach a wider pool of candidates.</p>

			<p><strong>Employee Referrals:</strong> Implement a referral program that incentivizes current team members to recommend qualified candidates.</p>

			<h2>The Interview Process</h2>
			<p>Develop a structured interview process that evaluates both technical skills and cultural fit. Include practical assessments and scenario-based questions to gauge problem-solving abilities.</p>

			<h2>Onboarding for Success</h2>
			<p>Create a comprehensive onboarding program that introduces new hires to your practice culture, systems, and expectations. Assign mentors and provide clear training schedules.</p>

			<h2>Retention Strategies</h2>
			<p>Retain top talent through competitive compensation, professional development opportunities, recognition programs, and work-life balance initiatives. Regular feedback and career planning discussions are essential.</p>

			<h2>Creating a Positive Culture</h2>
			<p>Foster open communication, celebrate achievements, and address conflicts promptly. A positive workplace culture attracts quality candidates and reduces turnover.</p>
		`,
		author: "Dr. Mark Thompson",
		date: "2024-01-08",
		category: "Practice Management",
		image:
			"https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "6 min read",
	},
	{
		id: 5,
		title: "Maximizing Insurance Reimbursements: A Dental Practice Guide",
		excerpt:
			"Learn effective strategies to optimize insurance claim processing and maximize reimbursements for your dental practice.",
		content: `
			<p>Insurance reimbursements represent a significant portion of most dental practices' revenue. Optimizing your insurance processes can dramatically improve cash flow and reduce administrative burden.</p>

			<h2>Understanding Insurance Fundamentals</h2>
			<p>Familiarize yourself with different insurance plan types, coverage limitations, and reimbursement schedules. Stay updated on policy changes and new regulations that affect dental benefits.</p>

			<h2>Pre-Authorization Best Practices</h2>
			<p>Submit pre-authorizations for major treatments to avoid claim denials. Include comprehensive documentation, radiographs, and detailed treatment plans to support your requests.</p>

			<h2>Accurate Coding and Documentation</h2>
			<p>Use current CDT codes accurately and provide detailed clinical notes that justify the necessity of treatments. Proper documentation is crucial for claim approval and audit protection.</p>

			<h2>Claim Submission Strategies</h2>
			<p><strong>Electronic Claims:</strong> Submit claims electronically for faster processing and reduced errors. Most insurance companies process electronic claims within 14-21 days.</p>

			<p><strong>Batch Processing:</strong> Submit claims in batches to improve efficiency and track submission patterns more effectively.</p>

			<h2>Managing Claim Denials</h2>
			<p>Develop a systematic approach to handling denials. Review denial reasons, gather additional documentation if needed, and submit appeals promptly within the specified timeframes.</p>

			<h2>Patient Communication</h2>
			<p>Educate patients about their insurance benefits and limitations. Provide clear estimates and discuss payment options before treatment to avoid misunderstandings.</p>

			<h2>Technology Solutions</h2>
			<p>Invest in practice management software with robust insurance features, including eligibility verification, claim tracking, and automated follow-up capabilities.</p>
		`,
		author: "Jennifer Walsh, RDH",
		date: "2024-01-05",
		category: "Financial Management",
		image:
			"https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "8 min read",
	},
	{
		id: 6,
		title: "Preventive Care Marketing: Educating Patients for Better Outcomes",
		excerpt:
			"Effective strategies for promoting preventive dental care and building long-term patient relationships through education.",
		content: `
			<p>Preventive care is the foundation of excellent oral health and a sustainable dental practice. Educating patients about the importance of prevention not only improves their health outcomes but also builds trust and loyalty.</p>

			<h2>The Business Case for Prevention</h2>
			<p>Preventive care generates consistent revenue, reduces emergency appointments, and creates satisfied patients who refer others. It's more cost-effective for patients and more predictable for practices.</p>

			<h2>Patient Education Strategies</h2>
			<p><strong>Visual Communication:</strong> Use intraoral cameras, models, and educational videos to help patients understand their oral health status and treatment needs.</p>

			<p><strong>Written Materials:</strong> Provide take-home brochures and care instructions that reinforce verbal education and serve as ongoing reminders.</p>

			<h2>Technology-Enhanced Education</h2>
			<p>Leverage digital tools like patient education software, mobile apps, and online resources to provide interactive learning experiences that engage patients.</p>

			<h2>Recall System Optimization</h2>
			<p>Implement automated recall systems that send timely reminders via email, text, or phone calls. Personalize messages based on individual patient needs and preferences.</p>

			<h2>Preventive Care Packages</h2>
			<p>Create attractive preventive care packages that bundle services like cleanings, exams, and fluoride treatments. This approach simplifies decision-making for patients and ensures comprehensive care.</p>

			<h2>Community Outreach</h2>
			<p>Participate in community health fairs, school programs, and local events to promote oral health awareness and establish your practice as a trusted healthcare resource.</p>

			<h2>Measuring Success</h2>
			<p>Track key metrics like recall compliance rates, preventive treatment acceptance, and patient retention to evaluate the effectiveness of your education efforts.</p>
		`,
		author: "Dr. Lisa Park",
		date: "2024-01-03",
		category: "Patient Education",
		image:
			"https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		readTime: "6 min read",
	}
];

interface BlogPostPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { id } = await params;
	const post = blogPosts.find((p) => p.id === Number.parseInt(id));

	if (!post) {
		return {
			title: "Post Not Found - DentalCloud Blog",
		};
	}

	return {
		title: `${post.title} - DentalCloud Blog`,
		description: post.excerpt,
		keywords: `dental practice, ${post.category.toLowerCase()}, dental management`,
		openGraph: {
			title: post.title,
			description: post.excerpt,
			type: "article",
			images: [post.image],
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { id } = await params;
	const post = blogPosts.find((p) => p.id === Number.parseInt(id));

	if (!post) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-gray-800 border-b bg-gray-900/95 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center">
							<CognidentTextLogo logoSize={32} className="text-white" />
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
							<Link href="/blog" className="font-medium text-white">
								Blog
							</Link>
							<Link
								href="/#contact"
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

			{/* Back to Blog */}
			<div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
				<Link
					href="/blog"
					className="inline-flex items-center text-blue-400 transition-colors hover:text-blue-300"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Blog
				</Link>
			</div>

			{/* Article Header */}
			<article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<header className="mb-8">
					<div className="mb-4">
						<span className="rounded-full bg-blue-600 px-3 py-1 font-medium text-sm text-white">
							{post.category}
						</span>
					</div>
					<h1 className="mb-6 font-bold text-4xl leading-tight lg:text-5xl">
						{post.title}
					</h1>
					<div className="flex flex-wrap items-center justify-between gap-4 text-gray-400">
						<div className="flex items-center space-x-6">
							<div className="flex items-center">
								<User className="mr-2 h-4 w-4" />
								<span>{post.author}</span>
							</div>
							<div className="flex items-center">
								<Calendar className="mr-2 h-4 w-4" />
								<span>{new Date(post.date).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center">
								<BookOpen className="mr-2 h-4 w-4" />
								<span>{post.readTime}</span>
							</div>
						</div>
						<button className="flex items-center text-blue-400 transition-colors hover:text-blue-300">
							<Share2 className="mr-2 h-4 w-4" />
							Share
						</button>
					</div>
				</header>

				{/* Featured Image */}
				<div className="mb-8 overflow-hidden rounded-lg">
					<img
						src={post.image}
						alt={post.title}
						className="h-64 w-full object-cover lg:h-96"
					/>
				</div>

				{/* Article Content */}
				<div
					className="prose prose-lg prose-invert max-w-none"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				{/* Article Footer */}
				<footer className="mt-12 border-gray-800 border-t pt-8">
					<div className="flex items-center justify-between">
						<div className="text-gray-400">
							<p>
								Written by{" "}
								<span className="font-medium text-white">{post.author}</span>
							</p>
						</div>
						<button className="flex items-center text-blue-400 transition-colors hover:text-blue-300">
							<Share2 className="mr-2 h-4 w-4" />
							Share this article
						</button>
					</div>
				</footer>
			</article>

			{/* Related Articles */}
			<section className="bg-gray-800/50 py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h2 className="mb-8 text-center font-bold text-3xl">
						Related Articles
					</h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{blogPosts
							.filter((p) => p.id !== post.id)
							.slice(0, 3)
							.map((relatedPost) => (
								<article
									key={relatedPost.id}
									className="group overflow-hidden rounded-lg bg-gray-800 transition-colors hover:bg-gray-700"
								>
									<div className="relative h-48 overflow-hidden">
										<img
											src={relatedPost.image}
											alt={relatedPost.title}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="p-6">
										<h3 className="mb-3 font-semibold text-xl transition-colors group-hover:text-blue-400">
											<Link href={`/blog/${relatedPost.id}`}>
												{relatedPost.title}
											</Link>
										</h3>
										<p className="mb-4 line-clamp-2 text-gray-300">
											{relatedPost.excerpt}
										</p>
										<div className="flex items-center text-gray-400 text-sm">
											<span>{relatedPost.readTime}</span>
										</div>
									</div>
								</article>
							))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-gray-800 border-t bg-gray-900 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center">
								<CognidentTextLogo logoSize={32} className="text-white" />
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
										href="/api"
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
						<p>&copy; 2024 Cognident. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
