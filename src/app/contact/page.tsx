"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LiveAgentChatbot } from "@/components/chat/live-agent-chatbot";
import {
	Clock,
	Mail,
	MapPin,
	Phone,
	Send,
	MessageSquare,
	Users,
	Headphones,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSubmitted(true);
			} else {
				throw new Error('Failed to send message');
			}
		} catch (error) {
			console.error('Error sending message:', error);
			alert('Failed to send message. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
		setFormData({
			name: "",
			email: "",
			company: "",
			subject: "",
			message: "",
		});
	};

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
								href="/contact"
								className="text-blue-600 transition-colors hover:text-blue-700"
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
						Get in Touch with Cognident
					</h1>
					<p className="mb-8 text-blue-100 text-xl">
						Have questions about our dental practice management software? We're
						here to help you transform your practice.
					</p>
				</div>
			</section>

			{/* Contact Methods */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 md:grid-cols-3">
						<div className="rounded-lg border border-gray-700 bg-white p-6 text-center">
							<Phone className="mx-auto mb-4 h-12 w-12 text-blue-600" />
							<h3 className="mb-2 font-semibold text-xl">Call Us</h3>
							<p className="mb-4 text-gray-600">
								Speak with our dental technology experts
							</p>
							<p className="font-semibold text-blue-600">1-800-COGNIDENT</p>
							<p className="text-gray-600 text-sm">(1-800-264-6433)</p>
						</div>

						<div className="rounded-lg border border-gray-700 bg-white p-6 text-center">
							<Mail className="mx-auto mb-4 h-12 w-12 text-blue-600" />
							<h3 className="mb-2 font-semibold text-xl">Email Us</h3>
							<p className="mb-4 text-gray-600">
								Get detailed answers to your questions
							</p>
							<p className="font-semibold text-blue-600">hello@cognident.org</p>
							<p className="text-gray-600 text-sm">We respond within 24 hours</p>
						</div>

						<div className="rounded-lg border border-gray-700 bg-white p-6 text-center">
							<MessageSquare className="mx-auto mb-4 h-12 w-12 text-blue-600" />
							<h3 className="mb-2 font-semibold text-xl">Live Chat</h3>
							<p className="mb-4 text-gray-600">
								Chat with our support team in real-time
							</p>
							<Button className="bg-blue-600 hover:bg-blue-700">
								Start Chat
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form & Office Info */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-12 lg:grid-cols-2">
						{/* Contact Form */}
						<div>
							<h2 className="mb-6 font-bold text-3xl">Send us a Message</h2>
							{submitted ? (
								<div className="rounded-lg border border-green-600 bg-green-900/20 p-6">
									<h3 className="mb-2 font-semibold text-green-400">
										Message Sent Successfully!
									</h3>
									<p className="text-green-300">
										Thank you for contacting us. We'll get back to you within 24
										hours.
									</p>
								</div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<label
												htmlFor="name"
												className="mb-2 block font-medium text-sm"
											>
												Full Name *
											</label>
											<Input
												id="name"
												name="name"
												type="text"
												required
												value={formData.name}
												onChange={handleInputChange}
												className="bg-white border-gray-600 text-gray-900"
												placeholder="Your full name"
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className="mb-2 block font-medium text-sm"
											>
												Email Address *
											</label>
											<Input
												id="email"
												name="email"
												type="email"
												required
												value={formData.email}
												onChange={handleInputChange}
												className="bg-white border-gray-600 text-gray-900"
												placeholder="your@email.com"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="company"
											className="mb-2 block font-medium text-sm"
										>
											Practice/Company Name
										</label>
										<Input
											id="company"
											name="company"
											type="text"
											value={formData.company}
											onChange={handleInputChange}
											className="bg-white border-gray-600 text-gray-900"
											placeholder="Your dental practice name"
										/>
									</div>

									<div>
										<label
											htmlFor="subject"
											className="mb-2 block font-medium text-sm"
										>
											Subject *
										</label>
										<Input
											id="subject"
											name="subject"
											type="text"
											required
											value={formData.subject}
											onChange={handleInputChange}
											className="bg-white border-gray-600 text-gray-900"
											placeholder="What can we help you with?"
										/>
									</div>

									<div>
										<label
											htmlFor="message"
											className="mb-2 block font-medium text-sm"
										>
											Message *
										</label>
										<Textarea
											id="message"
											name="message"
											required
											rows={6}
											value={formData.message}
											onChange={handleInputChange}
											className="bg-white border-gray-600 text-gray-900"
											placeholder="Tell us more about your needs..."
										/>
									</div>

									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-blue-600 hover:bg-blue-700"
									>
										{isSubmitting ? (
											"Sending..."
										) : (
											<>
												<Send className="mr-2 h-4 w-4" />
												Send Message
											</>
										)}
									</Button>
								</form>
							)}
						</div>

						{/* Office Information */}
						<div>
							<h2 className="mb-6 font-bold text-3xl">Visit Our Office</h2>
							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<MapPin className="mt-1 h-6 w-6 text-blue-600" />
									<div>
										<h3 className="mb-1 font-semibold">Headquarters</h3>
										<p className="text-gray-600">
											222 E Van Buren St.
											<br />
											Harlingen, TX  78550
											<br />
											United States
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<Clock className="mt-1 h-6 w-6 text-blue-600" />
									<div>
										<h3 className="mb-1 font-semibold">Business Hours</h3>
										<p className="text-gray-600">
											Monday - Friday: 8:00 AM - 6:00 PM PST
											<br />
											Saturday: 9:00 AM - 2:00 PM PST
											<br />
											Sunday: Closed
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<Headphones className="mt-1 h-6 w-6 text-blue-600" />
									<div>
										<h3 className="mb-1 font-semibold">Support Hours</h3>
										<p className="text-gray-600">
											24/7 Emergency Support
											<br />
											Live Chat: Monday - Friday 8 AM - 8 PM PST
											<br />
											Phone Support: Monday - Friday 8 AM - 6 PM PST
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<Users className="mt-1 h-6 w-6 text-blue-600" />
									<div>
										<h3 className="mb-1 font-semibold">Sales Team</h3>
										<p className="text-gray-600">
											Schedule a personalized demo
											<br />
											<span className="text-blue-600">sales@cognident.org</span>
											<br />
											1-800-COGNIDENT ext. 1
										</p>
									</div>
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

			{/* Live Agent Chatbot */}
			<LiveAgentChatbot />
		</div>
	);
}
