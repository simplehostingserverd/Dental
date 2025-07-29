"use client";

import { LargeLogo } from "@/components/ui/tooth-logo";
import { Calendar, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Get default redirect path based on user type and role
 * This is a fallback - the smart login API will provide the correct redirect URL
 */
function getDefaultRedirectPath(userType: string, role?: string): string {
	if (userType === "patient") {
		return "/dashboard/patient";
	} else {
		const userRole = role?.toLowerCase();
		switch (userRole) {
			case "dentist":
				return "/dashboard/dentist";
			case "receptionist":
				return "/dashboard/receptionist";
			case "admin":
				return "/dashboard";
			default:
				return "/dashboard";
		}
	}
}

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/smart-login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const data = await response.json();

			if (data.success) {
				// Use the redirect URL provided by the API
				const redirectPath =
					data.redirectUrl ||
					getDefaultRedirectPath(data.userType, data.user?.role);
				router.push(redirectPath);
			} else {
				setError(data.error || "Login failed");
			}
		} catch (error) {
			setError("An error occurred during login");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-900">
			{/* Left Panel - Sign In Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-800 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="mb-6 flex items-center justify-center">
							<LargeLogo className="text-blue-500" />
						</div>
						<h2 className="mb-2 font-bold text-2xl text-white">Welcome back</h2>
						<p className="text-gray-300">Sign in to your Cognident account.</p>
					</div>

					<div className="rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-lg">
						{error && (
							<div className="mb-4 rounded-md border border-red-700 bg-red-900/50 p-3">
								<p className="text-red-200 text-sm">{error}</p>
							</div>
						)}

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
									required
									disabled={isLoading}
									className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
									placeholder="Enter your email"
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
									required
									disabled={isLoading}
									className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
									placeholder="Enter your password"
								/>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isLoading ? "Signing In..." : "Sign In"}
							</button>
						</form>
					</div>

					<div className="mt-6 text-center">
						<p className="text-gray-400 text-sm">
							Don't have an account?{" "}
							<Link
								href="/auth/signup"
								className="font-medium text-blue-400 hover:text-blue-300"
							>
								Sign up here
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Dental Office Background */}
			<div className="relative hidden lg:flex lg:w-1/2">
				<div
					className="absolute inset-0 bg-center bg-cover bg-no-repeat"
					style={{
						backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.9)), url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80')`,
					}}
				/>
				<div className="relative z-10 flex flex-col justify-center p-12 text-white">
					<div className="max-w-md">
						<h1 className="mb-4 font-bold text-4xl">
							Next-Gen Dental Practice Management
						</h1>

						<p className="mb-8 text-gray-200 text-xl">
							HIPAA-compliant cloud platform with AI-powered insights, smart
							scheduling, and seamless patient care.
						</p>

						<div className="space-y-6">
							<div className="flex items-start">
								<div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-sm">
									<Calendar className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-lg">
										Smart Scheduling
									</h3>
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
									<h3 className="mb-1 font-semibold text-lg">
										Digital Charting
									</h3>
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
									<h3 className="mb-1 font-semibold text-lg">
										HIPAA Compliant
									</h3>
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
