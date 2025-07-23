"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	Calendar,
	CheckCircle,
	Clock,
	Edit,
	Filter,
	MessageSquare,
	MoreVertical,
	Phone,
	Plus,
	Search,
	Trash2,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Spanish translations
const translations = {
	title: "Gestión de Citas",
	subtitle: "Administra todas las citas de la clínica",
	newAppointment: "Nueva Cita",
	searchPlaceholder: "Buscar por paciente, doctor o tipo...",
	filterBy: "Filtrar por",
	allAppointments: "Todas las Citas",
	todayAppointments: "Citas de Hoy",
	upcomingAppointments: "Próximas Citas",
	pastAppointments: "Citas Pasadas",
	status: {
		scheduled: "Programada",
		confirmed: "Confirmada",
		inProgress: "En Progreso",
		completed: "Completada",
		cancelled: "Cancelada",
		noShow: "No Asistió",
	},
	actions: {
		edit: "Editar",
		cancel: "Cancelar",
		confirm: "Confirmar",
		complete: "Completar",
		reschedule: "Reprogramar",
		delete: "Eliminar",
	},
	appointmentTypes: {
		consultation: "Consulta General",
		cleaning: "Limpieza Dental",
		filling: "Empaste",
		extraction: "Extracción",
		rootCanal: "Endodoncia",
		orthodontics: "Ortodoncia",
		surgery: "Cirugía",
		emergency: "Emergencia",
	},
	tableHeaders: {
		time: "Hora",
		patient: "Paciente",
		doctor: "Doctor",
		type: "Tipo",
		status: "Estado",
		actions: "Acciones",
	},
};

