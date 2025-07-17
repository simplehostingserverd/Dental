"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	Filter,
	MapPin,
	MessageSquare,
	MoreHorizontal,
	Phone,
	Plus,
	Repeat,
	Search,
	User,
	UserCheck,
	UserX,
	Users,
	XCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import DragDropCalendar, { type Appointment } from "@/components/calendar/DragDropCalendar";

// Mock data for appointments
const todayAppointments = [
	{
		id: "1",
		time: "9:00 AM",
		endTime: "10:00 AM",
		patient: { name: "Sarah Johnson", phone: "(555) 123-4567", id: "p1" },
		provider: "Dr. Smith",
		treatment: "Routine Cleaning",
		room: "Room 1",
		status: "checked-in",
		notes: "Patient prefers morning appointments",
		isRecurring: true,
		waitlistPosition: null,
	},
	{
		id: "2",
		time: "10:30 AM",
		endTime: "12:00 PM",
		patient: { name: "Michael Chen", phone: "(555) 234-5678", id: "p2" },
		provider: "Dr. Johnson",
		treatment: "Root Canal",
		room: "Room 2",
		status: "confirmed",
		notes: "Follow-up from last week",
		isRecurring: false,
		waitlistPosition: null,
	},
	{
		id: "3",
		time: "1:00 PM",
		endTime: "2:00 PM",
		patient: { name: "Emily Davis", phone: "(555) 345-6789", id: "p3" },
		provider: "Dr. Smith",
		treatment: "Consultation",
		room: "Room 1",
		status: "pending",
		notes: "New patient consultation",
		isRecurring: false,
		waitlistPosition: null,
	},
	{
		id: "4",
		time: "2:30 PM",
		endTime: "3:30 PM",
		patient: { name: "David Wilson", phone: "(555) 456-7890", id: "p4" },
		provider: "Dr. Johnson",
		treatment: "Filling",
		room: "Room 3",
		status: "late",
		notes: "Patient is 15 minutes late",
		isRecurring: false,
		waitlistPosition: null,
	},
	{
		id: "5",
		time: "4:00 PM",
		endTime: "5:00 PM",
		patient: { name: "Lisa Brown", phone: "(555) 567-8901", id: "p5" },
		provider: "Dr. Smith",
		treatment: "Check-up",
		room: "Room 1",
		status: "no-show",
		notes: "Patient did not arrive",
		isRecurring: true,
		waitlistPosition: null,
	},
];

const waitlistPatients = [
	{
		id: "w1",
		patient: { name: "John Smith", phone: "(555) 111-2222", id: "p6" },
		preferredTime: "Morning",
		treatment: "Cleaning",
		provider: "Any",
		addedDate: "2025-07-15",
		priority: "normal",
	},
	{
		id: "w2",
		patient: { name: "Maria Garcia", phone: "(555) 333-4444", id: "p7" },
		preferredTime: "Afternoon",
		treatment: "Emergency",
		provider: "Dr. Smith",
		addedDate: "2025-07-16",
		priority: "urgent",
	},
];

