"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { getAllTestUsers } from "@/lib/auth-test";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const testUsers = getAllTestUsers();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/test-auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (data.success && data.user && data.redirectUrl) {
				// Store user session in localStorage for testing
				localStorage.setItem(
					"testUser",
					JSON.stringify({
						id: data.user.id,
						email: data.user.email,
						role: data.user.role,
						profile: data.user.profile,
						sessionToken: data.user.sessionToken,
						timestamp: Date.now(),
					}),
				);

				// Redirect to appropriate dashboard
				router.push(data.redirectUrl);
			} else {
				setError(data.error || "Login failed");
			}
		} catch (error) {
			setError("An error occurred during login");
			console.error("Login error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleQuickLogin = async (testUser: { email: string; password: string }) => {
		setEmail(testUser.email);
		setIsLoading(true);
		setError("");

		try {
			// Get the actual password from test-users-server
			const { testUsers: fullTestUsers } = await import(
				"@/lib/test-users-server"
			);
			const userWithPassword = fullTestUsers.find(
				(u) => u.email === testUser.email,
			);

			if (userWithPassword) {
				const response = await fetch("/api/test-auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: testUser.email,
						password: userWithPassword.password,
					}),
				});

				const data = await response.json();

				if (data.success && data.user && data.redirectUrl) {
					localStorage.setItem(
						"testUser",
						JSON.stringify({
							id: data.user.id,
							email: data.user.email,
							role: data.user.role,
							profile: data.user.profile,
							sessionToken: data.user.sessionToken,
							timestamp: Date.now(),
						}),
					);

					router.push(data.redirectUrl);
				} else {
					setError(data.error || "Quick login failed");
				}
			} else {
				setError("User not found");
			}
		} catch (error) {
			setError("Quick login failed");
			console.error("Quick login error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
				{/* Login Form */}
				<div className="rounded-2xl bg-white p-8 shadow-xl">
					<div className="mb-8 text-center">
						<div className="mb-4 flex items-center justify-center">
							<HeaderLogo className="text-blue-600" />
						</div>
						<h2 className="text-gray-600 text-xl">Test Login Portal</h2>
						<p className="mt-2 text-gray-500 text-sm">
							Use the test credentials to access different dashboards
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="mb-2 block font-medium text-gray-700 text-sm"
							>
								Email Address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
								placeholder="Enter your email"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="mb-2 block font-medium text-gray-700 text-sm"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-600 hover:text-gray-600"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-gray-900 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? (
								<div className="h-5 w-5 animate-spin rounded-full border-white border-b-2" />
							) : (
								<>
									<LogIn className="mr-2 h-5 w-5" />
									Sign In
								</>
							)}
						</button>
					</form>
				</div>

				{/* Test Users Panel */}
				<div className="rounded-2xl bg-white p-8 shadow-xl">
					<h3 className="mb-6 font-bold text-2xl text-gray-900">
						Quick Test Login
					</h3>
					<p className="mb-6 text-gray-600">
						Click any user below to instantly log in and test their dashboard:
					</p>

					<div className="space-y-4">
						{/* Dentist Users */}
						<div>
							<h4 className="mb-3 font-semibold text-blue-600 text-lg">
								🦷 Dentists
							</h4>
							<div className="space-y-2">
								<button
									onClick={() =>
										handleQuickLogin({
											email: "dr.smith@cognident.org",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
									disabled={isLoading}
								>
									<div className="font-medium">Dr. Sarah Smith</div>
									<div className="text-gray-500 text-sm">
										dr.smith@cognident.org
									</div>
									<div className="text-blue-600 text-xs">
										Oral Surgeon • 15 years experience
									</div>
								</button>
								<button
									onClick={() =>
										handleQuickLogin({
											email: "dr.johnson@cognident.org",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
									disabled={isLoading}
								>
									<div className="font-medium">Dr. Michael Johnson</div>
									<div className="text-gray-500 text-sm">
										dr.johnson@cognident.org
									</div>
									<div className="text-blue-600 text-xs">
										Orthodontist • 12 years experience
									</div>
								</button>
							</div>
						</div>

						{/* Receptionist Users */}
						<div>
							<h4 className="mb-3 font-semibold text-green-600 text-lg">
								📋 Receptionists
							</h4>
							<div className="space-y-2">
								<button
									onClick={() =>
										handleQuickLogin({
											email: "mary.wilson@cognident.org",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-green-300 hover:bg-green-50"
									disabled={isLoading}
								>
									<div className="font-medium">Mary Wilson</div>
									<div className="text-gray-500 text-sm">
										mary.wilson@cognident.org
									</div>
									<div className="text-green-600 text-xs">
										Lead Receptionist • Full Access
									</div>
								</button>
								<button
									onClick={() =>
										handleQuickLogin({
											email: "jennifer.brown@cognident.org",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-green-300 hover:bg-green-50"
									disabled={isLoading}
								>
									<div className="font-medium">Jennifer Brown</div>
									<div className="text-gray-500 text-sm">
										jennifer.brown@cognident.org
									</div>
									<div className="text-green-600 text-xs">
										Receptionist • Limited Access
									</div>
								</button>
							</div>
						</div>

						{/* Patient Users */}
						<div>
							<h4 className="mb-3 font-semibold text-lg text-purple-600">
								🏥 Patients
							</h4>
							<div className="space-y-2">
								<button
									onClick={() =>
										handleQuickLogin({
											email: "john.doe@email.com",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-purple-300 hover:bg-purple-50"
									disabled={isLoading}
								>
									<div className="font-medium">John Doe</div>
									<div className="text-gray-500 text-sm">
										john.doe@email.com
									</div>
									<div className="text-purple-600 text-xs">
										DOB: 06/15/1985 • Balance: $225
									</div>
								</button>
								<button
									onClick={() =>
										handleQuickLogin({
											email: "alice.johnson@email.com",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-purple-300 hover:bg-purple-50"
									disabled={isLoading}
								>
									<div className="font-medium">Alice Johnson</div>
									<div className="text-gray-500 text-sm">
										alice.johnson@email.com
									</div>
									<div className="text-purple-600 text-xs">
										DOB: 03/22/1992 • Balance: $0
									</div>
								</button>
								<button
									onClick={() =>
										handleQuickLogin({
											email: "robert.smith@email.com",
											password: "password123",
										})
									}
									className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-purple-300 hover:bg-purple-50"
									disabled={isLoading}
								>
									<div className="font-medium">Robert Smith</div>
									<div className="text-gray-500 text-sm">
										robert.smith@email.com
									</div>
									<div className="text-purple-600 text-xs">
										DOB: 11/08/1978 • Balance: $450
									</div>
								</button>
							</div>
						</div>
					</div>

					<div className="mt-6 rounded-lg bg-gray-50 p-4">
						<h5 className="mb-2 font-medium text-gray-900">
							🔐 Security Features
						</h5>
						<ul className="space-y-1 text-gray-600 text-sm">
							<li>
								• Quantum-resistant encryption (ML-KEM, ML-DSA, SLH-DSA, HQC)
							</li>
							<li>• Secure password hashing</li>
							<li>• Role-based access control</li>
							<li>• Session management</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
