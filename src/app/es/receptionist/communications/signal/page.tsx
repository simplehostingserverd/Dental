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
	ArrowLeft,
	CheckCircle,
	Clock,
	Filter,
	Lock,
	Phone,
	Plus,
	Search,
	Send,
	Settings,
	Shield,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Spanish translations
const translations = {
	title: "Signal Seguro",
	subtitle: "Comunicaciones cifradas de extremo a extremo con pacientes",
	newMessage: "Nuevo Mensaje",
	sendMessage: "Enviar Mensaje",
	messageHistory: "Historial de Mensajes",
	templates: "Plantillas",
	quickReplies: "Respuestas Rápidas",
	messageTypes: {
		appointment: "Recordatorio de Cita",
		confirmation: "Confirmación",
		payment: "Recordatorio de Pago",
		followUp: "Seguimiento",
		promotion: "Promoción",
		general: "General",
		emergency: "Emergencia",
	},
	stats: {
		totalMessages: "Mensajes Totales",
		sentToday: "Enviados Hoy",
		pendingResponses: "Respuestas Pendientes",
		activeChats: "Chats Activos",
	},
};

export default function SpanishSignalPage() {
	const [selectedPatient, setSelectedPatient] = useState("");
	const [messageType, setMessageType] = useState("general");
	const [messageText, setMessageText] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [isConnected, setIsConnected] = useState(false);

	// Check Signal connection status
	useEffect(() => {
		checkConnection();
	}, []);

	const checkConnection = async () => {
		try {
			const response = await fetch("/api/communications/signal");
			if (response.ok) {
				const data = await response.json();
				setIsConnected(data.available || false);
			} else {
				setIsConnected(false);
			}
		} catch (error) {
			console.error("Error checking Signal connection:", error);
			setIsConnected(false);
		}
	};

	// Mock data for Signal communications
	const signalStats = [
		{
			title: translations.stats.totalMessages,
			value: "312",
			change: "+15",
			icon: Shield,
			color: "text-blue-600",
		},
		{
			title: translations.stats.sentToday,
			value: "28",
			change: "+6",
			icon: Send,
			color: "text-green-600",
		},
		{
			title: translations.stats.pendingResponses,
			value: "3",
			change: "-1",
			icon: AlertCircle,
			color: "text-orange-600",
		},
		{
			title: translations.stats.activeChats,
			value: "12",
			change: "+2",
			icon: User,
			color: "text-purple-600",
		},
	];

	const recentMessages = [
		{
			id: 1,
			patient: "María González",
			phone: "+52 55 1234 5678",
			type: "appointment",
			message: "🔒 Recordatorio confidencial: Su cita es mañana a las 10:00 AM",
			timestamp: "2024-01-15 14:30",
			status: "delivered",
			response: "Perfecto, ahí estaré. Gracias por la privacidad!",
		},
		{
			id: 2,
			patient: "Carlos Hernández",
			phone: "+52 55 2345 6789",
			type: "emergency",
			message: "🚨 Información médica urgente sobre su tratamiento",
			timestamp: "2024-01-15 13:15",
			status: "read",
			response: "Entendido, gracias por contactarme de forma segura",
		},
		{
			id: 3,
			patient: "Ana López",
			phone: "+52 55 3456 7890",
			type: "followUp",
			message: "🔐 Seguimiento confidencial post-endodoncia",
			timestamp: "2024-01-15 12:00",
			status: "delivered",
			response: "Mucho mejor, gracias por la privacidad",
		},
	];

	const messageTemplates = [
		{
			id: 1,
			name: "Recordatorio de Cita Confidencial",
			type: "appointment",
			content:
				"🔒 RECORDATORIO CONFIDENCIAL\n\nHola {nombre},\n\nTe recordamos tu cita:\n📅 Fecha: {fecha}\n🕐 Hora: {hora}\n👨‍⚕️ Doctor: {doctor}\n\nEste mensaje está cifrado de extremo a extremo para tu privacidad.",
		},
		{
			id: 2,
			name: "Información Médica Segura",
			type: "followUp",
			content:
				"🔐 INFORMACIÓN MÉDICA CONFIDENCIAL\n\nHola {nombre},\n\nInformación sobre tu {tratamiento}:\n{informacion}\n\nTu privacidad médica está protegida con cifrado de extremo a extremo.",
		},
		{
			id: 3,
			name: "Emergencia Médica",
			type: "emergency",
			content:
				"🚨 COMUNICACIÓN MÉDICA URGENTE\n\nHola {nombre},\n\nInformación urgente sobre tu tratamiento:\n{mensaje_urgente}\n\nContacta inmediatamente: {telefono_emergencia}",
		},
		{
			id: 4,
			name: "Resultados Confidenciales",
			type: "general",
			content:
				"🔒 RESULTADOS MÉDICOS CONFIDENCIALES\n\nHola {nombre},\n\nTus resultados están listos:\n{resultados}\n\nEsta información está protegida por cifrado de extremo a extremo.",
		},
	];

	const patients = [
		{ id: 1, name: "María González", phone: "+52 55 1234 5678" },
		{ id: 2, name: "Carlos Hernández", phone: "+52 55 2345 6789" },
		{ id: 3, name: "Ana López", phone: "+52 55 3456 7890" },
		{ id: 4, name: "Luis Morales", phone: "+52 55 4567 8901" },
	];

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

		try {
			const response = await fetch("/api/communications/signal", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: patients.find((p) => p.id.toString() === selectedPatient)?.phone,
					type: messageType,
					message: messageText,
					data: {
						patientName: patients.find(
							(p) => p.id.toString() === selectedPatient,
						)?.name,
					},
				}),
			});

			if (response.ok) {
				setMessageText("");
				setSelectedPatient("");
				alert("Mensaje enviado de forma segura");
			} else {
				const error = await response.json();
				alert(error.error || "Error al enviar mensaje");
			}
		} catch (error) {
			console.error("Error sending Signal message:", error);
			alert("Error al enviar mensaje");
		}
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
										href="/es/receptionist/communications"
										className="rounded-md px-3 py-2 font-medium text-gray-300 text-sm hover:bg-gray-700 hover:text-white"
									>
										Comunicaciones
									</Link>
									<span className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white">
										Signal
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Badge className={isConnected ? "bg-green-500" : "bg-red-500"}>
								<Lock className="mr-1 h-3 w-3" />
								{isConnected ? "Conectado" : "Desconectado"}
							</Badge>
							<Link
								href="/es/receptionist/communications"
								className="flex items-center rounded-md bg-gray-600 px-4 py-2 font-medium text-sm text-white hover:bg-gray-500"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Volver
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center space-x-3">
						<div className="rounded-full bg-blue-600 p-3">
							<Shield className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="font-bold text-3xl text-white">
								{translations.title}
							</h1>
							<p className="mt-2 text-gray-400">{translations.subtitle}</p>
						</div>
					</div>
				</div>

				{/* Security Notice */}
				<div className="mb-6 rounded-lg border border-blue-600 bg-blue-900/20 p-4">
					<div className="flex items-center space-x-2">
						<Lock className="h-5 w-5 text-blue-400" />
						<p className="text-blue-300">
							<strong>Comunicación Segura:</strong> Todos los mensajes de Signal
							están cifrados de extremo a extremo para proteger la privacidad
							médica de los pacientes.
						</p>
					</div>
				</div>

				{/* Connection Warning */}
				{!isConnected && (
					<div className="mb-6 rounded-lg border border-orange-600 bg-orange-900/20 p-4">
						<div className="flex items-center space-x-2">
							<AlertCircle className="h-5 w-5 text-orange-400" />
							<p className="text-orange-300">
								Signal no está configurado. Ve a
								<Link
									href="/dashboard/settings/communications"
									className="ml-1 text-orange-200 underline"
								>
									Configuración
								</Link>
								para configurar Signal CLI.
							</p>
						</div>
					</div>
				)}

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					{signalStats.map((stat, index) => {
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

				{/* Main Signal Interface */}
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Send Message Panel */}
					<div className="lg:col-span-1">
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<Shield className="mr-2 h-5 w-5" />
									{translations.newMessage}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
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
											<SelectItem value="emergency">
												{translations.messageTypes.emergency}
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
										Mensaje Cifrado
									</label>
									<Textarea
										placeholder="Escribe tu mensaje confidencial aquí..."
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
										rows={4}
									/>
									<p className="mt-1 text-gray-500 text-xs">
										🔒 Este mensaje será cifrado de extremo a extremo
									</p>
								</div>

								{/* Send Button */}
								<Button
									onClick={handleSendMessage}
									className="w-full bg-blue-600 hover:bg-blue-700"
									disabled={
										!selectedPatient || !messageText.trim() || !isConnected
									}
								>
									<Shield className="mr-2 h-4 w-4" />
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
										<CardTitle className="text-white">
											Mensajes Seguros de Signal
										</CardTitle>
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
																<span className="text-lg">🔒</span>
																<span className="font-medium text-white">
																	{message.patient}
																</span>
																<Badge
																	className={getStatusColor(message.status)}
																>
																	{getStatusText(message.status)}
																</Badge>
																<Badge
																	variant="outline"
																	className="border-blue-600 text-blue-300"
																>
																	<Lock className="mr-1 h-3 w-3" />
																	Cifrado
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
											Plantillas Seguras de Signal
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
													<div className="mt-2 flex items-center space-x-1">
														<Lock className="h-3 w-3 text-blue-400" />
														<span className="text-blue-400 text-xs">
															Cifrado de extremo a extremo
														</span>
													</div>
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
