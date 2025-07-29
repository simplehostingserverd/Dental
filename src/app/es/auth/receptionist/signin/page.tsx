"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MexicanReceptionistSignInPage() {
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
				router.push(data.redirectUrl || "/receptionist");
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
					{/* Reception Desk Illustration */}
					<svg
						viewBox="0 0 800 600"
						className="h-full w-full"
						aria-label="Reception desk background"
					>
						<title>Reception desk background</title>
						{/* Reception desk */}
						<rect
							x="150"
							y="350"
							width="200"
							height="80"
							rx="10"
							fill="#f3f4f6"
							stroke="#6b7280"
							strokeWidth="2"
						/>
						<rect
							x="160"
							y="330"
							width="180"
							height="20"
							rx="5"
							fill="#9ca3af"
						/>

						{/* Computer monitor */}
						<rect
							x="200"
							y="280"
							width="80"
							height="50"
							rx="5"
							fill="#1f2937"
							stroke="#374151"
							strokeWidth="2"
						/>
						<rect x="205" y="285" width="70" height="40" fill="#3b82f6" />
						<rect x="230" y="330" width="20" height="20" fill="#6b7280" />

						{/* Phone */}
						<rect
							x="300"
							y="340"
							width="30"
							height="15"
							rx="3"
							fill="#374151"
						/>
						<circle cx="315" cy="347" r="2" fill="#10b981" />

						{/* Filing cabinet */}
						<rect
							x="450"
							y="300"
							width="60"
							height="100"
							rx="5"
							fill="#e5e7eb"
							stroke="#9ca3af"
							strokeWidth="2"
						/>
						<rect x="460" y="320" width="40" height="3" fill="#6b7280" />
						<rect x="460" y="340" width="40" height="3" fill="#6b7280" />
						<rect x="460" y="360" width="40" height="3" fill="#6b7280" />

						{/* Waiting chairs */}
						<rect
							x="100"
							y="450"
							width="40"
							height="40"
							rx="5"
							fill="#dbeafe"
							stroke="#3b82f6"
							strokeWidth="2"
						/>
						<rect
							x="160"
							y="450"
							width="40"
							height="40"
							rx="5"
							fill="#dbeafe"
							stroke="#3b82f6"
							strokeWidth="2"
						/>
						<rect
							x="220"
							y="450"
							width="40"
							height="40"
							rx="5"
							fill="#dbeafe"
							stroke="#3b82f6"
							strokeWidth="2"
						/>

						{/* Window */}
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
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
							<MapPin className="h-8 w-8 text-blue-600" />
						</div>
						<h1 className="font-bold text-2xl text-gray-900">
							Acceso para Recepcionistas
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
								placeholder="recepcionista@ejemplo.com"
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
							className="w-full bg-blue-600 hover:bg-blue-700"
							disabled={isLoading}
						>
							{isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
						</Button>
					</form>

					{/* Links */}
					<div className="mt-6 space-y-2 text-center">
						<Link
							href="/es/auth/forgot-password"
							className="text-blue-600 text-sm hover:text-blue-700"
						>
							¿Olvidaste tu contraseña?
						</Link>
						<div className="text-gray-600 text-sm">
							¿Problemas para acceder?{" "}
							<Link
								href="/es/contact"
								className="font-medium text-blue-600 hover:text-blue-700"
							>
								Contactar soporte
							</Link>
						</div>
					</div>

					{/* Demo Credentials */}
					<div className="mt-6 rounded-lg bg-blue-50 p-4">
						<h3 className="font-medium text-blue-800 text-sm">
							Credenciales de Demo:
						</h3>
						<p className="text-blue-700 text-sm">
							Email: recepcionista@cognident.org
						</p>
						<p className="text-blue-700 text-sm">Contraseña: recepcion123</p>
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
