import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	Users,
	Phone,
	CreditCard,
	FileText,
	MapPin,
	Clock,
	TrendingUp,
	Upload,
	Settings,
	MessageSquare,
	Bell
} from "lucide-react";
import Link from "next/link";

export default async function ReceptionistDashboardES() {
	const user = await getCurrentUser();

	if (!user || user.type !== "practice") {
		redirect("/es/auth/signin");
	}

	if (user.role !== "RECEPTIONIST" && user.role !== "ADMIN") {
		redirect("/es/dashboard/dentist");
	}

	// Get practice information
	const practiceUser = await db.practiceUser.findUnique({
		where: { id: user.id },
		include: {
			practice: true,
		},
	});

	if (!practiceUser?.practice) {
		redirect("/es/auth/signin");
	}

	// Get dashboard statistics
	const today = new Date();
	const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
	const [
		todayAppointments,
		totalPatients,
		pendingPayments,
		recentAppointments
	] = await Promise.all([
		db.appointment.count({
			where: {
				practiceUser: { practiceId: practiceUser.practice.id },
				start: {
					gte: startOfDay,
					lt: endOfDay,
				},
				status: { notIn: ["CANCELED"] },
			},
		}),
		db.patient.count({
			where: { practiceId: practiceUser.practice.id },
		}),
		db.patient.count({
			where: {
				practiceId: practiceUser.practice.id,
				outstandingBalance: { gt: 0 }
			},
		}),
		db.appointment.findMany({
			where: {
				practiceUser: { practiceId: practiceUser.practice.id },
				start: {
					gte: startOfDay,
					lt: endOfDay,
				},
				status: { notIn: ["CANCELED"] },
			},
			include: {
				patient: {
					select: {
						firstName: true,
						lastName: true,
						phone: true,
					},
				},
				practiceUser: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: { start: "asc" },
			take: 5,
		}),
	]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
			{/* Header */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Panel de Recepción - {practiceUser.practice.name}
							</h1>
							<p className="text-gray-600">
								Bienvenida, {user.firstName} {user.lastName}
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Badge variant="outline" className="border-green-600 text-green-600">
								🇲🇽 México
							</Badge>
							<Badge variant="outline" className="border-blue-600 text-blue-600">
								ID: {practiceUser.practice.id.slice(0, 8)}...
							</Badge>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-8">
				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-blue-800">
								Citas de Hoy
							</CardTitle>
							<Calendar className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-700">{todayAppointments}</div>
							<p className="text-xs text-blue-600">
								{new Date().toLocaleDateString('es-MX', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						</CardContent>
					</Card>

					<Card className="border-green-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-green-800">
								Total Pacientes
							</CardTitle>
							<Users className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-700">{totalPatients.toLocaleString()}</div>
							<p className="text-xs text-green-600">
								Registrados en la clínica
							</p>
						</CardContent>
					</Card>

					<Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-orange-800">
								Pagos Pendientes
							</CardTitle>
							<CreditCard className="h-4 w-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-orange-700">{pendingPayments}</div>
							<p className="text-xs text-orange-600">
								Requieren seguimiento
							</p>
						</CardContent>
					</Card>

					<Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-purple-800">
								Eficiencia
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-700">96%</div>
							<p className="text-xs text-purple-600">
								Atención al cliente
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card className="mb-8 border-gray-200 bg-white/90 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-gray-800">
							<MapPin className="h-5 w-5" />
							Acciones de Recepción
						</CardTitle>
						<CardDescription>
							Herramientas para gestión de pacientes y citas
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Link href="/es/receptionist/patients">
								<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-200 hover:bg-blue-50">
									<Users className="h-6 w-6 text-blue-600" />
									<span className="text-sm">Pacientes</span>
								</Button>
							</Link>
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
