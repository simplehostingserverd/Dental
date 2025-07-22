"use client";

import { useState } from "react";
import Link from "next/link";
import { 
	Users, 
	Search, 
	Filter, 
	Plus,
	Phone, 
	MessageSquare,
	Mail,
	Edit,
	Eye,
	Calendar,
	FileText,
	MoreVertical
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
	title: "Gestión de Pacientes",
	subtitle: "Administra la información de todos los pacientes",
	newPatient: "Nuevo Paciente",
	searchPlaceholder: "Buscar por nombre, teléfono o email...",
	filterBy: "Filtrar por",
	allPatients: "Todos los Pacientes",
	activePatients: "Pacientes Activos",
	newPatients: "Pacientes Nuevos",
	inactivePatients: "Pacientes Inactivos",
	actions: {
		view: "Ver Perfil",
		edit: "Editar",
		schedule: "Agendar Cita",
		message: "Enviar Mensaje",
		call: "Llamar",
		email: "Enviar Email",
		history: "Ver Historial"
	},
	tableHeaders: {
		name: "Nombre",
		contact: "Contacto",
		lastVisit: "Última Visita",
		nextAppointment: "Próxima Cita",
		status: "Estado",
		actions: "Acciones"
	},
	status: {
		active: "Activo",
		inactive: "Inactivo",
		new: "Nuevo",
		pending: "Pendiente"
	},
	stats: {
		totalPatients: "Total de Pacientes",
		activePatients: "Pacientes Activos",
		newThisMonth: "Nuevos este Mes",
		appointmentsToday: "Citas Hoy"
	}
};

