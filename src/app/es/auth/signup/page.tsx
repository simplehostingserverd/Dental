"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ArrowLeft,
	Building2,
	CheckCircle,
	Eye,
	EyeOff,
	Heart,
	Mail,
	MapPin,
	Phone,
	Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MexicoSignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		clinicName: "",
		ownerName: "",
		email: "",
		phone: "",
		city: "",
		state: "",
		password: "",
		confirmPassword: "",
	});

	const mexicanStates = [
		"Aguascalientes",
		"Baja California",
		"Baja California Sur",
		"Campeche",
		"Chiapas",
		"Chihuahua",
		"Ciudad de México",
		"Coahuila",
		"Colima",
		"Durango",
		"Estado de México",
		"Guanajuato",
		"Guerrero",
		"Hidalgo",
		"Jalisco",
		"Michoacán",
		"Morelos",
		"Nayarit",
		"Nuevo León",
		"Oaxaca",
		"Puebla",
		"Querétaro",
		"Quintana Roo",
		"San Luis Potosí",
		"Sinaloa",
		"Sonora",
		"Tabasco",
		"Tamaulipas",
		"Tlaxcala",
		"Veracruz",
		"Yucatán",
		"Zacatecas",
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Handle Mexican clinic registration
		console.log("Mexican clinic registration:", formData);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-red-50 p-4">
			{/* Dental Office Background */}
			<div className="absolute inset-0 overflow-hidden opacity-10">
				<div className="h-full w-full bg-gradient-to-br from-green-100 to-red-100">
					{/* Dental Office Illustration */}
					<svg viewBox="0 0 800 600" className="h-full w-full" aria-label="Dental office background">
						<title>Dental office background</title>
						{/* Modern dental chair */}
						<rect x="200" y="300" width="120" height="80" rx="10" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/>
						<rect x="220" y="280" width="80" height="20" rx="10" fill="#9ca3af"/>

						{/* Dental light */}
						<circle cx="350" cy="200" r="30" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3"/>
						<line x1="350" y1="230" x2="350" y2="280" stroke="#6b7280" strokeWidth="4"/>

						{/* Medical cabinet */}
						<rect x="500" y="250" width="80" height="120" rx="5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2"/>
						<rect x="510" y="260" width="60" height="15" fill="#3b82f6"/>
						<rect x="510" y="285" width="60" height="15" fill="#10b981"/>
						<rect x="510" y="310" width="60" height="15" fill="#ef4444"/>

						{/* Dental tools */}
						<line x1="100" y1="200" x2="120" y2="180" stroke="#6b7280" strokeWidth="3"/>
						<line x1="110" y1="210" x2="130" y2="190" stroke="#6b7280" strokeWidth="3"/>
						<circle cx="125" r="5" fill="#9ca3af"/>

						{/* Window with natural light */}
						<rect x="50" y="100" width="100" height="80" rx="5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
						<line x1="100" y1="100" x2="100" y2="180" stroke="#3b82f6" strokeWidth="1"/>
						<line x1="50" y1="140" x2="150" y2="140" stroke="#3b82f6" strokeWidth="1"/>
					</svg>
				</div>
			</div>

			<div className="relative z-10 w-full max-w-2xl">
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
							Registrar Clínica Dental en México
						</CardTitle>
						<p className="mt-2 text-gray-600">
							Únete a las clínicas dentales más exitosas de México
						</p>

						{/* Mexican Flag Badge */}
						<div className="mt-4 flex justify-center">
							<Badge className="border-0 bg-gradient-to-r from-green-600 via-white to-red-600 px-4 py-1 text-gray-900">
								🇲🇽 Registro Mexicano
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Clinic Information */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label
										htmlFor="clinicName"
										className="font-medium text-gray-700"
									>
										Nombre de la Clínica *
									</Label>
									<Input
										id="clinicName"
										type="text"
										placeholder="Clínica Dental Ejemplo"
										value={formData.clinicName}
										onChange={(e) =>
											setFormData({ ...formData, clinicName: e.target.value })
										}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="ownerName"
										className="font-medium text-gray-700"
									>
										Nombre del Propietario *
									</Label>
									<Input
										id="ownerName"
										type="text"
										placeholder="Dr. Juan Pérez"
										value={formData.ownerName}
										onChange={(e) =>
											setFormData({ ...formData, ownerName: e.target.value })
										}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Contact Information */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="email" className="font-medium text-gray-700">
										Correo Electrónico *
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

								<div className="space-y-2">
									<Label htmlFor="phone" className="font-medium text-gray-700">
										Teléfono *
									</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="+52 55 1234-5678"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Location Information */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="state" className="font-medium text-gray-700">
										Estado *
									</Label>
									<Select
										value={formData.state}
										onValueChange={(value) =>
											setFormData({ ...formData, state: value })
										}
									>
										<SelectTrigger className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500">
											<SelectValue placeholder="Selecciona tu estado" />
										</SelectTrigger>
										<SelectContent>
											{mexicanStates.map((state) => (
												<SelectItem key={state} value={state}>
													{state}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="city" className="font-medium text-gray-700">
										Ciudad *
									</Label>
									<Input
										id="city"
										type="text"
										placeholder="Ciudad de México"
										value={formData.city}
										onChange={(e) =>
											setFormData({ ...formData, city: e.target.value })
										}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Password Fields */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label
										htmlFor="password"
										className="font-medium text-gray-700"
									>
										Contraseña *
									</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Mínimo 8 caracteres"
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

								<div className="space-y-2">
									<Label
										htmlFor="confirmPassword"
										className="font-medium text-gray-700"
									>
										Confirmar Contraseña *
									</Label>
									<Input
										id="confirmPassword"
										type="password"
										placeholder="Repite tu contraseña"
										value={formData.confirmPassword}
										onChange={(e) =>
											setFormData({
												...formData,
												confirmPassword: e.target.value,
											})
										}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Benefits Section */}
							<div className="space-y-3 rounded-lg bg-green-50 p-4">
								<h3 className="flex items-center font-semibold text-green-800">
									<CheckCircle className="mr-2 h-5 w-5" />
									Beneficios incluidos:
								</h3>
								<div className="grid grid-cols-1 gap-2 text-green-700 text-sm md:grid-cols-2">
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4" />
										Facturación CFDI automática
									</div>
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4" />
										Integración con WhatsApp
									</div>
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4" />
										Expedientes digitales
									</div>
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4" />
										Soporte en español 24/7
									</div>
								</div>
							</div>

							{/* Register Button */}
							<Button
								type="submit"
								className="h-12 w-full bg-gradient-to-r from-green-600 to-red-600 font-semibold text-white shadow-lg hover:from-green-700 hover:to-red-700"
							>
								<Building2 className="mr-2 h-5 w-5" />
								Registrar Mi Clínica Gratis
							</Button>
						</form>

						{/* Links */}
						<div className="space-y-2 text-center">
							<div className="text-gray-600 text-sm">
								¿Ya tienes cuenta?{" "}
								<Link
									href="/es/auth/signin"
									className="font-medium text-green-600 hover:text-green-700"
								>
									Iniciar Sesión
								</Link>
							</div>
						</div>

						{/* Security and Legal */}
						<div className="space-y-3">
							<div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-50 p-3 text-gray-500 text-xs">
								<Shield className="h-4 w-4" />
								<span>
									Datos protegidos • Cumplimiento HIPAA • Encriptación SSL
								</span>
							</div>
							<div className="text-center text-gray-500 text-xs">
								Al registrarte, aceptas nuestros{" "}
								<Link
									href="/es/terms"
									className="text-green-600 hover:underline"
								>
									Términos de Servicio
								</Link>{" "}
								y{" "}
								<Link
									href="/es/privacy"
									className="text-green-600 hover:underline"
								>
									Política de Privacidad
								</Link>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Contact Info */}
				<div className="mt-6 text-center text-gray-600 text-sm">
					<p className="flex items-center justify-center space-x-4">
						<span className="flex items-center">
							<Phone className="mr-1 h-4 w-4" />
							+52 55 1234-5678
						</span>
						<span className="flex items-center">
							<Mail className="mr-1 h-4 w-4" />
							mexico@cognident.org
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
