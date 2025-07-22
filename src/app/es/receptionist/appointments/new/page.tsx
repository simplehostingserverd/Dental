"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
	Calendar, 
	Clock, 
	User, 
	Phone, 
	Mail,
	MapPin,
	Save,
	ArrowLeft,
	Plus,
	Search,
	UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Spanish translations
const translations = {
	title: "Nueva Cita",
	subtitle: "Programar una nueva cita para el paciente",
	patientInfo: "Información del Paciente",
	appointmentDetails: "Detalles de la Cita",
	selectPatient: "Seleccionar Paciente",
	existingPatient: "Paciente Existente",
	newPatient: "Nuevo Paciente",
	searchPatient: "Buscar paciente...",
	createNewPatient: "Crear Nuevo Paciente",
	patientName: "Nombre del Paciente",
	email: "Correo Electrónico",
	phone: "Teléfono",
	address: "Dirección",
	emergencyContact: "Contacto de Emergencia",
	appointmentDate: "Fecha de la Cita",
	appointmentTime: "Hora de la Cita",
	duration: "Duración",
	treatmentType: "Tipo de Tratamiento",
	dentist: "Dentista",
	notes: "Notas Adicionales",
	saveAppointment: "Guardar Cita",
	cancel: "Cancelar",
	navigation: {
		dashboard: "Panel Principal",
		appointments: "Citas",
		patients: "Pacientes",
		communications: "Comunicaciones"
	}
};

