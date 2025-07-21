"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { Calendar, Clock, CreditCard, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PatientSignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Redirect to patient dashboard
		window.location.href = "/patient/dashboard";
	};

	return (
		<div className="flex min-h-screen bg-gray-900">
			{/* Left Panel - Sign In Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-900 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="mb-6 flex items-center justify-center">
							<ToothIcon className="mr-3 h-10 w-10 text-blue-400" />
							<span className="font-bold text-3xl text-white">Cognident</span>
						</div>
						<h2 className="mb-2 font-bold text-2xl text-white">
							Patient Portal
						</h2>
						<p className="text-gray-400">
							Access your dental records and appointments.
						</p>
					</div>

					<div className="rounded-lg bg-gray-800 p-6 shadow-xl">
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
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
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
									className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your password"
									required
								/>
							</div>
							<button
								type="submit"
								className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
							>
								Sign In to Patient Portal
							</button>
						</form>
					</div>

					<div className="mt-6 text-center">
						<p className="text-gray-400 text-sm">
							Don't have an account?{" "}
							<Link
								href="/auth/patient/signup"
								className="font-medium text-blue-400 hover:text-blue-300"
							>
								Register here
							</Link>
						</p>
						<div className="mt-4 space-y-2">
							<Link
								href="/auth/dentist/signin"
								className="block text-gray-400 text-sm transition-colors hover:text-white"
							>
								Dentist Portal →
							</Link>
							<Link
								href="/auth/employee/signin"
								className="block text-gray-400 text-sm transition-colors hover:text-white"
							>
								Employee Portal →
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Patient Care Background */}
			<div className="relative hidden lg:flex lg:w-1/2">
				<div
					className="absolute inset-0 bg-center bg-cover bg-no-repeat"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80')`,
					}}
				/>
				<div className="relative z-10 flex flex-col justify-center p-12 text-white">
					<div className="max-w-md">
						<h1 className="mb-4 font-bold text-4xl">
							Your Health, Our Priority
						</h1>

						<p className="mb-8 text-gray-200 text-xl">
							Access your dental records, schedule appointments, and manage your
							oral health journey.
						</p>

						<div className="space-y-6">
							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Calendar className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Easy Scheduling
									</h3>
									<p className="text-gray-300">
										Book, reschedule, or cancel appointments online 24/7
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<FileText className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Medical Records
									</h3>
									<p className="text-gray-300">
										View your treatment history and upcoming procedures
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<CreditCard className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Billing & Insurance
									</h3>
									<p className="text-gray-300">
										Manage payments and insurance claims seamlessly
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