export default function AppointmentsPage() {
	const [selectedDateString, setSelectedDateString] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("day");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [appointments, setAppointments] = useState(todayAppointments);
	const [waitlist, setWaitlist] = useState(waitlistPatients);
	const [calendarAppointments, setCalendarAppointments] = useState<Appointment[]>([]);

	// Convert mock appointments to calendar format
	const convertToCalendarAppointments = useCallback((mockAppointments: typeof todayAppointments): Appointment[] => {
		return mockAppointments.map(apt => {
			const today = new Date();
			const [startHour, startMinute] = apt.time.includes('AM') || apt.time.includes('PM')
				? parseTime(apt.time)
				: [9, 0];
			const [endHour, endMinute] = apt.endTime.includes('AM') || apt.endTime.includes('PM')
				? parseTime(apt.endTime)
				: [10, 0];

			const start = new Date(today);
			start.setHours(startHour, startMinute, 0, 0);

			const end = new Date(today);
			end.setHours(endHour, endMinute, 0, 0);

			return {
				id: apt.id,
				title: `${apt.patient.name} - ${apt.treatment}`,
				patient: apt.patient,
				provider: apt.provider,
				treatment: apt.treatment,
				room: apt.room,
				status: apt.status as Appointment['status'],
				start,
				end,
				notes: apt.notes,
				isRecurring: apt.isRecurring,
			};
		});
	}, []);

	const parseTime = (timeStr: string): [number, number] => {
		const [time, period] = timeStr.split(' ');
		const [hours, minutes] = time.split(':').map(Number);
		let hour24 = hours;

		if (period === 'PM' && hours !== 12) {
			hour24 += 12;
		} else if (period === 'AM' && hours === 12) {
			hour24 = 0;
		}

		return [hour24, minutes || 0];
	};

	// Initialize calendar appointments
	useEffect(() => {
		const initialAppointments = convertToCalendarAppointments(todayAppointments);
		setCalendarAppointments(initialAppointments);
	}, [convertToCalendarAppointments]);

	const handleAppointmentMove = (appointmentId: string, newTimeSlot: string, newDate: Date) => {
		setCalendarAppointments(prev => prev.map(apt => {
			if (apt.id === appointmentId) {
				const [hours, minutes] = newTimeSlot.split(':').map(Number);
				const newStart = new Date(newDate);
				newStart.setHours(hours, minutes, 0, 0);

				const duration = apt.end.getTime() - apt.start.getTime();
				const newEnd = new Date(newStart.getTime() + duration);

				return { ...apt, start: newStart, end: newEnd };
			}
			return apt;
		}));
	};

	const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
		setCalendarAppointments(prev => prev.map(apt =>
			apt.id === updatedAppointment.id ? updatedAppointment : apt
		));
	};

	const handleNewAppointment = (timeSlot: string, date: Date) => {
		// TODO: Open new appointment dialog
		console.log('New appointment requested for:', timeSlot, date);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "checked-in":
				return "bg-green-100 text-green-800 border-green-200";
			case "confirmed":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "late":
				return "bg-red-100 text-red-800 border-red-200";
			case "completed":
				return "bg-gray-100 text-gray-800 border-gray-200";
			case "no-show":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "canceled":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "checked-in":
				return <UserCheck className="h-4 w-4" />;
			case "confirmed":
				return <CheckCircle className="h-4 w-4" />;
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "late":
				return <AlertCircle className="h-4 w-4" />;
			case "completed":
				return <CheckCircle className="h-4 w-4" />;
			case "no-show":
				return <UserX className="h-4 w-4" />;
			case "canceled":
				return <XCircle className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const handleStatusChange = (appointmentId: string, newStatus: string) => {
		setAppointments((prev) =>
			prev.map((apt) =>
				apt.id === appointmentId ? { ...apt, status: newStatus } : apt,
			),
		);
	};

	const handleCheckIn = (appointmentId: string) => {
		handleStatusChange(appointmentId, "checked-in");
	};

	const handleCheckOut = (appointmentId: string) => {
		handleStatusChange(appointmentId, "completed");
	};

	const filteredAppointments = appointments.filter((apt) => {
		const matchesSearch =
			apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			apt.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
			apt.provider.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus = statusFilter === "all" || apt.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString([], {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const changeDate = (days: number) => {
		const currentDate = new Date(selectedDate);
		currentDate.setDate(currentDate.getDate() + days);
		setSelectedDate(currentDate.toISOString().split("T")[0]);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Appointment Management
					</h1>
					<p className="text-gray-600">
						Manage today's schedule, check-ins, and waitlist
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline">
						<Repeat className="mr-2 h-4 w-4" />
						Recurring Setup
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						New Appointment
					</Button>
				</div>
			</div>

			{/* Date Navigation */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="sm" onClick={() => changeDate(-1)}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="flex items-center space-x-2">
								<Label htmlFor="date-select">Date:</Label>
								<Input
									id="date-select"
									type="date"
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									className="w-48"
								/>
							</div>
							<Button variant="ghost" size="sm" onClick={() => changeDate(1)}>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<div className="text-gray-600 text-sm">
							{formatDate(selectedDate)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs for different views */}
			<Tabs defaultValue="schedule" className="space-y-4">
				<TabsList>
					<TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
					<TabsTrigger value="calendar">Calendar View</TabsTrigger>
					<TabsTrigger value="waitlist">
						Waitlist ({waitlist.length})
					</TabsTrigger>
				</TabsList>

				{/* Today's Schedule Tab */}
				<TabsContent value="schedule" className="space-y-4">
					{/* Filters */}
					<div className="flex items-center space-x-4">
						<div className="relative max-w-md flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search appointments..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Filter className="mr-2 h-4 w-4" />
									Status: {statusFilter === "all" ? "All" : statusFilter}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => setStatusFilter("all")}>
									All Statuses
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("pending")}>
									Pending
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
									Confirmed
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("checked-in")}>
									Checked In
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("late")}>
									Late
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter("completed")}>
									Completed
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Appointments List */}
					<div className="space-y-4">
						{filteredAppointments.length > 0 ? (
							filteredAppointments.map((appointment) => (
								<Card
									key={appointment.id}
									className="transition-shadow hover:shadow-md"
								>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-start space-x-4">
												<div className="text-center">
													<div className="font-semibold text-gray-900 text-lg">
														{appointment.time}
													</div>
													<div className="text-gray-500 text-sm">
														{appointment.endTime}
													</div>
												</div>
												<div className="flex-1">
													<div className="mb-2 flex items-center space-x-3">
														<h3 className="font-medium text-gray-900 text-lg">
															{appointment.patient.name}
														</h3>
														{appointment.isRecurring && (
															<Badge variant="outline" className="text-xs">
																<Repeat className="mr-1 h-3 w-3" />
																Recurring
															</Badge>
														)}
														<Badge
															className={getStatusColor(appointment.status)}
														>
															{getStatusIcon(appointment.status)}
															<span className="ml-1">
																{appointment.status.replace("-", " ")}
															</span>
														</Badge>
													</div>
													<div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
														<div className="flex items-center">
															<User className="mr-2 h-4 w-4" />
															{appointment.provider}
														</div>
														<div className="flex items-center">
															<MapPin className="mr-2 h-4 w-4" />
															{appointment.room}
														</div>
														<div className="flex items-center">
															<Phone className="mr-2 h-4 w-4" />
															{appointment.patient.phone}
														</div>
														<div>
															<strong>Treatment:</strong>{" "}
															{appointment.treatment}
														</div>
													</div>
													{appointment.notes && (
														<div className="mt-2 text-gray-600 text-sm">
															<strong>Notes:</strong> {appointment.notes}
														</div>
													)}
												</div>
											</div>
											<div className="flex items-center space-x-2">
												{appointment.status === "confirmed" && (
													<Button
														size="sm"
														onClick={() => handleCheckIn(appointment.id)}
														className="bg-green-600 hover:bg-green-700"
													>
														<UserCheck className="mr-1 h-4 w-4" />
														Check In
													</Button>
												)}
												{appointment.status === "checked-in" && (
													<Button
														size="sm"
														onClick={() => handleCheckOut(appointment.id)}
														className="bg-blue-600 hover:bg-blue-700"
													>
														<CheckCircle className="mr-1 h-4 w-4" />
														Check Out
													</Button>
												)}
												<Button variant="ghost" size="sm">
													<MessageSquare className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm">
													<Phone className="h-4 w-4" />
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																handleStatusChange(appointment.id, "confirmed")
															}
														>
															Mark as Confirmed
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleStatusChange(appointment.id, "no-show")
															}
														>
															Mark as No Show
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleStatusChange(appointment.id, "canceled")
															}
														>
															Cancel Appointment
														</DropdownMenuItem>
														<DropdownMenuItem>Reschedule</DropdownMenuItem>
														<DropdownMenuItem>Edit Details</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<Card>
								<CardContent className="flex h-64 flex-col items-center justify-center">
									<Calendar className="mb-4 h-12 w-12 text-gray-400" />
									<p className="text-gray-500">No appointments found</p>
									<p className="text-gray-400 text-sm">
										Try adjusting your search or filters
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				{/* Calendar View Tab */}
				<TabsContent value="calendar">
					<DragDropCalendar
						appointments={calendarAppointments}
						onAppointmentMove={handleAppointmentMove}
						onAppointmentUpdate={handleAppointmentUpdate}
						onNewAppointment={handleNewAppointment}
						selectedDate={selectedDate}
						onDateChange={setSelectedDate}
						view={calendarView}
						onViewChange={setCalendarView}
					/>
				</TabsContent>

				{/* Waitlist Tab */}
				<TabsContent value="waitlist" className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-gray-900 text-lg">
							Patient Waitlist
						</h3>
						<Button variant="outline">
							<Users className="mr-2 h-4 w-4" />
							Manage Waitlist
						</Button>
					</div>

					<div className="space-y-4">
						{waitlist.map((item, index) => (
							<Card key={item.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">
												{index + 1}
											</div>
											<div>
												<h4 className="font-medium text-gray-900">
													{item.patient.name}
												</h4>
												<div className="flex items-center space-x-4 text-gray-600 text-sm">
													<span>{item.patient.phone}</span>
													<span>•</span>
													<span>{item.treatment}</span>
													<span>•</span>
													<span>Prefers {item.preferredTime}</span>
												</div>
												<div className="text-gray-500 text-xs">
													Added {new Date(item.addedDate).toLocaleDateString()}
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											{item.priority === "urgent" && (
												<Badge className="bg-red-100 text-red-800">
													Urgent
												</Badge>
											)}
											<Button size="sm">Schedule</Button>
											<Button variant="ghost" size="sm">
												<Phone className="h-4 w-4" />
											</Button>
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
