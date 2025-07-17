"use client";

import { useState, useCallback, useMemo } from "react";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
	closestCenter,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	User,
	MapPin,
	Calendar as CalendarIcon,
	Plus,
} from "lucide-react";
import { DraggableAppointment } from "./DraggableAppointment";
import { DroppableTimeSlot } from "./DroppableTimeSlot";

export interface Appointment {
	id: string;
	title: string;
	patient: {
		name: string;
		phone: string;
		id: string;
	};
	provider: string;
	treatment: string;
	room: string;
	status: "confirmed" | "pending" | "checked-in" | "completed" | "cancelled" | "no-show";
	start: Date;
	end: Date;
	notes?: string;
	isRecurring?: boolean;
	color?: string;
}

export interface TimeSlot {
	id: string;
	time: string;
	date: Date;
	isAvailable: boolean;
	appointments: Appointment[];
}

interface DragDropCalendarProps {
	appointments: Appointment[];
	onAppointmentMove: (appointmentId: string, newTimeSlot: string, newDate: Date) => void;
	onAppointmentUpdate: (appointment: Appointment) => void;
	onNewAppointment: (timeSlot: string, date: Date) => void;
	selectedDate: Date;
	onDateChange: (date: Date) => void;
	view: "day" | "week" | "month";
	onViewChange: (view: "day" | "week" | "month") => void;
}

