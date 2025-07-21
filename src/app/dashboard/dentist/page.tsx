"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { CognidentTextLogo } from "@/components/icons/cognident-logo";
import {
	BarChart3,
	Bell,
	Calendar,
	Clock,
	DollarSign,
	FileText,
	LogOut,
	Plus,
	Search,
	Settings,
	TrendingUp,
	Users,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DentistDashboard() {
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString(),
	);

	useEffect(() => {
		document.title = "Cognident - Dentist Dashboard";
	}, []);

	const handleLogout = async () => {
		try {
			await fetch("/api/test-auth/logout", { method: "POST" });
			localStorage.removeItem("testUser");
			window.location.href = "/test-login";
		} catch (error) {
			console.error("Logout error:", error);
			// Fallback: clear localStorage and redirect
			localStorage.removeItem("testUser");
			window.location.href = "/test-login";
		}
	};

	// Sample data
	const todayStats = {
		appointments: 12,
		patients: 8,
		revenue: 3250,
		procedures: 15,
	};

	const upcomingAppointments = [
		{
			id: 1,
			patient: "Sarah Johnson",
			time: "9:00 AM",
			procedure: "Cleaning",
			status: "confirmed",
		},
		{
			id: 2,
			patient: "Michael Chen",
			time: "10:30 AM",
			procedure: "Root Canal",
			status: "confirmed",
		},
		{
			id: 3,
			patient: "Emily Davis",
			time: "2:00 PM",
			procedure: "Crown Prep",
			status: "pending",
		},
		{
			id: 4,
			patient: "Robert Wilson",
			time: "3:30 PM",
			procedure: "Consultation",
			status: "confirmed",
		},
	];

	const recentPatients = [
		{
			id: 1,
			name: "Alice Brown",
			lastVisit: "2025-01-15",
			nextAppointment: "2025-02-15",
			status: "active",
		},
		{
			id: 2,
			name: "David Lee",
			lastVisit: "2025-01-14",
			nextAppointment: "2025-03-14",
			status: "active",
		},
		{
			id: 3,
			name: "Maria Garcia",
			lastVisit: "2025-01-13",
			nextAppointment: "Pending",
			status: "follow-up",
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Header */}
			<header className="border-gray-700 border-b bg-gray-800">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<CognidentTextLogo logoSize={32} className="text-white" />
							<span className="ml-4 text-gray-400">Dentist Dashboard</span>
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
							<button className="p-2 text-gray-400 hover:text-white">
								<Settings className="h-5 w-5" />
							</button>
							<button
								onClick={handleLogout}
								className="p-2 text-gray-400 transition-colors hover:text-red-400"
								title="Logout"
							>
								<LogOut className="h-5 w-5" />
							</button>
							<div className="text-gray-400 text-sm">
								Dr. Smith | {currentTime}
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-3xl">Good morning, Dr. Smith</h1>
					<p className="text-gray-400">
						Here's what's happening in your practice today.
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
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-4 w-4 text-green-400" />
							<span className="text-green-400">+12%</span>
							<span className="ml-1 text-gray-400">from yesterday</span>
						</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Patients Seen</p>
								<p className="font-bold text-2xl text-white">
									{todayStats.patients}
								</p>
							</div>
							<Users className="h-8 w-8 text-green-400" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-4 w-4 text-green-400" />
							<span className="text-green-400">+8%</span>
							<span className="ml-1 text-gray-400">from yesterday</span>
						</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Today's Revenue</p>
								<p className="font-bold text-2xl text-white">
									${todayStats.revenue.toLocaleString()}
								</p>
							</div>
							<DollarSign className="h-8 w-8 text-yellow-400" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-4 w-4 text-green-400" />
							<span className="text-green-400">+15%</span>
							<span className="ml-1 text-gray-400">from yesterday</span>
						</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Procedures</p>
								<p className="font-bold text-2xl text-white">
									{todayStats.procedures}
								</p>
							</div>
							<FileText className="h-8 w-8 text-purple-400" />
						</div>
						<div className="mt-2 flex items-center text-sm">
							<TrendingUp className="mr-1 h-4 w-4 text-green-400" />
							<span className="text-green-400">+5%</span>
							<span className="ml-1 text-gray-400">from yesterday</span>
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Today's Appointments */}
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Today's Appointments</h2>
							<button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-sm transition-colors hover:bg-blue-700">
								<Plus className="mr-2 h-4 w-4" />
								New Appointment
							</button>
						</div>
						<div className="space-y-4">
							{upcomingAppointments.map((appointment) => (
								<div
									key={appointment.id}
									className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
								>
									<div className="flex items-center space-x-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
											<Clock className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{appointment.patient}</p>
											<p className="text-gray-400 text-sm">
												{appointment.procedure}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">{appointment.time}</p>
										<span
											className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${
												appointment.status === "confirmed"
													? "bg-green-600 text-white"
													: "bg-yellow-600 text-white"
											}`}
										>
											{appointment.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Recent Patients */}
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Recent Patients</h2>
							<Link
								href="/patients"
								className="font-medium text-blue-400 text-sm hover:text-blue-300"
							>
								View All
							</Link>
						</div>
						<div className="space-y-4">
							{recentPatients.map((patient) => (
								<div
									key={patient.id}
									className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
								>
									<div className="flex items-center space-x-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600">
											<Users className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{patient.name}</p>
											<p className="text-gray-400 text-sm">
												Last visit: {patient.lastVisit}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-gray-300 text-sm">
											Next: {patient.nextAppointment}
										</p>
										<span
											className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${
												patient.status === "active"
													? "bg-green-600 text-white"
													: "bg-orange-600 text-white"
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

				{/* Quick Actions */}
				<div className="mt-8 rounded-lg bg-gray-800 p-6">
					<h2 className="mb-6 font-semibold text-xl">Quick Actions</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Calendar className="mb-2 h-8 w-8 text-blue-400" />
							<span className="font-medium text-sm">Schedule Appointment</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Users className="mb-2 h-8 w-8 text-green-400" />
							<span className="font-medium text-sm">Add Patient</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<FileText className="mb-2 h-8 w-8 text-purple-400" />
							<span className="font-medium text-sm">Create Treatment Plan</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<BarChart3 className="mb-2 h-8 w-8 text-yellow-400" />
							<span className="font-medium text-sm">View Reports</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
