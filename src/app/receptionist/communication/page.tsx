"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	AlertCircle,
	Bell,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Filter,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Send,
	Smartphone,
	User,
	Users,
	XCircle,
} from "lucide-react";
import { useState } from "react";

// Mock data for communication
const reminderTemplates = [
	{
		id: "1",
		name: "Appointment Reminder - 24 Hours",
		type: "appointment",
		channel: "sms",
		content:
			"Hi {patientName}, this is a reminder that you have an appointment tomorrow at {appointmentTime} with {providerName}. Please reply CONFIRM or call us at {practicePhone}.",
	},
	{
		id: "2",
		name: "Appointment Confirmation",
		type: "appointment",
		channel: "email",
		content:
			"Dear {patientName}, your appointment has been scheduled for {appointmentDate} at {appointmentTime} with {providerName}. Please arrive 15 minutes early.",
	},
	{
		id: "3",
		name: "Payment Reminder",
		type: "billing",
		channel: "sms",
		content:
			"Hi {patientName}, you have an outstanding balance of ${balance}. Please call us at {practicePhone} to make a payment.",
	},
	{
		id: "4",
		name: "Cleaning Reminder",
		type: "recall",
		channel: "email",
		content:
			"Dear {patientName}, it's time for your regular dental cleaning! Please call us at {practicePhone} to schedule your appointment.",
	},
];

const sentMessages = [
	{
		id: "1",
		patient: "Sarah Johnson",
		phone: "(555) 123-4567",
		type: "sms",
		template: "Appointment Reminder - 24 Hours",
		sentAt: "2025-07-17T10:30:00",
		status: "delivered",
		response: "CONFIRM",
	},
	{
		id: "2",
		patient: "Michael Chen",
		phone: "(555) 234-5678",
		type: "email",
		template: "Appointment Confirmation",
		sentAt: "2025-07-17T09:15:00",
		status: "opened",
		response: null,
	},
	{
		id: "3",
		patient: "Emily Davis",
		phone: "(555) 345-6789",
		type: "sms",
		template: "Payment Reminder",
		sentAt: "2025-07-17T08:45:00",
		status: "failed",
		response: null,
	},
];

const incomingMessages = [
	{
		id: "1",
		patient: "Sarah Johnson",
		phone: "(555) 123-4567",
		message: "CONFIRM",
		receivedAt: "2025-07-17T10:35:00",
		isRead: true,
		type: "appointment_confirmation",
	},
	{
		id: "2",
		patient: "David Wilson",
		phone: "(555) 456-7890",
		message: "I'm running 10 minutes late for my 2:30 appointment",
		receivedAt: "2025-07-17T14:20:00",
		isRead: false,
		type: "general",
	},
	{
		id: "3",
		patient: "Lisa Brown",
		phone: "(555) 567-8901",
		message: "Can I reschedule my appointment for next week?",
		receivedAt: "2025-07-17T11:15:00",
		isRead: false,
		type: "reschedule_request",
	},
];

const arrivalNotifications = [
	{
		id: "1",
		patient: "Sarah Johnson",
		appointmentTime: "2:30 PM",
		arrivedAt: "2:25 PM",
		status: "early",
		checkInMethod: "self-checkin",
	},
	{
		id: "2",
		patient: "Michael Chen",
		appointmentTime: "3:00 PM",
		arrivedAt: "3:15 PM",
		status: "late",
		checkInMethod: "front-desk",
	},
];

