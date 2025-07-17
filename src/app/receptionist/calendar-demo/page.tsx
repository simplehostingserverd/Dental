"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DragDropCalendar, { type Appointment } from "@/components/calendar/DragDropCalendar";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

// Sample appointments for demonstration
const sampleAppointments: Appointment[] = [
	{
		id: "1",
		title: "Sarah Johnson - Routine Cleaning",
		patient: {
			name: "Sarah Johnson",
			phone: "(555) 123-4567",
			id: "p1"
		},
		provider: "Dr. Smith",
		treatment: "Routine Cleaning",
		room: "Room 1",
		status: "confirmed",
		start: new Date(2025, 6, 17, 9, 0), // July 17, 2025, 9:00 AM
		end: new Date(2025, 6, 17, 10, 0),   // July 17, 2025, 10:00 AM
		notes: "Patient prefers morning appointments",
		isRecurring: true,
	},
	{
		id: "2",
		title: "Michael Chen - Root Canal",
		patient: {
			name: "Michael Chen",
			phone: "(555) 234-5678",
			id: "p2"
		},
		provider: "Dr. Johnson",
		treatment: "Root Canal",
		room: "Room 2",
		status: "checked-in",
		start: new Date(2025, 6, 17, 10, 30), // July 17, 2025, 10:30 AM
		end: new Date(2025, 6, 17, 12, 0),    // July 17, 2025, 12:00 PM
		notes: "Follow-up from last week",
		isRecurring: false,
	},
	{
		id: "3",
		title: "Emily Davis - Dental Filling",
		patient: {
			name: "Emily Davis",
			phone: "(555) 345-6789",
			id: "p3"
		},
		provider: "Dr. Smith",
		treatment: "Dental Filling",
		room: "Room 1",
		status: "pending",
		start: new Date(2025, 6, 17, 14, 0), // July 17, 2025, 2:00 PM
		end: new Date(2025, 6, 17, 15, 30),  // July 17, 2025, 3:30 PM
		notes: "Patient has dental anxiety",
		isRecurring: false,
	},
	{
		id: "4",
		title: "Robert Wilson - Check-up",
		patient: {
			name: "Robert Wilson",
			phone: "(555) 456-7890",
			id: "p4"
		},
		provider: "Dr. Johnson",
		treatment: "Check-up",
		room: "Room 3",
		status: "completed",
		start: new Date(2025, 6, 17, 15, 30), // July 17, 2025, 3:30 PM
		end: new Date(2025, 6, 17, 16, 30),   // July 17, 2025, 4:30 PM
		notes: "Regular 6-month checkup",
		isRecurring: true,
	},
	{
		id: "5",
		title: "Lisa Brown - Emergency",
		patient: {
			name: "Lisa Brown",
			phone: "(555) 567-8901",
			id: "p5"
		},
		provider: "Dr. Smith",
		treatment: "Emergency Treatment",
		room: "Room 1",
		status: "no-show",
		start: new Date(2025, 6, 17, 16, 0), // July 17, 2025, 4:00 PM
		end: new Date(2025, 6, 17, 17, 0),   // July 17, 2025, 5:00 PM
		notes: "Patient did not arrive",
		isRecurring: false,
	},
];

export default function CalendarDemoPage() {
	const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
	const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 17)); // July 17, 2025
	const [view, setView] = useState<"day" | "week" | "month">("day");
	const [moveCount, setMoveCount] = useState(0);

	const handleAppointmentMove = (appointmentId: string, newTimeSlot: string, newDate: Date) => {
		setAppointments(prev => prev.map(apt => {
			if (apt.id === appointmentId) {
				const [hours, minutes] = newTimeSlot.split(':').map(Number);
				const newStart = new Date(newDate);
				newStart.setHours(hours, minutes, 0, 0);
				
				const duration = apt.end.getTime() - apt.start.getTime();
				const newEnd = new Date(newStart.getTime() + duration);
				
				setMoveCount(prev => prev + 1);
				
				return { 
					...apt, 
					start: newStart, 
					end: newEnd,
					title: `${apt.patient.name} - ${apt.treatment}` // Update title if needed
				};
			}
			return apt;
		}));
	};

	const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
		setAppointments(prev => prev.map(apt => 
			apt.id === updatedAppointment.id ? updatedAppointment : apt
		));
	};

	const handleNewAppointment = (timeSlot: string, date: Date) => {
		const [hours, minutes] = timeSlot.split(':').map(Number);
		const start = new Date(date);
		start.setHours(hours, minutes, 0, 0);
		
		const end = new Date(start);
		end.setHours(hours + 1, minutes, 0, 0); // Default 1-hour appointment
		
		const newAppointment: Appointment = {
			id: `new-${Date.now()}`,
			title: "New Patient - Consultation",
			patient: {
				name: "New Patient",
				phone: "(555) 000-0000",
				id: `p-new-${Date.now()}`
			},
			provider: "Dr. Smith",
			treatment: "Consultation",
			room: "Room 1",
			status: "pending",
			start,
			end,
			notes: "New appointment created via drag-and-drop",
			isRecurring: false,
		};
		
		setAppointments(prev => [...prev, newAppointment]);
	};

	const getStatusStats = () => {
		const stats = appointments.reduce((acc, apt) => {
			acc[apt.status] = (acc[apt.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
		
		return stats;
	};

	const stats = getStatusStats();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">
						Drag & Drop Calendar Demo
					</h1>
					<p className="text-gray-600">
						Interactive appointment scheduling with drag-and-drop functionality
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<Badge variant="outline" className="text-sm">
						{appointments.length} appointments
					</Badge>
					<Badge variant="outline" className="text-sm">
						{moveCount} moves made
					</Badge>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Total Appointments
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<Calendar className="h-5 w-5 text-blue-600" />
							<span className="text-2xl font-bold">{appointments.length}</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Confirmed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<div className="h-3 w-3 rounded-full bg-blue-500" />
							<span className="text-2xl font-bold">{stats.confirmed || 0}</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Checked In
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<div className="h-3 w-3 rounded-full bg-green-500" />
							<span className="text-2xl font-bold">{stats['checked-in'] || 0}</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Pending
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<div className="h-3 w-3 rounded-full bg-yellow-500" />
							<span className="text-2xl font-bold">{stats.pending || 0}</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<div className="h-3 w-3 rounded-full bg-gray-500" />
							<span className="text-2xl font-bold">{stats.completed || 0}</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Instructions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Users className="h-5 w-5" />
						<span>How to Use</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="flex items-start space-x-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
								1
							</div>
							<div>
								<h4 className="font-medium">Drag Appointments</h4>
								<p className="text-sm text-gray-600">
									Click and drag appointments to different time slots
								</p>
							</div>
						</div>
						
						<div className="flex items-start space-x-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
								2
							</div>
							<div>
								<h4 className="font-medium">Add New Appointments</h4>
								<p className="text-sm text-gray-600">
									Click on empty time slots to create new appointments
								</p>
							</div>
						</div>
						
						<div className="flex items-start space-x-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
								3
							</div>
							<div>
								<h4 className="font-medium">View Details</h4>
								<p className="text-sm text-gray-600">
									Click on appointments to view and edit details
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Calendar */}
			<DragDropCalendar
				appointments={appointments}
				onAppointmentMove={handleAppointmentMove}
				onAppointmentUpdate={handleAppointmentUpdate}
				onNewAppointment={handleNewAppointment}
				selectedDate={selectedDate}
				onDateChange={setSelectedDate}
				view={view}
				onViewChange={setView}
			/>
		</div>
	);
}
