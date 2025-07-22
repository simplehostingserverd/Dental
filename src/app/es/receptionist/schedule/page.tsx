"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	Calendar, 
	Clock, 
	User, 
	Phone, 
	ChevronLeft,
	ChevronRight,
	Plus,
	Filter,
	Search,
	Eye,
	Edit,
	Trash2,
	CheckCircle,
	XCircle,
	AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
	title: "Horarios y Agenda",
	subtitle: "Gestiona los horarios y citas de la clínica",
	todaySchedule: "Agenda de Hoy",
	weekView: "Vista Semanal",
	monthView: "Vista Mensual",
	newAppointment: "Nueva Cita",
	filterByDentist: "Filtrar por Dentista",
	filterByStatus: "Filtrar por Estado",
	searchPatient: "Buscar paciente...",
	today: "Hoy",
	thisWeek: "Esta Semana",
	thisMonth: "Este Mes",
	navigation: {
		dashboard: "Panel Principal",
		appointments: "Citas",
		patients: "Pacientes",
		communications: "Comunicaciones"
	},
	appointmentStatus: {
		scheduled: "Programada",
		confirmed: "Confirmada",
		inProgress: "En Progreso",
		completed: "Completada",
		cancelled: "Cancelada",
		noShow: "No Asistió"
	},
	actions: {
		view: "Ver",
		edit: "Editar",
		cancel: "Cancelar",
		complete: "Completar",
		confirm: "Confirmar"
	}
};

interface Appointment {
	id: string;
	time: string;
	duration: number;
	patient: {
		name: string;
		phone: string;
		email: string;
	};
	dentist: string;
	treatment: string;
	status: "scheduled" | "confirmed" | "inProgress" | "completed" | "cancelled" | "noShow";
	notes?: string;
}