export default function SpanishPatientsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	// Mock patients data
	const patients = [
		{
			id: 1,
			name: "María González Pérez",
			email: "maria.gonzalez@email.com",
			phone: "+52 55 1234 5678",
			whatsapp: "+52 55 1234 5678",
			lastVisit: "2024-01-10",
			nextAppointment: "2024-01-20",
			status: "active",
			age: 35,
			gender: "Femenino",
			address: "Av. Reforma 123, CDMX",
			insurance: "Seguro Popular",
			emergencyContact: "Juan González - +52 55 8765 4321"
		},
		{
			id: 2,
			name: "Carlos Hernández López",
			email: "carlos.hernandez@email.com",
			phone: "+52 55 2345 6789",
			whatsapp: "+52 55 2345 6789",
			lastVisit: "2024-01-08",
			nextAppointment: "2024-01-18",
			status: "active",
			age: 42,
			gender: "Masculino",
			address: "Calle Juárez 456, CDMX",
			insurance: "IMSS",
			emergencyContact: "Ana Hernández - +52 55 9876 5432"
		},
		{
			id: 3,
			name: "Ana Martínez Ruiz",
			email: "ana.martinez@email.com",
			phone: "+52 55 3456 7890",
			whatsapp: "+52 55 3456 7890",
			lastVisit: "2024-01-05",
			nextAppointment: null,
			status: "inactive",
			age: 28,
			gender: "Femenino",
			address: "Insurgentes Sur 789, CDMX",
			insurance: "Particular",
			emergencyContact: "Luis Martínez - +52 55 5432 1098"
		},
		{
			id: 4,
			name: "Luis Morales García",
			email: "luis.morales@email.com",
			phone: "+52 55 4567 8901",
			whatsapp: "+52 55 4567 8901",
			lastVisit: null,
			nextAppointment: "2024-01-16",
			status: "new",
			age: 31,
			gender: "Masculino",
			address: "Polanco 321, CDMX",
			insurance: "Seguro Popular",
			emergencyContact: "Carmen Morales - +52 55 2109 8765"
		},
		{
			id: 5,
			name: "Carmen Ruiz Sánchez",
			email: "carmen.ruiz@email.com",
			phone: "+52 55 5678 9012",
			whatsapp: "+52 55 5678 9012",
			lastVisit: "2024-01-12",
			nextAppointment: "2024-01-22",
			status: "active",
			age: 45,
			gender: "Femenino",
			address: "Roma Norte 654, CDMX",
			insurance: "ISSSTE",
			emergencyContact: "Pedro Ruiz - +52 55 6543 2109"
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active": return "bg-green-100 text-green-800 border-green-200";
			case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
			case "new": return "bg-blue-100 text-blue-800 border-blue-200";
			case "pending": return "bg-orange-100 text-orange-800 border-orange-200";
			default: return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusText = (status: string) => {
		return translations.status[status as keyof typeof translations.status] || status;
	};

	const filteredPatients = patients.filter(patient => {
		const matchesSearch = 
			patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.phone.includes(searchTerm);
		
		const matchesFilter = filterStatus === "all" || patient.status === filterStatus;
		
		return matchesSearch && matchesFilter;
	});

	const totalPatients = patients.length;
	const activePatients = patients.filter(p => p.status === "active").length;
	const newPatients = patients.filter(p => p.status === "new").length;
	const patientsWithAppointmentsToday = patients.filter(p => 
		p.nextAppointment === new Date().toISOString().split('T')[0]
	).length;

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Sin cita";
		return new Date(dateString).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
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
										Panel Principal
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
									>
										Citas
									</Link>
									<Link
										href="/es/receptionist/patients"
										className="rounded-md bg-gray-900 px-3 py-2 text-white text-sm font-medium"
									>
										Pacientes
									</Link>
								</div>
							</div>
						</div>
						<Link
							href="/es/receptionist/patients/new"
							className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
						>
							<Plus className="mr-2 inline h-4 w-4" />
							{translations.newPatient}
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

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium">{translations.stats.totalPatients}</p>
									<p className="font-bold text-2xl text-white">{totalPatients}</p>
								</div>
								<Users className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium">{translations.stats.activePatients}</p>
									<p className="font-bold text-2xl text-white">{activePatients}</p>
								</div>
								<Users className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium">{translations.stats.newThisMonth}</p>
									<p className="font-bold text-2xl text-white">{newPatients}</p>
								</div>
								<Users className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-gray-700 bg-gray-800">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium">{translations.stats.appointmentsToday}</p>
									<p className="font-bold text-2xl text-white">{patientsWithAppointmentsToday}</p>
								</div>
								<Calendar className="h-8 w-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters and Search */}
				<Card className="mb-8 border-gray-700 bg-gray-800">
					<CardContent className="p-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-1 items-center space-x-4">
								<div className="relative flex-1 max-w-md">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
										<SelectItem value="all">Todos los Pacientes</SelectItem>
										<SelectItem value="active">Pacientes Activos</SelectItem>
										<SelectItem value="new">Pacientes Nuevos</SelectItem>
										<SelectItem value="inactive">Pacientes Inactivos</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button variant="outline" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
								<Filter className="mr-2 h-4 w-4" />
								Filtros Avanzados
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Patients Table */}
				<Card className="border-gray-700 bg-gray-800">
					<CardHeader>
						<CardTitle className="text-white">
							Pacientes ({filteredPatients.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-gray-700 border-b">
										<th className="pb-3 text-left text-gray-400 text-sm font-medium">{translations.tableHeaders.name}</th>
										<th className="pb-3 text-left text-gray-400 text-sm font-medium">{translations.tableHeaders.contact}</th>
										<th className="pb-3 text-left text-gray-400 text-sm font-medium">{translations.tableHeaders.lastVisit}</th>
										<th className="pb-3 text-left text-gray-400 text-sm font-medium">{translations.tableHeaders.nextAppointment}</th>
										<th className="pb-3 text-left text-gray-400 text-sm font-medium">{translations.tableHeaders.status}</th>
										<th className="pb-3 text-left text-gray-400 text-sm font-medium">{translations.tableHeaders.actions}</th>
									</tr>
								</thead>
								<tbody>
									{filteredPatients.map((patient) => (
										<tr key={patient.id} className="border-gray-700 border-b">
											<td className="py-4">
												<div className="font-medium text-white">{patient.name}</div>
												<div className="text-gray-400 text-sm">{patient.age} años • {patient.gender}</div>
											</td>
											<td className="py-4">
												<div className="text-white">{patient.phone}</div>
												<div className="text-gray-400 text-sm">{patient.email}</div>
											</td>
											<td className="py-4 text-white">
												{patient.lastVisit ? formatDate(patient.lastVisit) : "Primera visita"}
											</td>
											<td className="py-4 text-white">
												{formatDate(patient.nextAppointment)}
											</td>
											<td className="py-4">
												<Badge className={getStatusColor(patient.status)}>
													{getStatusText(patient.status)}
												</Badge>
											</td>
											<td className="py-4">
												<div className="flex items-center space-x-2">
													<Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
														<Eye className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
														<Phone className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
														<MessageSquare className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
														<Calendar className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
														<Edit className="h-4 w-4" />
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
