"use client";

import { Calendar, Eye, EyeOff, FileText, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
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
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/practice/login", {
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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	return (
		<div className="flex min-h-screen">
			{/* Left Panel - Features */}
			<div className="hidden flex-col justify-center bg-slate-800 p-12 text-white lg:flex lg:w-1/2">
				<div className="max-w-md">
					<div className="mb-8 flex items-center">
						<Heart className="mr-3 h-8 w-8 text-white" />
						<span className="font-bold text-2xl">DentalCloud</span>
					</div>

					<h1 className="mb-4 font-bold text-3xl">
						Next-Gen Dental Practice Management
					</h1>

					<p className="mb-8 text-slate-300">
						HIPAA-compliant cloud platform with AI-powered insights, smart
						scheduling, and seamless patient care.
					</p>

					<div className="space-y-6">
						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
								<Calendar className="h-4 w-4" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold">Smart Scheduling</h3>
								<p className="text-slate-300 text-sm">
									AI-powered appointment optimization and automated reminders
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
								<FileText className="h-4 w-4" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold">Digital Charting</h3>
								<p className="text-slate-300 text-sm">
									Interactive odontogram with real-time collaboration
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
								<Shield className="h-4 w-4" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold">HIPAA Compliant</h3>
								<p className="text-slate-300 text-sm">
									Enterprise-grade security and data protection
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Sign In Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<h2 className="mb-2 font-bold text-2xl text-gray-900">
							Welcome back
						</h2>
						<p className="text-gray-600">
							Sign in to your dental practice account.
						</p>
					</div>

					{error && (
						<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center pr-3"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-400" />
									) : (
										<Eye className="h-4 w-4 text-gray-400" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="rememberMe"
									type="checkbox"
									checked={formData.rememberMe}
									onChange={handleInputChange}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-gray-700 text-sm"
								>
									Remember me
								</label>
							</div>
							<Link
								href="/auth/forgot-password"
								className="text-blue-600 text-sm hover:text-blue-500"
							>
								Forgot password?
							</Link>
						</div>

						{!requiresTwoFactor ? (
							<button
								type="submit"
								disabled={isLoading}
								className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2.5 font-medium text-sm text-white shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isLoading ? "Signing in..." : "Sign In"}
							</button>
						) : (
							<div className="space-y-4">
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
										className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter 6-digit code"
										maxLength={6}
									/>
									<p className="mt-1 text-gray-500 text-sm">
										Enter the 6-digit code from your authenticator app
									</p>
								</div>
								<button
									type="submit"
									disabled={isLoading}
									className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2.5 font-medium text-sm text-white shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isLoading ? "Verifying..." : "Verify Code"}
								</button>
							</div>
						)}
					</form>

					<div className="mt-6">
						<p className="text-center text-gray-600 text-sm">
							Need to create an account?{" "}
							<Link
								href="/auth/signup"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Start Free Trial
							</Link>
						</p>
					</div>

					<div className="mt-8 border-gray-200 border-t pt-6">
						<p className="text-center text-gray-500 text-xs">
							Are you a patient?{" "}
							<Link
								href="/patient/auth/signin"
								className="text-blue-600 hover:text-blue-500"
							>
								Access Patient Portal
							</Link>
						</p>
					</div>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-gray-300 border-t" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-gray-50 px-2 text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-4 grid grid-cols-2 gap-3">
							<button
								type="button"
								className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-500 text-sm shadow-sm hover:bg-gray-50"
							>
								<svg
									className="h-5 w-5"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Google logo"
								>
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								<span className="ml-2">Google</span>
							</button>

							<button
								type="button"
								className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-500 text-sm shadow-sm hover:bg-gray-50"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Microsoft logo"
								>
									<path d="M23.5 12.5c0-6.9-5.6-12.5-12.5-12.5S-1.5 5.6-1.5 12.5 4.1 25 11 25c3.2 0 6.2-1.2 8.5-3.5l-3.5-3.5c-1.4 1.4-3.3 2.2-5 2.2-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7h-7v4h11.5z" />
								</svg>
								<span className="ml-2">Microsoft</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
