"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Lock, Shield } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Simple authentication check (in production, this would be server-side)
		if (
			credentials.username === "admin" &&
			credentials.password === "cognident2025"
		) {
			// Set admin session (in production, use proper JWT/session management)
			localStorage.setItem("adminAuthenticated", "true");
			window.location.href = "/admin/blog";
		} else {
			alert("Invalid credentials. Please try again.");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-900">
			<div className="w-full max-w-md space-y-8 p-8">
				<div className="text-center">
					<div className="mb-6 flex items-center justify-center">
						<HeaderLogo className="text-blue-600" />
						<span className="font-bold text-3xl text-white">Cognident</span>
					</div>
					<h2 className="mb-2 font-bold text-2xl text-white">
						Administrator Login
					</h2>
					<p className="text-gray-400">Access the blog management system</p>
				</div>

				<div className="rounded-lg bg-gray-800 p-8 shadow-xl">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="username"
								className="mb-2 block font-medium text-gray-300 text-sm"
							>
								Username
							</label>
							<input
								id="username"
								name="username"
								type="text"
								value={credentials.username}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter admin username"
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
								name="password"
								type="password"
								value={credentials.password}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter admin password"
								required
							/>
						</div>

						<button
							type="submit"
							className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition duration-200 hover:bg-blue-700"
						>
							<Lock className="mr-2 h-4 w-4" />
							Sign In to Admin Panel
						</button>
					</form>

					<div className="mt-6 text-center">
						<div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
							<Shield className="h-4 w-4" />
							<span>Secure administrator access</span>
						</div>
					</div>
				</div>

				<div className="text-center">
					<p className="text-gray-500 text-sm">
						Demo credentials: admin / cognident2025
					</p>
				</div>
			</div>
		</div>
	);
}
