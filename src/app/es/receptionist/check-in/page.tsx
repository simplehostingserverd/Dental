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
	Camera,
	Printer,
	QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Spanish translations
const translations = {
	title: "Check-in de Pacientes",
	subtitle: "Gestiona el registro de llegada de pacientes",
	todayAppointments: "Citas de Hoy",
	checkInProcess: "Proceso de Check-in",
	searchPatient: "Buscar paciente...",
	patientInfo: "Información del Paciente",
	appointmentDetails: "Detalles de la Cita",
	checkInNotes: "Notas de Check-in",
	paymentStatus: "Estado de Pago",
	documents: "Documentos",
	checkIn: "Registrar Llegada",
	checkOut: "Registrar Salida",
	noShow: "No Asistió",
	reschedule: "Reprogramar",
	cancel: "Cancelar",
	print: "Imprimir",
	navigation: {
		dashboard: "Panel Principal",
		appointments: "Citas",
		patients: "Pacientes",
		communications: "Comunicaciones"
	},
	appointmentStatus: {
		scheduled: "Programada",
		confirmed: "Confirmada",
		checkedIn: "Registrado",
		inProgress: "En Progreso",
		completed: "Completada",
		cancelled: "Cancelada",
		noShow: "No Asistió"
	},
	paymentStatus: {
		pending: "Pendiente",
		partial: "Parcial",
		paid: "Pagado",
		insurance: "Seguro"
	}
};

interface TodayAppointment {
	id: string;
	time: string;
	patient: {
		id: string;
		name: string;
		phone: string;
		email: string;
		dateOfBirth: string;
		address: string;
		emergencyContact: string;
	};
	dentist: string;
	treatment: string;
	duration: number;
	status: "scheduled" | "confirmed" | "checkedIn" | "inProgress" | "completed" | "cancelled" | "noShow";
	paymentStatus: "pending" | "partial" | "paid" | "insurance";
	estimatedCost: number;
	notes?: string;
	checkInTime?: string;
	checkOutTime?: string;
}

