"use client";

import { Check, Eye, EyeOff, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		practiceName: "",
		workEmail: "",
		phoneNumber: "",
		practiceSize: "",
		password: "",
		agreeToTerms: false,
		receiveUpdates: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState({
		hasMinLength: false,
		hasUppercase: false,
		hasNumber: false,
	});

	const router = useRouter();

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;

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

		try {
			const response = await fetch("/api/auth/practice/signup", {
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
					router.push("/dashboard");
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
			<div className="hidden flex-col justify-center bg-slate-800 p-12 text-white lg:flex lg:w-1/2">
				<div className="max-w-md">
					<div className="mb-8 flex items-center">
						<Heart className="mr-3 h-8 w-8 text-white" />
						<span className="font-bold text-2xl">DentalCloud</span>
					</div>

					<h1 className="mb-4 font-bold text-4xl">
						Join 5,000+ Dental Practices
					</h1>

					<p className="mb-8 text-slate-300">
						Experience the future of dental practice management with our
						AI-powered platform.
					</p>

					<div className="space-y-6">
						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
								<div className="h-4 w-4 rounded bg-blue-400" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold">AI-Powered Insights</h3>
								<p className="text-slate-300 text-sm">
									Smart analytics and predictive scheduling optimization
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
								<div className="h-4 w-4 rounded bg-green-400" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold">Complete EMR Suite</h3>
								<p className="text-slate-300 text-sm">
									Digital charting, imaging, eRx, and billing in one platform
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
								<div className="h-4 w-4 rounded bg-yellow-400" />
							</div>
							<div>
								<h3 className="mb-1 font-semibold">Lightning Fast</h3>
								<p className="text-slate-300 text-sm">
									3x faster than Dentrix with real-time collaboration
								</p>
							</div>
						</div>
					</div>

					{/* Testimonial */}
					<div className="mt-12 rounded-lg bg-slate-700 p-6">
						<div className="mb-4 flex items-center">
							<div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-600">
								<span className="font-semibold text-sm">SC</span>
							</div>
							<div>
								<div className="font-semibold">Dr. Sarah Chen</div>
								<div className="text-slate-400 text-sm">Family Dentistry</div>
							</div>
						</div>
						<p className="text-slate-300 text-sm">
							"DentalCloud transformed our practice. Patient flow improved 40%
							and our team loves the intuitive interface."
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Signup Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
				<div className="w-full max-w-md">
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
								<input
									id="firstName"
									name="firstName"
									type="text"
									required
									value={formData.firstName}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="John"
								/>
							</div>
							<div>
								<label
									htmlFor="lastName"
									className="mb-1 block font-medium text-gray-700 text-sm"
								>
									Last Name
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									required
									value={formData.lastName}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Smith"
								/>
							</div>
						</div>

						{/* Practice Name */}
						<div>
							<label
								htmlFor="practiceName"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Practice Name
							</label>
							<input
								id="practiceName"
								name="practiceName"
								type="text"
								required
								value={formData.practiceName}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Smith Family Dentistry"
							/>
						</div>

						{/* Work Email */}
						<div>
							<label
								htmlFor="workEmail"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Work Email
							</label>
							<input
								id="workEmail"
								name="workEmail"
								type="email"
								required
								value={formData.workEmail}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="john@smithdentistry.com"
							/>
						</div>

						{/* Phone Number */}
						<div>
							<label
								htmlFor="phoneNumber"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Phone Number
							</label>
							<input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								required
								value={formData.phoneNumber}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="(555) 123-4567"
							/>
						</div>

						{/* Practice Size */}
						<div>
							<label
								htmlFor="practiceSize"
								className="mb-1 block font-medium text-gray-700 text-sm"
							>
								Practice Size
							</label>
							<select
								id="practiceSize"
								name="practiceSize"
								required
								value={formData.practiceSize}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select practice size</option>
								<option value="1-2">1-2 providers</option>
								<option value="3-5">3-5 providers</option>
								<option value="6-10">6-10 providers</option>
								<option value="11-20">11-20 providers</option>
								<option value="21+">21+ providers</option>
							</select>
						</div>

						{/* Password */}
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
									required
									value={formData.password}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Create a secure password"
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

							{/* Password Requirements */}
							<div className="mt-2 space-y-1">
								<div
									className={`flex items-center text-xs ${passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}`}
								>
									<Check
										className={`mr-1 h-3 w-3 ${passwordStrength.hasMinLength ? "text-green-600" : "text-gray-400"}`}
									/>
									At least 8 characters
								</div>
								<div
									className={`flex items-center text-xs ${passwordStrength.hasUppercase ? "text-green-600" : "text-gray-500"}`}
								>
									<Check
										className={`mr-1 h-3 w-3 ${passwordStrength.hasUppercase ? "text-green-600" : "text-gray-400"}`}
									/>
									One uppercase letter
								</div>
								<div
									className={`flex items-center text-xs ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}`}
								>
									<Check
										className={`mr-1 h-3 w-3 ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-400"}`}
									/>
									One number
								</div>
							</div>
						</div>

						{/* Checkboxes */}
						<div className="space-y-3">
							<div className="flex items-start">
								<input
									id="agreeToTerms"
									name="agreeToTerms"
									type="checkbox"
									required
									checked={formData.agreeToTerms}
									onChange={handleInputChange}
									className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="agreeToTerms"
									className="ml-2 block text-gray-700 text-sm"
								>
									I agree to the{" "}
									<Link
										href="/terms"
										className="text-blue-600 underline hover:text-blue-500"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-blue-600 underline hover:text-blue-500"
									>
										Privacy Policy
									</Link>
								</label>
							</div>

							<div className="flex items-start">
								<input
									id="receiveUpdates"
									name="receiveUpdates"
									type="checkbox"
									checked={formData.receiveUpdates}
									onChange={handleInputChange}
									className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="receiveUpdates"
									className="ml-2 block text-gray-700 text-sm"
								>
									Send me product updates and dental industry insights
								</label>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading || !isPasswordValid || !formData.agreeToTerms}
							className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 px-4 py-3 font-medium text-sm text-white shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? "Creating Account..." : "Start Free 30-Day Trial"}
						</button>
					</form>

					{/* Sign In Link */}
					<div className="mt-6 text-center">
						<p className="text-gray-600 text-sm">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign In
							</Link>
						</p>
					</div>

					{/* Patient Portal Link */}
					<div className="mt-4 text-center">
						<p className="text-gray-500 text-xs">
							Are you a patient?{" "}
							<Link
								href="/patient/auth/signup"
								className="text-blue-600 hover:text-blue-500"
							>
								Access Patient Portal
							</Link>
						</p>
					</div>

					{/* Social Login */}
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-gray-300 border-t" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-gray-50 px-2 text-gray-500">
									Or sign up with
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
