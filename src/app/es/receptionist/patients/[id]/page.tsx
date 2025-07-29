"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	ArrowLeft,
	Calendar,
	Edit,
	Heart,
	Mail,
	MapPin,
	Phone,
	Shield,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Patient {
	id: number;
	name: string;
	email: string;
	phone: string;
	whatsapp: string;
	age: number;
	gender: string;
	address: string;
	insurance: string;
	emergencyContact: string;
	lastVisit: string | null;
	nextAppointment: string | null;
	status: string;
	dateOfBirth?: string;
	curp?: string;
	rfc?: string;
	medicalHistory?: {
		allergies: string;
		medications: string;
		conditions: string;
		notes: string;
	};
}

const translations = {
	title: "Perfil del Paciente",
	backToPatients: "Volver a Pacientes",
	edit: "Editar Paciente",
	personalInfo: "Información Personal",
	contactInfo: "Información de Contacto",
	medicalInfo: "Información Médica",
	appointmentHistory: "Historial de Citas",
	treatmentHistory: "Historial de Tratamientos",
	fields: {
		name: "Nombre Completo",
		email: "Correo Electrónico",
		phone: "Teléfono",
		whatsapp: "WhatsApp",
		age: "Edad",
		gender: "Género",
		dateOfBirth: "Fecha de Nacimiento",
		curp: "CURP",
		rfc: "RFC",
		address: "Dirección",
		insurance: "Seguro Médico",
		emergencyContact: "Contacto de Emergencia",
		lastVisit: "Última Visita",
		nextAppointment: "Próxima Cita",
		status: "Estado",
		allergies: "Alergias",
		medications: "Medicamentos",
		conditions: "Condiciones Médicas",
		notes: "Notas Médicas",
	},
	status: {
		active: "Activo",
		inactive: "Inactivo",
		new: "Nuevo",
		pending: "Pendiente",
	},
	noData: "Sin información",
	loading: "Cargando...",
	error: "Error al cargar la información del paciente",
};

