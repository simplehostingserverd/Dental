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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
	Activity,
	AlertTriangle,
	Bell,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	MessageSquare,
	Phone,
	Plus,
	Printer,
	Send,
	TrendingDown,
	TrendingUp,
	UserPlus,
	Users,
} from "lucide-react";
import { useState } from "react";

// TypeScript interfaces
interface AppointmentData {
	id: string;
	time: string;
	patient: string;
	provider: string;
	type: string;
	status:
		| "checked-in"
		| "confirmed"
		| "pending"
		| "late"
		| "completed"
		| "cancelled";
	phone: string;
}

interface TaskData {
	id: string;
	task: string;
	priority: "high" | "medium" | "low";
	time: string;
}

interface TodayStats {
	totalAppointments: number;
	checkedIn: number;
	waiting: number;
	completed: number;
	noShows: number;
	revenue: number;
	newPatients: number;
	pendingTasks: number;
}

interface NewAppointmentForm {
	patientName: string;
	phone: string;
	email: string;
	provider: string;
	treatment: string;
	date: string;
	time: string;
	notes: string;
}

interface PaymentForm {
	patientId: string;
	amount: string;
	method: "cash" | "credit" | "debit" | "insurance" | "check";
	description: string;
	invoiceNumber: string;
}

interface ReminderForm {
	patientId: string;
	type: "appointment" | "payment" | "followup" | "custom";
	method: "sms" | "email" | "call";
	message: string;
	scheduleTime: string;
}

