"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	Clock, 
	User, 
	Phone, 
	Calendar,
	CheckCircle,
	AlertCircle,
	Search,
	UserCheck,
	FileText,
	CreditCard,
	Stethoscope,
	MapPin,
	Timer,
	Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Spanish translations
const translations = {
	title: "Check-in de Pacientes",
	subtitle: "Gestiona el registro de llegada de pacientes",
	todayAppointments: "Citas de Hoy",
	searchPatient: "Buscar paciente...",
	patientInfo: "Información del Paciente",
	appointmentDetails: "Detalles de la Cita",
	checkInProcess: "Proceso de Check-in",
	waitingRoom: "Sala de Espera",
	checkIn: "Registrar Llegada",
	checkOut: "Registrar Salida",
	noShow: "No Asistió",
	arrived: "Llegó",
	waiting: "Esperando",
	inTreatment: "En Tratamiento",
	completed: "Completado",
	cancelled: "Cancelado",
	navigation: {
		dashboard: "Panel Principal",
		appointments: "Citas",
		patients: "Pacientes",
		communications: "Comunicaciones"
	},
	checkInSteps: {
		arrival: "Llegada",
		documentation: "Documentación",
		payment: "Pago",
		waiting: "Sala de Espera",
		treatment: "Tratamiento"
	},
	actions: {
		checkIn: "Check-in",
		viewDetails: "Ver Detalles",
		updateStatus: "Actualizar Estado",
		sendToTreatment: "Enviar a Tratamiento",
		markCompleted: "Marcar Completado"
	}
};

interface Patient {
	id: string;
	name: string;
	phone: string;
	email: string;
	emergencyContact?: string;
}

interface Appointment {
	id: string;
	time: string;
	duration: number;
	patient: Patient;
	dentist: string;
	treatment: string;
	status: "scheduled" | "arrived" | "waiting" | "inTreatment" | "completed" | "cancelled" | "noShow";
	checkInTime?: string;
	notes?: string;
	paymentStatus: "pending" | "partial" | "completed";
	insuranceVerified: boolean;
}