export default function DragDropCalendar({
	appointments,
	onAppointmentMove,
	onAppointmentUpdate,
	onNewAppointment,
	selectedDate,
	onDateChange,
	view,
	onViewChange,
}: DragDropCalendarProps) {
	const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	// Generate time slots for the day (9 AM to 6 PM in 30-minute intervals)
	const timeSlots = useMemo(() => {
		const slots: TimeSlot[] = [];
		const startHour = 9;
		const endHour = 18;
		
		for (let hour = startHour; hour < endHour; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
				const slotDate = new Date(selectedDate);
				slotDate.setHours(hour, minute, 0, 0);
				
				const slotAppointments = appointments.filter(apt => {
					const aptStart = new Date(apt.start);
					return aptStart.getTime() === slotDate.getTime();
				});

				slots.push({
					id: `${selectedDate.toISOString().split('T')[0]}-${time}`,
					time,
					date: slotDate,
					isAvailable: slotAppointments.length === 0,
					appointments: slotAppointments,
				});
			}
		}
		return slots;
	}, [selectedDate, appointments]);

	// Generate week dates for week view
	const weekDates = useMemo(() => {
		const dates = [];
		const startOfWeek = new Date(selectedDate);
		const day = startOfWeek.getDay();
		startOfWeek.setDate(startOfWeek.getDate() - day);

		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);
			dates.push(date);
		}
		return dates;
	}, [selectedDate]);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		const appointment = appointments.find(apt => apt.id === event.active.id);
		setActiveAppointment(appointment || null);
	}, [appointments]);

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		setActiveAppointment(null);

		if (!over) return;

		const appointmentId = active.id as string;
		const timeSlotId = over.id as string;
		
		// Parse the time slot ID to get date and time
		const [dateStr, time] = timeSlotId.split('-');
		const newDate = new Date(dateStr);
		const [hours, minutes] = time.split(':').map(Number);
		newDate.setHours(hours, minutes, 0, 0);

		onAppointmentMove(appointmentId, time, newDate);
	}, [onAppointmentMove]);

	const handleAppointmentClick = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setShowAppointmentDialog(true);
	};

	const getStatusColor = (status: Appointment['status']) => {
		switch (status) {
			case 'confirmed':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'checked-in':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'completed':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			case 'cancelled':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'no-show':
				return 'bg-orange-100 text-orange-800 border-orange-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const navigateDate = (direction: 'prev' | 'next') => {
		const newDate = new Date(selectedDate);
		
		if (view === 'day') {
			newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
		} else if (view === 'week') {
			newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
		} else if (view === 'month') {
			newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
		}
		
		onDateChange(newDate);
	};

	const formatDateHeader = () => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		
		if (view === 'week') {
			const startOfWeek = weekDates[0];
			const endOfWeek = weekDates[6];
			return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
		} else if (view === 'month') {
			return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
		}
		
		return selectedDate.toLocaleDateString('en-US', options);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="space-y-4">
				{/* Calendar Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigateDate('prev')}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigateDate('next')}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<h2 className="text-xl font-semibold text-gray-900">
							{formatDateHeader()}
						</h2>
					</div>
					
					<div className="flex items-center space-x-2">
						<div className="flex rounded-lg border">
							{(['day', 'week', 'month'] as const).map((viewType) => (
								<Button
									key={viewType}
									variant={view === viewType ? "default" : "ghost"}
									size="sm"
									onClick={() => onViewChange(viewType)}
									className="rounded-none first:rounded-l-lg last:rounded-r-lg"
								>
									{viewType.charAt(0).toUpperCase() + viewType.slice(1)}
								</Button>
							))}
						</div>
						<Button
							onClick={() => onDateChange(new Date())}
							variant="outline"
							size="sm"
						>
							Today
						</Button>
					</div>
				</div>

				{/* Calendar Content */}
				{view === 'day' && (
					<Card>
						<CardContent className="p-0">
							<div className="grid grid-cols-1">
								{/* Time column header */}
								<div className="border-b border-gray-200 p-4">
									<div className="grid grid-cols-12 gap-4">
										<div className="col-span-2 text-sm font-medium text-gray-500">
											Time
										</div>
										<div className="col-span-10 text-sm font-medium text-gray-900">
											{selectedDate.toLocaleDateString('en-US', { 
												weekday: 'long', 
												month: 'long', 
												day: 'numeric' 
											})}
										</div>
									</div>
								</div>
								
								{/* Time slots */}
								<div className="divide-y divide-gray-100">
									<SortableContext
										items={timeSlots.map(slot => slot.id)}
										strategy={verticalListSortingStrategy}
									>
										{timeSlots.map((slot) => (
											<DroppableTimeSlot
												key={slot.id}
												timeSlot={slot}
												onNewAppointment={onNewAppointment}
											>
												<div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
													<div className="col-span-2 text-sm text-gray-500">
														{slot.time}
													</div>
													<div className="col-span-10 space-y-2">
														{slot.appointments.map((appointment) => (
															<DraggableAppointment
																key={appointment.id}
																appointment={appointment}
																onClick={() => handleAppointmentClick(appointment)}
																statusColor={getStatusColor(appointment.status)}
															/>
														))}
														{slot.appointments.length === 0 && (
															<div className="flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500">
																<Plus className="h-4 w-4 mr-2" />
																<span className="text-sm">Add appointment</span>
															</div>
														)}
													</div>
												</div>
											</DroppableTimeSlot>
										))}
									</SortableContext>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Week View */}
				{view === 'week' && (
					<Card>
						<CardContent className="p-0">
							<div className="grid grid-cols-8 border-b border-gray-200">
								{/* Time column header */}
								<div className="p-4 text-sm font-medium text-gray-500 border-r border-gray-200">
									Time
								</div>
								{/* Day headers */}
								{weekDates.map((date, index) => (
									<div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
										<div className="text-sm font-medium text-gray-900">
											{date.toLocaleDateString('en-US', { weekday: 'short' })}
										</div>
										<div className={`text-lg font-semibold mt-1 ${
											date.toDateString() === new Date().toDateString()
												? 'text-blue-600'
												: 'text-gray-900'
										}`}>
											{date.getDate()}
										</div>
									</div>
								))}
							</div>

							{/* Time slots grid */}
							<div className="divide-y divide-gray-100">
								{timeSlots.map((slot) => (
									<div key={slot.time} className="grid grid-cols-8">
										{/* Time label */}
										<div className="p-4 text-sm text-gray-500 border-r border-gray-200">
											{slot.time}
										</div>
										{/* Day columns */}
										{weekDates.map((date, dayIndex) => {
											const daySlotId = `${date.toISOString().split('T')[0]}-${slot.time}`;
											const dayAppointments = appointments.filter(apt => {
												const aptStart = new Date(apt.start);
												return aptStart.toDateString() === date.toDateString() &&
													   aptStart.getHours() === parseInt(slot.time.split(':')[0]) &&
													   aptStart.getMinutes() === parseInt(slot.time.split(':')[1]);
											});

											return (
												<DroppableTimeSlot
													key={daySlotId}
													timeSlot={{
														id: daySlotId,
														time: slot.time,
														date: date,
														isAvailable: dayAppointments.length === 0,
														appointments: dayAppointments,
													}}
													onNewAppointment={onNewAppointment}
												>
													<div className="p-2 min-h-[60px] border-r border-gray-200 last:border-r-0 hover:bg-gray-50">
														{dayAppointments.map((appointment) => (
															<DraggableAppointment
																key={appointment.id}
																appointment={appointment}
																onClick={() => handleAppointmentClick(appointment)}
																statusColor={getStatusColor(appointment.status)}
															/>
														))}
													</div>
												</DroppableTimeSlot>
											);
										})}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Month View */}
				{view === 'month' && (
					<Card>
						<CardContent className="p-0">
							<div className="grid grid-cols-7 border-b border-gray-200">
								{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
									<div key={day} className="p-4 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
										{day}
									</div>
								))}
							</div>

							<div className="grid grid-cols-7">
								{Array.from({ length: 42 }, (_, i) => {
									const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
									date.setDate(date.getDate() - date.getDay() + i);

									const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
									const isToday = date.toDateString() === new Date().toDateString();

									const dayAppointments = appointments.filter(apt => {
										const aptStart = new Date(apt.start);
										return aptStart.toDateString() === date.toDateString();
									});

									return (
										<div
											key={i}
											className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
												isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
											} ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
										>
											<div className={`text-sm mb-2 ${
												isToday ? 'font-bold text-blue-600' :
												isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
											}`}>
												{date.getDate()}
											</div>

											<div className="space-y-1">
												{dayAppointments.slice(0, 3).map((appointment) => (
													<div
														key={appointment.id}
														className={`text-xs p-1 rounded cursor-pointer truncate ${getStatusColor(appointment.status)}`}
														onClick={() => handleAppointmentClick(appointment)}
													>
														{appointment.start.toLocaleTimeString('en-US', {
															hour: 'numeric',
															minute: '2-digit'
														})} {appointment.patient.name}
													</div>
												))}
												{dayAppointments.length > 3 && (
													<div className="text-xs text-gray-500 p-1">
														+{dayAppointments.length - 3} more
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Drag Overlay */}
				<DragOverlay>
					{activeAppointment && (
						<div className="rounded-lg border bg-white p-3 shadow-lg">
							<div className="flex items-center space-x-2">
								<User className="h-4 w-4 text-gray-500" />
								<span className="font-medium text-sm">
									{activeAppointment.patient.name}
								</span>
							</div>
							<div className="mt-1 text-xs text-gray-500">
								{activeAppointment.treatment}
							</div>
						</div>
					)}
				</DragOverlay>
			</div>

			{/* Appointment Details Dialog */}
			<Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Appointment Details</DialogTitle>
					</DialogHeader>
					{selectedAppointment && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-lg">
									{selectedAppointment.patient.name}
								</h3>
								<Badge className={getStatusColor(selectedAppointment.status)}>
									{selectedAppointment.status.replace('-', ' ').toUpperCase()}
								</Badge>
							</div>
							
							<div className="space-y-3">
								<div className="flex items-center space-x-2 text-sm">
									<Clock className="h-4 w-4 text-gray-500" />
									<span>
										{selectedAppointment.start.toLocaleTimeString('en-US', { 
											hour: 'numeric', 
											minute: '2-digit' 
										})} - {selectedAppointment.end.toLocaleTimeString('en-US', { 
											hour: 'numeric', 
											minute: '2-digit' 
										})}
									</span>
								</div>
								
								<div className="flex items-center space-x-2 text-sm">
									<User className="h-4 w-4 text-gray-500" />
									<span>{selectedAppointment.provider}</span>
								</div>
								
								<div className="flex items-center space-x-2 text-sm">
									<MapPin className="h-4 w-4 text-gray-500" />
									<span>{selectedAppointment.room}</span>
								</div>
								
								<div className="text-sm">
									<span className="font-medium">Treatment: </span>
									{selectedAppointment.treatment}
								</div>
								
								{selectedAppointment.notes && (
									<div className="text-sm">
										<span className="font-medium">Notes: </span>
										{selectedAppointment.notes}
									</div>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</DndContext>
	);
}
