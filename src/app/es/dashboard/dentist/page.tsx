import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	Calendar, 
	Users, 
	Clock, 
	TrendingUp, 
	FileText, 
	Stethoscope,
	AlertCircle,
	CheckCircle,
	Upload,
	Settings
} from "lucide-react";
import Link from "next/link";

export default async function DentistDashboardES() {
	const user = await getCurrentUser();

	if (!user || user.type !== "practice") {
		redirect("/es/auth/signin");
	}

	if (user.role !== "DENTIST" && user.role !== "ADMIN") {
		redirect("/es/receptionist");
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
		pendingTreatments,
		recentPatients
	] = await Promise.all([
		db.appointment.count({
			where: {
				practiceUserId: user.id,
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
		db.treatmentPlan.count({
			where: {
				patient: { practiceId: practiceUser.practice.id },
				status: "PENDING",
			},
		}),
		db.patient.findMany({
			where: { practiceId: practiceUser.practice.id },
			orderBy: { createdAt: "desc" },
			take: 5,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				createdAt: true,
				lastVisit: true,
			},
		}),
	]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
			{/* Header */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-green-200">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Panel del Dentista - {practiceUser.practice.name}
							</h1>
							<p className="text-gray-600">
								Bienvenido, Dr. {user.firstName} {user.lastName}
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
					<Card className="border-green-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-green-800">
								Citas de Hoy
							</CardTitle>
							<Calendar className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-700">{todayAppointments}</div>
							<p className="text-xs text-green-600">
								{new Date().toLocaleDateString('es-MX', { 
									weekday: 'long', 
									year: 'numeric', 
									month: 'long', 
									day: 'numeric' 
								})}
							</p>
						</CardContent>
					</Card>

					<Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-blue-800">
								Total Pacientes
							</CardTitle>
							<Users className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-700">{totalPatients.toLocaleString()}</div>
							<p className="text-xs text-blue-600">
								Registrados en la clínica
							</p>
						</CardContent>
					</Card>

					<Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-orange-800">
								Tratamientos Pendientes
							</CardTitle>
							<Clock className="h-4 w-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-orange-700">{pendingTreatments}</div>
							<p className="text-xs text-orange-600">
								Requieren atención
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
							<div className="text-2xl font-bold text-purple-700">94%</div>
							<p className="text-xs text-purple-600">
								Promedio mensual
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card className="mb-8 border-gray-200 bg-white/90 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-gray-800">
							<Stethoscope className="h-5 w-5" />
							Acciones Rápidas
						</CardTitle>
						<CardDescription>
							Herramientas frecuentemente utilizadas
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Link href="/es/dashboard/patients">
								<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-200 hover:bg-green-50">
									<Users className="h-6 w-6 text-green-600" />
									<span className="text-sm">Pacientes</span>
								</Button>
							</Link>
							<Link href="/es/dashboard/appointments">
								<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-200 hover:bg-blue-50">
									<Calendar className="h-6 w-6 text-blue-600" />
									<span className="text-sm">Citas</span>
								</Button>
							</Link>
							<Link href="/es/dashboard/treatment-plans">
								<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-purple-200 hover:bg-purple-50">
									<FileText className="h-6 w-6 text-purple-600" />
									<span className="text-sm">Tratamientos</span>
								</Button>
							</Link>
							<Link href="/es/dashboard/data-import">
								<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-red-200 hover:bg-red-50">
									<Upload className="h-6 w-6 text-red-600" />
									<span className="text-sm">Importar Datos</span>
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-gray-800">Pacientes Recientes</CardTitle>
							<CardDescription>
								Últimos pacientes registrados
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentPatients.map((patient) => (
									<div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div>
											<div className="font-medium text-gray-900">
												{patient.firstName} {patient.lastName}
											</div>
											<div className="text-sm text-gray-600">
												Registrado: {patient.createdAt.toLocaleDateString('es-MX')}
											</div>
										</div>
										<div className="text-right">
											{patient.lastVisit ? (
												<Badge variant="outline" className="border-green-600 text-green-600">
													<CheckCircle className="h-3 w-3 mr-1" />
													Activo
												</Badge>
											) : (
												<Badge variant="outline" className="border-orange-600 text-orange-600">
													<AlertCircle className="h-3 w-3 mr-1" />
													Nuevo
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-gray-800">Información de la Clínica</CardTitle>
							<CardDescription>
								Detalles de su práctica dental
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex justify-between">
									<span className="text-gray-600">Nombre:</span>
									<span className="font-medium">{practiceUser.practice.name}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Ubicación:</span>
									<span className="font-medium">{practiceUser.practice.city}, {practiceUser.practice.state}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Teléfono:</span>
									<span className="font-medium">{practiceUser.practice.phone}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">ID Único:</span>
									<span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
										{practiceUser.practice.id}
									</span>
								</div>
								<div className="pt-4">
									<Link href="/es/dashboard/settings">
										<Button variant="outline" className="w-full">
											<Settings className="h-4 w-4 mr-2" />
											Configuración
										</Button>
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center text-gray-500 text-sm">
					<p>🇲🇽 Sistema de Gestión Dental para México | Cognident</p>
					<p>Datos seguros y aislados por clínica | Soporte: mexico@cognident.org</p>
				</div>
			</div>
		</div>
	);
}
