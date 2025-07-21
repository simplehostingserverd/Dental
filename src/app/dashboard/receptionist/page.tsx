"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
	Calendar,
	Clock,
	Edit,
	Eye,
	LogOut,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	User,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Appointment {
	id: string;
	start: string;
	end: string;
	status: string;
	appointmentType: string;
	notes?: string;
	patient: {
		id: string;
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
	};
	practiceUser: {
		firstName: string;
		lastName: string;
	};
}

interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
}

interface PracticeUser {
	id: string;
	firstName: string;
	lastName: string;
	role: string;
}

const appointmentTypes = [
	{ value: "cleaning", label: "Cleaning", duration: 60 },
	{ value: "checkup", label: "Check-up", duration: 30 },
	{ value: "consultation", label: "Consultation", duration: 45 },
	{ value: "emergency", label: "Emergency", duration: 30 },
	{ value: "filling", label: "Filling", duration: 90 },
	{ value: "extraction", label: "Extraction", duration: 60 },
	{ value: "root-canal", label: "Root Canal", duration: 120 },
];

const timeSlots = [
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
	"18:00",
];

export default function ReceptionistDashboard() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [practiceUsers, setPracticeUsers] = useState<PracticeUser[]>([]);

	useEffect(() => {
		document.title = "Cognident - Receptionist Dashboard";
	}, []);

	const handleLogout = async () => {
		try {
			await fetch("/api/test-auth/logout", { method: "POST" });
			localStorage.removeItem("testUser");
			window.location.href = "/test-login";
		} catch (error) {
			console.error("Logout error:", error);
			localStorage.removeItem("testUser");
			window.location.href = "/test-login";
		}
	};
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [isLoading, setIsLoading] = useState(true);
	const [showNewAppointment, setShowNewAppointment] = useState(false);
	const [showPatientSearch, setShowPatientSearch] = useState(false);
	const [patientSearchTerm, setPatientSearchTerm] = useState("");
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [appointmentForm, setAppointmentForm] = useState({
		patientId: "",
		date: new Date().toISOString().split("T")[0],
		time: "",
		appointmentType: "",
		providerId: "",
		notes: "",
	});
	const [isSaving, setIsSaving] = useState(false);

	// Fetch data on component mount
	useEffect(() => {
		fetchAppointments();
		fetchPatients();
		fetchPracticeUsers();
	}, []);

	const fetchAppointments = async () => {
		try {
			const response = await fetch(
				`/api/dashboard/appointments?date=${selectedDate}`,
			);
			if (response.ok) {
				const data = await response.json();
				setAppointments(data.appointments || []);
			}
		} catch (error) {
			console.error("Error fetching appointments:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchPatients = async () => {
		try {
			const response = await fetch("/api/dashboard/patients");
			if (response.ok) {
				const data = await response.json();
				setPatients(data.patients || []);
			}
		} catch (error) {
			console.error("Error fetching patients:", error);
		}
	};

	const fetchPracticeUsers = async () => {
		try {
			const response = await fetch("/api/dashboard/practice-users");
			if (response.ok) {
				const data = await response.json();
				setPracticeUsers(data.users || []);
			}
		} catch (error) {
			console.error("Error fetching practice users:", error);
		}
	};

	const filteredPatients = patients.filter(
		(patient) =>
			patient.firstName
				.toLowerCase()
				.includes(patientSearchTerm.toLowerCase()) ||
			patient.lastName
				.toLowerCase()
				.includes(patientSearchTerm.toLowerCase()) ||
			patient.phone.includes(patientSearchTerm) ||
			patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase()),
	);

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString([], {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			case "canceled":
				return "bg-red-100 text-red-800";
			case "no_show":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleCreateAppointment = async () => {
		if (
			!selectedPatient ||
			!appointmentForm.date ||
			!appointmentForm.time ||
			!appointmentForm.appointmentType ||
			!appointmentForm.providerId
		) {
			alert("Please fill in all required fields");
			return;
		}

		setIsSaving(true);
		try {
			const response = await fetch("/api/dashboard/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId: selectedPatient.id,
					date: appointmentForm.date,
					time: appointmentForm.time,
					appointmentType: appointmentForm.appointmentType,
					providerId: appointmentForm.providerId,
					notes: appointmentForm.notes,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setAppointments((prev) => [...prev, data.appointment]);
				setShowNewAppointment(false);
				setSelectedPatient(null);
				setAppointmentForm({
					patientId: "",
					date: new Date().toISOString().split("T")[0],
					time: "",
					appointmentType: "",
					providerId: "",
					notes: "",
				});
				alert("Appointment created successfully!");
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to create appointment");
			}
		} catch (error) {
			console.error("Error creating appointment:", error);
			alert("Error creating appointment");
		} finally {
			setIsSaving(false);
		}
	};

	const handleUpdateAppointmentStatus = async (
		appointmentId: string,
		newStatus: string,
	) => {
		try {
			const response = await fetch(
				`/api/dashboard/appointments/${appointmentId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: newStatus }),
				},
			);

			if (response.ok) {
				setAppointments((prev) =>
					prev.map((apt) =>
						apt.id === appointmentId ? { ...apt, status: newStatus } : apt,
					),
				);
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to update appointment");
			}
		} catch (error) {
			console.error("Error updating appointment:", error);
			alert("Error updating appointment");
		}
	};

	const handleCancelAppointment = async (appointmentId: string) => {
		if (!confirm("Are you sure you want to cancel this appointment?")) return;

		try {
			const response = await fetch(
				`/api/dashboard/appointments/${appointmentId}`,
				{
					method: "DELETE",
				},
			);

			if (response.ok) {
				setAppointments((prev) =>
					prev.filter((apt) => apt.id !== appointmentId),
				);
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to cancel appointment");
			}
		} catch (error) {
			console.error("Error canceling appointment:", error);
			alert("Error canceling appointment");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Receptionist Dashboard
					</h1>
					<p className="text-gray-600">
						Manage appointments and patient scheduling
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline" onClick={() => setShowPatientSearch(true)}>
						<UserPlus className="mr-2 h-4 w-4" />
						Quick Patient Lookup
					</Button>
					<Button onClick={() => setShowNewAppointment(true)}>
						<Plus className="mr-2 h-4 w-4" />
						New Appointment
					</Button>
					<Button
						variant="outline"
						onClick={handleLogout}
						className="text-red-600 hover:bg-red-50 hover:text-red-700"
					>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</Button>
				</div>
			</div>

			{/* Date Navigation */}
			<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
				<div className="flex items-center space-x-4">
					<Label htmlFor="date-select">Schedule for:</Label>
					<Input
						id="date-select"
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="w-48"
					/>
				</div>
				<div className="text-gray-600 text-sm">{selectedDate ? formatDate(selectedDate) : ""}</div>
			</div>

			{/* Today's Schedule */}
			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-gray-200 border-b px-6 py-4">
					<h2 className="font-semibold text-gray-900 text-lg">
						Daily Schedule ({appointments.length} appointments)
					</h2>
				</div>
				<div className="divide-y divide-gray-200">
					{isLoading ? (
						<div className="flex h-64 items-center justify-center">
							<div className="text-gray-500">Loading appointments...</div>
						</div>
					) : appointments.length > 0 ? (
						appointments.map((appointment) => (
							<div key={appointment.id} className="p-6 hover:bg-gray-50">
								<div className="flex items-center justify-between">
									<div className="flex items-start space-x-4">
										<div className="flex flex-col items-center">
											<Clock className="h-5 w-5 text-gray-400" />
											<div className="mt-1 text-center">
												<div className="font-medium text-gray-900 text-sm">
													{formatTime(appointment.start)}
												</div>
												<div className="text-gray-500 text-xs">
													{formatTime(appointment.end)}
												</div>
											</div>
										</div>
										<div className="flex-1">
											<div className="flex items-center space-x-3">
												<h3 className="font-medium text-gray-900">
													{appointment.patient.firstName}{" "}
													{appointment.patient.lastName}
												</h3>
												<Badge className={getStatusColor(appointment.status)}>
													{appointment.status.replace("_", " ")}
												</Badge>
											</div>
											<div className="mt-1 flex items-center space-x-4 text-gray-600 text-sm">
												<span className="flex items-center">
													<User className="mr-1 h-4 w-4" />
													{appointment.practiceUser.firstName}{" "}
													{appointment.practiceUser.lastName}
												</span>
												<span className="flex items-center">
													<Phone className="mr-1 h-4 w-4" />
													{appointment.patient.phone}
												</span>
											</div>
											<div className="mt-1 text-gray-600 text-sm">
												<strong>Type:</strong> {appointment.appointmentType}
											</div>
											{appointment.notes && (
												<div className="mt-1 text-gray-600 text-sm">
													<strong>Notes:</strong> {appointment.notes}
												</div>
											)}
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														handleUpdateAppointmentStatus(
															appointment.id,
															"CONFIRMED",
														)
													}
												>
													Mark as Confirmed
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleUpdateAppointmentStatus(
															appointment.id,
															"IN_PROGRESS",
														)
													}
												>
													Mark as In Progress
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleUpdateAppointmentStatus(
															appointment.id,
															"COMPLETED",
														)
													}
												>
													Mark as Completed
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleUpdateAppointmentStatus(
															appointment.id,
															"NO_SHOW",
														)
													}
												>
													Mark as No Show
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600"
													onClick={() =>
														handleCancelAppointment(appointment.id)
													}
												>
													Cancel Appointment
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="flex h-64 flex-col items-center justify-center">
							<Calendar className="mb-4 h-12 w-12 text-gray-400" />
							<p className="text-gray-500">
								No appointments scheduled for this date
							</p>
							<p className="text-gray-400 text-sm">
								Click "New Appointment" to schedule one
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Patient Search Modal */}
			{showPatientSearch && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 text-lg">
								Patient Search
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setShowPatientSearch(false);
									setPatientSearchTerm("");
								}}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div className="space-y-4">
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search by name, phone, or email..."
									value={patientSearchTerm}
									onChange={(e) => setPatientSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>

							<div className="max-h-96 space-y-2 overflow-y-auto">
								{filteredPatients.length > 0 ? (
									filteredPatients.map((patient) => (
										<div
											key={patient.id}
											role="button"
											tabIndex={0}
											className="cursor-pointer rounded-md border border-gray-200 p-4 hover:bg-gray-50"
											onClick={() => {
												setSelectedPatient(patient);
												setAppointmentForm((prev) => ({
													...prev,
													patientId: patient.id,
												}));
												setShowPatientSearch(false);
												setShowNewAppointment(true);
												setPatientSearchTerm("");
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													setSelectedPatient(patient);
													setAppointmentForm((prev) => ({
														...prev,
														patientId: patient.id,
													}));
													setShowPatientSearch(false);
													setShowNewAppointment(true);
													setPatientSearchTerm("");
												}
											}}
										>
											<div className="flex items-center justify-between">
												<div>
													<h4 className="font-medium text-gray-900">
														{patient.firstName} {patient.lastName}
													</h4>
													<div className="mt-1 flex items-center space-x-4 text-gray-600 text-sm">
														<span>{patient.phone}</span>
														<span>{patient.email}</span>
													</div>
												</div>
												<div className="text-gray-500 text-sm">
													DOB:{" "}
													{new Date(patient.dateOfBirth).toLocaleDateString()}
												</div>
											</div>
										</div>
									))
								) : (
									<div className="py-8 text-center text-gray-500">
										{patientSearchTerm
											? "No patients found"
											: "Start typing to search patients"}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* New Appointment Modal */}
			{showNewAppointment && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 text-lg">
								Schedule New Appointment
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setShowNewAppointment(false);
									setSelectedPatient(null);
									setAppointmentForm({
										patientId: "",
										date: new Date().toISOString().split("T")[0],
										time: "",
										appointmentType: "",
										providerId: "",
										notes: "",
									});
								}}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div className="space-y-4">
							{/* Patient Selection */}
							<div>
								<Label>Patient</Label>
								{selectedPatient ? (
									<div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 p-3">
										<div>
											<div className="font-medium text-gray-900">
												{selectedPatient.firstName} {selectedPatient.lastName}
											</div>
											<div className="text-gray-600 text-sm">
												{selectedPatient.phone} • {selectedPatient.email}
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setSelectedPatient(null);
												setShowPatientSearch(true);
												setShowNewAppointment(false);
											}}
										>
											Change
										</Button>
									</div>
								) : (
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											setShowNewAppointment(false);
											setShowPatientSearch(true);
										}}
									>
										<Search className="mr-2 h-4 w-4" />
										Select Patient
									</Button>
								)}
							</div>

							{/* Date and Time */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="appointment-date">Date</Label>
									<Input
										id="appointment-date"
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
									<Label htmlFor="appointment-time">Time</Label>
									<Select
										value={appointmentForm.time}
										onValueChange={(value) =>
											setAppointmentForm((prev) => ({ ...prev, time: value }))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select time" />
										</SelectTrigger>
										<SelectContent>
											{timeSlots.map((time) => (
												<SelectItem key={time} value={time}>
													{new Date(`2000-01-01T${time}`).toLocaleTimeString(
														[],
														{
															hour: "2-digit",
															minute: "2-digit",
															hour12: true,
														},
													)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Appointment Type and Provider */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="appointment-type">Appointment Type</Label>
									<Select
										value={appointmentForm.appointmentType}
										onValueChange={(value) =>
											setAppointmentForm((prev) => ({
												...prev,
												appointmentType: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											{appointmentTypes.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label} ({type.duration} min)
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="provider">Provider</Label>
									<Select
										value={appointmentForm.providerId}
										onValueChange={(value) =>
											setAppointmentForm((prev) => ({
												...prev,
												providerId: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select provider" />
										</SelectTrigger>
										<SelectContent>
											{practiceUsers.map((user) => (
												<SelectItem key={user.id} value={user.id}>
													{user.firstName} {user.lastName} ({user.role})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Notes */}
							<div>
								<Label htmlFor="appointment-notes">Notes (Optional)</Label>
								<Textarea
									id="appointment-notes"
									placeholder="Any special instructions or notes..."
									value={appointmentForm.notes}
									onChange={(e) =>
										setAppointmentForm((prev) => ({
											...prev,
											notes: e.target.value,
										}))
									}
									rows={3}
								/>
							</div>

							{/* Actions */}
							<div className="flex space-x-3">
								<Button
									onClick={handleCreateAppointment}
									disabled={
										!selectedPatient ||
										!appointmentForm.date ||
										!appointmentForm.time ||
										!appointmentForm.appointmentType ||
										!appointmentForm.providerId ||
										isSaving
									}
									className="flex-1"
								>
									<Calendar className="mr-2 h-4 w-4" />
									{isSaving ? "Scheduling..." : "Schedule Appointment"}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setShowNewAppointment(false);
										setSelectedPatient(null);
										setAppointmentForm({
											patientId: "",
											date: new Date().toISOString().split("T")[0],
											time: "",
											appointmentType: "",
											providerId: "",
											notes: "",
										});
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