export default function SpanishCheckInPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [checkInNotes, setCheckInNotes] = useState("");
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every minute
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	// Mock data for today's appointments
	const appointments: Appointment[] = [
		{
			id: "1",
			time: "09:00",
			duration: 30,
			patient: {
				id: "1",
				name: "María González",
				phone: "+52 55 1234 5678",
				email: "maria@email.com",
				emergencyContact: "+52 55 9876 5432"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Limpieza Dental",
			status: "arrived",
			checkInTime: "08:55",
			paymentStatus: "completed",
			insuranceVerified: true
		},
		{
			id: "2",
			time: "09:30",
			duration: 60,
			patient: {
				id: "2",
				name: "Carlos Hernández",
				phone: "+52 55 2345 6789",
				email: "carlos@email.com"
			},
			dentist: "Dra. Patricia Mendoza",
			treatment: "Endodoncia",
			status: "waiting",
			checkInTime: "09:25",
			paymentStatus: "partial",
			insuranceVerified: false
		},
		{
			id: "3",
			time: "10:30",
			duration: 45,
			patient: {
				id: "3",
				name: "Ana López",
				phone: "+52 55 3456 7890",
				email: "ana@email.com"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Empaste",
			status: "inTreatment",
			checkInTime: "10:25",
			paymentStatus: "completed",
			insuranceVerified: true
		},
		{
			id: "4",
			time: "11:15",
			duration: 30,
			patient: {
				id: "4",
				name: "Luis Morales",
				phone: "+52 55 4567 8901",
				email: "luis@email.com"
			},
			dentist: "Dr. Miguel Torres",
			treatment: "Revisión General",
			status: "scheduled",
			paymentStatus: "pending",
			insuranceVerified: false
		},
		{
			id: "5",
			time: "14:00",
			duration: 90,
			patient: {
				id: "5",
				name: "Carmen Ruiz",
				phone: "+52 55 5678 9012",
				email: "carmen@email.com"
			},
			dentist: "Dra. Laura Jiménez",
			treatment: "Implante",
			status: "scheduled",
			paymentStatus: "pending",
			insuranceVerified: true
		}
	];

	// Filter appointments
	const filteredAppointments = appointments.filter(appointment =>
		appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		appointment.patient.phone.includes(searchTerm) ||
		appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled": return "bg-blue-100 text-blue-800";
			case "arrived": return "bg-green-100 text-green-800";
			case "waiting": return "bg-yellow-100 text-yellow-800";
			case "inTreatment": return "bg-purple-100 text-purple-800";
			case "completed": return "bg-gray-100 text-gray-800";
			case "cancelled": return "bg-red-100 text-red-800";
			case "noShow": return "bg-orange-100 text-orange-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "arrived": return <UserCheck className="h-3 w-3" />;
			case "waiting": return <Clock className="h-3 w-3" />;
			case "inTreatment": return <Stethoscope className="h-3 w-3" />;
			case "completed": return <CheckCircle className="h-3 w-3" />;
			case "cancelled": return <AlertCircle className="h-3 w-3" />;
			default: return <Calendar className="h-3 w-3" />;
		}
	};

	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case "completed": return "bg-green-100 text-green-800";
			case "partial": return "bg-yellow-100 text-yellow-800";
			case "pending": return "bg-red-100 text-red-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const handleCheckIn = (appointmentId: string) => {
		// Here you would call the API to update the appointment status
		console.log("Checking in appointment:", appointmentId);
		// Update local state for demo
		const appointment = appointments.find(a => a.id === appointmentId);
		if (appointment) {
			appointment.status = "arrived";
			appointment.checkInTime = currentTime.toLocaleTimeString('es-MX', { 
				hour: '2-digit', 
				minute: '2-digit' 
			});
		}
	};

	const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
		// Here you would call the API to update the appointment status
		console.log("Updating status:", appointmentId, newStatus);
	};

	const getWaitingTime = (checkInTime?: string) => {
		if (!checkInTime) return null;
		const timeParts = checkInTime.split(':').map(Number);
		if (timeParts.length !== 2) return null;
		const [hours, minutes] = timeParts;
		if (hours === undefined || minutes === undefined) return null;
		const checkIn = new Date();
		checkIn.setHours(hours, minutes, 0, 0);
		const now = new Date();
		const diffMs = now.getTime() - checkIn.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		return diffMins;
	};

	const waitingPatients = appointments.filter(a => a.status === "waiting" || a.status === "arrived");

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
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
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
						<div className="text-gray-300 text-sm">
							{currentTime.toLocaleString('es-MX', {
								weekday: 'long',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-white">{translations.title}</h1>
					<p className="mt-2 text-gray-400">{translations.subtitle}</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Today's Appointments */}
					<div className="lg:col-span-2">
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-white">{translations.todayAppointments}</CardTitle>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<Input
											placeholder={translations.searchPatient}
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400 w-64"
										/>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{filteredAppointments.map((appointment) => (
										<div
											key={appointment.id}
											className="rounded-lg border border-gray-700 bg-gray-900 p-4 transition-colors hover:bg-gray-800"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<div className="flex items-center space-x-2">
															<Clock className="h-4 w-4 text-gray-400" />
															<span className="font-medium text-white">
																{appointment.time} ({appointment.duration} min)
															</span>
														</div>
														<Badge className={getStatusColor(appointment.status)}>
															{getStatusIcon(appointment.status)}
															<span className="ml-1">
																{appointment.status === "scheduled" ? "Programada" :
																 appointment.status === "arrived" ? "Llegó" :
																 appointment.status === "waiting" ? "Esperando" :
																 appointment.status === "inTreatment" ? "En Tratamiento" :
																 appointment.status === "completed" ? "Completado" :
																 appointment.status === "cancelled" ? "Cancelado" :
																 appointment.status === "noShow" ? "No Asistió" :
																 appointment.status}
															</span>
														</Badge>
														{appointment.checkInTime && (
															<Badge variant="outline" className="border-gray-600 text-gray-300">
																<Timer className="mr-1 h-3 w-3" />
																{getWaitingTime(appointment.checkInTime)} min
															</Badge>
														)}
													</div>
													<div className="mt-2">
														<div className="flex items-center space-x-2">
															<User className="h-4 w-4 text-gray-400" />
															<span className="font-medium text-white">{appointment.patient.name}</span>
															<span className="text-gray-400">•</span>
															<span className="text-gray-400">{appointment.patient.phone}</span>
														</div>
														<div className="mt-1 text-gray-300 text-sm">
															<span className="font-medium">{appointment.dentist}</span> • {appointment.treatment}
														</div>
														<div className="mt-2 flex items-center space-x-4">
															<Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
																<CreditCard className="mr-1 h-3 w-3" />
																{appointment.paymentStatus === "completed" ? "Pagado" : 
																 appointment.paymentStatus === "partial" ? "Pago Parcial" : "Pendiente"}
															</Badge>
															<Badge className={appointment.insuranceVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
																<FileText className="mr-1 h-3 w-3" />
																{appointment.insuranceVerified ? "Seguro Verificado" : "Verificar Seguro"}
															</Badge>
														</div>
													</div>
												</div>
												<div className="flex flex-col space-y-2">
													{appointment.status === "scheduled" && (
														<Button
															size="sm"
															onClick={() => handleCheckIn(appointment.id)}
															className="bg-green-600 hover:bg-green-700"
														>
															<UserCheck className="mr-2 h-4 w-4" />
															{translations.actions.checkIn}
														</Button>
													)}
													{appointment.status === "arrived" && (
														<Button
															size="sm"
															onClick={() => handleStatusUpdate(appointment.id, "waiting")}
															className="bg-yellow-600 hover:bg-yellow-700"
														>
															<Clock className="mr-2 h-4 w-4" />
															A Sala de Espera
														</Button>
													)}
													{appointment.status === "waiting" && (
														<Button
															size="sm"
															onClick={() => handleStatusUpdate(appointment.id, "inTreatment")}
															className="bg-purple-600 hover:bg-purple-700"
														>
															<Stethoscope className="mr-2 h-4 w-4" />
															{translations.actions.sendToTreatment}
														</Button>
													)}
													{appointment.status === "inTreatment" && (
														<Button
															size="sm"
															onClick={() => handleStatusUpdate(appointment.id, "completed")}
															className="bg-gray-600 hover:bg-gray-700"
														>
															<CheckCircle className="mr-2 h-4 w-4" />
															{translations.actions.markCompleted}
														</Button>
													)}
													<Button
														variant="outline"
														size="sm"
														onClick={() => setSelectedAppointment(appointment)}
														className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
													>
														{translations.actions.viewDetails}
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Waiting Room Status */}
					<div className="space-y-6">
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<Users className="mr-2 h-5 w-5" />
									{translations.waitingRoom}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{waitingPatients.length === 0 ? (
										<p className="text-center text-gray-400">No hay pacientes esperando</p>
									) : (
										waitingPatients.map((appointment) => (
											<div key={appointment.id} className="rounded-lg border border-gray-700 bg-gray-900 p-3">
												<div className="flex items-center justify-between">
													<div>
														<p className="font-medium text-white">{appointment.patient.name}</p>
														<p className="text-gray-400 text-sm">{appointment.treatment}</p>
													</div>
													<div className="text-right">
														<Badge className={getStatusColor(appointment.status)}>
															{getStatusIcon(appointment.status)}
														</Badge>
														{appointment.checkInTime && (
															<p className="mt-1 text-gray-400 text-xs">
																{getWaitingTime(appointment.checkInTime)} min
															</p>
														)}
													</div>
												</div>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="text-white">Estadísticas del Día</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-gray-400">Total de Citas:</span>
										<span className="font-medium text-white">{appointments.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Check-ins:</span>
										<span className="font-medium text-white">
											{appointments.filter(a => a.status !== "scheduled").length}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">En Espera:</span>
										<span className="font-medium text-white">
											{appointments.filter(a => a.status === "waiting" || a.status === "arrived").length}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">En Tratamiento:</span>
										<span className="font-medium text-white">
											{appointments.filter(a => a.status === "inTreatment").length}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Completadas:</span>
										<span className="font-medium text-white">
											{appointments.filter(a => a.status === "completed").length}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
