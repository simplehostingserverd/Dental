"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	FileText,
	Filter,
	MessageSquare,
	MoreVertical,
	Phone,
	Plus,
	Search,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Spanish translations
const translations = {
	title: "Panel de Recepcionista",
	subtitle: "Gestiona citas, pacientes y comunicaciones",
	quickActions: "Acciones Rápidas",
	todayOverview: "Resumen de Hoy",
	upcomingAppointments: "Próximas Citas",
	recentPatients: "Pacientes Recientes",
	communications: "Comunicaciones",
	stats: {
		todayAppointments: "Citas de Hoy",
		waitingPatients: "Pacientes Esperando",
		todayRevenue: "Ingresos de Hoy",
		pendingTasks: "Tareas Pendientes",
	},
	actions: {
		newAppointment: "Nueva Cita",
		checkInPatient: "Registrar Paciente",
		sendReminder: "Enviar Recordatorio",
		processPayment: "Procesar Pago",
		viewSchedule: "Ver Horario",
		managePatients: "Gestionar Pacientes",
	},
	navigation: {
		dashboard: "Panel Principal",
		appointments: "Citas",
		patients: "Pacientes",
		billing: "Facturación",
		communications: "Comunicaciones",
		reports: "Reportes",
		settings: "Configuración",
	},
	status: {
		scheduled: "Programada",
		inProgress: "En Progreso",
		completed: "Completada",
		cancelled: "Cancelada",
		waiting: "Esperando",
		confirmed: "Confirmada",
	},
};

