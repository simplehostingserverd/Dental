"use client";

// Temporarily disable Stack Auth to debug the error
// import { SignUp } from "@stackframe/stack";
import { Calendar, FileText, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		practiceName: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Temporary fallback - just redirect to dashboard
		window.location.href = "/dashboard";
	};
	return (
		<div className="flex min-h-screen bg-gray-900">
			{/* Left Panel - Sign Up Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-900 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="mb-6 flex items-center justify-center">
							<Heart className="mr-3 h-10 w-10 text-blue-400" />
							<span className="font-bold text-3xl text-white">Cognident</span>
						</div>
						<h2 className="mb-2 font-bold text-2xl text-white">
							Create your account
						</h2>
						<p className="text-gray-400">
							Start your free trial of Cognident today.
						</p>
					</div>
					
					<div className="rounded-lg bg-gray-800 p-6 shadow-xl">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
										First Name
									</label>
									<input
										id="firstName"
										name="firstName"
										type="text"
										value={formData.firstName}
										onChange={handleInputChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="John"
										required
									/>
								</div>
								<div>
									<label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
										Last Name
									</label>
									<input
										id="lastName"
										name="lastName"
										type="text"
										value={formData.lastName}
										onChange={handleInputChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Doe"
										required
									/>
								</div>
							</div>

							<div>
								<label htmlFor="practiceName" className="block text-sm font-medium text-gray-300 mb-2">
									Practice Name
								</label>
								<input
									id="practiceName"
									name="practiceName"
									type="text"
									value={formData.practiceName}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Smile Dental Clinic"
									required
								/>
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="john@smiledental.com"
									required
								/>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Create a strong password"
									required
								/>
							</div>

							<div>
								<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Confirm your password"
									required
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
							>
								Create Account
							</button>
						</form>
					</div>
					
					<div className="mt-6 text-center">
						<p className="text-gray-400 text-sm">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="font-medium text-blue-400 hover:text-blue-300"
							>
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Dental Office Background */}
			<div className="hidden lg:flex lg:w-1/2 relative">
				<div 
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80')`
					}}
				/>
				<div className="relative z-10 flex flex-col justify-center p-12 text-white">
					<div className="max-w-md">
						<h1 className="mb-4 font-bold text-4xl">
							Join Thousands of Dental Practices
						</h1>

						<p className="mb-8 text-xl text-gray-200">
							Transform your practice with our comprehensive management platform.
						</p>

						<div className="space-y-6">
							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Calendar className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">Smart Scheduling</h3>
									<p className="text-gray-300">
										AI-powered appointment optimization and automated reminders
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<FileText className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">Digital Charting</h3>
									<p className="text-gray-300">
										Interactive odontogram with real-time collaboration
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Shield className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">HIPAA Compliant</h3>
									<p className="text-gray-300">
										Enterprise-grade security and data protection
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