export default function PatientDetailPage() {
	const params = useParams();
	const patientId = params.id as string;
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPatient = async () => {
			try {
				const response = await fetch(`/api/dashboard/patients/${patientId}`);
				if (response.ok) {
					const data = await response.json();
					setPatient(data);
				} else {
					setError(translations.error);
				}
			} catch (err) {
				setError(translations.error);
			} finally {
				setLoading(false);
			}
		};

		if (patientId) {
			fetchPatient();
		}
	}, [patientId]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 border-green-200";
			case "new":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "inactive":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return translations.noData;
		return new Date(dateString).toLocaleDateString("es-MX", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
				<div className="flex h-screen items-center justify-center">
					<div className="text-center">
						<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
						<p className="text-gray-300">{translations.loading}</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !patient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
				<div className="flex h-screen items-center justify-center">
					<div className="text-center">
						<p className="text-red-400">{error || translations.error}</p>
						<Link href="/es/receptionist/patients">
							<Button className="mt-4" variant="outline">
								{translations.backToPatients}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			{/* Header */}
			<nav className="border-gray-700 border-b bg-gray-800">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<HeaderLogo />
							<div className="ml-4">
								<div className="flex items-baseline space-x-4">
									<Link
										href="/es/receptionist"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Dashboard
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Citas
									</Link>
									<Link
										href="/es/receptionist/patients"
										className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white"
									>
										Pacientes
									</Link>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Badge className="border-0 bg-gradient-to-r from-green-600 via-white to-red-600 px-3 py-1 text-gray-900">
								🇲🇽 México
							</Badge>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center space-x-4">
								<Link href="/es/receptionist/patients">
									<Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
										<ArrowLeft className="mr-2 h-4 w-4" />
										{translations.backToPatients}
									</Button>
								</Link>
								<div>
									<h1 className="font-bold text-3xl text-white">{patient.name}</h1>
									<p className="mt-1 text-gray-400">{translations.title}</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Badge className={getStatusColor(patient.status)}>
								{translations.status[patient.status as keyof typeof translations.status] || patient.status}
							</Badge>
							<Button className="bg-blue-600 hover:bg-blue-700">
								<Edit className="mr-2 h-4 w-4" />
								{translations.edit}
							</Button>
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Left Column - Personal & Contact Info */}
					<div className="space-y-6 lg:col-span-2">
						{/* Personal Information */}
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<User className="mr-2 h-5 w-5" />
									{translations.personalInfo}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="font-medium text-gray-300">{translations.fields.name}</p>
										<p className="text-white">{patient.name}</p>
									</div>
									<div>
										<p className="font-medium text-gray-300">{translations.fields.age}</p>
										<p className="text-white">{patient.age} años</p>
									</div>
									<div>
										<p className="font-medium text-gray-300">{translations.fields.gender}</p>
										<p className="text-white">{patient.gender}</p>
									</div>
									<div>
										<p className="font-medium text-gray-300">{translations.fields.dateOfBirth}</p>
										<p className="text-white">{patient.dateOfBirth || translations.noData}</p>
									</div>
									{patient.curp && (
										<div>
											<p className="font-medium text-gray-300">{translations.fields.curp}</p>
											<p className="text-white">{patient.curp}</p>
										</div>
									)}
									{patient.rfc && (
										<div>
											<p className="font-medium text-gray-300">{translations.fields.rfc}</p>
											<p className="text-white">{patient.rfc}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Contact Information */}
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<Phone className="mr-2 h-5 w-5" />
									{translations.contactInfo}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="font-medium text-gray-300">{translations.fields.email}</p>
										<div className="flex items-center space-x-2">
											<Mail className="h-4 w-4 text-gray-400" />
											<p className="text-white">{patient.email}</p>
										</div>
									</div>
									<div>
										<p className="font-medium text-gray-300">{translations.fields.phone}</p>
										<div className="flex items-center space-x-2">
											<Phone className="h-4 w-4 text-gray-400" />
											<p className="text-white">{patient.phone}</p>
										</div>
									</div>
									{patient.whatsapp && (
										<div>
											<p className="font-medium text-gray-300">{translations.fields.whatsapp}</p>
											<p className="text-white">{patient.whatsapp}</p>
										</div>
									)}
									<div>
										<p className="font-medium text-gray-300">{translations.fields.emergencyContact}</p>
										<div className="flex items-center space-x-2">
											<Users className="h-4 w-4 text-gray-400" />
											<p className="text-white">{patient.emergencyContact}</p>
										</div>
									</div>
								</div>
								<div>
									<p className="font-medium text-gray-300">{translations.fields.address}</p>
									<div className="flex items-center space-x-2">
										<MapPin className="h-4 w-4 text-gray-400" />
										<p className="text-white">{patient.address}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Medical Information */}
						{patient.medicalHistory && (
							<Card className="border-gray-700 bg-gray-800">
								<CardHeader>
									<CardTitle className="flex items-center text-white">
										<Heart className="mr-2 h-5 w-5" />
										{translations.medicalInfo}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<p className="font-medium text-gray-300">{translations.fields.allergies}</p>
											<p className="text-white">{patient.medicalHistory.allergies || translations.noData}</p>
										</div>
										<div>
											<p className="font-medium text-gray-300">{translations.fields.medications}</p>
											<p className="text-white">{patient.medicalHistory.medications || translations.noData}</p>
										</div>
									</div>
									<div>
										<p className="font-medium text-gray-300">{translations.fields.conditions}</p>
										<p className="text-white">{patient.medicalHistory.conditions || translations.noData}</p>
									</div>
									<div>
										<p className="font-medium text-gray-300">{translations.fields.notes}</p>
										<p className="text-white">{patient.medicalHistory.notes || translations.noData}</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Right Column - Summary & Actions */}
					<div className="space-y-6">
						{/* Quick Summary */}
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<Calendar className="mr-2 h-5 w-5" />
									Resumen
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="font-medium text-gray-300">{translations.fields.lastVisit}</p>
									<p className="text-white">{formatDate(patient.lastVisit)}</p>
								</div>
								<div>
									<p className="font-medium text-gray-300">{translations.fields.nextAppointment}</p>
									<p className="text-white">{formatDate(patient.nextAppointment)}</p>
								</div>
								<div>
									<p className="font-medium text-gray-300">{translations.fields.insurance}</p>
									<div className="flex items-center space-x-2">
										<Shield className="h-4 w-4 text-gray-400" />
										<p className="text-white">{patient.insurance}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="text-white">Acciones Rápidas</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
									<Calendar className="mr-2 h-4 w-4" />
									Agendar Cita
								</Button>
								<Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
									<Phone className="mr-2 h-4 w-4" />
									Llamar Paciente
								</Button>
								<Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
									<Mail className="mr-2 h-4 w-4" />
									Enviar Email
								</Button>
								<Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
									<Edit className="mr-2 h-4 w-4" />
									Editar Información
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}