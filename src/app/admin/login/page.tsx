"use client";

import { useState } from "react";
import { Heart, Shield, Lock } from "lucide-react";

export default function AdminLoginPage() {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Simple authentication check (in production, this would be server-side)
		if (credentials.username === "admin" && credentials.password === "cognident2024") {
			// Set admin session (in production, use proper JWT/session management)
			localStorage.setItem("adminAuthenticated", "true");
			window.location.href = "/admin/blog";
		} else {
			alert("Invalid credentials. Please try again.");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials(prev => ({
			...prev,
			[name]: value
		}));
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center">
			<div className="max-w-md w-full space-y-8 p-8">
				<div className="text-center">
					<div className="flex justify-center items-center mb-6">
						<Heart className="h-12 w-12 text-blue-400 mr-3" />
						<span className="font-bold text-3xl text-white">Cognident</span>
					</div>
					<h2 className="text-2xl font-bold text-white mb-2">
						Administrator Login
					</h2>
					<p className="text-gray-400">
						Access the blog management system
					</p>
				</div>

				<div className="bg-gray-800 rounded-lg p-8 shadow-xl">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
								Username
							</label>
							<input
								id="username"
								name="username"
								type="text"
								value={credentials.username}
								onChange={handleInputChange}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter admin username"
								required
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								value={credentials.password}
								onChange={handleInputChange}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter admin password"
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
						>
							<Lock className="h-4 w-4 mr-2" />
							Sign In to Admin Panel
						</button>
					</form>

					<div className="mt-6 text-center">
						<div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
							<Shield className="h-4 w-4" />
							<span>Secure administrator access</span>
						</div>
					</div>
				</div>

				<div className="text-center">
					<p className="text-gray-500 text-sm">
						Demo credentials: admin / cognident2024
					</p>
				</div>
			</div>
		</div>
	);
}
