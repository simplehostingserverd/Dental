"use client";

import {
	AlertCircle,
	Bell,
	Calendar,
	CheckCircle,
	Clock,
	Heart,
	Phone,
	Plus,
	Search,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeDashboard() {
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString(),
	);

	// Sample data
	const todayStats = {
		appointments: 18,
		checkedIn: 12,
		waitingRoom: 3,
		calls: 25,
	};

	const todaySchedule = [
		{
			id: 1,
			time: "9:00 AM",
			patient: "Sarah Johnson",
			procedure: "Cleaning",
			doctor: "Dr. Smith",
			status: "checked-in",
		},
		{
			id: 2,
			time: "9:30 AM",
			patient: "Michael Chen",
			procedure: "Consultation",
			doctor: "Dr. Smith",
			status: "waiting",
		},
		{
			id: 3,
			time: "10:00 AM",
			patient: "Emily Davis",
			procedure: "Root Canal",
			doctor: "Dr. Smith",
			status: "confirmed",
		},
		{
			id: 4,
			time: "10:30 AM",
			patient: "Robert Wilson",
			procedure: "Crown Prep",
			doctor: "Dr. Smith",
			status: "confirmed",
		},
		{
			id: 5,
			time: "11:00 AM",
			patient: "Lisa Brown",
			procedure: "Cleaning",
			doctor: "Dr. Smith",
			status: "confirmed",
		},
	];

	const waitingPatients = [
		{
			id: 1,
			name: "Michael Chen",
			appointmentTime: "9:30 AM",
			waitTime: "15 min",
			status: "waiting",
		},
		{
			id: 2,
			name: "David Lee",
			appointmentTime: "10:15 AM",
			waitTime: "5 min",
			status: "ready",
		},
		{
			id: 3,
			name: "Maria Garcia",
			appointmentTime: "11:00 AM",
			waitTime: "Just arrived",
			status: "checked-in",
		},
	];

	const recentCalls = [
		{
			id: 1,
			caller: "Alice Brown",
			time: "10:45 AM",
			purpose: "Appointment booking",
			status: "completed",
		},
		{
			id: 2,
			caller: "John Smith",
			time: "10:30 AM",
			purpose: "Insurance inquiry",
			status: "completed",
		},
		{
			id: 3,
			caller: "Emma Wilson",
			time: "10:15 AM",
			purpose: "Rescheduling",
			status: "completed",
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Header */}
			<header className="border-gray-700 border-b bg-gray-800">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Heart className="mr-3 h-8 w-8 text-blue-400" />
							<span className="font-bold text-xl">Cognident</span>
							<span className="ml-4 text-gray-400">Employee Dashboard</span>
						</div>
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
								<input
									type="text"
									placeholder="Search patients..."
									className="rounded-md border border-gray-600 bg-gray-700 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<button className="relative p-2 text-gray-400 hover:text-white">
								<Bell className="h-5 w-5" />
								<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
							</button>
							<div className="flex items-center space-x-2">
								<User className="h-5 w-5 text-gray-400" />
								<span className="text-gray-400 text-sm">
									Jane Receptionist | {currentTime}
								</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-3xl">Good morning, Jane</h1>
					<p className="text-gray-400">
						Here's your front desk overview for today.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Today's Appointments</p>
								<p className="font-bold text-2xl text-white">
									{todayStats.appointments}
								</p>
							</div>
							<Calendar className="h-8 w-8 text-blue-400" />
						</div>
						<div className="mt-2 text-gray-400 text-sm">
							Scheduled for today
						</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Checked In</p>
								<p className="font-bold text-2xl text-white">
									{todayStats.checkedIn}
								</p>
							</div>
							<CheckCircle className="h-8 w-8 text-green-400" />
						</div>
						<div className="mt-2 text-gray-400 text-sm">Patients processed</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Waiting Room</p>
								<p className="font-bold text-2xl text-white">
									{todayStats.waitingRoom}
								</p>
							</div>
							<Clock className="h-8 w-8 text-yellow-400" />
						</div>
						<div className="mt-2 text-gray-400 text-sm">Currently waiting</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Phone Calls</p>
								<p className="font-bold text-2xl text-white">
									{todayStats.calls}
								</p>
							</div>
							<Phone className="h-8 w-8 text-purple-400" />
						</div>
						<div className="mt-2 text-gray-400 text-sm">Handled today</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Today's Schedule */}
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Today's Schedule</h2>
							<button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-sm transition-colors hover:bg-blue-700">
								<Plus className="mr-2 h-4 w-4" />
								Add Appointment
							</button>
						</div>
						<div className="max-h-96 space-y-3 overflow-y-auto">
							{todaySchedule.map((appointment) => (
								<div
									key={appointment.id}
									className="flex items-center justify-between rounded-lg bg-gray-700 p-3"
								>
									<div className="flex items-center space-x-3">
										<div className="w-16 font-medium text-blue-400 text-sm">
											{appointment.time}
										</div>
										<div>
											<p className="font-medium text-sm">
												{appointment.patient}
											</p>
											<p className="text-gray-400 text-xs">
												{appointment.procedure} - {appointment.doctor}
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<span
											className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${
												appointment.status === "checked-in"
													? "bg-green-600 text-white"
													: appointment.status === "waiting"
														? "bg-yellow-600 text-white"
														: "bg-blue-600 text-white"
											}`}
										>
											{appointment.status}
										</span>
										<button className="text-gray-400 hover:text-white">
											<CheckCircle className="h-4 w-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Waiting Room */}
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Waiting Room</h2>
							<span className="rounded-full bg-yellow-600 px-3 py-1 font-medium text-sm text-white">
								{waitingPatients.length} waiting
							</span>
						</div>
						<div className="space-y-4">
							{waitingPatients.map((patient) => (
								<div
									key={patient.id}
									className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
								>
									<div className="flex items-center space-x-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
											<Clock className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{patient.name}</p>
											<p className="text-gray-400 text-sm">
												Appt: {patient.appointmentTime}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium text-sm">{patient.waitTime}</p>
										<span
											className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${
												patient.status === "ready"
													? "bg-green-600 text-white"
													: patient.status === "waiting"
														? "bg-yellow-600 text-white"
														: "bg-blue-600 text-white"
											}`}
										>
											{patient.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="mt-8 rounded-lg bg-gray-800 p-6">
					<h2 className="mb-6 font-semibold text-xl">Recent Phone Calls</h2>
					<div className="space-y-4">
						{recentCalls.map((call) => (
							<div
								key={call.id}
								className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
							>
								<div className="flex items-center space-x-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
										<Phone className="h-5 w-5" />
									</div>
									<div>
										<p className="font-medium">{call.caller}</p>
										<p className="text-gray-400 text-sm">{call.purpose}</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-gray-300 text-sm">{call.time}</p>
									<span className="inline-flex rounded-full bg-green-600 px-2 py-1 font-semibold text-white text-xs">
										{call.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8 rounded-lg bg-gray-800 p-6">
					<h2 className="mb-6 font-semibold text-xl">Quick Actions</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<CheckCircle className="mb-2 h-8 w-8 text-green-400" />
							<span className="font-medium text-sm">Check In Patient</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Calendar className="mb-2 h-8 w-8 text-blue-400" />
							<span className="font-medium text-sm">Schedule Appointment</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Phone className="mb-2 h-8 w-8 text-purple-400" />
							<span className="font-medium text-sm">Log Phone Call</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Users className="mb-2 h-8 w-8 text-yellow-400" />
							<span className="font-medium text-sm">Add New Patient</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
