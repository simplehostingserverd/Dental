"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MexicanDentistSignInPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/smart-login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				// Redirect to appropriate dashboard
				router.push(data.redirectUrl || "/dashboard");
			} else {
				alert(`Error de inicio de sesión: ${data.error}`);
			}
		} catch (error) {
			alert("Error de conexión. Por favor intente de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-red-50 p-4">
			{/* Dental Office Background */}
			<div className="absolute inset-0 overflow-hidden opacity-10">
				<div className="h-full w-full bg-gradient-to-br from-green-100 to-red-100">
					{/* Dental Office Illustration */}
					<svg
						viewBox="0 0 800 600"
						className="h-full w-full"
						aria-label="Dental office background"
					>
						<title>Dental office background</title>
						{/* Modern dental chair */}
						<rect
							x="200"
							y="300"
							width="120"
							height="80"
							rx="10"
							fill="#e5e7eb"
							stroke="#6b7280"
							strokeWidth="2"
						/>
						<rect
							x="220"
							y="280"
							width="80"
							height="20"
							rx="10"
							fill="#9ca3af"
						/>

						{/* Dental light */}
						<circle
							cx="350"
							cy="200"
							r="30"
							fill="#fbbf24"
							stroke="#f59e0b"
							strokeWidth="3"
						/>
						<line
							x1="350"
							y1="230"
							x2="350"
							y2="280"
							stroke="#6b7280"
							strokeWidth="4"
						/>

						{/* Medical cabinet */}
						<rect
							x="500"
							y="250"
							width="80"
							height="120"
							rx="5"
							fill="#f3f4f6"
							stroke="#9ca3af"
							strokeWidth="2"
						/>
						<rect x="510" y="260" width="60" height="15" fill="#3b82f6" />
						<rect x="510" y="285" width="60" height="15" fill="#10b981" />
						<rect x="510" y="310" width="60" height="15" fill="#ef4444" />

						{/* Dental tools */}
						<line
							x1="100"
							y1="200"
							x2="120"
							y2="180"
							stroke="#6b7280"
							strokeWidth="3"
						/>
						<line
							x1="110"
							y1="210"
							x2="130"
							y2="190"
							stroke="#6b7280"
							strokeWidth="3"
						/>
						<circle cx="125" r="5" fill="#9ca3af" />

						{/* Window with natural light */}
						<rect
							x="50"
							y="100"
							width="100"
							height="80"
							rx="5"
							fill="#dbeafe"
							stroke="#3b82f6"
							strokeWidth="2"
						/>
						<line
							x1="100"
							y1="100"
							x2="100"
							y2="180"
							stroke="#3b82f6"
							strokeWidth="1"
						/>
						<line
							x1="50"
							y1="140"
							x2="150"
							y2="140"
							stroke="#3b82f6"
							strokeWidth="1"
						/>
					</svg>
				</div>
			</div>

			<div className="relative z-10 w-full max-w-md">
				{/* Back to Main Login */}
				<div className="mb-6">
					<Link
						href="/es/auth/signin"
						className="flex items-center text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver al inicio
					</Link>
				</div>

				<div className="rounded-lg bg-white p-8 shadow-xl">
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<Stethoscope className="h-8 w-8 text-green-600" />
						</div>
						<h1 className="font-bold text-2xl text-gray-900">
							Acceso para Dentistas
						</h1>
						<p className="mt-2 text-gray-600">
							Ingrese sus credenciales para acceder al sistema
						</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<Label htmlFor="email" className="text-gray-700">
								Correo Electrónico
							</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="dentista@ejemplo.com"
								className="mt-1"
								required
							/>
						</div>

						<div>
							<Label htmlFor="password" className="text-gray-700">
								Contraseña
							</Label>
							<div className="relative mt-1">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									placeholder="Ingrese su contraseña"
									className="pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 flex items-center pr-3"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-400" />
									) : (
										<Eye className="h-4 w-4 text-gray-400" />
									)}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-green-600 hover:bg-green-700"
							disabled={isLoading}
						>
							{isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
						</Button>
					</form>

					{/* Links */}
					<div className="mt-6 space-y-2 text-center">
						<Link
							href="/es/auth/forgot-password"
							className="text-green-600 text-sm hover:text-green-700"
						>
							¿Olvidaste tu contraseña?
						</Link>
						<div className="text-gray-600 text-sm">
							¿Problemas para acceder?{" "}
							<Link
								href="/es/contact"
								className="font-medium text-green-600 hover:text-green-700"
							>
								Contactar soporte
							</Link>
						</div>
					</div>

					{/* Demo Credentials */}
					<div className="mt-6 rounded-lg bg-green-50 p-4">
						<h3 className="font-medium text-green-800 text-sm">
							Credenciales de Demo:
						</h3>
						<p className="text-green-700 text-sm">
							Email: dentist.es@cognident.org
						</p>
						<p className="text-green-700 text-sm">Contraseña: dentista123</p>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-gray-500 text-sm">
						Soporte técnico: +52 55 1234-5678
					</p>
					<p className="text-gray-500 text-sm">mexico@cognident.org</p>
				</div>
			</div>
		</div>
	);
}
