"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	MapPin,
	Phone,
	Mail,
	Users,
	Building2,
	Stethoscope,
	CreditCard,
	Shield,
	Star,
	ArrowRight,
	Heart,
	Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MexicoLandingPage() {
	const majorCities = [
		{ name: "Ciudad de México", patients: "50,000+", clinics: 120 },
		{ name: "Guadalajara", patients: "25,000+", clinics: 65 },
		{ name: "Monterrey", patients: "20,000+", clinics: 45 },
		{ name: "Puebla", patients: "15,000+", clinics: 35 },
		{ name: "Tijuana", patients: "12,000+", clinics: 28 },
		{ name: "León", patients: "10,000+", clinics: 22 },
		{ name: "Juárez", patients: "8,000+", clinics: 18 },
		{ name: "Mérida", patients: "7,000+", clinics: 15 },
	];

	const features = [
		{
			icon: Calendar,
			title: "Gestión de Citas",
			description: "Sistema avanzado de citas con recordatorios automáticos por SMS y WhatsApp"
		},
		{
			icon: Users,
			title: "Expedientes Digitales",
			description: "Historiales médicos completos con radiografías y fotografías dentales"
		},
		{
			icon: CreditCard,
			title: "Facturación CFDI",
			description: "Facturación electrónica automática conforme al SAT mexicano"
		},
		{
			icon: Shield,
			title: "Seguridad HIPAA",
			description: "Protección total de datos médicos con encriptación de nivel bancario"
		},
		{
			icon: Stethoscope,
			title: "Odontograma Digital",
			description: "Charting dental interactivo con planes de tratamiento detallados"
		},
		{
			icon: Phone,
			title: "Comunicación Multicanal",
			description: "SMS, WhatsApp, email y llamadas integradas en una sola plataforma"
		}
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-red-600">
								<Heart className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-900">Cognident México</h1>
								<p className="text-sm text-gray-600">Gestión Dental Profesional</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Badge variant="outline" className="border-green-600 text-green-600">
								🇲🇽 México
							</Badge>
							<Link href="/es/auth/signin">
								<Button variant="outline">Iniciar Sesión</Button>
							</Link>
							<Link href="/es/auth/signup">
								<Button className="bg-gradient-to-r from-green-600 to-red-600 text-white">
									Registrarse
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section with Mexico Map Background */}
			<section className="relative py-20">
				{/* Mexico Map Background */}
				<div className="absolute inset-0 opacity-10">
					<svg viewBox="0 0 1000 600" className="h-full w-full">
						{/* Simplified Mexico Map Outline */}
						<path
							d="M100 300 L200 250 L350 200 L500 180 L650 200 L800 250 L850 300 L800 400 L700 450 L600 480 L500 500 L400 480 L300 450 L200 400 L150 350 Z"
							fill="url(#mexicoGradient)"
							stroke="#059669"
							strokeWidth="2"
						/>
						<defs>
							<linearGradient id="mexicoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="#059669" />
								<stop offset="50%" stopColor="#ffffff" />
								<stop offset="100%" stopColor="#dc2626" />
							</linearGradient>
						</defs>
						{/* Major Cities */}
						<circle cx="400" cy="350" r="8" fill="#dc2626" />
						<text x="410" y="355" className="text-sm font-medium fill-gray-700">CDMX</text>
						<circle cx="300" cy="320" r="6" fill="#059669" />
						<text x="310" y="325" className="text-xs fill-gray-600">Guadalajara</text>
						<circle cx="450" cy="280" r="6" fill="#059669" />
						<text x="460" y="285" className="text-xs fill-gray-600">Monterrey</text>
						<circle cx="420" cy="330" r="5" fill="#059669" />
						<text x="430" y="335" className="text-xs fill-gray-600">Puebla</text>
					</svg>
				</div>

				<div className="container relative mx-auto px-4 text-center">
					<div className="mx-auto max-w-4xl">
						<h1 className="mb-6 text-5xl font-bold text-gray-900">
							Sistema de Gestión Dental
							<span className="block text-transparent bg-gradient-to-r from-green-600 to-red-600 bg-clip-text">
								Líder en México
							</span>
						</h1>
						<p className="mb-8 text-xl text-gray-600">
							Más de 300 clínicas dentales en México confían en Cognident para gestionar 
							sus pacientes, citas, facturación y expedientes médicos digitales.
						</p>
						<div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
							<Link href="/es/auth/signup">
								<Button size="lg" className="bg-gradient-to-r from-green-600 to-red-600 text-white">
									<Building2 className="mr-2 h-5 w-5" />
									Registrar Mi Clínica
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/es/demo">
								<Button size="lg" variant="outline">
									<Calendar className="mr-2 h-5 w-5" />
									Ver Demo en Vivo
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Presencia Nacional en México
						</h2>
						<p className="text-gray-600">
							Clínicas dentales en las principales ciudades del país
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{majorCities.map((city, index) => (
							<Card key={index} className="text-center">
								<CardHeader>
									<CardTitle className="flex items-center justify-center space-x-2">
										<MapPin className="h-5 w-5 text-red-600" />
										<span>{city.name}</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="text-2xl font-bold text-green-600">
											{city.clinics}
										</div>
										<div className="text-sm text-gray-600">Clínicas Activas</div>
										<div className="text-lg font-semibold text-gray-900">
											{city.patients}
										</div>
										<div className="text-sm text-gray-600">Pacientes Atendidos</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Funcionalidades Diseñadas para México
						</h2>
						<p className="text-gray-600">
							Sistema completo adaptado a las necesidades del sector dental mexicano
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<Card key={index} className="h-full">
								<CardHeader>
									<div className="flex items-center space-x-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-100 to-red-100">
											<feature.icon className="h-6 w-6 text-green-600" />
										</div>
										<CardTitle className="text-lg">{feature.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600">{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-gradient-to-r from-green-600 to-red-600">
				<div className="container mx-auto px-4 text-center">
					<div className="mx-auto max-w-3xl">
						<h2 className="mb-4 text-3xl font-bold text-white">
							¿Listo para Modernizar tu Clínica Dental?
						</h2>
						<p className="mb-8 text-xl text-green-100">
							Únete a las clínicas dentales más exitosas de México. 
							Configuración gratuita y soporte en español.
						</p>
						<div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
							<Link href="/es/auth/signup">
								<Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
									<Award className="mr-2 h-5 w-5" />
									Comenzar Gratis
								</Button>
							</Link>
							<Link href="tel:+52-55-1234-5678">
								<Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
									<Phone className="mr-2 h-5 w-5" />
									Llamar: +52 55 1234-5678
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 py-12 text-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-3 mb-4">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-red-600">
									<Heart className="h-5 w-5 text-white" />
								</div>
								<span className="text-xl font-bold">Cognident México</span>
							</div>
							<p className="text-gray-400">
								La plataforma de gestión dental más confiable de México.
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Contacto</h3>
							<div className="space-y-2 text-gray-400">
								<div className="flex items-center space-x-2">
									<Phone className="h-4 w-4" />
									<span>+52 55 1234-5678</span>
								</div>
								<div className="flex items-center space-x-2">
									<Mail className="h-4 w-4" />
									<span>mexico@cognident.org</span>
								</div>
								<div className="flex items-center space-x-2">
									<MapPin className="h-4 w-4" />
									<span>Ciudad de México, México</span>
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Servicios</h3>
							<div className="space-y-2 text-gray-400">
								<div>Gestión de Pacientes</div>
								<div>Facturación CFDI</div>
								<div>Expedientes Digitales</div>
								<div>Comunicación WhatsApp</div>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Legal</h3>
							<div className="space-y-2 text-gray-400">
								<div>Términos de Servicio</div>
								<div>Política de Privacidad</div>
								<div>Cumplimiento HIPAA</div>
								<div>Protección de Datos</div>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 Cognident México. Todos los derechos reservados.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