export default function ReceptionistDashboard() {
	const { showToast } = useToast();

	const currentTime = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	// State for dialogs
	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [showReminderDialog, setShowReminderDialog] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	// Form states
	const [appointmentForm, setAppointmentForm] = useState<NewAppointmentForm>({
		patientName: "",
		phone: "",
		email: "",
		provider: "",
		treatment: "",
		date: new Date().toISOString().split("T")[0] || new Date().toLocaleDateString(),
		time: "",
		notes: "",
	});

	const [paymentForm, setPaymentForm] = useState<PaymentForm>({
		patientId: "",
		amount: "",
		method: "credit",
		description: "",
		invoiceNumber: "",
	});

	const [reminderForm, setReminderForm] = useState<ReminderForm>({
		patientId: "",
		type: "appointment",
		method: "sms",
		message: "",
		scheduleTime: "",
	});

	// Mock data for dashboard
	const todayStats: TodayStats = {
		totalAppointments: 24,
		checkedIn: 8,
		waiting: 3,
		completed: 12,
		noShows: 1,
		revenue: 3250,
		newPatients: 2,
		pendingTasks: 5,
	};

	const upcomingAppointments: AppointmentData[] = [
		{
			id: "1",
			time: "2:30 PM",
			patient: "Sarah Johnson",
			provider: "Dr. Smith",
			type: "Cleaning",
			status: "checked-in",
			phone: "(555) 123-4567",
		},
		{
			id: "2",
			time: "3:00 PM",
			patient: "Michael Chen",
			provider: "Dr. Johnson",
			type: "Consultation",
			status: "confirmed",
			phone: "(555) 234-5678",
		},
		{
			id: "3",
			time: "3:30 PM",
			patient: "Emily Davis",
			provider: "Dr. Smith",
			type: "Filling",
			status: "pending",
			phone: "(555) 345-6789",
		},
		{
			id: "4",
			time: "4:00 PM",
			patient: "David Wilson",
			provider: "Dr. Johnson",
			type: "Check-up",
			status: "late",
			phone: "(555) 456-7890",
		},
	];

	const pendingTasks: TaskData[] = [
		{
			id: "1",
			task: "Verify insurance for Sarah Johnson",
			priority: "high",
			time: "10 min ago",
		},
		{
			id: "2",
			task: "Call Michael Chen for appointment confirmation",
			priority: "medium",
			time: "30 min ago",
		},
		{
			id: "3",
			task: "Process payment for Emily Davis",
			priority: "high",
			time: "1 hour ago",
		},
		{
			id: "4",
			task: "Upload documents for David Wilson",
			priority: "low",
			time: "2 hours ago",
		},
		{
			id: "5",
			task: "Send reminder to Lisa Brown",
			priority: "medium",
			time: "3 hours ago",
		},
	];

	// Handler functions for quick actions
	const handleBookAppointment = async () => {
		setIsProcessing(true);
		try {
			const response = await fetch("/api/receptionist/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(appointmentForm),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to book appointment");
			}

			// Reset form and close dialog
			setAppointmentForm({
				patientName: "",
				phone: "",
				email: "",
				provider: "",
				treatment: "",
				date: new Date().toISOString().split("T")[0] || new Date().toLocaleDateString(),
				time: "",
				notes: "",
			});
			setShowAppointmentDialog(false);

			showToast({
				type: "success",
				title: "Appointment Booked",
				message: `Successfully booked appointment for ${appointmentForm.patientName}. ID: ${data.appointment.id}`,
			});
		} catch (error) {
			console.error("Error booking appointment:", error);
			showToast({
				type: "error",
				title: "Booking Failed",
				message:
					error instanceof Error
						? error.message
						: "Failed to book appointment. Please try again.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleProcessPayment = async () => {
		setIsProcessing(true);
		try {
			const response = await fetch("/api/receptionist/payments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(paymentForm),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to process payment");
			}

			// Reset form and close dialog
			setPaymentForm({
				patientId: "",
				amount: "",
				method: "credit",
				description: "",
				invoiceNumber: "",
			});
			setShowPaymentDialog(false);

			showToast({
				type: "success",
				title: "Payment Processed",
				message: `Successfully processed $${paymentForm.amount} payment. Transaction ID: ${data.payment.transactionId}`,
			});
		} catch (error) {
			console.error("Error processing payment:", error);
			showToast({
				type: "error",
				title: "Payment Failed",
				message:
					error instanceof Error
						? error.message
						: "Failed to process payment. Please try again.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleSendReminder = async () => {
		setIsProcessing(true);
		try {
			const response = await fetch("/api/receptionist/reminders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reminderForm),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to send reminder");
			}

			// Reset form and close dialog
			setReminderForm({
				patientId: "",
				type: "appointment",
				method: "sms",
				message: "",
				scheduleTime: "",
			});
			setShowReminderDialog(false);

			showToast({
				type: "success",
				title: "Reminder Sent",
				message: data.message || "Reminder sent successfully!",
			});
		} catch (error) {
			console.error("Error sending reminder:", error);
			showToast({
				type: "error",
				title: "Reminder Failed",
				message:
					error instanceof Error
						? error.message
						: "Failed to send reminder. Please try again.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handlePrintSchedule = () => {
		// Generate printable schedule
		const printContent = `
			<html>
				<head>
					<title>Daily Schedule - ${new Date().toLocaleDateString()}</title>
					<style>
						body { font-family: Arial, sans-serif; margin: 20px; }
						h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
						table { width: 100%; border-collapse: collapse; margin-top: 20px; }
						th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
						th { background-color: #f2f2f2; }
						.status-checked-in { color: #16a34a; font-weight: bold; }
						.status-confirmed { color: #2563eb; }
						.status-pending { color: #ca8a04; }
						.status-late { color: #dc2626; font-weight: bold; }
					</style>
				</head>
				<body>
					<h1>Daily Schedule - ${new Date().toLocaleDateString()}</h1>
					<p>Generated on: ${new Date().toLocaleString()}</p>
					<table>
						<thead>
							<tr>
								<th>Time</th>
								<th>Patient</th>
								<th>Provider</th>
								<th>Treatment</th>
								<th>Status</th>
								<th>Phone</th>
							</tr>
						</thead>
						<tbody>
							${upcomingAppointments
								.map(
									(apt) => `
								<tr>
									<td>${apt.time}</td>
									<td>${apt.patient}</td>
									<td>${apt.provider}</td>
									<td>${apt.type}</td>
									<td class="status-${apt.status}">${apt.status.toUpperCase()}</td>
									<td>${apt.phone}</td>
								</tr>
							`,
								)
								.join("")}
						</tbody>
					</table>
				</body>
			</html>
		`;

		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(printContent);
			printWindow.document.close();
			printWindow.print();
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "checked-in":
				return "bg-green-100 text-green-800";
			case "confirmed":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "late":
				return "bg-red-100 text-red-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl text-gray-900">
						Good afternoon, Receptionist!
					</h1>
					<p className="text-gray-600">
						Here's what's happening at your practice today
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Button>
						<UserPlus className="mr-2 h-4 w-4" />
						New Patient
					</Button>
					<Button variant="outline">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Today's Appointments
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{todayStats.totalAppointments}
						</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+2</span> from yesterday
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Patients Waiting
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{todayStats.waiting}</div>
						<p className="text-muted-foreground text-xs">
							Average wait: 12 min
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Today's Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							${todayStats.revenue.toLocaleString()}
						</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+12%</span> from last week
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Pending Tasks</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{todayStats.pendingTasks}</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-red-600">2 urgent</span> tasks
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Upcoming Appointments */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Upcoming Appointments</span>
								<Badge variant="outline">
									{upcomingAppointments.length} remaining
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
									>
										<div className="flex items-center space-x-4">
											<div className="text-center">
												<div className="font-semibold text-gray-900 text-lg">
													{appointment.time}
												</div>
											</div>
											<div className="flex-1">
												<h3 className="font-medium text-gray-900">
													{appointment.patient}
												</h3>
												<div className="flex items-center space-x-2 text-gray-600 text-sm">
													<span>{appointment.provider}</span>
													<span>•</span>
													<span>{appointment.type}</span>
												</div>
												<div className="flex items-center text-gray-500 text-sm">
													<Phone className="mr-1 h-3 w-3" />
													{appointment.phone}
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Badge className={getStatusColor(appointment.status)}>
												{appointment.status.replace("-", " ")}
											</Badge>
											<Button variant="ghost" size="sm">
												<MessageSquare className="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="sm">
												<Phone className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Pending Tasks */}
					<Card>
						<CardHeader>
							<CardTitle>Pending Tasks</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{pendingTasks.slice(0, 5).map((task) => (
									<div key={task.id} className="flex items-start space-x-3">
										<div className="flex-1">
											<p className="font-medium text-gray-900 text-sm">
												{task.task}
											</p>
											<div className="flex items-center space-x-2">
												<Badge
													variant="outline"
													className={getPriorityColor(task.priority)}
												>
													{task.priority}
												</Badge>
												<span className="text-gray-500 text-xs">
													{task.time}
												</span>
											</div>
										</div>
										<Button variant="ghost" size="sm">
											<CheckCircle className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Dialog
									open={showAppointmentDialog}
									onOpenChange={setShowAppointmentDialog}
								>
									<DialogTrigger asChild>
										<Button variant="outline" className="w-full justify-start">
											<Calendar className="mr-2 h-4 w-4" />
											Book Appointment
										</Button>
									</DialogTrigger>
								</Dialog>

								<Dialog
									open={showPaymentDialog}
									onOpenChange={setShowPaymentDialog}
								>
									<DialogTrigger asChild>
										<Button variant="outline" className="w-full justify-start">
											<CreditCard className="mr-2 h-4 w-4" />
											Process Payment
										</Button>
									</DialogTrigger>
								</Dialog>

								<Dialog
									open={showReminderDialog}
									onOpenChange={setShowReminderDialog}
								>
									<DialogTrigger asChild>
										<Button variant="outline" className="w-full justify-start">
											<Bell className="mr-2 h-4 w-4" />
											Send Reminder
										</Button>
									</DialogTrigger>
								</Dialog>

								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={handlePrintSchedule}
								>
									<Printer className="mr-2 h-4 w-4" />
									Print Schedule
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Book Appointment Dialog */}
			<Dialog
				open={showAppointmentDialog}
				onOpenChange={setShowAppointmentDialog}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Book New Appointment</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="patientName">Patient Name *</Label>
								<Input
									id="patientName"
									value={appointmentForm.patientName}
									onChange={(e) =>
										setAppointmentForm((prev) => ({
											...prev,
											patientName: e.target.value,
										}))
									}
									placeholder="Enter patient name"
								/>
							</div>
							<div>
								<Label htmlFor="phone">Phone Number *</Label>
								<Input
									id="phone"
									value={appointmentForm.phone}
									onChange={(e) =>
										setAppointmentForm((prev) => ({
											...prev,
											phone: e.target.value,
										}))
									}
									placeholder="(555) 123-4567"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								value={appointmentForm.email}
								onChange={(e) =>
									setAppointmentForm((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
								placeholder="patient@email.com"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="provider">Provider *</Label>
								<Select
									value={appointmentForm.provider}
									onValueChange={(value) =>
										setAppointmentForm((prev) => ({
											...prev,
											provider: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select provider" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
										<SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
										<SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
										<SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="treatment">Treatment *</Label>
								<Select
									value={appointmentForm.treatment}
									onValueChange={(value) =>
										setAppointmentForm((prev) => ({
											...prev,
											treatment: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select treatment" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Cleaning">Cleaning</SelectItem>
										<SelectItem value="Consultation">Consultation</SelectItem>
										<SelectItem value="Filling">Filling</SelectItem>
										<SelectItem value="Root Canal">Root Canal</SelectItem>
										<SelectItem value="Crown">Crown</SelectItem>
										<SelectItem value="Extraction">Extraction</SelectItem>
										<SelectItem value="Check-up">Check-up</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="date">Date *</Label>
								<Input
									id="date"
									type="date"
									value={appointmentForm.date}
									onChange={(e) =>
										setAppointmentForm((prev) => ({
											...prev,
											date: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<Label htmlFor="time">Time *</Label>
								<Select
									value={appointmentForm.time}
									onValueChange={(value) =>
										setAppointmentForm((prev) => ({
											...prev,
											time: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select time" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="9:00 AM">9:00 AM</SelectItem>
										<SelectItem value="9:30 AM">9:30 AM</SelectItem>
										<SelectItem value="10:00 AM">10:00 AM</SelectItem>
										<SelectItem value="10:30 AM">10:30 AM</SelectItem>
										<SelectItem value="11:00 AM">11:00 AM</SelectItem>
										<SelectItem value="11:30 AM">11:30 AM</SelectItem>
										<SelectItem value="1:00 PM">1:00 PM</SelectItem>
										<SelectItem value="1:30 PM">1:30 PM</SelectItem>
										<SelectItem value="2:00 PM">2:00 PM</SelectItem>
										<SelectItem value="2:30 PM">2:30 PM</SelectItem>
										<SelectItem value="3:00 PM">3:00 PM</SelectItem>
										<SelectItem value="3:30 PM">3:30 PM</SelectItem>
										<SelectItem value="4:00 PM">4:00 PM</SelectItem>
										<SelectItem value="4:30 PM">4:30 PM</SelectItem>
										<SelectItem value="5:00 PM">5:00 PM</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div>
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								value={appointmentForm.notes}
								onChange={(e) =>
									setAppointmentForm((prev) => ({
										...prev,
										notes: e.target.value,
									}))
								}
								placeholder="Additional notes or special instructions"
								rows={3}
							/>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowAppointmentDialog(false)}
								disabled={isProcessing}
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleBookAppointment}
								disabled={
									isProcessing ||
									!appointmentForm.patientName ||
									!appointmentForm.phone ||
									!appointmentForm.provider ||
									!appointmentForm.treatment ||
									!appointmentForm.date ||
									!appointmentForm.time
								}
							>
								{isProcessing ? (
									<>
										<Clock className="mr-2 h-4 w-4 animate-spin" />
										Booking...
									</>
								) : (
									<>
										<Plus className="mr-2 h-4 w-4" />
										Book Appointment
									</>
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Process Payment Dialog */}
			<Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Process Payment</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="patientSelect">Patient *</Label>
							<Select
								value={paymentForm.patientId}
								onValueChange={(value) =>
									setPaymentForm((prev) => ({
										...prev,
										patientId: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									{upcomingAppointments.map((apt) => (
										<SelectItem key={apt.id} value={apt.id}>
											{apt.patient} - {apt.time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="amount">Amount *</Label>
								<Input
									id="amount"
									type="number"
									step="0.01"
									value={paymentForm.amount}
									onChange={(e) =>
										setPaymentForm((prev) => ({
											...prev,
											amount: e.target.value,
										}))
									}
									placeholder="0.00"
								/>
							</div>
							<div>
								<Label htmlFor="method">Payment Method *</Label>
								<Select
									value={paymentForm.method}
									onValueChange={(value: PaymentForm["method"]) =>
										setPaymentForm((prev) => ({
											...prev,
											method: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cash">Cash</SelectItem>
										<SelectItem value="credit">Credit Card</SelectItem>
										<SelectItem value="debit">Debit Card</SelectItem>
										<SelectItem value="insurance">Insurance</SelectItem>
										<SelectItem value="check">Check</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div>
							<Label htmlFor="invoiceNumber">Invoice Number</Label>
							<Input
								id="invoiceNumber"
								value={paymentForm.invoiceNumber}
								onChange={(e) =>
									setPaymentForm((prev) => ({
										...prev,
										invoiceNumber: e.target.value,
									}))
								}
								placeholder="INV-001"
							/>
						</div>

						<div>
							<Label htmlFor="description">Description *</Label>
							<Textarea
								id="description"
								value={paymentForm.description}
								onChange={(e) =>
									setPaymentForm((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder="Payment for dental cleaning, consultation, etc."
								rows={3}
							/>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowPaymentDialog(false)}
								disabled={isProcessing}
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleProcessPayment}
								disabled={
									isProcessing ||
									!paymentForm.patientId ||
									!paymentForm.amount ||
									!paymentForm.description
								}
							>
								{isProcessing ? (
									<>
										<Clock className="mr-2 h-4 w-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-4 w-4" />
										Process Payment
									</>
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Send Reminder Dialog */}
			<Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Send Reminder</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="reminderPatient">Patient *</Label>
							<Select
								value={reminderForm.patientId}
								onValueChange={(value) =>
									setReminderForm((prev) => ({
										...prev,
										patientId: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									{upcomingAppointments.map((apt) => (
										<SelectItem key={apt.id} value={apt.id}>
											{apt.patient} - {apt.time} ({apt.type})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="reminderType">Reminder Type *</Label>
								<Select
									value={reminderForm.type}
									onValueChange={(value: ReminderForm["type"]) =>
										setReminderForm((prev) => ({
											...prev,
											type: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="appointment">
											Appointment Reminder
										</SelectItem>
										<SelectItem value="payment">Payment Due</SelectItem>
										<SelectItem value="followup">Follow-up Care</SelectItem>
										<SelectItem value="custom">Custom Message</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="reminderMethod">Method *</Label>
								<Select
									value={reminderForm.method}
									onValueChange={(value: ReminderForm["method"]) =>
										setReminderForm((prev) => ({
											...prev,
											method: value,
										}))
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
						</div>

						<div>
							<Label htmlFor="scheduleTime">Schedule Time (Optional)</Label>
							<Input
								id="scheduleTime"
								type="datetime-local"
								value={reminderForm.scheduleTime}
								onChange={(e) =>
									setReminderForm((prev) => ({
										...prev,
										scheduleTime: e.target.value,
									}))
								}
							/>
							<p className="mt-1 text-gray-500 text-xs">
								Leave empty to send immediately
							</p>
						</div>

						<div>
							<Label htmlFor="reminderMessage">Message *</Label>
							<Textarea
								id="reminderMessage"
								value={reminderForm.message}
								onChange={(e) =>
									setReminderForm((prev) => ({
										...prev,
										message: e.target.value,
									}))
								}
								placeholder={
									reminderForm.type === "appointment"
										? "Hi! This is a reminder about your upcoming dental appointment..."
										: reminderForm.type === "payment"
											? "This is a friendly reminder about your outstanding balance..."
											: reminderForm.type === "followup"
												? "We hope you're feeling better after your recent treatment..."
												: "Enter your custom message here..."
								}
								rows={4}
							/>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowReminderDialog(false)}
								disabled={isProcessing}
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleSendReminder}
								disabled={
									isProcessing ||
									!reminderForm.patientId ||
									!reminderForm.message
								}
							>
								{isProcessing ? (
									<>
										<Clock className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Send className="mr-2 h-4 w-4" />
										{reminderForm.scheduleTime
											? "Schedule Reminder"
											: "Send Now"}
									</>
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
