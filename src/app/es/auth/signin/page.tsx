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
			{/* Mexico Map Background */}
			<div className="absolute inset-0 overflow-hidden opacity-5">
				<svg
					viewBox="0 0 1000 600"
					className="h-full w-full"
					aria-label="Mexico map background"
				>
					<title>Mexico map background</title>
					{/* Detailed Mexico Map Outline */}
					<path
						d="M80 320 L120 280 L180 250 L250 220 L320 200 L400 180 L480 170 L560 180 L640 200 L720 230 L780 260 L820 300 L850 340 L830 380 L800 420 L750 450 L700 470 L650 485 L600 500 L550 510 L500 515 L450 510 L400 500 L350 485 L300 470 L250 450 L200 420 L150 380 L120 350 Z"
						fill="url(#mexicoMapGradient)"
						stroke="#059669"
						strokeWidth="3"
					/>

					{/* Baja California Peninsula */}
					<path
						d="M80 250 L100 200 L120 180 L140 200 L160 240 L150 280 L130 300 L110 290 L90 270 Z"
						fill="url(#mexicoMapGradient)"
						stroke="#059669"
						strokeWidth="2"
					/>

					{/* Yucatan Peninsula */}
					<path
						d="M550 380 L600 360 L650 370 L680 390 L670 420 L640 430 L600 425 L570 410 Z"
						fill="url(#mexicoMapGradient)"
						stroke="#059669"
						strokeWidth="2"
					/>

					<defs>
						<linearGradient
							id="mexicoMapGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
							<stop offset="33%" stopColor="#ffffff" stopOpacity="0.5" />
							<stop offset="66%" stopColor="#dc2626" stopOpacity="0.3" />
							<stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
						</linearGradient>
						<radialGradient id="cityGlow">
							<stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
							<stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
						</radialGradient>
					</defs>

					{/* Major Cities with Glow Effect */}
					{majorCities.map((city, index) => (
						<g key={index}>
							<circle
								cx={city.x}
								cy={city.y}
								r={city.size === "large" ? 12 : city.size === "medium" ? 8 : 6}
								fill="url(#cityGlow)"
							/>
							<circle
								cx={city.x}
								cy={city.y}
								r={city.size === "large" ? 8 : city.size === "medium" ? 5 : 3}
								fill="#dc2626"
							/>
							<text
								x={city.x + 15}
								y={city.y + 5}
								className="fill-gray-600 font-medium text-xs"
							>
								{city.name}
							</text>
						</g>
					))}

					{/* Decorative Elements */}
					<circle cx="100" cy="150" r="3" fill="#fbbf24" opacity="0.6" />
					<circle cx="850" cy="200" r="4" fill="#fbbf24" opacity="0.6" />
					<circle cx="200" cy="500" r="2" fill="#fbbf24" opacity="0.6" />
				</svg>
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
							<Button
								variant="outline"
								className="h-12 w-full border-green-200 hover:bg-green-50"
							>
								<Stethoscope className="mr-2 h-5 w-5 text-green-600" />
								Acceso para Dentistas
							</Button>
							<Button
								variant="outline"
								className="h-12 w-full border-blue-200 hover:bg-blue-50"
							>
								<MapPin className="mr-2 h-5 w-5 text-blue-600" />
								Acceso para Recepcionistas
							</Button>
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
