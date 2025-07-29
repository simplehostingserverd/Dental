import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import {
	Bell,
	Calendar,
	Clock,
	CreditCard,
	FileText,
	MapPin,
	MessageSquare,
	Phone,
	Settings,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
	const startOfDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	);
	const endOfDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + 1,
	);
	const [
		todayAppointments,
		totalPatients,
		pendingPayments,
		recentAppointments,
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
				outstandingBalance: { gt: 0 },
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
			<div className="border-blue-200 border-b bg-white/80 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-bold text-2xl text-gray-900">
								Panel de Recepción - {practiceUser.practice.name}
							</h1>
							<p className="text-gray-600">
								Bienvenida, {user.firstName} {user.lastName}
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Badge
								variant="outline"
								className="border-green-600 text-green-600"
							>
								🇲🇽 México
							</Badge>
							<Badge
								variant="outline"
								className="border-blue-600 text-blue-600"
							>
								ID: {practiceUser.practice.id.slice(0, 8)}...
							</Badge>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-8">
				{/* Quick Stats */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
					<Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-blue-800 text-sm">
								Citas de Hoy
							</CardTitle>
							<Calendar className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl text-blue-700">
								{todayAppointments}
							</div>
							<p className="text-blue-600 text-xs">
								{new Date().toLocaleDateString("es-MX", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</CardContent>
					</Card>

					<Card className="border-green-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-green-800 text-sm">
								Total Pacientes
							</CardTitle>
							<Users className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl text-green-700">
								{totalPatients.toLocaleString()}
							</div>
							<p className="text-green-600 text-xs">
								Registrados en la clínica
							</p>
						</CardContent>
					</Card>

					<Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-orange-800 text-sm">
								Pagos Pendientes
							</CardTitle>
							<CreditCard className="h-4 w-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl text-orange-700">
								{pendingPayments}
							</div>
							<p className="text-orange-600 text-xs">Requieren seguimiento</p>
						</CardContent>
					</Card>

					<Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-purple-800 text-sm">
								Eficiencia
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl text-purple-700">96%</div>
							<p className="text-purple-600 text-xs">Atención al cliente</p>
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
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<Link href="/es/receptionist/patients">
								<Button
									variant="outline"
									className="flex h-20 w-full flex-col gap-2 border-blue-200 hover:bg-blue-50"
								>
									<Users className="h-6 w-6 text-blue-600" />
									<span className="text-sm">Pacientes</span>
								</Button>
							</Link>
							<Link href="/es/receptionist/appointments">
								<Button
									variant="outline"
									className="flex h-20 w-full flex-col gap-2 border-green-200 hover:bg-green-50"
								>
									<Calendar className="h-6 w-6 text-green-600" />
									<span className="text-sm">Citas</span>
								</Button>
							</Link>
							<Link href="/es/receptionist/billing">
								<Button
									variant="outline"
									className="flex h-20 w-full flex-col gap-2 border-orange-200 hover:bg-orange-50"
								>
									<CreditCard className="h-6 w-6 text-orange-600" />
									<span className="text-sm">Facturación</span>
								</Button>
							</Link>
							<Link href="/es/dashboard/data-import">
								<Button
									variant="outline"
									className="flex h-20 w-full flex-col gap-2 border-red-200 hover:bg-red-50"
								>
									<Upload className="h-6 w-6 text-red-600" />
									<span className="text-sm">Importar Datos</span>
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Today's Schedule and Communication Tools */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Clock className="h-5 w-5" />
								Agenda de Hoy
							</CardTitle>
							<CardDescription>Próximas citas programadas</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentAppointments.length > 0 ? (
									recentAppointments.map((appointment) => (
										<div
											key={appointment.id}
											className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
										>
											<div>
												<div className="font-medium text-gray-900">
													{appointment.patient.firstName}{" "}
													{appointment.patient.lastName}
												</div>
												<div className="text-gray-600 text-sm">
													Dr. {appointment.practiceUser?.firstName}{" "}
													{appointment.practiceUser?.lastName}
												</div>
												<div className="text-gray-500 text-xs">
													{appointment.patient.phone}
												</div>
											</div>
											<div className="text-right">
												<div className="font-medium text-blue-600">
													{appointment.start?.toLocaleTimeString("es-MX", {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</div>
												<Badge
													variant="outline"
													className="border-green-600 text-green-600 text-xs"
												>
													{appointment.status}
												</Badge>
											</div>
										</div>
									))
								) : (
									<div className="py-8 text-center text-gray-500">
										<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
										<p>No hay citas programadas para hoy</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Phone className="h-5 w-5" />
								Herramientas de Comunicación
							</CardTitle>
							<CardDescription>
								Gestión de comunicación con pacientes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Link href="/es/receptionist/communication">
									<Button variant="outline" className="w-full justify-start">
										<MessageSquare className="mr-2 h-4 w-4" />
										Mensajes y WhatsApp
									</Button>
								</Link>
								<Link href="/es/receptionist/reminders">
									<Button variant="outline" className="w-full justify-start">
										<Bell className="mr-2 h-4 w-4" />
										Recordatorios de Citas
									</Button>
								</Link>
								<Link href="/es/receptionist/reports">
									<Button variant="outline" className="w-full justify-start">
										<FileText className="mr-2 h-4 w-4" />
										Reportes y Estadísticas
									</Button>
								</Link>
								<Link href="/es/receptionist/settings">
									<Button variant="outline" className="w-full justify-start">
										<Settings className="mr-2 h-4 w-4" />
										Configuración
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Practice Information */}
				<Card className="mt-6 border-gray-200 bg-white/90 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-gray-800">
							Información de la Clínica
						</CardTitle>
						<CardDescription>Detalles de contacto y ubicación</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<div>
								<h4 className="mb-2 font-semibold text-gray-800">Contacto</h4>
								<div className="space-y-1 text-sm">
									<div>📞 {practiceUser.practice.phone}</div>
									<div>📧 {practiceUser.practice.email}</div>
									<div>🌐 {practiceUser.practice.website}</div>
								</div>
							</div>
							<div>
								<h4 className="mb-2 font-semibold text-gray-800">Ubicación</h4>
								<div className="space-y-1 text-sm">
									<div>📍 {practiceUser.practice.address}</div>
									<div>
										{practiceUser.practice.city}, {practiceUser.practice.state}
									</div>
									<div>CP: {practiceUser.practice.zipCode}</div>
								</div>
							</div>
							<div>
								<h4 className="mb-2 font-semibold text-gray-800">Sistema</h4>
								<div className="space-y-1 text-sm">
									<div>🆔 ID: {practiceUser.practice.id}</div>
									<div>🕐 Zona: {practiceUser.practice.timezone}</div>
									<div>✅ Estado: Activo</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-gray-500 text-sm">
					<p>🇲🇽 Sistema de Gestión Dental para México | Cognident</p>
					<p>
						Datos seguros y aislados por clínica | Soporte: mexico@cognident.org
					</p>
				</div>
			</div>
		</div>
	);
}
