"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Eye,
	EyeOff,
	Heart,
	MapPin,
	Building2,
	Phone,
	Mail,
	Shield,
	ArrowLeft,
	CheckCircle,
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
		"Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
		"Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
		"Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
		"Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
		"Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Handle Mexican clinic registration
		console.log("Mexican clinic registration:", formData);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center p-4">
			{/* Mexico Map Background */}
			<div className="absolute inset-0 overflow-hidden opacity-5">
				<svg viewBox="0 0 1000 600" className="h-full w-full">
					{/* Mexico Map Outline */}
					<path
						d="M80 320 L120 280 L180 250 L250 220 L320 200 L400 180 L480 170 L560 180 L640 200 L720 230 L780 260 L820 300 L850 340 L830 380 L800 420 L750 450 L700 470 L650 485 L600 500 L550 510 L500 515 L450 510 L400 500 L350 485 L300 470 L250 450 L200 420 L150 380 L120 350 Z"
						fill="url(#mexicoMapGradient)"
						stroke="#059669"
						strokeWidth="3"
					/>
					
					<defs>
						<linearGradient id="mexicoMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
							<stop offset="33%" stopColor="#ffffff" stopOpacity="0.5" />
							<stop offset="66%" stopColor="#dc2626" stopOpacity="0.3" />
							<stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
						</linearGradient>
					</defs>
				</svg>
			</div>

			<div className="relative z-10 w-full max-w-2xl">
				{/* Back to Landing */}
				<div className="mb-6">
					<Link href="/es" className="flex items-center text-gray-600 hover:text-gray-900">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver al inicio
					</Link>
				</div>

				<Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
					<CardHeader className="text-center pb-6">
						{/* Logo and Branding */}
						<div className="flex items-center justify-center mb-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-red-600 shadow-lg">
								<Heart className="h-7 w-7 text-white" />
							</div>
						</div>
						
						<CardTitle className="text-2xl font-bold text-gray-900">
							Registrar Clínica Dental en México
						</CardTitle>
						<p className="text-gray-600 mt-2">
							Únete a las clínicas dentales más exitosas de México
						</p>
						
						{/* Mexican Flag Badge */}
						<div className="flex justify-center mt-4">
							<Badge className="bg-gradient-to-r from-green-600 via-white to-red-600 text-gray-900 border-0 px-4 py-1">
								🇲🇽 Registro Mexicano
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Clinic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="clinicName" className="text-gray-700 font-medium">
										Nombre de la Clínica *
									</Label>
									<Input
										id="clinicName"
										type="text"
										placeholder="Clínica Dental Ejemplo"
										value={formData.clinicName}
										onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="ownerName" className="text-gray-700 font-medium">
										Nombre del Propietario *
									</Label>
									<Input
										id="ownerName"
										type="text"
										placeholder="Dr. Juan Pérez"
										value={formData.ownerName}
										onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Contact Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="email" className="text-gray-700 font-medium">
										Correo Electrónico *
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="clinica@ejemplo.com.mx"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone" className="text-gray-700 font-medium">
										Teléfono *
									</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="+52 55 1234-5678"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Location Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="state" className="text-gray-700 font-medium">
										Estado *
									</Label>
									<Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
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
									<Label htmlFor="city" className="text-gray-700 font-medium">
										Ciudad *
									</Label>
									<Input
										id="city"
										type="text"
										placeholder="Ciudad de México"
										value={formData.city}
										onChange={(e) => setFormData({ ...formData, city: e.target.value })}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Password Fields */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="password" className="text-gray-700 font-medium">
										Contraseña *
									</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Mínimo 8 caracteres"
											value={formData.password}
											onChange={(e) => setFormData({ ...formData, password: e.target.value })}
											className="h-12 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
										>
											{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
										Confirmar Contraseña *
									</Label>
									<Input
										id="confirmPassword"
										type="password"
										placeholder="Repite tu contraseña"
										value={formData.confirmPassword}
										onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
										className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
										required
									/>
								</div>
							</div>

							{/* Benefits Section */}
							<div className="bg-green-50 rounded-lg p-4 space-y-3">
								<h3 className="font-semibold text-green-800 flex items-center">
									<CheckCircle className="mr-2 h-5 w-5" />
									Beneficios incluidos:
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
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
								className="w-full h-12 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold shadow-lg"
							>
								<Building2 className="mr-2 h-5 w-5" />
								Registrar Mi Clínica Gratis
							</Button>
						</form>

						{/* Links */}
						<div className="text-center space-y-2">
							<div className="text-sm text-gray-600">
								¿Ya tienes cuenta?{" "}
								<Link href="/es/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
									Iniciar Sesión
								</Link>
							</div>
						</div>

						{/* Security and Legal */}
						<div className="space-y-3">
							<div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
								<Shield className="h-4 w-4" />
								<span>Datos protegidos • Cumplimiento HIPAA • Encriptación SSL</span>
							</div>
							<div className="text-xs text-gray-500 text-center">
								Al registrarte, aceptas nuestros{" "}
								<Link href="/es/terms" className="text-green-600 hover:underline">
									Términos de Servicio
								</Link>{" "}
								y{" "}
								<Link href="/es/privacy" className="text-green-600 hover:underline">
									Política de Privacidad
								</Link>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Contact Info */}
				<div className="mt-6 text-center text-sm text-gray-600">
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