export default function SpanishNewAppointmentPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [patientType, setPatientType] = useState<"existing" | "new">("existing");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPatient, setSelectedPatient] = useState("");

	// Form data
	const [formData, setFormData] = useState({
		// Patient info (for new patients)
		patientName: "",
		email: "",
		phone: "",
		address: "",
		emergencyContact: "",
		// Appointment details
		date: "",
		time: "",
		duration: "30",
		treatmentType: "",
		dentist: "",
		notes: ""
	});

	// Mock data for existing patients
	const existingPatients = [
		{ id: "1", name: "María González", email: "maria@email.com", phone: "+52 55 1234 5678" },
		{ id: "2", name: "Carlos Hernández", email: "carlos@email.com", phone: "+52 55 2345 6789" },
		{ id: "3", name: "Ana López", email: "ana@email.com", phone: "+52 55 3456 7890" },
		{ id: "4", name: "Luis Morales", email: "luis@email.com", phone: "+52 55 4567 8901" },
		{ id: "5", name: "Carmen Ruiz", email: "carmen@email.com", phone: "+52 55 5678 9012" }
	];

	// Mock data for dentists
	const dentists = [
		{ id: "1", name: "Dr. Roberto Sánchez" },
		{ id: "2", name: "Dra. Patricia Mendoza" },
		{ id: "3", name: "Dr. Miguel Torres" },
		{ id: "4", name: "Dra. Laura Jiménez" }
	];

	// Treatment types
	const treatmentTypes = [
		"Limpieza Dental",
		"Revisión General",
		"Empaste",
		"Extracción",
		"Endodoncia",
		"Corona Dental",
		"Implante",
		"Ortodoncia",
		"Blanqueamiento",
		"Cirugía Oral"
	];

	// Time slots
	const timeSlots = [
		"08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
		"11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
		"14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
		"17:00", "17:30", "18:00", "18:30"
	];

	const filteredPatients = existingPatients.filter(patient =>
		patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		patient.phone.includes(searchTerm)
	);

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Prepare appointment data
			const appointmentData = {
				patientId: patientType === "existing" ? selectedPatient : null,
				newPatient: patientType === "new" ? {
					name: formData.patientName,
					email: formData.email,
					phone: formData.phone,
					address: formData.address,
					emergencyContact: formData.emergencyContact
				} : null,
				date: formData.date,
				time: formData.time,
				duration: parseInt(formData.duration),
				treatmentType: formData.treatmentType,
				dentistId: formData.dentist,
				notes: formData.notes
			};

			const response = await fetch("/api/dashboard/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(appointmentData),
			});

			if (response.ok) {
				router.push("/es/receptionist/appointments?success=appointment-created");
			} else {
				const errorData = await response.json();
				alert(errorData.error || errorData.message || "Error al crear la cita");
			}
		} catch (error) {
			console.error("Error creating appointment:", error);
			alert("Error al crear la cita. Por favor intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Navigation Header */}
			<nav className="border-gray-700 border-b bg-gray-800">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link href="/es" className="flex items-center">
								<HeaderLogo className="text-white" />
							</Link>
							<div className="ml-6 hidden md:block">
								<div className="flex items-baseline space-x-4">
									<Link
										href="/es/receptionist"
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
									>
										{translations.navigation.dashboard}
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md bg-gray-900 px-3 py-2 text-white text-sm font-medium"
									>
										{translations.navigation.appointments}
									</Link>
									<Link
										href="/es/receptionist/patients"
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
									>
										{translations.navigation.patients}
									</Link>
									<Link
										href="/es/receptionist/communications"
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
									>
										{translations.navigation.communications}
									</Link>
								</div>
							</div>
						</div>
						<Link
							href="/es/receptionist/appointments"
							className="flex items-center rounded-md bg-gray-600 px-4 py-2 text-white text-sm font-medium hover:bg-gray-500"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Volver
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-white">{translations.title}</h1>
					<p className="mt-2 text-gray-400">{translations.subtitle}</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Patient Selection */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="text-white">{translations.patientInfo}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Patient Type Selection */}
							<div className="flex space-x-4">
								<Button
									type="button"
									variant={patientType === "existing" ? "default" : "outline"}
									onClick={() => setPatientType("existing")}
									className="flex-1"
								>
									<User className="mr-2 h-4 w-4" />
									{translations.existingPatient}
								</Button>
								<Button
									type="button"
									variant={patientType === "new" ? "default" : "outline"}
									onClick={() => setPatientType("new")}
									className="flex-1"
								>
									<UserPlus className="mr-2 h-4 w-4" />
									{translations.newPatient}
								</Button>
							</div>

							{/* Existing Patient Selection */}
							{patientType === "existing" && (
								<div className="space-y-4">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<Input
											placeholder={translations.searchPatient}
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400"
										/>
									</div>
									<Select value={selectedPatient} onValueChange={setSelectedPatient}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder={translations.selectPatient} />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											{filteredPatients.map((patient) => (
												<SelectItem key={patient.id} value={patient.id}>
													<div className="flex flex-col">
														<span className="font-medium text-white">{patient.name}</span>
														<span className="text-gray-400 text-sm">{patient.email} • {patient.phone}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							{/* New Patient Form */}
							{patientType === "new" && (
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<Label htmlFor="patientName" className="text-gray-300">
											{translations.patientName} *
										</Label>
										<Input
											id="patientName"
											value={formData.patientName}
											onChange={(e) => handleInputChange("patientName", e.target.value)}
											className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
											required
										/>
									</div>
									<div>
										<Label htmlFor="email" className="text-gray-300">
											{translations.email} *
										</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
											required
										/>
									</div>
									<div>
										<Label htmlFor="phone" className="text-gray-300">
											{translations.phone} *
										</Label>
										<Input
											id="phone"
											value={formData.phone}
											onChange={(e) => handleInputChange("phone", e.target.value)}
											className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
											placeholder="+52 55 1234 5678"
											required
										/>
									</div>
									<div>
										<Label htmlFor="emergencyContact" className="text-gray-300">
											{translations.emergencyContact}
										</Label>
										<Input
											id="emergencyContact"
											value={formData.emergencyContact}
											onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
											className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
											placeholder="+52 55 1234 5678"
										/>
									</div>
									<div className="md:col-span-2">
										<Label htmlFor="address" className="text-gray-300">
											{translations.address}
										</Label>
										<Input
											id="address"
											value={formData.address}
											onChange={(e) => handleInputChange("address", e.target.value)}
											className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
											placeholder="Calle, Colonia, Ciudad, Estado, CP"
										/>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Appointment Details */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="text-white">{translations.appointmentDetails}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label htmlFor="date" className="text-gray-300">
										{translations.appointmentDate} *
									</Label>
									<Input
										id="date"
										type="date"
										value={formData.date}
										onChange={(e) => handleInputChange("date", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white"
										min={new Date().toISOString().split('T')[0]}
										required
									/>
								</div>
								<div>
									<Label htmlFor="time" className="text-gray-300">
										{translations.appointmentTime} *
									</Label>
									<Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar hora" />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											{timeSlots.map((time) => (
												<SelectItem key={time} value={time}>
													{time}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="duration" className="text-gray-300">
										{translations.duration} (minutos) *
									</Label>
									<Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											<SelectItem value="15">15 minutos</SelectItem>
											<SelectItem value="30">30 minutos</SelectItem>
											<SelectItem value="45">45 minutos</SelectItem>
											<SelectItem value="60">1 hora</SelectItem>
											<SelectItem value="90">1.5 horas</SelectItem>
											<SelectItem value="120">2 horas</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="treatmentType" className="text-gray-300">
										{translations.treatmentType} *
									</Label>
									<Select value={formData.treatmentType} onValueChange={(value) => handleInputChange("treatmentType", value)}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar tratamiento" />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											{treatmentTypes.map((treatment) => (
												<SelectItem key={treatment} value={treatment}>
													{treatment}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="dentist" className="text-gray-300">
										{translations.dentist} *
									</Label>
									<Select value={formData.dentist} onValueChange={(value) => handleInputChange("dentist", value)}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar dentista" />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											{dentists.map((dentist) => (
												<SelectItem key={dentist.id} value={dentist.id}>
													{dentist.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="notes" className="text-gray-300">
										{translations.notes}
									</Label>
									<Textarea
										id="notes"
										value={formData.notes}
										onChange={(e) => handleInputChange("notes", e.target.value)}
										className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
										placeholder="Notas adicionales sobre la cita..."
										rows={3}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
						>
							{translations.cancel}
						</Button>
						<Button
							type="submit"
							disabled={isLoading || (patientType === "existing" && !selectedPatient) || !formData.date || !formData.time || !formData.treatmentType || !formData.dentist}
							className="bg-blue-600 hover:bg-blue-700"
						>
							<Save className="mr-2 h-4 w-4" />
							{isLoading ? "Guardando..." : translations.saveAppointment}
						</Button>
					</div>
				</form>
			</main>
		</div>
	);
}
