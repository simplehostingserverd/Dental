"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PatientSignInPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
	const [twoFactorToken, setTwoFactorToken] = useState("");

	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/patient/dashboard";

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/patient/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					twoFactorToken: requiresTwoFactor ? twoFactorToken : undefined,
				}),
			});

			const data = await response.json();

			if (data.success) {
				router.push(callbackUrl);
			} else if (data.requiresTwoFactor) {
				setRequiresTwoFactor(true);
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
		<div className="flex min-h-screen">
			{/* Left Panel - Marketing Content */}
			<div className="hidden flex-col justify-center bg-blue-600 p-12 text-white lg:flex lg:w-1/2">
				<div className="max-w-md">
					<div className="mb-8 flex items-center">
						<HeaderLogo className="text-white" />
					</div>
					<h2 className="mb-6 font-bold text-3xl">
						Welcome back to your dental care portal
					</h2>
					<p className="mb-8 text-blue-100 text-lg">
						Access your appointments, treatment history, and communicate with
						your dental team.
					</p>
					<div className="space-y-4">
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">✓</span>
							</div>
							<span>View upcoming appointments</span>
						</div>
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">✓</span>
							</div>
							<span>Access treatment history</span>
						</div>
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">✓</span>
							</div>
							<span>Secure messaging with your dental team</span>
						</div>
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">✓</span>
							</div>
							<span>Online appointment booking</span>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Login Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<h2 className="font-bold text-2xl text-gray-900">
							Patient Sign In
						</h2>
						<p className="mt-2 text-gray-600 text-sm">
							Access your dental care portal
						</p>
					</div>

					{error && (
						<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{!requiresTwoFactor ? (
							<>
								{/* Email Field */}
								<div>
									<label
										htmlFor="email"
										className="mb-1 block font-medium text-gray-700 text-sm"
									>
										Email Address
									</label>
									<div className="relative">
										<Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
										<input
											id="email"
											name="email"
											type="email"
											required
											value={formData.email}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
											placeholder="Enter your email"
										/>
									</div>
								</div>

								{/* Password Field */}
								<div>
									<label
										htmlFor="password"
										className="mb-1 block font-medium text-gray-700 text-sm"
									>
										Password
									</label>
									<div className="relative">
										<Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
										<input
											id="password"
											name="password"
											type={showPassword ? "text" : "password"}
											required
											value={formData.password}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
											placeholder="Enter your password"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								{/* Remember Me & Forgot Password */}
								<div className="flex items-center justify-between">
									<label className="flex items-center">
										<input
											name="rememberMe"
											type="checkbox"
											checked={formData.rememberMe}
											onChange={handleInputChange}
											className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<span className="text-gray-700 text-sm">Remember me</span>
									</label>
									<Link
										href="/patient/auth/forgot-password"
										className="text-blue-600 text-sm hover:text-blue-500"
									>
										Forgot password?
									</Link>
								</div>
							</>
						) : (
							/* Two-Factor Authentication */
							<div>
								<label
									htmlFor="twoFactorToken"
									className="mb-1 block font-medium text-gray-700 text-sm"
								>
									Two-Factor Authentication Code
								</label>
								<input
									id="twoFactorToken"
									name="twoFactorToken"
									type="text"
									required
									value={twoFactorToken}
									onChange={(e) => setTwoFactorToken(e.target.value)}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									placeholder="Enter 6-digit code"
									maxLength={6}
								/>
								<p className="mt-1 text-gray-500 text-xs">
									Enter the 6-digit code from your authenticator app
								</p>
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					{/* Sign Up Link */}
					<div className="mt-6 text-center">
						<p className="text-gray-600 text-sm">
							Don't have an account?{" "}
							<Link
								href="/patient/auth/signup"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign up here
							</Link>
						</p>
					</div>

					{/* Practice Portal Link */}
					<div className="mt-4 text-center">
						<p className="text-gray-500 text-xs">
							Are you a dental professional?{" "}
							<Link
								href="/auth/signin"
								className="text-blue-600 hover:text-blue-500"
							>
								Practice Portal
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
