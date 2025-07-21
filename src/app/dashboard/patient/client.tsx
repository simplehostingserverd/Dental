"use client";

import {
	AlertCircle,
	Bell,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	FileText,
	Heart,
	LogOut,
	Phone,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PatientUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role?: string;
	type: string;
	patientId?: string;
}

interface PatientDashboardClientProps {
	user: PatientUser;
}

export default function PatientDashboardClient({
	user,
}: PatientDashboardClientProps) {
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString(),
	);

	useEffect(() => {
		document.title = "Cognident - Patient Portal";
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

	// Use actual user data
	const patientInfo = {
		name: `${user.firstName} ${user.lastName}`,
		email: user.email,
		phone: "(555) 123-4567", // This would come from user profile in real app
		dateOfBirth: "1985-06-15", // This would come from user profile in real app
		lastVisit: "2024-01-15", // This would come from appointments data in real app
	};

	const upcomingAppointments = [
		{
			id: 1,
			date: "2024-02-15",
			time: "10:00 AM",
			procedure: "Regular Cleaning",
			doctor: "Dr. Smith",
			status: "confirmed",
		},
		{
			id: 2,
			date: "2024-03-20",
			time: "2:00 PM",
			procedure: "Crown Placement",
			doctor: "Dr. Smith",
			status: "pending",
		},
	];

	const recentTreatments = [
		{
			id: 1,
			date: "2024-01-15",
			procedure: "Dental Cleaning",
			doctor: "Dr. Smith",
			status: "completed",
		},
		{
			id: 2,
			date: "2023-12-10",
			procedure: "Cavity Filling",
			doctor: "Dr. Smith",
			status: "completed",
		},
		{
			id: 3,
			date: "2023-11-05",
			procedure: "X-Ray",
			doctor: "Dr. Smith",
			status: "completed",
		},
	];

	const bills = [
		{
			id: 1,
			date: "2024-01-15",
			amount: 150,
			description: "Dental Cleaning",
			status: "paid",
		},
		{
			id: 2,
			date: "2024-01-15",
			amount: 75,
			description: "X-Ray",
			status: "paid",
		},
		{
			id: 3,
			date: "2023-12-10",
			amount: 200,
			description: "Cavity Filling",
			status: "pending",
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
							<span className="ml-4 text-gray-400">Patient Portal</span>
						</div>
						<div className="flex items-center space-x-4">
							<button className="relative p-2 text-gray-400 hover:text-white">
								<Bell className="h-5 w-5" />
								<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
							</button>
							<button
								onClick={handleLogout}
								className="p-2 text-gray-400 transition-colors hover:text-red-400"
								title="Logout"
							>
								<LogOut className="h-5 w-5" />
							</button>
							<div className="flex items-center space-x-2">
								<User className="h-5 w-5 text-gray-400" />
								<span className="text-gray-400 text-sm">
									{patientInfo.name}
								</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-3xl">
						Welcome back, {patientInfo.name}
					</h1>
					<p className="text-gray-400">
						Manage your dental health and appointments.
					</p>
				</div>

				{/* Quick Stats */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Next Appointment</p>
								<p className="font-bold text-white text-xl">Feb 15, 2024</p>
								<p className="text-gray-400 text-sm">10:00 AM - Cleaning</p>
							</div>
							<Calendar className="h-8 w-8 text-blue-400" />
						</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Last Visit</p>
								<p className="font-bold text-white text-xl">Jan 15, 2024</p>
								<p className="text-gray-400 text-sm">Cleaning completed</p>
							</div>
							<CheckCircle className="h-8 w-8 text-green-400" />
						</div>
					</div>

					<div className="rounded-lg bg-gray-800 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Outstanding Balance</p>
								<p className="font-bold text-white text-xl">$200.00</p>
								<p className="text-gray-400 text-sm">1 pending payment</p>
							</div>
							<CreditCard className="h-8 w-8 text-yellow-400" />
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Upcoming Appointments */}
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Upcoming Appointments</h2>
							<button className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm transition-colors hover:bg-blue-700">
								Book Appointment
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
											<Calendar className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{appointment.procedure}</p>
											<p className="text-gray-400 text-sm">
												{appointment.doctor}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">{appointment.date}</p>
										<p className="text-gray-400 text-sm">{appointment.time}</p>
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

					{/* Recent Treatments */}
					<div className="rounded-lg bg-gray-800 p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-semibold text-xl">Treatment History</h2>
							<Link
								href="/treatments"
								className="font-medium text-blue-400 text-sm hover:text-blue-300"
							>
								View All
							</Link>
						</div>
						<div className="space-y-4">
							{recentTreatments.map((treatment) => (
								<div
									key={treatment.id}
									className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
								>
									<div className="flex items-center space-x-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
											<FileText className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{treatment.procedure}</p>
											<p className="text-gray-400 text-sm">
												{treatment.doctor}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-gray-300 text-sm">{treatment.date}</p>
										<span className="inline-flex rounded-full bg-green-600 px-2 py-1 font-semibold text-white text-xs">
											{treatment.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Billing Section */}
				<div className="mt-8 rounded-lg bg-gray-800 p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-semibold text-xl">Billing & Payments</h2>
						<button className="rounded-md bg-green-600 px-4 py-2 font-medium text-sm transition-colors hover:bg-green-700">
							Make Payment
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-gray-700 border-b">
									<th className="px-4 py-3 text-left font-medium text-gray-400 text-sm">
										Date
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-400 text-sm">
										Description
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-400 text-sm">
										Amount
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-400 text-sm">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{bills.map((bill) => (
									<tr key={bill.id} className="border-gray-700 border-b">
										<td className="px-4 py-3 text-sm">{bill.date}</td>
										<td className="px-4 py-3 text-sm">{bill.description}</td>
										<td className="px-4 py-3 font-medium text-sm">
											${bill.amount}
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${
													bill.status === "paid"
														? "bg-green-600 text-white"
														: "bg-yellow-600 text-white"
												}`}
											>
												{bill.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8 rounded-lg bg-gray-800 p-6">
					<h2 className="mb-6 font-semibold text-xl">Quick Actions</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Calendar className="mb-2 h-8 w-8 text-blue-400" />
							<span className="font-medium text-sm">Book Appointment</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<FileText className="mb-2 h-8 w-8 text-green-400" />
							<span className="font-medium text-sm">View Records</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<CreditCard className="mb-2 h-8 w-8 text-yellow-400" />
							<span className="font-medium text-sm">Pay Bill</span>
						</button>
						<button className="flex flex-col items-center rounded-lg bg-gray-700 p-4 transition-colors hover:bg-gray-600">
							<Phone className="mb-2 h-8 w-8 text-purple-400" />
							<span className="font-medium text-sm">Contact Office</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
