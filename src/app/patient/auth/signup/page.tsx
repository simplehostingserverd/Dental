"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PatientSignUpPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
		allowMarketing: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState({
		hasMinLength: false,
		hasUppercase: false,
		hasNumber: false,
	});

	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		// Check password strength
		if (name === "password") {
			setPasswordStrength({
				hasMinLength: value.length >= 8,
				hasUppercase: /[A-Z]/.test(value),
				hasNumber: /\d/.test(value),
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (!isPasswordValid) {
			setError("Password does not meet requirements");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/auth/patient/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				// Show success message briefly before redirecting
				setError(""); // Clear any previous errors
				setIsSuccess(true);

				// Small delay to ensure cookie is set and user sees success
				setTimeout(() => {
					router.push("/patient/dashboard");
				}, 1500);
			} else {
				setError(data.error || "An error occurred during signup");
			}
		} catch (error) {
			setError("An error occurred during signup. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const isPasswordValid =
		passwordStrength.hasMinLength &&
		passwordStrength.hasUppercase &&
		passwordStrength.hasNumber;

	return (
		<div className="flex min-h-screen">
			{/* Left Panel - Marketing Content */}
			<div className="hidden flex-col justify-center bg-blue-600 p-12 text-white lg:flex lg:w-1/2">
				<div className="max-w-md">
					<div className="mb-8 flex items-center">
						<HeaderLogo className="text-blue-600" />
						<h1 className="font-bold text-2xl">DentalExpresso</h1>
					</div>
					<h2 className="mb-6 font-bold text-3xl">
						Join thousands of patients managing their dental care online
					</h2>
					<p className="mb-8 text-blue-100 text-lg">
						Create your patient portal account to access appointments, treatment
						history, and more.
					</p>
					<div className="space-y-4">
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<Calendar className="h-4 w-4" />
							</div>
							<span>Book appointments online 24/7</span>
						</div>
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">📋</span>
							</div>
							<span>Access your complete treatment history</span>
						</div>
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">💬</span>
							</div>
							<span>Secure messaging with your dental team</span>
						</div>
						<div className="flex items-center">
							<div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<span className="font-semibold text-sm">🔔</span>
							</div>
							<span>Automatic appointment reminders</span>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Signup Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<h2 className="font-bold text-2xl text-gray-900">
							Create Patient Account
						</h2>
						<p className="mt-2 text-gray-600 text-sm">
							Join your dental practice's patient portal
						</p>
					</div>

					{error && (
						<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}

					{isSuccess && (
						<div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
							<p className="text-green-600 text-sm">
								Account created successfully! Redirecting to your dashboard...
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="mb-1 block font-medium text-gray-700 text-sm"
								>
									First Name
								</label>
								<div className="relative">
									<User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
									<input
										id="firstName"
										name="firstName"
										type="text"
										required
										value={formData.firstName}
										onChange={handleInputChange}
										className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										placeholder="First name"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="lastName"
									className="mb-1 block font-medium text-gray-700 text-sm"
								>
									Last Name
								</label>
								<div className="relative">
									<User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
									<input
										id="lastName"
										name="lastName"
										type="text"
										required
										value={formData.lastName}
										onChange={handleInputChange}
										className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										placeholder="Last name"
									/>
								</div>
							</div>
						</div>

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

						{/* Phone Field */}
						<div>
							<label
								htmlFor="phone"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Phone Number
							</label>
							<div className="relative">
								<Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<input
									id="phone"
									name="phone"
									type="tel"
									required
									value={formData.phone}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									placeholder="(555) 123-4567"
								/>
							</div>
						</div>

						{/* Date of Birth */}
						<div>
							<label
								htmlFor="dateOfBirth"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Date of Birth
							</label>
							<input
								id="dateOfBirth"
								name="dateOfBirth"
								type="date"
								required
								value={formData.dateOfBirth}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
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
									placeholder="Create a password"
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

						{/* Confirm Password Field */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									required
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{/* Password Strength Indicator */}
						{formData.password && (
							<div className="space-y-2">
								<p className="font-medium text-gray-700 text-sm">
									Password Requirements:
								</p>
								<div className="space-y-1">
									<div className="flex items-center">
										<div
											className={`mr-2 h-2 w-2 rounded-full ${
												passwordStrength.hasMinLength
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span
											className={`text-xs ${
												passwordStrength.hasMinLength
													? "text-green-600"
													: "text-gray-500"
											}`}
										>
											At least 8 characters
										</span>
									</div>
									<div className="flex items-center">
										<div
											className={`mr-2 h-2 w-2 rounded-full ${
												passwordStrength.hasUppercase
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span
											className={`text-xs ${
												passwordStrength.hasUppercase
													? "text-green-600"
													: "text-gray-500"
											}`}
										>
											One uppercase letter
										</span>
									</div>
									<div className="flex items-center">
										<div
											className={`mr-2 h-2 w-2 rounded-full ${
												passwordStrength.hasNumber
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span
											className={`text-xs ${
												passwordStrength.hasNumber
													? "text-green-600"
													: "text-gray-500"
											}`}
										>
											One number
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Terms and Conditions */}
						<div className="space-y-3">
							<label className="flex items-start">
								<input
									name="agreeToTerms"
									type="checkbox"
									checked={formData.agreeToTerms}
									onChange={handleInputChange}
									className="mt-0.5 mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									required
								/>
								<span className="text-gray-700 text-sm">
									I agree to the{" "}
									<Link
										href="/terms"
										className="text-blue-600 hover:text-blue-500"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-blue-600 hover:text-blue-500"
									>
										Privacy Policy
									</Link>
								</span>
							</label>
							<label className="flex items-start">
								<input
									name="allowMarketing"
									type="checkbox"
									checked={formData.allowMarketing}
									onChange={handleInputChange}
									className="mt-0.5 mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className="text-gray-700 text-sm">
									I would like to receive appointment reminders and dental
									health tips
								</span>
							</label>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading || !formData.agreeToTerms || !isPasswordValid}
							className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? "Creating Account..." : "Create Patient Account"}
						</button>
					</form>

					{/* Sign In Link */}
					<div className="mt-6 text-center">
						<p className="text-gray-600 text-sm">
							Already have an account?{" "}
							<Link
								href="/patient/auth/signin"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign in here
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
