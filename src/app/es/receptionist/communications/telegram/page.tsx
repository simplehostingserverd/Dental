"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	Send, 
	Phone, 
	User,
	Clock,
	CheckCircle,
	AlertCircle,
	Plus,
	Search,
	Filter,
	Settings,
	ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Spanish translations
const translations = {
	title: "Telegram Bot",
	subtitle: "Gestiona las comunicaciones de Telegram con pacientes",
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
		general: "General"
	},
	stats: {
		totalMessages: "Mensajes Totales",
		sentToday: "Enviados Hoy",
		pendingResponses: "Respuestas Pendientes",
		activeChats: "Chats Activos"
	}
};

export default function SpanishTelegramPage() {
	const [selectedPatient, setSelectedPatient] = useState("");
	const [messageType, setMessageType] = useState("general");
	const [messageText, setMessageText] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [isConnected, setIsConnected] = useState(false);

	// Check Telegram connection status
	useEffect(() => {
		checkConnection();
	}, []);

	const checkConnection = async () => {
		try {
			const response = await fetch("/api/communications/telegram");
			if (response.ok) {
				const data = await response.json();
				setIsConnected(data.available || false);
			} else {
				setIsConnected(false);
			}
		} catch (error) {
			console.error("Error checking Telegram connection:", error);
			setIsConnected(false);
		}
	};

	// Mock data for Telegram communications
	const telegramStats = [
		{
			title: translations.stats.totalMessages,
			value: "523",
			change: "+18",
			icon: Send,
			color: "text-blue-600"
		},
		{
			title: translations.stats.sentToday,
			value: "42",
			change: "+8",
			icon: Send,
			color: "text-green-600"
		},
		{
			title: translations.stats.pendingResponses,
			value: "5",
			change: "-2",
			icon: AlertCircle,
			color: "text-orange-600"
		},
		{
			title: translations.stats.activeChats,
			value: "18",
			change: "+3",
			icon: User,
			color: "text-purple-600"
		}
	];

	const recentMessages = [
		{
			id: 1,
			patient: "María González",
			chatId: "123456789",
			type: "appointment",
			message: "🦷 Recordatorio: Su cita es mañana a las 10:00 AM con Dr. Sánchez",
			timestamp: "2024-01-15 14:30",
			status: "delivered",
			response: "Perfecto, ahí estaré. Gracias!"
		},
		{
			id: 2,
			patient: "Carlos Hernández",
			chatId: "987654321",
			type: "payment",
			message: "💳 Recordatorio de pago pendiente por $1,500 MXN",
			timestamp: "2024-01-15 13:15",
			status: "read",
			response: null
		},
		{
			id: 3,
			patient: "Ana López",
			chatId: "456789123",
			type: "followUp",
			message: "🩺 ¿Cómo se siente después del tratamiento de endodoncia?",
			timestamp: "2024-01-15 12:00",
			status: "delivered",
			response: "Mucho mejor, gracias por preguntar"
		}
	];

	const messageTemplates = [
		{
			id: 1,
			name: "Recordatorio de Cita",
			type: "appointment",
			content: "🦷 <b>RECORDATORIO DE CITA</b>\n\nHola {nombre},\n\nTe recordamos tu cita:\n📅 Fecha: {fecha}\n🕐 Hora: {hora}\n👨‍⚕️ Doctor: {doctor}\n\nPor favor confirma tu asistencia."
		},
		{
			id: 2,
			name: "Confirmación de Cita",
			type: "confirmation",
			content: "✅ <b>CITA CONFIRMADA</b>\n\nHola {nombre},\n\nTu cita ha sido confirmada:\n📅 {fecha} a las {hora}\n\n¡Te esperamos en nuestra clínica!"
		},
		{
			id: 3,
			name: "Recordatorio de Pago",
			type: "payment",
			content: "💳 <b>RECORDATORIO DE PAGO</b>\n\nEstimado/a {nombre},\n\nTienes un pago pendiente:\n💰 Monto: ${monto} MXN\n📅 Vencimiento: {fecha}\n\nContacta con nosotros para más información."
		},
		{
			id: 4,
			name: "Seguimiento Post-Tratamiento",
			type: "followUp",
			content: "🩺 <b>SEGUIMIENTO</b>\n\nHola {nombre},\n\n¿Cómo te sientes después de tu {tratamiento}?\n\nSi tienes alguna molestia, no dudes en contactarnos."
		}
	];

	const patients = [
		{ id: 1, name: "María González", chatId: "123456789" },
		{ id: 2, name: "Carlos Hernández", chatId: "987654321" },
		{ id: 3, name: "Ana López", chatId: "456789123" },
		{ id: 4, name: "Luis Morales", chatId: "789123456" }
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "delivered": return "bg-green-100 text-green-800";
			case "read": return "bg-blue-100 text-blue-800";
			case "sent": return "bg-gray-100 text-gray-800";
			case "failed": return "bg-red-100 text-red-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "delivered": return "Entregado";
			case "read": return "Leído";
			case "sent": return "Enviado";
			case "failed": return "Fallido";
			default: return status;
		}
	};

	const handleSendMessage = async () => {
		if (!selectedPatient || !messageText.trim()) return;

		try {
			const response = await fetch("/api/communications/telegram", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chatId: patients.find(p => p.id.toString() === selectedPatient)?.chatId,
					type: messageType,
					message: messageText,
					data: {
						patientName: patients.find(p => p.id.toString() === selectedPatient)?.name
					}
				}),
			});

			if (response.ok) {
				setMessageText("");
				setSelectedPatient("");
				alert("Mensaje enviado exitosamente");
			} else {
				const error = await response.json();
				alert(error.error || "Error al enviar mensaje");
			}
		} catch (error) {
			console.error("Error sending Telegram message:", error);
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
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
									>
										Panel Principal
									</Link>
									<Link
										href="/es/receptionist/communications"
										className="rounded-md px-3 py-2 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white"
									>
										Comunicaciones
									</Link>
									<span className="rounded-md bg-gray-900 px-3 py-2 text-white text-sm font-medium">
										Telegram
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Badge className={isConnected ? "bg-green-500" : "bg-red-500"}>
								{isConnected ? "Conectado" : "Desconectado"}
							</Badge>
							<Link
								href="/es/receptionist/communications"
								className="flex items-center rounded-md bg-gray-600 px-4 py-2 text-white text-sm font-medium hover:bg-gray-500"
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
						<div className="p-3 bg-blue-600 rounded-full">
							<Send className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="font-bold text-3xl text-white">{translations.title}</h1>
							<p className="mt-2 text-gray-400">{translations.subtitle}</p>
						</div>
					</div>
				</div>

				{/* Connection Warning */}
				{!isConnected && (
					<div className="mb-6 rounded-lg border border-orange-600 bg-orange-900/20 p-4">
						<div className="flex items-center space-x-2">
							<AlertCircle className="h-5 w-5 text-orange-400" />
							<p className="text-orange-300">
								Telegram no está configurado. Ve a 
								<Link href="/dashboard/settings/communications" className="ml-1 text-orange-200 underline">
									Configuración
								</Link> 
								para configurar tu Bot de Telegram.
							</p>
						</div>
					</div>
				)}

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					{telegramStats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<Card key={index} className="border-gray-700 bg-gray-800">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-gray-400 text-sm font-medium">{stat.title}</p>
											<p className="font-bold text-2xl text-white">{stat.value}</p>
											<p className="text-green-400 text-sm">{stat.change}</p>
										</div>
										<IconComponent className={`h-8 w-8 ${stat.color}`} />
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Main Telegram Interface */}
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Send Message Panel */}
					<div className="lg:col-span-1">
						<Card className="border-gray-700 bg-gray-800">
							<CardHeader>
								<CardTitle className="flex items-center text-white">
									<Send className="mr-2 h-5 w-5" />
									{translations.newMessage}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Patient Selection */}
								<div>
									<label className="mb-2 block text-gray-300 text-sm font-medium">
										Paciente
									</label>
									<Select value={selectedPatient} onValueChange={setSelectedPatient}>
										<SelectTrigger className="border-gray-600 bg-gray-700 text-white">
											<SelectValue placeholder="Seleccionar paciente" />
										</SelectTrigger>
										<SelectContent className="border-gray-600 bg-gray-700">
											{patients.map((patient) => (
												<SelectItem key={patient.id} value={patient.id.toString()}>
													{patient.name} - {patient.chatId}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Message Type */}
								<div>
									<label className="mb-2 block text-gray-300 text-sm font-medium">
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
									<label className="mb-2 block text-gray-300 text-sm font-medium">
										Mensaje
									</label>
									<Textarea
										placeholder="Escribe tu mensaje aquí... (Puedes usar HTML: <b>negrita</b>, <i>cursiva</i>)"
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
										rows={4}
									/>
									<p className="mt-1 text-gray-500 text-xs">
										Telegram soporta formato HTML básico
									</p>
								</div>

								{/* Send Button */}
								<Button 
									onClick={handleSendMessage}
									className="w-full bg-blue-600 hover:bg-blue-700"
									disabled={!selectedPatient || !messageText.trim() || !isConnected}
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
										<CardTitle className="text-white">Mensajes Recientes de Telegram</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{recentMessages.map((message) => (
												<div key={message.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<div className="flex items-center space-x-2">
																<span className="text-lg">✈️</span>
																<span className="font-medium text-white">{message.patient}</span>
																<Badge className={getStatusColor(message.status)}>
																	{getStatusText(message.status)}
																</Badge>
															</div>
															<p className="mt-2 text-gray-300">{message.message}</p>
															{message.response && (
																<div className="mt-2 rounded bg-gray-800 p-2">
																	<p className="text-blue-400 text-sm">Respuesta: {message.response}</p>
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
										<CardTitle className="text-white">Plantillas de Telegram</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-4 md:grid-cols-2">
											{messageTemplates.map((template) => (
												<div key={template.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
													<div className="flex items-center justify-between">
														<h3 className="font-medium text-white">{template.name}</h3>
														<Button 
															size="sm" 
															variant="outline"
															className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
															onClick={() => setMessageText(template.content)}
														>
															Usar
														</Button>
													</div>
													<p className="mt-2 text-gray-400 text-sm">{template.content}</p>
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