export default function SpanishSchedulePage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
	const [selectedDentist, setSelectedDentist] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	// Mock data for appointments
	const appointments: Appointment[] = [
		{
			id: "1",
			time: "09:00",
			duration: 30,
			patient: {
				name: "María González",
				phone: "+52 55 1234 5678",
				email: "maria@email.com"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Limpieza Dental",
			status: "confirmed"
		},
		{
			id: "2",
			time: "09:30",
			duration: 60,
			patient: {
				name: "Carlos Hernández",
				phone: "+52 55 2345 6789",
				email: "carlos@email.com"
			},
			dentist: "Dra. Patricia Mendoza",
			treatment: "Endodoncia",
			status: "scheduled"
		},
		{
			id: "3",
			time: "10:30",
			duration: 45,
			patient: {
				name: "Ana López",
				phone: "+52 55 3456 7890",
				email: "ana@email.com"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Empaste",
			status: "inProgress"
		},
		{
			id: "4",
			time: "11:15",
			duration: 30,
			patient: {
				name: "Luis Morales",
				phone: "+52 55 4567 8901",
				email: "luis@email.com"
			},
			dentist: "Dr. Miguel Torres",
			treatment: "Revisión General",
			status: "completed"
		},
		{
			id: "5",
			time: "14:00",
			duration: 90,
			patient: {
				name: "Carmen Ruiz",
				phone: "+52 55 5678 9012",
				email: "carmen@email.com"
			},
			dentist: "Dra. Laura Jiménez",
			treatment: "Implante",
			status: "scheduled"
		},
		{
			id: "6",
			time: "15:30",
			duration: 30,
			patient: {
				name: "Roberto Silva",
				phone: "+52 55 6789 0123",
				email: "roberto@email.com"
			},
			dentist: "Dr. Roberto Sánchez",
			treatment: "Blanqueamiento",
			status: "cancelled"
		}
	];

	const dentists = [
		{ id: "all", name: "Todos los Dentistas" },
		{ id: "1", name: "Dr. Roberto Sánchez" },
		{ id: "2", name: "Dra. Patricia Mendoza" },
		{ id: "3", name: "Dr. Miguel Torres" },
		{ id: "4", name: "Dra. Laura Jiménez" }
	];

	const statusOptions = [
		{ id: "all", name: "Todos los Estados" },
		{ id: "scheduled", name: translations.appointmentStatus.scheduled },
		{ id: "confirmed", name: translations.appointmentStatus.confirmed },
		{ id: "inProgress", name: translations.appointmentStatus.inProgress },
		{ id: "completed", name: translations.appointmentStatus.completed },
		{ id: "cancelled", name: translations.appointmentStatus.cancelled },
		{ id: "noShow", name: translations.appointmentStatus.noShow }
	];

	// Filter appointments
	const filteredAppointments = appointments.filter(appointment => {
		const matchesSearch = appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.patient.phone.includes(searchTerm) ||
			appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesDentist = selectedDentist === "all" || appointment.dentist === dentists.find(d => d.id === selectedDentist)?.name;
		const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus;

		return matchesSearch && matchesDentist && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled": return "bg-blue-100 text-blue-800";
			case "confirmed": return "bg-green-100 text-green-800";
			case "inProgress": return "bg-yellow-100 text-yellow-800";
			case "completed": return "bg-gray-100 text-gray-800";
			case "cancelled": return "bg-red-100 text-red-800";
			case "noShow": return "bg-orange-100 text-orange-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "confirmed": return <CheckCircle className="h-3 w-3" />;
			case "cancelled": return <XCircle className="h-3 w-3" />;
			case "inProgress": return <Clock className="h-3 w-3" />;
			case "noShow": return <AlertCircle className="h-3 w-3" />;
			default: return null;
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('es-MX', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const navigateDate = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		if (viewMode === "day") {
			newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
		} else if (viewMode === "week") {
			newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
		} else {
			newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
		}
		setCurrentDate(newDate);
	};

	const goToToday = () => {
		setCurrentDate(new Date());
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
						<Link
							href="/es/receptionist/appointments/new"
							className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
						>
							<Plus className="mr-2 h-4 w-4" />
							{translations.newAppointment}
						</Link>
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

				{/* Controls */}
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					{/* Date Navigation */}
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigateDate("prev")}
								className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="min-w-[200px] text-center">
								<h2 className="font-medium text-white">{formatDate(currentDate)}</h2>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigateDate("next")}
								className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={goToToday}
							className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
						>
							{translations.today}
						</Button>
					</div>

					{/* View Mode */}
					<div className="flex items-center space-x-2">
						<Button
							variant={viewMode === "day" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("day")}
							className={viewMode === "day" ? "" : "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"}
						>
							Día
						</Button>
						<Button
							variant={viewMode === "week" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("week")}
							className={viewMode === "week" ? "" : "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"}
						>
							Semana
						</Button>
						<Button
							variant={viewMode === "month" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("month")}
							className={viewMode === "month" ? "" : "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"}
						>
							Mes
						</Button>
					</div>
				</div>

				{/* Filters */}
				<div className="mb-6 grid gap-4 md:grid-cols-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder={translations.searchPatient}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400"
						/>
					</div>
					<Select value={selectedDentist} onValueChange={setSelectedDentist}>
						<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
							<SelectValue placeholder={translations.filterByDentist} />
						</SelectTrigger>
						<SelectContent className="border-gray-600 bg-gray-700">
							{dentists.map((dentist) => (
								<SelectItem key={dentist.id} value={dentist.id}>
									{dentist.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
							<SelectValue placeholder={translations.filterByStatus} />
						</SelectTrigger>
						<SelectContent className="border-gray-600 bg-gray-700">
							{statusOptions.map((status) => (
								<SelectItem key={status.id} value={status.id}>
									{status.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex items-center justify-end">
						<span className="text-gray-400 text-sm">
							{filteredAppointments.length} citas encontradas
						</span>
					</div>
				</div>

				{/* Schedule View */}
				<Card className="border-gray-700 bg-gray-800">
					<CardHeader>
						<CardTitle className="text-white">
							{viewMode === "day" && translations.todaySchedule}
							{viewMode === "week" && translations.weekView}
							{viewMode === "month" && translations.monthView}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredAppointments.length === 0 ? (
								<div className="py-8 text-center">
									<Calendar className="mx-auto h-12 w-12 text-gray-400" />
									<p className="mt-4 text-gray-400">No hay citas programadas para este período</p>
								</div>
							) : (
								filteredAppointments.map((appointment) => (
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
															{translations.appointmentStatus[appointment.status]}
														</span>
													</Badge>
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
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
													<Eye className="h-4 w-4" />
												</Button>
												<Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
													<Edit className="h-4 w-4" />
												</Button>
												{appointment.status === "scheduled" && (
													<Button variant="outline" size="sm" className="border-green-600 bg-green-700 text-white hover:bg-green-600">
														<CheckCircle className="h-4 w-4" />
													</Button>
												)}
												{appointment.status !== "completed" && appointment.status !== "cancelled" && (
													<Button variant="outline" size="sm" className="border-red-600 bg-red-700 text-white hover:bg-red-600">
														<XCircle className="h-4 w-4" />
													</Button>
												)}
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
