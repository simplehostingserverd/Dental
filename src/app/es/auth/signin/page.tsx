"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn, Flag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderLogo } from "@/components/ui/tooth-logo";

export default function MexicanSignInPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

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
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				// Redirect to Spanish dashboard
				router.push("/es/receptionist");
			} else {
				const errorData = await response.json();
				setError(errorData.error || "Error al iniciar sesión");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("Error de conexión. Por favor intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center p-4">
			{/* Mexican Flag Pattern Background */}
			<div className="absolute inset-0 opacity-5">
				<div className="h-full w-full bg-gradient-to-r from-green-600 via-white to-red-600"></div>
			</div>
			
			{/* Dental Pattern Overlay */}
			<div className="absolute inset-0 opacity-3">
				<div className="h-full w-full" style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}}></div>
			</div>

			<div className="relative z-10 w-full max-w-md">
				{/* Header with Mexican Flag */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-4">
						<div className="flex items-center space-x-3">
							{/* Mexican Flag */}
							<div className="flex h-8 w-12 overflow-hidden rounded border border-gray-300 shadow-sm">
								<div className="w-1/3 bg-green-600"></div>
								<div className="w-1/3 bg-white flex items-center justify-center">
									<div className="h-4 w-4 rounded-full bg-red-600 opacity-60"></div>
								</div>
								<div className="w-1/3 bg-red-600"></div>
							</div>
							<HeaderLogo className="text-green-600" />
						</div>
					</div>
					<h1 className="text-3xl font-bold text-gray-900">Cognident México</h1>
					<p className="text-gray-600 mt-2">Sistema de Gestión Dental Profesional</p>
				</div>

				{/* Login Card */}
				<Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
					<CardHeader className="space-y-1 pb-6">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<div className="p-3 bg-green-100 rounded-full">
								<LogIn className="h-6 w-6 text-green-600" />
							</div>
						</div>
						<CardTitle className="text-2xl text-center text-gray-900">
							Iniciar Sesión
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							Accede a tu panel de administración dental
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
									{error}
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-700">
									Correo Electrónico
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										id="email"
										type="email"
										placeholder="tu@clinica.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-gray-700">
									Contraseña
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="remember"
										className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
									/>
									<Label htmlFor="remember" className="text-sm text-gray-600">
										Recordarme
									</Label>
								</div>
								<Link
									href="/es/auth/forgot-password"
									className="text-sm text-green-600 hover:text-green-500"
								>
									¿Olvidaste tu contraseña?
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										<span>Iniciando sesión...</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<LogIn className="h-4 w-4" />
										<span>Iniciar Sesión</span>
									</div>
								)}
							</Button>
						</form>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">o</span>
							</div>
						</div>

						{/* Quick Access for Demo */}
						<div className="space-y-3">
							<p className="text-center text-sm text-gray-600">Acceso rápido para demostración:</p>
							<div className="grid grid-cols-1 gap-2">
								<Button
									type="button"
									variant="outline"
									className="w-full border-green-200 text-green-700 hover:bg-green-50"
									onClick={() => {
										setEmail("recepcionista@clinica.mx");
										setPassword("demo123");
									}}
								>
									👩‍💼 Recepcionista Demo
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
									onClick={() => {
										setEmail("doctor@clinica.mx");
										setPassword("demo123");
									}}
								>
									🦷 Doctor Demo
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center">
					<div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
						<Heart className="h-4 w-4 text-red-500" />
						<span>Hecho con amor para las clínicas dentales mexicanas</span>
						<div className="flex h-4 w-6 overflow-hidden rounded border border-gray-300">
							<div className="w-1/3 bg-green-600"></div>
							<div className="w-1/3 bg-white"></div>
							<div className="w-1/3 bg-red-600"></div>
						</div>
					</div>
					<div className="mt-2 text-xs text-gray-500">
						¿Necesitas ayuda? Contacta a soporte: 
						<a href="tel:+525512345678" className="text-green-600 hover:text-green-500 ml-1">
							+52 55 1234 5678
						</a>
					</div>
					<div className="mt-4">
						<Link
							href="/auth/signin"
							className="text-sm text-gray-500 hover:text-gray-700"
						>
							🇺🇸 Switch to English / Cambiar a Inglés
						</Link>
					</div>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-10 left-10 opacity-10">
				<div className="h-20 w-20 rounded-full bg-green-600"></div>
			</div>
			<div className="absolute bottom-10 right-10 opacity-10">
				<div className="h-16 w-16 rounded-full bg-red-600"></div>
			</div>
			<div className="absolute top-1/2 left-5 opacity-10">
				<div className="h-12 w-12 rounded-full bg-white border-2 border-green-600"></div>
			</div>
		</div>
	);
}
