"use client";

import { Calendar, FileText, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DentistSignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Redirect to dentist dashboard
		window.location.href = "/dashboard/dentist";
	};

	return (
		<div className="flex min-h-screen bg-gray-900">
			{/* Left Panel - Sign In Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-900 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="mb-6 flex items-center justify-center">
							<Heart className="mr-3 h-10 w-10 text-blue-400" />
							<span className="font-bold text-3xl text-white">Cognident</span>
						</div>
						<h2 className="mb-2 font-bold text-2xl text-white">
							Dentist Portal
						</h2>
						<p className="text-gray-400">
							Access your practice management dashboard.
						</p>
					</div>
					
					<div className="rounded-lg bg-gray-800 p-6 shadow-xl">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter your email"
									required
								/>
							</div>
							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter your password"
									required
								/>
							</div>
							<button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
							>
								Sign In to Dentist Portal
							</button>
						</form>
					</div>
					
					<div className="mt-6 text-center">
						<p className="text-gray-400 text-sm">
							Need access?{" "}
							<Link
								href="/contact"
								className="font-medium text-blue-400 hover:text-blue-300"
							>
								Contact Administrator
							</Link>
						</p>
						<div className="mt-4 space-y-2">
							<Link
								href="/auth/patient/signin"
								className="block text-gray-400 hover:text-white text-sm transition-colors"
							>
								Patient Portal →
							</Link>
							<Link
								href="/auth/employee/signin"
								className="block text-gray-400 hover:text-white text-sm transition-colors"
							>
								Employee Portal →
							</Link>
						</div>
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
							Dentist Dashboard
						</h1>

						<p className="mb-8 text-xl text-gray-200">
							Manage your practice with comprehensive tools for patient care, scheduling, and analytics.
						</p>

						<div className="space-y-6">
							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Calendar className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">Practice Management</h3>
									<p className="text-gray-300">
										Complete overview of appointments, patients, and practice performance
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<FileText className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">Patient Records</h3>
									<p className="text-gray-300">
										Access and manage comprehensive patient treatment histories
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Shield className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">Analytics & Reports</h3>
									<p className="text-gray-300">
										Detailed insights into practice performance and growth opportunities
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