export default function SpanishCheckInPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAppointment, setSelectedAppointment] = useState<TodayAppointment | null>(null);
	const [checkInNotes, setCheckInNotes] = useState("");
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every minute
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	// Mock data for today's appointments
	const todayAppointments: TodayAppointment[] = [
		{
			id: "1",
			time: "09:00",
			patient: {
				id: "p1",
				name: "María González",
				phone: "+52 55 1234 5678",
				email: "maria@email.com",
				dateOfBirth: "1985-03-15",
				address: "Av. Reforma 123, Col. Centro, CDMX",
				emergencyContact: "+52 55 9876 5432"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Limpieza Dental",
			duration: 30,
			status: "confirmed",
			paymentStatus: "pending",
			estimatedCost: 800,
			notes: "Primera visita del año"
		},
		{
			id: "2",
			time: "09:30",
			patient: {
				id: "p2",
				name: "Carlos Hernández",
				phone: "+52 55 2345 6789",
				email: "carlos@email.com",
				dateOfBirth: "1978-07-22",
				address: "Calle Juárez 456, Col. Roma, CDMX",
				emergencyContact: "+52 55 8765 4321"
			},
			dentist: "Dra. Patricia Mendoza",
			treatment: "Endodoncia",
			duration: 90,
			status: "checkedIn",
			paymentStatus: "insurance",
			estimatedCost: 3500,
			checkInTime: "09:25",
			notes: "Paciente con seguro dental"
		},
		{
			id: "3",
			time: "11:00",
			patient: {
				id: "p3",
				name: "Ana López",
				phone: "+52 55 3456 7890",
				email: "ana@email.com",
				dateOfBirth: "1992-11-08",
				address: "Insurgentes Sur 789, Col. Del Valle, CDMX",
				emergencyContact: "+52 55 7654 3210"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Empaste",
			duration: 45,
			status: "scheduled",
			paymentStatus: "pending",
			estimatedCost: 1200
		},
		{
			id: "4",
			time: "14:00",
			patient: {
				id: "p4",
				name: "Luis Morales",
				phone: "+52 55 4567 8901",
				email: "luis@email.com",
				dateOfBirth: "1980-05-30",
				address: "Polanco 321, Col. Polanco, CDMX",
				emergencyContact: "+52 55 6543 2109"
			},
			dentist: "Dr. Miguel Torres",
			treatment: "Revisión General",
			duration: 30,
			status: "completed",
			paymentStatus: "paid",
			estimatedCost: 600,
			checkInTime: "13:55",
			checkOutTime: "14:35"
		},
		{
			id: "5",
			time: "15:30",
			patient: {
				id: "p5",
				name: "Carmen Ruiz",
				phone: "+52 55 5678 9012",
				email: "carmen@email.com",
				dateOfBirth: "1975-12-12",
				address: "Condesa 654, Col. Condesa, CDMX",
				emergencyContact: "+52 55 5432 1098"
			},
			dentist: "Dra. Laura Jiménez",
			treatment: "Implante",
			duration: 120,
			status: "scheduled",
			paymentStatus: "partial",
			estimatedCost: 8500,
			notes: "Pago inicial realizado"
		}
	];

	const filteredAppointments = todayAppointments.filter(appointment =>
		appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		appointment.patient.phone.includes(searchTerm) ||
		appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled": return "bg-blue-100 text-blue-800";
			case "confirmed": return "bg-green-100 text-green-800";
			case "checkedIn": return "bg-purple-100 text-purple-800";
			case "inProgress": return "bg-yellow-100 text-yellow-800";
			case "completed": return "bg-gray-100 text-gray-800";
			case "cancelled": return "bg-red-100 text-red-800";
			case "noShow": return "bg-orange-100 text-orange-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case "pending": return "bg-red-100 text-red-800";
			case "partial": return "bg-yellow-100 text-yellow-800";
			case "paid": return "bg-green-100 text-green-800";
			case "insurance": return "bg-blue-100 text-blue-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const handleCheckIn = async (appointmentId: string) => {
		try {
			// Here you would call the API to check in the patient
			console.log("Checking in appointment:", appointmentId);
			
			// Update the appointment status locally for demo
			const appointment = todayAppointments.find(a => a.id === appointmentId);
			if (appointment) {
				appointment.status = "checkedIn";
				appointment.checkInTime = currentTime.toLocaleTimeString('es-MX', { 
					hour: '2-digit', 
					minute: '2-digit' 
				});
			}
			
			alert("Paciente registrado exitosamente");
		} catch (error) {
			console.error("Error checking in patient:", error);
			alert("Error al registrar al paciente");
		}
	};

	const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
		try {
			// Here you would call the API to update the appointment status
			console.log("Updating appointment status:", appointmentId, newStatus);
			
			const appointment = todayAppointments.find(a => a.id === appointmentId);
			if (appointment) {
				appointment.status = newStatus as any;
				if (newStatus === "completed") {
					appointment.checkOutTime = currentTime.toLocaleTimeString('es-MX', { 
						hour: '2-digit', 
						minute: '2-digit' 
					});
				}
			}
			
			alert("Estado actualizado exitosamente");
		} catch (error) {
			console.error("Error updating appointment status:", error);
			alert("Error al actualizar el estado");
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN'
		}).format(amount);
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
						<div className="flex items-center space-x-4">
							<span className="text-gray-300 text-sm">
								{currentTime.toLocaleString('es-MX', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</span>
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

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Today's Appointments */}
					<div>
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-white">{translations.todayAppointments}</CardTitle>
									<Badge variant="outline" className="border-gray-600 text-gray-300">
										{filteredAppointments.length} citas
									</Badge>
								</div>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder={translations.searchPatient}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400"
									/>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{filteredAppointments.map((appointment) => (
										<div
											key={appointment.id}
											className={`cursor-pointer rounded-lg border p-4 transition-colors ${
												selectedAppointment?.id === appointment.id
													? "border-blue-500 bg-blue-900/20"
													: "border-gray-700 bg-gray-900 hover:bg-gray-800"
											}`}
											onClick={() => setSelectedAppointment(appointment)}
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<Clock className="h-4 w-4 text-gray-400" />
														<span className="font-medium text-white">{appointment.time}</span>
														<Badge className={getStatusColor(appointment.status)}>
															{translations.appointmentStatus[appointment.status]}
														</Badge>
													</div>
													<div className="mt-2">
														<div className="flex items-center space-x-2">
															<User className="h-4 w-4 text-gray-400" />
															<span className="font-medium text-white">{appointment.patient.name}</span>
														</div>
														<div className="mt-1 text-gray-300 text-sm">
															{appointment.dentist} • {appointment.treatment}
														</div>
														<div className="mt-1 flex items-center space-x-4 text-gray-400 text-sm">
															<span>{appointment.duration} min</span>
															<Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
																{translations.paymentStatus[appointment.paymentStatus]}
															</Badge>
														</div>
													</div>
												</div>
												<div className="flex flex-col items-end space-y-2">
													{appointment.status === "confirmed" && (
														<Button
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleCheckIn(appointment.id);
															}}
															className="bg-green-600 hover:bg-green-700"
														>
															<UserCheck className="mr-1 h-3 w-3" />
															Check-in
														</Button>
													)}
													{appointment.status === "checkedIn" && (
														<Button
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleStatusUpdate(appointment.id, "inProgress");
															}}
															className="bg-yellow-600 hover:bg-yellow-700"
														>
															Iniciar
														</Button>
													)}
													{appointment.status === "inProgress" && (
														<Button
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleStatusUpdate(appointment.id, "completed");
															}}
															className="bg-blue-600 hover:bg-blue-700"
														>
															Completar
														</Button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Patient Details */}
					<div>
						{selectedAppointment ? (
							<Card className="border-gray-700 bg-gray-800">
								<CardHeader>
									<CardTitle className="text-white">{translations.checkInProcess}</CardTitle>
								</CardHeader>
								<CardContent>
									<Tabs defaultValue="patient" className="w-full">
										<TabsList className="grid w-full grid-cols-3 bg-gray-700">
											<TabsTrigger value="patient" className="text-white">Paciente</TabsTrigger>
											<TabsTrigger value="appointment" className="text-white">Cita</TabsTrigger>
											<TabsTrigger value="payment" className="text-white">Pago</TabsTrigger>
										</TabsList>

										<TabsContent value="patient" className="space-y-4">
											<div>
												<h3 className="mb-3 font-medium text-white">{translations.patientInfo}</h3>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-400">Nombre:</span>
														<span className="text-white">{selectedAppointment.patient.name}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Teléfono:</span>
														<span className="text-white">{selectedAppointment.patient.phone}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Email:</span>
														<span className="text-white">{selectedAppointment.patient.email}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Fecha de Nacimiento:</span>
														<span className="text-white">{selectedAppointment.patient.dateOfBirth}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Dirección:</span>
														<span className="text-white">{selectedAppointment.patient.address}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Contacto de Emergencia:</span>
														<span className="text-white">{selectedAppointment.patient.emergencyContact}</span>
													</div>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="appointment" className="space-y-4">
											<div>
												<h3 className="mb-3 font-medium text-white">{translations.appointmentDetails}</h3>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-400">Hora:</span>
														<span className="text-white">{selectedAppointment.time}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Duración:</span>
														<span className="text-white">{selectedAppointment.duration} minutos</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Dentista:</span>
														<span className="text-white">{selectedAppointment.dentist}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Tratamiento:</span>
														<span className="text-white">{selectedAppointment.treatment}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Estado:</span>
														<Badge className={getStatusColor(selectedAppointment.status)}>
															{translations.appointmentStatus[selectedAppointment.status]}
														</Badge>
													</div>
													{selectedAppointment.checkInTime && (
														<div className="flex justify-between">
															<span className="text-gray-400">Hora de Llegada:</span>
															<span className="text-white">{selectedAppointment.checkInTime}</span>
														</div>
													)}
													{selectedAppointment.checkOutTime && (
														<div className="flex justify-between">
															<span className="text-gray-400">Hora de Salida:</span>
															<span className="text-white">{selectedAppointment.checkOutTime}</span>
														</div>
													)}
												</div>
											</div>

											<div>
												<Label htmlFor="checkInNotes" className="text-gray-300">
													{translations.checkInNotes}
												</Label>
												<Textarea
													id="checkInNotes"
													value={checkInNotes}
													onChange={(e) => setCheckInNotes(e.target.value)}
													className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
													placeholder="Notas adicionales del check-in..."
													rows={3}
												/>
											</div>
										</TabsContent>

										<TabsContent value="payment" className="space-y-4">
											<div>
												<h3 className="mb-3 font-medium text-white">{translations.paymentStatus}</h3>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-400">Costo Estimado:</span>
														<span className="text-white">{formatCurrency(selectedAppointment.estimatedCost)}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-400">Estado de Pago:</span>
														<Badge className={getPaymentStatusColor(selectedAppointment.paymentStatus)}>
															{translations.paymentStatus[selectedAppointment.paymentStatus]}
														</Badge>
													</div>
												</div>
											</div>

											<div className="flex space-x-2">
												<Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
													<CreditCard className="mr-2 h-4 w-4" />
													Procesar Pago
												</Button>
												<Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
													<Printer className="mr-2 h-4 w-4" />
													Imprimir Recibo
												</Button>
											</div>
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						) : (
							<Card className="border-gray-700 bg-gray-800">
								<CardContent className="py-12 text-center">
									<UserCheck className="mx-auto h-12 w-12 text-gray-400" />
									<p className="mt-4 text-gray-400">
										Selecciona una cita para ver los detalles del check-in
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