export default function CommunicationPage() {
	const [selectedTemplate, setSelectedTemplate] = useState<
		(typeof reminderTemplates)[0] | null
	>(null);
	const [newMessage, setNewMessage] = useState({
		recipient: "",
		type: "sms",
		message: "",
	});
	const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const getStatusColor = (status: string) => {
		switch (status) {
			case "delivered":
				return "bg-green-100 text-green-800";
			case "opened":
				return "bg-blue-100 text-blue-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "delivered":
				return <CheckCircle className="h-4 w-4" />;
			case "opened":
				return <CheckCircle className="h-4 w-4" />;
			case "failed":
				return <XCircle className="h-4 w-4" />;
			case "pending":
				return <Clock className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const getArrivalStatusColor = (status: string) => {
		switch (status) {
			case "early":
				return "bg-green-100 text-green-800";
			case "on-time":
				return "bg-blue-100 text-blue-800";
			case "late":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleSendMessage = () => {
		// TODO: Implement message sending
		console.log("Sending message:", newMessage);
		setShowNewMessageDialog(false);
		setNewMessage({ recipient: "", type: "sms", message: "" });
	};

	const handleTemplateUse = (template: (typeof reminderTemplates)[0]) => {
		setNewMessage((prev) => ({
			...prev,
			type: template.channel,
			message: template.content,
		}));
		setShowNewMessageDialog(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Communication Center
					</h1>
					<p className="text-gray-600">
						Manage patient communications, reminders, and notifications
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline">
						<Bell className="mr-2 h-4 w-4" />
						Setup Automation
					</Button>
					<Dialog
						open={showNewMessageDialog}
						onOpenChange={setShowNewMessageDialog}
					>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Send Message
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Send New Message</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label htmlFor="recipient">Recipient</Label>
									<Input
										id="recipient"
										placeholder="Patient name or phone number"
										value={newMessage.recipient}
										onChange={(e) =>
											setNewMessage((prev) => ({
												...prev,
												recipient: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<Label htmlFor="messageType">Message Type</Label>
									<Select
										value={newMessage.type}
										onValueChange={(value) =>
											setNewMessage((prev) => ({ ...prev, type: value }))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="sms">SMS Text</SelectItem>
											<SelectItem value="email">Email</SelectItem>
											<SelectItem value="call">Phone Call</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="message">Message</Label>
									<Textarea
										id="message"
										placeholder="Type your message..."
										value={newMessage.message}
										onChange={(e) =>
											setNewMessage((prev) => ({
												...prev,
												message: e.target.value,
											}))
										}
										rows={4}
									/>
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										variant="outline"
										onClick={() => setShowNewMessageDialog(false)}
									>
										Cancel
									</Button>
									<Button onClick={handleSendMessage}>
										<Send className="mr-2 h-4 w-4" />
										Send
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Communication Tabs */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="templates">Templates</TabsTrigger>
					<TabsTrigger value="sent">Sent Messages</TabsTrigger>
					<TabsTrigger value="incoming">
						Incoming ({incomingMessages.filter((m) => !m.isRead).length})
					</TabsTrigger>
					<TabsTrigger value="arrivals">
						Arrivals ({arrivalNotifications.length})
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-4">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">
									Messages Sent Today
								</CardTitle>
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">24</div>
								<p className="text-muted-foreground text-xs">
									<span className="text-green-600">+12%</span> from yesterday
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">
									Delivery Rate
								</CardTitle>
								<CheckCircle className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">96%</div>
								<p className="text-muted-foreground text-xs">
									23 of 24 delivered
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">
									Response Rate
								</CardTitle>
								<Phone className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">78%</div>
								<p className="text-muted-foreground text-xs">
									18 patients responded
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">
									Unread Messages
								</CardTitle>
								<AlertCircle className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">
									{incomingMessages.filter((m) => !m.isRead).length}
								</div>
								<p className="text-muted-foreground text-xs">
									Require attention
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button variant="outline" className="w-full justify-start">
									<Bell className="mr-2 h-4 w-4" />
									Send Appointment Reminders
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<Calendar className="mr-2 h-4 w-4" />
									Send Confirmation Requests
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<FileText className="mr-2 h-4 w-4" />
									Send Forms to Patients
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<Users className="mr-2 h-4 w-4" />
									Broadcast Message
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{sentMessages.slice(0, 3).map((message) => (
										<div
											key={message.id}
											className="flex items-center space-x-3"
										>
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
												{message.type === "sms" ? (
													<Smartphone className="h-4 w-4 text-blue-600" />
												) : (
													<Mail className="h-4 w-4 text-blue-600" />
												)}
											</div>
											<div className="flex-1">
												<p className="font-medium text-sm">{message.patient}</p>
												<p className="text-gray-500 text-xs">
													{message.template}
												</p>
											</div>
											<Badge className={getStatusColor(message.status)}>
												{getStatusIcon(message.status)}
												<span className="ml-1">{message.status}</span>
											</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Templates Tab */}
				<TabsContent value="templates" className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-lg">Message Templates</h3>
						<Button variant="outline">
							<Plus className="mr-2 h-4 w-4" />
							New Template
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{reminderTemplates.map((template) => (
							<Card key={template.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-base">{template.name}</CardTitle>
										<div className="flex items-center space-x-2">
											<Badge variant="outline">
												{template.channel === "sms" ? (
													<Smartphone className="mr-1 h-3 w-3" />
												) : (
													<Mail className="mr-1 h-3 w-3" />
												)}
												{template.channel.toUpperCase()}
											</Badge>
											<Badge variant="outline">{template.type}</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-gray-600 text-sm">
										{template.content.substring(0, 100)}...
									</p>
									<div className="flex space-x-2">
										<Button
											size="sm"
											onClick={() => handleTemplateUse(template)}
										>
											Use Template
										</Button>
										<Button variant="outline" size="sm">
											Edit
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Sent Messages Tab */}
				<TabsContent value="sent" className="space-y-4">
					<div className="flex items-center space-x-4">
						<div className="relative max-w-md flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search sent messages..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button variant="outline">
							<Filter className="mr-2 h-4 w-4" />
							Filter
						</Button>
					</div>

					<div className="space-y-4">
						{sentMessages.map((message) => (
							<Card key={message.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
												{message.type === "sms" ? (
													<Smartphone className="h-5 w-5 text-blue-600" />
												) : (
													<Mail className="h-5 w-5 text-blue-600" />
												)}
											</div>
											<div>
												<h4 className="font-medium">{message.patient}</h4>
												<p className="text-gray-600 text-sm">{message.phone}</p>
												<p className="text-gray-500 text-sm">
													{message.template}
												</p>
											</div>
										</div>
										<div className="text-right">
											<Badge className={getStatusColor(message.status)}>
												{getStatusIcon(message.status)}
												<span className="ml-1">{message.status}</span>
											</Badge>
											<p className="mt-1 text-gray-500 text-xs">
												{new Date(message.sentAt).toLocaleString()}
											</p>
											{message.response && (
												<p className="mt-1 text-green-600 text-xs">
													Response: {message.response}
												</p>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Incoming Messages Tab */}
				<TabsContent value="incoming" className="space-y-4">
					<div className="space-y-4">
						{incomingMessages.map((message) => (
							<Card
								key={message.id}
								className={!message.isRead ? "border-blue-200 bg-blue-50" : ""}
							>
								<CardContent className="p-4">
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
												<User className="h-5 w-5 text-green-600" />
											</div>
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<h4 className="font-medium">{message.patient}</h4>
													{!message.isRead && (
														<Badge className="bg-blue-100 text-blue-800">
															New
														</Badge>
													)}
												</div>
												<p className="text-gray-600 text-sm">{message.phone}</p>
												<p className="mt-2 text-gray-900 text-sm">
													{message.message}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-gray-500 text-xs">
												{new Date(message.receivedAt).toLocaleString()}
											</p>
											<div className="mt-2 flex space-x-2">
												<Button size="sm">Reply</Button>
												<Button variant="outline" size="sm">
													Call
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Arrivals Tab */}
				<TabsContent value="arrivals" className="space-y-4">
					<div className="space-y-4">
						{arrivalNotifications.map((arrival) => (
							<Card key={arrival.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
												<User className="h-5 w-5 text-purple-600" />
											</div>
											<div>
												<h4 className="font-medium">{arrival.patient}</h4>
												<p className="text-gray-600 text-sm">
													Appointment: {arrival.appointmentTime}
												</p>
												<p className="text-gray-600 text-sm">
													Arrived: {arrival.arrivedAt}
												</p>
												<p className="text-gray-500 text-xs">
													Check-in: {arrival.checkInMethod}
												</p>
											</div>
										</div>
										<div className="text-right">
											<Badge className={getArrivalStatusColor(arrival.status)}>
												{arrival.status}
											</Badge>
											<div className="mt-2 flex space-x-2">
												<Button size="sm">Notify Provider</Button>
												<Button variant="outline" size="sm">
													Room Ready
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