export default function SpanishReceptionistDashboard() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [searchTerm, setSearchTerm] = useState("");

	const handleLogout = async () => {
		try {
			// Call logout API to properly clear server-side session
			await fetch("/api/auth/practice/logout", {
				method: "POST",
			});
		} catch (error) {
			console.error("Logout API error:", error);
		}

		// Clear all authentication cookies
		document.cookie =
			"practice-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

		// Clear localStorage
		localStorage.removeItem("testUser");

		// Redirect to sign in page
		window.location.href = "/auth/signin";
	};

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Mock data for Spanish dashboard
	const todayStats = [
		{
			title: translations.stats.todayAppointments,
			value: "24",
			change: "+3",
			icon: Calendar,
			color: "text-blue-600",
		},
		{
			title: translations.stats.waitingPatients,
			value: "5",
			change: "+2",
			icon: Users,
			color: "text-orange-600",
		},
		{
			title: translations.stats.todayRevenue,
			value: "$3,240",
			change: "+12%",
			icon: DollarSign,
			color: "text-green-600",
		},
		{
			title: translations.stats.pendingTasks,
			value: "8",
			change: "-2",
			icon: AlertCircle,
			color: "text-red-600",
		},
	];

	const upcomingAppointments = [
		{
			id: 1,
			time: "09:00",
			patient: "María González",
			type: "Limpieza Dental",
			status: "confirmed",
			phone: "+52 55 1234 5678",
		},
		{
			id: 2,
			time: "09:30",
			patient: "Carlos Rodríguez",
			type: "Consulta General",
			status: "waiting",
			phone: "+52 55 2345 6789",
		},
		{
			id: 3,
			time: "10:00",
			patient: "Ana Martínez",
			type: "Endodoncia",
			status: "scheduled",
			phone: "+52 55 3456 7890",
		},
		{
			id: 4,
			time: "10:30",
			patient: "Luis Hernández",
			type: "Ortodoncia",
			status: "confirmed",
			phone: "+52 55 4567 8901",
		},
	];

	const quickActions = [
		{
			title: translations.actions.newAppointment,
			icon: Plus,
			href: "/es/receptionist/appointments/new",
			color: "bg-blue-600 hover:bg-blue-700",
		},
		{
			title: translations.actions.checkInPatient,
			icon: CheckCircle,
			href: "/es/receptionist/check-in",
			color: "bg-green-600 hover:bg-green-700",
		},
		{
			title: translations.actions.sendReminder,
			icon: MessageSquare,
			href: "/es/receptionist/communications",
			color: "bg-purple-600 hover:bg-purple-700",
		},
		{
			title: translations.actions.processPayment,
			icon: DollarSign,
			href: "/es/receptionist/billing",
			color: "bg-orange-600 hover:bg-orange-700",
		},
		{
			title: translations.actions.viewSchedule,
			icon: Calendar,
			href: "/es/receptionist/schedule",
			color: "bg-indigo-600 hover:bg-indigo-700",
		},
		{
			title: translations.actions.managePatients,
			icon: Users,
			href: "/es/receptionist/patients",
			color: "bg-teal-600 hover:bg-teal-700",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "waiting":
				return "bg-orange-100 text-orange-800";
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		return (
			translations.status[status as keyof typeof translations.status] || status
		);
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
										className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white"
									>
										{translations.navigation.dashboard}
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										{translations.navigation.appointments}
									</Link>
									<Link
										href="/es/receptionist/patients"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										{translations.navigation.patients}
									</Link>
									<Link
										href="/es/receptionist/communications"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										{translations.navigation.communications}
									</Link>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-300 text-sm">
								{currentTime.toLocaleString("es-MX", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							<Link
								href="/es/receptionist/settings"
								className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
							>
								{translations.navigation.settings}
							</Link>
							<button
								onClick={handleLogout}
								className="rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700"
							>
								Cerrar Sesión
							</button>
						</div>
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

				{/* Stats Overview */}
				<div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{todayStats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<Card key={index} className="border-gray-700 bg-gray-800">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-400 text-sm">
												{stat.title}
											</p>
											<p className="font-bold text-2xl text-white">
												{stat.value}
											</p>
											<p className="text-green-400 text-sm">{stat.change}</p>
										</div>
										<IconComponent className={`h-8 w-8 ${stat.color}`} />
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Quick Actions */}
				<div className="mb-8">
					<h2 className="mb-4 font-semibold text-white text-xl">
						{translations.quickActions}
					</h2>
					<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
						{quickActions.map((action, index) => {
							const IconComponent = action.icon;
							return (
								<Link key={index} href={action.href}>
									<Card className="border-gray-700 bg-gray-800 transition-all hover:bg-gray-700">
										<CardContent className="p-4 text-center">
											<div
												className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}
											>
												<IconComponent className="h-6 w-6 text-white" />
											</div>
											<p className="font-medium text-sm text-white">
												{action.title}
											</p>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Main Dashboard Grid */}
				<div className="grid gap-8 lg:grid-cols-2">
					{/* Upcoming Appointments */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="text-white">
								{translations.upcomingAppointments}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4"
									>
										<div className="flex items-center space-x-4">
											<div className="text-center">
												<p className="font-semibold text-blue-400">
													{appointment.time}
												</p>
											</div>
											<div>
												<p className="font-medium text-white">
													{appointment.patient}
												</p>
												<p className="text-gray-400 text-sm">
													{appointment.type}
												</p>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Badge className={getStatusColor(appointment.status)}>
												{getStatusText(appointment.status)}
											</Badge>
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
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Communications Hub */}
					<Card className="border-gray-700 bg-gray-800">
						<CardHeader>
							<CardTitle className="text-white">
								{translations.communications}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid gap-4 md:grid-cols-3">
									<Link href="/es/receptionist/communications/whatsapp">
										<Card className="border-gray-600 bg-gray-700 transition-all hover:bg-gray-600">
											<CardContent className="p-4 text-center">
												<div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
													<MessageSquare className="h-5 w-5 text-white" />
												</div>
												<p className="font-medium text-sm text-white">
													WhatsApp
												</p>
												<p className="text-gray-400 text-xs">5 mensajes</p>
											</CardContent>
										</Card>
									</Link>
									<Link href="/es/receptionist/communications/telegram">
										<Card className="border-gray-600 bg-gray-700 transition-all hover:bg-gray-600">
											<CardContent className="p-4 text-center">
												<div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
													<MessageSquare className="h-5 w-5 text-white" />
												</div>
												<p className="font-medium text-sm text-white">
													Telegram
												</p>
												<p className="text-gray-400 text-xs">2 mensajes</p>
											</CardContent>
										</Card>
									</Link>
									<Link href="/es/receptionist/communications/signal">
										<Card className="border-gray-600 bg-gray-700 transition-all hover:bg-gray-600">
											<CardContent className="p-4 text-center">
												<div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
													<MessageSquare className="h-5 w-5 text-white" />
												</div>
												<p className="font-medium text-sm text-white">Signal</p>
												<p className="text-gray-400 text-xs">1 mensaje</p>
											</CardContent>
										</Card>
									</Link>
								</div>
								<div className="mt-4">
									<Link href="/es/receptionist/communications">
										<Button className="w-full bg-blue-600 hover:bg-blue-700">
											Ver Todas las Comunicaciones
										</Button>
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
