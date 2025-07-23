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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	AlertCircle,
	CheckCircle,
	Clock,
	Filter,
	Mail,
	MessageSquare,
	Phone,
	Plus,
	Search,
	Send,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Spanish translations
const translations = {
	title: "Centro de Comunicaciones",
	subtitle: "Gestiona todas las comunicaciones con pacientes",
	newMessage: "Nuevo Mensaje",
	sendMessage: "Enviar Mensaje",
	messageHistory: "Historial de Mensajes",
	templates: "Plantillas",
	platforms: {
		whatsapp: "WhatsApp",
		telegram: "Telegram",
		signal: "Signal",
		sms: "SMS",
		email: "Email",
	},
	messageTypes: {
		appointment: "Recordatorio de Cita",
		confirmation: "Confirmación",
		payment: "Recordatorio de Pago",
		followUp: "Seguimiento",
		promotion: "Promoción",
		general: "General",
	},
	stats: {
		totalMessages: "Mensajes Totales",
		sentToday: "Enviados Hoy",
		pendingResponses: "Respuestas Pendientes",
		activeChats: "Chats Activos",
	},
};

export default function SpanishCommunicationsPage() {
	const [selectedPlatform, setSelectedPlatform] = useState("whatsapp");
	const [selectedPatient, setSelectedPatient] = useState("");
	const [messageType, setMessageType] = useState("general");
	const [messageText, setMessageText] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	// Mock data for communications
	const communicationStats = [
		{
			title: translations.stats.totalMessages,
			value: "1,247",
			change: "+23",
			icon: MessageSquare,
			color: "text-blue-600",
		},
		{
			title: translations.stats.sentToday,
			value: "89",
			change: "+12",
			icon: Send,
			color: "text-green-600",
		},
		{
			title: translations.stats.pendingResponses,
			value: "15",
			change: "-3",
			icon: AlertCircle,
			color: "text-orange-600",
		},
		{
			title: translations.stats.activeChats,
			value: "42",
			change: "+5",
			icon: Users,
			color: "text-purple-600",
		},
	];

	const recentMessages = [
		{
			id: 1,
			patient: "María González",
			platform: "whatsapp",
			type: "appointment",
			message: "Recordatorio de cita para mañana a las 10:00 AM",
			timestamp: "2024-01-15 14:30",
			status: "delivered",
			response: "Confirmado, ahí estaré. Gracias!",
		},
		{
			id: 2,
			patient: "Carlos Hernández",
			platform: "telegram",
			type: "payment",
			message: "Recordatorio de pago pendiente por $1,500 MXN",
			timestamp: "2024-01-15 13:15",
			status: "read",
			response: null,
		},
		{
			id: 3,
			patient: "Ana López",
			platform: "signal",
			type: "followUp",
			message: "Instrucciones de cuidado post-endodoncia",
			timestamp: "2024-01-15 12:00",
			status: "delivered",
			response: "Muchas gracias por las instrucciones",
		},
		{
			id: 4,
			patient: "Luis Morales",
			platform: "whatsapp",
			type: "confirmation",
			message: "Confirmación de cita reprogramada",
			timestamp: "2024-01-15 11:45",
			status: "delivered",
			response: "Perfecto, nos vemos el viernes",
		},
	];

	const messageTemplates = [
		{
			id: 1,
			name: "Recordatorio de Cita",
			type: "appointment",
			content:
				"Hola {nombre}, te recordamos tu cita el {fecha} a las {hora} con {doctor}. Por favor confirma tu asistencia.",
		},
		{
			id: 2,
			name: "Confirmación de Cita",
			type: "confirmation",
			content:
				"Tu cita ha sido confirmada para el {fecha} a las {hora}. Te esperamos en nuestra clínica.",
		},
		{
			id: 3,
			name: "Recordatorio de Pago",
			type: "payment",
			content:
				"Estimado/a {nombre}, tienes un pago pendiente de ${monto} con vencimiento el {fecha}.",
		},
		{
			id: 4,
			name: "Cuidados Post-Tratamiento",
			type: "followUp",
			content:
				"Hola {nombre}, aquí tienes las instrucciones de cuidado después de tu {tratamiento}: {instrucciones}",
		},
	];

	const patients = [
		{ id: 1, name: "María González", phone: "+52 55 1234 5678" },
		{ id: 2, name: "Carlos Hernández", phone: "+52 55 2345 6789" },
		{ id: 3, name: "Ana López", phone: "+52 55 3456 7890" },
		{ id: 4, name: "Luis Morales", phone: "+52 55 4567 8901" },
	];

	const getPlatformIcon = (platform: string) => {
		switch (platform) {
			case "whatsapp":
				return "💬";
			case "telegram":
				return "✈️";
			case "signal":
				return "🔒";
			case "sms":
				return "📱";
			case "email":
				return "📧";
			default:
				return "💬";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "delivered":
				return "bg-green-100 text-green-800";
			case "read":
				return "bg-blue-100 text-blue-800";
			case "sent":
				return "bg-gray-100 text-gray-800";
			case "failed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "delivered":
				return "Entregado";
			case "read":
				return "Leído";
			case "sent":
				return "Enviado";
			case "failed":
				return "Fallido";
			default:
				return status;
		}
	};

	const handleSendMessage = async () => {
		if (!selectedPatient || !messageText.trim()) return;

		// Here you would call the appropriate API based on selectedPlatform
		console.log("Sending message:", {
			platform: selectedPlatform,
			patient: selectedPatient,
			type: messageType,
			message: messageText,
		});

		// Reset form
		setMessageText("");
		setSelectedPatient("");
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
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Panel Principal
									</Link>
									<Link
										href="/es/receptionist/appointments"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Citas
									</Link>
									<Link
										href="/es/receptionist/communications"
										className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white"
									>
										Comunicaciones
									</Link>
								</div>
							</div>
						</div>
						<Button className="bg-blue-600 hover:bg-blue-700">
							<Plus className="mr-2 h-4 w-4" />
							{translations.newMessage}
						</Button>
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
					{communicationStats.map((stat, index) => {
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

				{/* Main Communication Interface */}
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Send Message Panel */}
					<div className="lg:col-span-1">
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="text-white">
									{translations.newMessage}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Platform Selection */}
								<div>
									<label className="mb-2 block font-medium text-gray-300 text-sm">
										Plataforma
									</label>
									<Select
										value={selectedPlatform}
										onValueChange={setSelectedPlatform}
									>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											<SelectItem value="whatsapp">
												💬 {translations.platforms.whatsapp}
											</SelectItem>
											<SelectItem value="telegram">
												✈️ {translations.platforms.telegram}
											</SelectItem>
											<SelectItem value="signal">
												🔒 {translations.platforms.signal}
											</SelectItem>
											<SelectItem value="sms">
												📱 {translations.platforms.sms}
											</SelectItem>
											<SelectItem value="email">
												📧 {translations.platforms.email}
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Patient Selection */}
								<div>
									<label className="mb-2 block font-medium text-gray-300 text-sm">
										Paciente
									</label>
									<Select
										value={selectedPatient}
										onValueChange={setSelectedPatient}
									>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar paciente" />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											{patients.map((patient) => (
												<SelectItem
													key={patient.id}
													value={patient.id.toString()}
												>
													{patient.name} - {patient.phone}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Message Type */}
								<div>
									<label className="mb-2 block font-medium text-gray-300 text-sm">
										Tipo de Mensaje
									</label>
									<Select value={messageType} onValueChange={setMessageType}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											<SelectItem value="appointment">
												{translations.messageTypes.appointment}
											</SelectItem>
											<SelectItem value="confirmation">
												{translations.messageTypes.confirmation}
											</SelectItem>
											<SelectItem value="payment">
												{translations.messageTypes.payment}
											</SelectItem>
											<SelectItem value="followUp">
												{translations.messageTypes.followUp}
											</SelectItem>
											<SelectItem value="promotion">
												{translations.messageTypes.promotion}
											</SelectItem>
											<SelectItem value="general">
												{translations.messageTypes.general}
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Message Text */}
								<div>
									<label className="mb-2 block font-medium text-gray-300 text-sm">
										Mensaje
									</label>
									<Textarea
										placeholder="Escribe tu mensaje aquí..."
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
										rows={4}
									/>
								</div>

								{/* Send Button */}
								<Button
									onClick={handleSendMessage}
									className="w-full bg-blue-600 hover:bg-blue-700"
									disabled={!selectedPatient || !messageText.trim()}
								>
									<Send className="mr-2 h-4 w-4" />
									{translations.sendMessage}
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Message History and Templates */}
					<div className="lg:col-span-2">
						<Tabs defaultValue="history" className="w-full">
							<TabsList className="grid w-full grid-cols-2 bg-gray-800">
								<TabsTrigger value="history" className="text-white">
									{translations.messageHistory}
								</TabsTrigger>
								<TabsTrigger value="templates" className="text-white">
									{translations.templates}
								</TabsTrigger>
							</TabsList>

							<TabsContent value="history">
								<Card className="border-gray-700 bg-gray-800">
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="text-white">
												Mensajes Recientes
											</CardTitle>
											<div className="flex items-center space-x-2">
												<div className="relative">
													<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
													<Input
														placeholder="Buscar mensajes..."
														value={searchTerm}
														onChange={(e) => setSearchTerm(e.target.value)}
														className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400"
													/>
												</div>
												<Button
													variant="outline"
													size="sm"
													className="border-gray-600 bg-gray-700 text-white"
												>
													<Filter className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{recentMessages.map((message) => (
												<div
													key={message.id}
													className="rounded-lg border border-gray-700 bg-gray-900 p-4"
												>
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<div className="flex items-center space-x-2">
																<span className="text-lg">
																	{getPlatformIcon(message.platform)}
																</span>
																<span className="font-medium text-white">
																	{message.patient}
																</span>
																<Badge
																	className={getStatusColor(message.status)}
																>
																	{getStatusText(message.status)}
																</Badge>
															</div>
															<p className="mt-2 text-gray-300">
																{message.message}
															</p>
															{message.response && (
																<div className="mt-2 rounded bg-gray-800 p-2">
																	<p className="text-blue-400 text-sm">
																		Respuesta: {message.response}
																	</p>
																</div>
															)}
														</div>
														<div className="text-gray-400 text-sm">
															{message.timestamp}
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="templates">
								<Card className="border-gray-700 bg-gray-800">
									<CardHeader>
										<CardTitle className="text-white">
											Plantillas de Mensajes
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-4 md:grid-cols-2">
											{messageTemplates.map((template) => (
												<div
													key={template.id}
													className="rounded-lg border border-gray-700 bg-gray-900 p-4"
												>
													<div className="flex items-center justify-between">
														<h3 className="font-medium text-white">
															{template.name}
														</h3>
														<Button
															size="sm"
															variant="outline"
															className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
															onClick={() => setMessageText(template.content)}
														>
															Usar
														</Button>
													</div>
													<p className="mt-2 text-gray-400 text-sm">
														{template.content}
													</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>
		</div>
	);
}
