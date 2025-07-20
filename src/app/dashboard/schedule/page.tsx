"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	MapPin,
	Phone,
	Plus,
	User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data - in real app this would come from database
const appointments = [
	{
		id: "1",
		time: "09:00",
		duration: 60,
		patient: {
			name: "John Smith",
			phone: "(555) 123-4567",
		},
		treatment: "Routine Cleaning",
		provider: "Dr. Sarah Chen",
		room: "Room 1",
		status: "confirmed",
		notes: "Patient prefers morning appointments",
	},
	{
		id: "2",
		time: "10:30",
		duration: 90,
		patient: {
			name: "Sarah Johnson",
			phone: "(555) 987-6543",
		},
		treatment: "Root Canal",
		provider: "Dr. Sarah Chen",
		room: "Room 2",
		status: "confirmed",
		notes: "Follow-up from last week",
	},
	{
		id: "3",
		time: "14:00",
		duration: 45,
		patient: {
			name: "Michael Brown",
			phone: "(555) 456-7890",
		},
		treatment: "Consultation",
		provider: "Dr. Sarah Chen",
		room: "Room 1",
		status: "pending",
		notes: "New patient consultation",
	},
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
];

type ViewType = "day" | "week" | "month";

export default function SchedulePage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewType, setViewType] = useState<ViewType>("day");

	const dateString = currentDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const navigateDate = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);

		switch (viewType) {
			case "day":
				newDate.setDate(
					currentDate.getDate() + (direction === "next" ? 1 : -1),
				);
				break;
			case "week":
				newDate.setDate(
					currentDate.getDate() + (direction === "next" ? 7 : -7),
				);
				break;
			case "month":
				newDate.setMonth(
					currentDate.getMonth() + (direction === "next" ? 1 : -1),
				);
				break;
		}

		setCurrentDate(newDate);
	};

	const getViewTitle = () => {
		switch (viewType) {
			case "day":
				return dateString;
			case "week": {
				const weekStart = new Date(currentDate);
				weekStart.setDate(currentDate.getDate() - currentDate.getDay());
				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekStart.getDate() + 6);
				return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
			}
			case "month":
				return currentDate.toLocaleDateString("en-US", {
					month: "long",
					year: "numeric",
				});
			default:
				return dateString;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">Schedule</h1>
					<p className="text-gray-600">Manage appointments and availability</p>
				</div>
				<Link href="/dashboard/appointments/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						New Appointment
					</Button>
				</Link>
			</div>

			{/* Date Navigation */}
			<div className="flex items-center justify-between rounded-lg border bg-white p-4">
				<div className="flex items-center space-x-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigateDate("prev")}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="flex items-center space-x-2">
						<Calendar className="h-5 w-5 text-gray-400" />
						<span className="font-medium text-lg">{getViewTitle()}</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigateDate("next")}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
				<div className="flex space-x-2">
					<Button
						variant={viewType === "day" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewType("day")}
					>
						Day
					</Button>
					<Button
						variant={viewType === "week" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewType("week")}
					>
						Week
					</Button>
					<Button
						variant={viewType === "month" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewType("month")}
					>
						Month
					</Button>
				</div>
			</div>

			{/* Schedule Grid */}
			{viewType === "day" && (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
					{/* Time Column */}
					<div className="lg:col-span-1">
						<div className="rounded-lg border bg-white p-4">
							<h3 className="mb-4 font-medium text-gray-900">Time Slots</h3>
							<div className="space-y-2">
								{timeSlots.map((time) => (
									<div
										key={time}
										className="flex items-center justify-between border-gray-100 border-b py-2 last:border-b-0"
									>
										<span className="text-gray-600 text-sm">{time}</span>
										<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
											<Plus className="h-3 w-3" />
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Appointments Column */}
					<div className="lg:col-span-3">
						<div className="rounded-lg border bg-white p-4">
							<h3 className="mb-4 font-medium text-gray-900">
								{viewType === "day" ? "Today's" : "This Week's"} Appointments
							</h3>
							<div className="space-y-4">
								{appointments.map((appointment) => (
									<div
										key={appointment.id}
										className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="mb-2 flex items-center space-x-3">
													<div className="flex items-center space-x-2">
														<Clock className="h-4 w-4 text-gray-400" />
														<span className="font-medium text-sm">
															{appointment.time} ({appointment.duration} min)
														</span>
													</div>
													<Badge className={getStatusColor(appointment.status)}>
														{appointment.status}
													</Badge>
												</div>

												<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
													<div>
														<div className="mb-1 flex items-center space-x-2">
															<User className="h-4 w-4 text-gray-400" />
															<span className="font-medium text-gray-900">
																{appointment.patient.name}
															</span>
														</div>
														<div className="mb-1 flex items-center space-x-2">
															<Phone className="h-4 w-4 text-gray-400" />
															<span className="text-gray-600 text-sm">
																{appointment.patient.phone}
															</span>
														</div>
														<div className="flex items-center space-x-2">
															<MapPin className="h-4 w-4 text-gray-400" />
															<span className="text-gray-600 text-sm">
																{appointment.room}
															</span>
														</div>
													</div>

													<div>
														<p className="mb-1 font-medium text-gray-900">
															{appointment.treatment}
														</p>
														<p className="mb-1 text-gray-600 text-sm">
															Provider: {appointment.provider}
														</p>
														{appointment.notes && (
															<p className="text-gray-500 text-sm italic">
																{appointment.notes}
															</p>
														)}
													</div>
												</div>
											</div>

											<div className="ml-4 flex space-x-2">
												<Button variant="outline" size="sm">
													Edit
												</Button>
												<Button variant="outline" size="sm">
													Complete
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>

							{appointments.length === 0 && (
								<div className="py-8 text-center">
									<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p className="text-gray-500">
										No appointments scheduled for{" "}
										{viewType === "day" ? "today" : "this period"}
									</p>
									<Link href="/dashboard/appointments/new">
										<Button className="mt-4">
											<Plus className="mr-2 h-4 w-4" />
											Schedule First Appointment
										</Button>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{viewType === "week" && (
				<div className="rounded-lg border bg-white p-4">
					<h3 className="mb-4 font-medium text-gray-900">Week View</h3>
					<div className="grid grid-cols-8 gap-2">
						{/* Time column */}
						<div className="space-y-12">
							<div className="h-8" /> {/* Header spacer */}
							{timeSlots.slice(0, 10).map((time) => (
								<div key={time} className="text-gray-600 text-sm">
									{time}
								</div>
							))}
						</div>

						{/* Days columns */}
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
							(day, index) => (
								<div key={day} className="space-y-2">
									<div className="border-gray-200 border-b pb-2 text-center font-medium text-sm">
										{day}
									</div>
									<div className="space-y-12">
										{timeSlots.slice(0, 10).map((time) => (
											<div
												key={time}
												className="h-8 rounded border border-gray-100 hover:bg-gray-50"
											>
												{/* Appointment slots would go here */}
											</div>
										))}
									</div>
								</div>
							),
						)}
					</div>
				</div>
			)}

			{viewType === "month" && (
				<div className="rounded-lg border bg-white p-4">
					<h3 className="mb-4 font-medium text-gray-900">Month View</h3>
					<div className="grid grid-cols-7 gap-2">
						{/* Day headers */}
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								className="border-gray-200 border-b pb-2 text-center font-medium text-sm"
							>
								{day}
							</div>
						))}

						{/* Calendar days */}
						{Array.from({ length: 35 }, (_, i) => {
							const dayNumber = i - 6; // Adjust for month start
							const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
							const isToday =
								dayNumber === currentDate.getDate() && isCurrentMonth;

							return (
								<div
									key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-day-${dayNumber}`}
									className={`aspect-square border border-gray-100 p-2 ${
										isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50"
									} ${isToday ? "border-blue-200 bg-blue-50" : ""}`}
								>
									{isCurrentMonth && (
										<>
											<div
												className={`text-sm ${isToday ? "font-bold text-blue-600" : "text-gray-900"}`}
											>
												{dayNumber}
											</div>
											{/* Sample appointments for demo */}
											{dayNumber === currentDate.getDate() && (
												<div className="mt-1 space-y-1">
													<div className="rounded bg-blue-100 px-1 text-blue-800 text-xs">
														9:00 Cleaning
													</div>
													<div className="rounded bg-green-100 px-1 text-green-800 text-xs">
														2:00 Checkup
													</div>
												</div>
											)}
										</>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Quick Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-blue-600">12</div>
					<div className="text-gray-600 text-sm">Total Today</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-green-600">8</div>
					<div className="text-gray-600 text-sm">Completed</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-yellow-600">3</div>
					<div className="text-gray-600 text-sm">Pending</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-red-600">1</div>
					<div className="text-gray-600 text-sm">Cancelled</div>
				</div>
			</div>
		</div>
	);
}
