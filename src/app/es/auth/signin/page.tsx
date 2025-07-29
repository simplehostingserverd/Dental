"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ArrowLeft,
	Building2,
	Eye,
	EyeOff,
	Heart,
	MapPin,
	Shield,
	Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MexicoSignInPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const majorCities = [
		{ name: "CDMX", x: 400, y: 350, size: "large" },
		{ name: "Guadalajara", x: 300, y: 320, size: "medium" },
		{ name: "Monterrey", x: 450, y: 280, size: "medium" },
		{ name: "Puebla", x: 420, y: 330, size: "small" },
		{ name: "Tijuana", x: 150, y: 250, size: "small" },
		{ name: "León", x: 350, y: 310, size: "small" },
		{ name: "Juárez", x: 380, y: 220, size: "small" },
		{ name: "Mérida", x: 550, y: 380, size: "small" },
		{ name: "Cancún", x: 600, y: 360, size: "small" },
		{ name: "Acapulco", x: 350, y: 400, size: "small" },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Handle Mexican clinic login
		console.log("Mexican clinic login:", formData);
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
				{/* Back to Landing */}
				<div className="mb-6">
					<Link
						href="/es"
						className="flex items-center text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver al inicio
					</Link>
				</div>

				<Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
					<CardHeader className="pb-6 text-center">
						{/* Logo and Branding */}
						<div className="mb-4 flex items-center justify-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-red-600 shadow-lg">
								<Heart className="h-7 w-7 text-white" />
							</div>
						</div>

						<CardTitle className="font-bold text-2xl text-gray-900">
							Cognident México
						</CardTitle>
						<p className="mt-2 text-gray-600">
							Acceso para Clínicas Dentales Mexicanas
						</p>

						{/* Mexican Flag Badge */}
						<div className="mt-4 flex justify-center">
							<Badge className="border-0 bg-gradient-to-r from-green-600 via-white to-red-600 px-4 py-1 text-gray-900">
								🇲🇽 Sistema Mexicano
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Email Field */}
							<div className="space-y-2">
								<Label htmlFor="email" className="font-medium text-gray-700">
									Correo Electrónico de la Clínica
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="clinica@ejemplo.com.mx"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
									required
								/>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label htmlFor="password" className="font-medium text-gray-700">
									Contraseña
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Ingresa tu contraseña"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										className="h-12 border-gray-300 pr-12 focus:border-green-500 focus:ring-green-500"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-500 hover:text-gray-700"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							{/* Login Button */}
							<Button
								type="submit"
								className="h-12 w-full bg-gradient-to-r from-green-600 to-red-600 font-semibold text-white shadow-lg hover:from-green-700 hover:to-red-700"
							>
								<Building2 className="mr-2 h-5 w-5" />
								Acceder a Mi Clínica
							</Button>
						</form>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-gray-300 border-t" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-4 text-gray-500">o</span>
							</div>
						</div>

						{/* Quick Access Options */}
						<div className="space-y-3">
							<Link href="/es/auth/dentist/signin">
								<Button
									variant="outline"
									className="h-12 w-full border-green-200 hover:bg-green-50"
								>
									<Stethoscope className="mr-2 h-5 w-5 text-green-600" />
									Acceso para Dentistas
								</Button>
							</Link>
							<Link href="/es/auth/receptionist/signin">
								<Button
									variant="outline"
									className="h-12 w-full border-blue-200 hover:bg-blue-50"
								>
									<MapPin className="mr-2 h-5 w-5 text-blue-600" />
									Acceso para Recepcionistas
								</Button>
							</Link>
						</div>

						{/* Links */}
						<div className="space-y-2 text-center">
							<Link
								href="/es/auth/forgot-password"
								className="text-green-600 text-sm hover:text-green-700"
							>
								¿Olvidaste tu contraseña?
							</Link>
							<div className="text-gray-600 text-sm">
								¿No tienes cuenta?{" "}
								<Link
									href="/es/auth/signup"
									className="font-medium text-green-600 hover:text-green-700"
								>
									Registrar Clínica
								</Link>
							</div>
						</div>

						{/* Security Badge */}
						<div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-50 p-3 text-gray-500 text-xs">
							<Shield className="h-4 w-4" />
							<span>
								Conexión segura • Datos protegidos • Cumplimiento HIPAA
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Footer Info */}
				<div className="mt-6 text-center text-gray-600 text-sm">
					<p>Soporte técnico: +52 55 1234-5678</p>
					<p>mexico@cognident.org</p>
				</div>
			</div>
		</div>
	);
}
