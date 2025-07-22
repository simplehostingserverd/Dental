"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { CognidentLargeLogo } from "@/components/icons/cognident-logo";
import { Calendar, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
	const [userType, setUserType] = useState<"practice" | "patient">("practice");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const [practiceFormData, setPracticeFormData] = useState({
		firstName: "",
		lastName: "",
		practiceName: "",
		workEmail: "",
		phoneNumber: "",
		practiceSize: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
		receiveUpdates: false,
	});

	const [patientFormData, setPatientFormData] = useState({
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

	const handlePracticeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setPracticeFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;
		setPatientFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const endpoint = userType === "practice"
				? "/api/auth/practice/signup"
				: "/api/auth/patient/signup";

			const formData = userType === "practice" ? practiceFormData : patientFormData;

			// Basic validation
			if (userType === "practice") {
				if (practiceFormData.password !== practiceFormData.confirmPassword) {
					setError("Passwords do not match");
					return;
				}
				if (!practiceFormData.agreeToTerms) {
					setError("You must agree to the Terms of Service");
					return;
				}
			} else {
				if (patientFormData.password !== patientFormData.confirmPassword) {
					setError("Passwords do not match");
					return;
				}
				if (!patientFormData.agreeToTerms) {
					setError("You must agree to the Terms of Service");
					return;
				}
			}

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				// Redirect based on user type and role
				let redirectPath = "/dashboard";

				if (userType === "practice") {
					// Check user role for practice staff
					const userRole = data.user?.role?.toLowerCase();
					if (userRole === "receptionist") {
						redirectPath = "/receptionist";
					} else {
						redirectPath = "/dashboard";
					}
				} else {
					redirectPath = "/patient/dashboard";
				}

				router.push(redirectPath);
			} else {
				setError(data.error || "Signup failed");
			}
		} catch (error) {
			setError("An error occurred during signup");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="flex min-h-screen bg-gray-900">
			{/* Left Panel - Sign Up Form */}
			<div className="flex flex-1 items-center justify-center bg-gray-800 p-8 lg:w-1/2">
				<div className="w-full max-w-md">
					<div className="mb-8 text-center">
						<div className="mb-6 flex items-center justify-center">
							<CognidentLargeLogo className="text-blue-500" />
						</div>
						<h2 className="mb-2 font-bold text-2xl text-white">
							Create your account
						</h2>
						<p className="text-gray-300">
							Start your free trial of Cognident today.
						</p>
					</div>

					<div className="rounded-lg bg-gray-700 border border-gray-600 p-6 shadow-lg">
						{/* User Type Selection */}
						<div className="mb-6">
							<label className="mb-3 block font-medium text-gray-300 text-sm">
								I want to create a:
							</label>
							<div className="flex space-x-4">
								<button
									type="button"
									onClick={() => setUserType("practice")}
									className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
										userType === "practice"
											? "bg-blue-600 text-white"
											: "bg-gray-600 text-gray-300 hover:bg-gray-500"
									}`}
								>
									Practice Account
								</button>
								<button
									type="button"
									onClick={() => setUserType("patient")}
									className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
										userType === "patient"
											? "bg-blue-600 text-white"
											: "bg-gray-600 text-gray-300 hover:bg-gray-500"
									}`}
								>
									Patient Account
								</button>
							</div>
						</div>

						{error && (
							<div className="mb-4 rounded-md bg-red-900/50 border border-red-700 p-3">
								<p className="text-red-200 text-sm">{error}</p>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="firstName"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										First Name
									</label>
									<input
										id="firstName"
										name="firstName"
										type="text"
										value={userType === "practice" ? practiceFormData.firstName : patientFormData.firstName}
										onChange={userType === "practice" ? handlePracticeInputChange : handlePatientInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="John"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="lastName"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Last Name
									</label>
									<input
										id="lastName"
										name="lastName"
										type="text"
										value={userType === "practice" ? practiceFormData.lastName : patientFormData.lastName}
										onChange={userType === "practice" ? handlePracticeInputChange : handlePatientInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="Doe"
										required
									/>
								</div>
							</div>

							{userType === "practice" && (
								<div>
									<label
										htmlFor="practiceName"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Practice Name
									</label>
									<input
										id="practiceName"
										name="practiceName"
										type="text"
										value={practiceFormData.practiceName}
										onChange={handlePracticeInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="Smile Dental Clinic"
										required
									/>
								</div>
							)}

							{userType === "practice" && (
								<div>
									<label
										htmlFor="phoneNumber"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Phone Number
									</label>
									<input
										id="phoneNumber"
										name="phoneNumber"
										type="tel"
										value={practiceFormData.phoneNumber}
										onChange={handlePracticeInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="(555) 123-4567"
										required
									/>
								</div>
							)}

							{userType === "patient" && (
								<div>
									<label
										htmlFor="phone"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Phone Number
									</label>
									<input
										id="phone"
										name="phone"
										type="tel"
										value={patientFormData.phone}
										onChange={handlePatientInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="(555) 123-4567"
										required
									/>
								</div>
							)}

							{userType === "patient" && (
								<div>
									<label
										htmlFor="dateOfBirth"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Date of Birth
									</label>
									<input
										id="dateOfBirth"
										name="dateOfBirth"
										type="date"
										value={patientFormData.dateOfBirth}
										onChange={handlePatientInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										required
									/>
								</div>
							)}

							<div>
								<label
									htmlFor="email"
									className="mb-2 block font-medium text-gray-700 text-sm"
								>
									Email
								</label>
								<input
									id="email"
									name={userType === "practice" ? "workEmail" : "email"}
									type="email"
									value={userType === "practice" ? practiceFormData.workEmail : patientFormData.email}
									onChange={userType === "practice" ? handlePracticeInputChange : handlePatientInputChange}
									disabled={isLoading}
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
									placeholder={userType === "practice" ? "john@smiledental.com" : "john.doe@email.com"}
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="password"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Password
									</label>
									<input
										id="password"
										name="password"
										type="password"
										value={userType === "practice" ? practiceFormData.password : patientFormData.password}
										onChange={userType === "practice" ? handlePracticeInputChange : handlePatientInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="Create a strong password"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="confirmPassword"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Confirm Password
									</label>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										value={userType === "practice" ? practiceFormData.confirmPassword : patientFormData.confirmPassword}
										onChange={userType === "practice" ? handlePracticeInputChange : handlePatientInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										placeholder="Confirm your password"
										required
									/>
								</div>
							</div>

							{userType === "practice" && (
								<div>
									<label
										htmlFor="practiceSize"
										className="mb-2 block font-medium text-gray-700 text-sm"
									>
										Practice Size
									</label>
									<select
										id="practiceSize"
										name="practiceSize"
										value={practiceFormData.practiceSize}
										onChange={handlePracticeInputChange}
										disabled={isLoading}
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
										required
									>
										<option value="">Select practice size</option>
										<option value="1-5">1-5 practitioners</option>
										<option value="6-15">6-15 practitioners</option>
										<option value="16-50">16-50 practitioners</option>
										<option value="50+">50+ practitioners</option>
									</select>
								</div>
							)}

							<div className="flex items-center">
								<input
									id="agreeToTerms"
									name="agreeToTerms"
									type="checkbox"
									checked={userType === "practice" ? practiceFormData.agreeToTerms : patientFormData.agreeToTerms}
									onChange={userType === "practice" ? handlePracticeInputChange : handlePatientInputChange}
									disabled={isLoading}
									className="h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500 disabled:opacity-50"
									required
								/>
								<label htmlFor="agreeToTerms" className="ml-2 text-gray-700 text-sm">
									I agree to the{" "}
									<Link href="/terms" className="text-blue-600 hover:text-blue-700">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link href="/privacy" className="text-blue-600 hover:text-blue-700">
										Privacy Policy
									</Link>
								</label>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-gray-900 transition duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</button>
						</form>
					</div>

					<div className="mt-6 text-center">
						<p className="text-gray-600 text-sm">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="font-medium text-blue-600 hover:text-blue-700"
							>
								Sign in here
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
				<div className="relative z-10 flex flex-col justify-center p-12 text-gray-900">
					<div className="max-w-md">
						<h1 className="mb-4 font-bold text-4xl">
							Join Thousands of Dental Practices
						</h1>

						<p className="mb-8 text-gray-200 text-xl">
							Transform your practice with our comprehensive management
							platform.
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
									<p className="text-gray-700">
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
									<p className="text-gray-700">
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
									<p className="text-gray-700">
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
