"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { Calendar, FileText, Phone, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeSignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Redirect to employee dashboard
		window.location.href = "/dashboard/employee";
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Left Panel - Sign In Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-50 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="mb-6 flex items-center justify-center">
							<ToothIcon className="mr-3 h-10 w-10 text-blue-600" />
							<span className="font-bold text-3xl text-gray-900">Cognident</span>
						</div>
						<h2 className="mb-2 font-bold text-2xl text-gray-900">
							Employee Portal
						</h2>
						<p className="text-gray-600">
							Access your work dashboard and patient management tools.
						</p>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-xl">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="mb-2 block font-medium text-gray-300 text-sm"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your email"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="mb-2 block font-medium text-gray-300 text-sm"
								>
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your password"
									required
								/>
							</div>
							<button
								type="submit"
								className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-gray-900 transition duration-200 hover:bg-blue-700"
							>
								Sign In to Employee Portal
							</button>
						</form>
					</div>

					<div className="mt-6 text-center">
						<p className="text-gray-600 text-sm">
							Need access?{" "}
							<Link
								href="/contact"
								className="font-medium text-blue-600 hover:text-blue-700"
							>
								Contact Administrator
							</Link>
						</p>
						<div className="mt-4 space-y-2">
							<Link
								href="/auth/dentist/signin"
								className="block text-gray-600 text-sm transition-colors hover:text-gray-900"
							>
								Dentist Portal →
							</Link>
							<Link
								href="/auth/patient/signin"
								className="block text-gray-600 text-sm transition-colors hover:text-gray-900"
							>
								Patient Portal →
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Office Background */}
			<div className="relative hidden lg:flex lg:w-1/2">
				<div
					className="absolute inset-0 bg-center bg-cover bg-no-repeat"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80')`,
					}}
				/>
				<div className="relative z-10 flex flex-col justify-center p-12 text-gray-900">
					<div className="max-w-md">
						<h1 className="mb-4 font-bold text-4xl">Employee Dashboard</h1>

						<p className="mb-8 text-gray-200 text-xl">
							Manage appointments, patient communications, and daily operations
							efficiently.
						</p>

						<div className="space-y-6">
							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Calendar className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Appointment Management
									</h3>
									<p className="text-gray-300">
										Schedule, modify, and track patient appointments
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Users className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Patient Communication
									</h3>
									<p className="text-gray-300">
										Handle patient inquiries and appointment confirmations
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Phone className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Front Desk Operations
									</h3>
									<p className="text-gray-300">
										Check-in patients and manage daily workflow
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