export default function SpanishAppointmentsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);

	// Mock appointments data
	const appointments = [
		{
			id: 1,
			time: "09:00",
			patient: "María González",
			patientPhone: "+52 55 1234 5678",
			doctor: "Dr. Rodríguez",
			type: "cleaning",
			status: "confirmed",
			date: "2024-01-15",
			duration: 60,
			notes: "Paciente regular, sin alergias conocidas",
		},
		{
			id: 2,
			time: "09:30",
			patient: "Carlos Hernández",
			patientPhone: "+52 55 2345 6789",
			doctor: "Dr. Martínez",
			type: "consultation",
			status: "scheduled",
			date: "2024-01-15",
			duration: 30,
			notes: "Primera visita",
		},
		{
			id: 3,
			time: "10:00",
			patient: "Ana López",
			patientPhone: "+52 55 3456 7890",
			doctor: "Dr. Rodríguez",
			type: "filling",
			status: "inProgress",
			date: "2024-01-15",
			duration: 90,
			notes: "Empaste en molar superior derecho",
		},
		{
			id: 4,
			time: "11:00",
			patient: "Luis Morales",
			patientPhone: "+52 55 4567 8901",
			doctor: "Dr. García",
			type: "rootCanal",
			status: "confirmed",
			date: "2024-01-15",
			duration: 120,
			notes: "Segunda sesión de endodoncia",
		},
		{
			id: 5,
			time: "14:00",
			patient: "Carmen Ruiz",
			patientPhone: "+52 55 5678 9012",
			doctor: "Dr. Martínez",
			type: "orthodontics",
			status: "completed",
			date: "2024-01-15",
			duration: 45,
			notes: "Ajuste de brackets",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800 border-green-200";
			case "scheduled":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "inProgress":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "completed":
				return "bg-gray-100 text-gray-800 border-gray-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border-red-200";
			case "noShow":
				return "bg-purple-100 text-purple-800 border-purple-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusText = (status: string) => {
		return (
			translations.status[status as keyof typeof translations.status] || status
		);
	};

	const getTypeText = (type: string) => {
		return (
			translations.appointmentTypes[
				type as keyof typeof translations.appointmentTypes
			] || type
		);
	};

	const filteredAppointments = appointments.filter((appointment) => {
		const matchesSearch =
			appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
			getTypeText(appointment.type)
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesFilter =
			filterStatus === "all" || appointment.status === filterStatus;

		return matchesSearch && matchesFilter;
	});

	const todayAppointments = appointments.filter(
		(apt) => apt.date === selectedDate,
	);
	const upcomingCount = appointments.filter(
		(apt) => apt.status === "scheduled" || apt.status === "confirmed",
	).length;
	const completedToday = appointments.filter(
		(apt) => apt.status === "completed" && apt.date === selectedDate,
	).length;

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
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Panel Principal
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white"
									>
										Citas
									</Link>
									<Link
										href="/es/receptionist/patients"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Pacientes
									</Link>
								</div>
							</div>
						</div>
						<Link
							href="/es/receptionist/appointments/new"
							className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
						>
							<Plus className="mr-2 inline h-4 w-4" />
							{translations.newAppointment}
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-white">
						{translations.title}
					</h1>
					<p className="mt-2 text-gray-400">{translations.subtitle}</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-400 text-sm">
										Citas de Hoy
									</p>
									<p className="font-bold text-2xl text-white">
										{todayAppointments.length}
									</p>
								</div>
								<Calendar className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-400 text-sm">Próximas</p>
									<p className="font-bold text-2xl text-white">
										{upcomingCount}
									</p>
								</div>
								<Clock className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-400 text-sm">
										Completadas Hoy
									</p>
									<p className="font-bold text-2xl text-white">
										{completedToday}
									</p>
								</div>
								<CheckCircle className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-400 text-sm">Total</p>
									<p className="font-bold text-2xl text-white">
										{appointments.length}
									</p>
								</div>
								<User className="h-8 w-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters and Search */}
				<Card className="mb-8 border-gray-700 bg-gray-800">
					<CardContent className="p-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-1 items-center space-x-4">
								<div className="relative max-w-md flex-1">
									<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder={translations.searchPlaceholder}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400"
									/>
								</div>
								<Select value={filterStatus} onValueChange={setFilterStatus}>
									<SelectTrigger className="w-48 border-gray-600 bg-gray-700 text-white">
										<SelectValue placeholder={translations.filterBy} />
									</SelectTrigger>
									<SelectContent className="border-gray-600 bg-gray-700">
										<SelectItem value="all">Todas las Citas</SelectItem>
										<SelectItem value="scheduled">Programadas</SelectItem>
										<SelectItem value="confirmed">Confirmadas</SelectItem>
										<SelectItem value="inProgress">En Progreso</SelectItem>
										<SelectItem value="completed">Completadas</SelectItem>
										<SelectItem value="cancelled">Canceladas</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center space-x-2">
								<Input
									type="date"
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									className="border-gray-600 bg-gray-700 text-white"
								/>
								<Button
									variant="outline"
									className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
								>
									<Filter className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Appointments Table */}
				<Card className="border-gray-700 bg-gray-800">
					<CardHeader>
						<CardTitle className="text-white">
							Citas ({filteredAppointments.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-gray-700 border-b">
										<th className="pb-3 text-left font-medium text-gray-400 text-sm">
											{translations.tableHeaders.time}
										</th>
										<th className="pb-3 text-left font-medium text-gray-400 text-sm">
											{translations.tableHeaders.patient}
										</th>
										<th className="pb-3 text-left font-medium text-gray-400 text-sm">
											{translations.tableHeaders.doctor}
										</th>
										<th className="pb-3 text-left font-medium text-gray-400 text-sm">
											{translations.tableHeaders.type}
										</th>
										<th className="pb-3 text-left font-medium text-gray-400 text-sm">
											{translations.tableHeaders.status}
										</th>
										<th className="pb-3 text-left font-medium text-gray-400 text-sm">
											{translations.tableHeaders.actions}
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredAppointments.map((appointment) => (
										<tr
											key={appointment.id}
											className="border-gray-700 border-b"
										>
											<td className="py-4">
												<div className="font-medium text-blue-400">
													{appointment.time}
												</div>
												<div className="text-gray-400 text-sm">
													{appointment.duration} min
												</div>
											</td>
											<td className="py-4">
												<div className="font-medium text-white">
													{appointment.patient}
												</div>
												<div className="text-gray-400 text-sm">
													{appointment.patientPhone}
												</div>
											</td>
											<td className="py-4 text-white">{appointment.doctor}</td>
											<td className="py-4 text-white">
												{getTypeText(appointment.type)}
											</td>
											<td className="py-4">
												<Badge className={getStatusColor(appointment.status)}>
													{getStatusText(appointment.status)}
												</Badge>
											</td>
											<td className="py-4">
												<div className="flex items-center space-x-2">
													<Button
														size="sm"
														variant="ghost"
														className="text-gray-400 hover:text-white"
													>
														<Phone className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="text-gray-400 hover:text-white"
													>
														<MessageSquare className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="text-gray-400 hover:text-white"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="text-gray-400 hover:text-red-400"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
