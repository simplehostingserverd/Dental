"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { AppointmentActions } from "@/components/patient/appointment-actions";
import {
	Calendar,
	Clock,
	FileText,
	LogOut,
	MessageSquare,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PatientData {
	id: string;
	firstName: string;
	lastName: string;
	appointments: Array<{
		id: string;
		start: string;
		appointmentType: string;
		practiceUser: {
			firstName: string;
			lastName: string;
		};
	}>;
	messages: Array<{
		id: string;
		content: string;
		timestamp: string;
		sender: {
			firstName: string;
			lastName: string;
		};
	}>;
}

interface UserData {
	id: string;
	firstName: string;
	lastName: string;
	type: string;
}

export default function PatientDashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<UserData | null>(null);
	const [patient, setPatient] = useState<PatientData | null>(null);
	const [stats, setStats] = useState({
		totalAppointments: 0,
		nextAppointment: null as string | null,
		lastAppointment: null as string | null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch user data
				const userResponse = await fetch("/api/auth/me");
				if (!userResponse.ok) {
					router.push("/patient/auth/signin");
					return;
				}
				const userData = await userResponse.json();

				if (userData.type !== "patient") {
					router.push("/patient/auth/signin");
					return;
				}

				setUser(userData);

				// Fetch patient dashboard data
				const dashboardResponse = await fetch("/api/patient/dashboard");
				if (!dashboardResponse.ok) {
					// If dashboard fetch fails, user might be logged out
					router.push("/patient/auth/signin");
					return;
				}
				const dashboardData = await dashboardResponse.json();
				setPatient(dashboardData.patient);
				setStats(dashboardData.stats);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				router.push("/patient/auth/signin");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router]);

	const handleAppointmentUpdate = () => {
		// Refresh the dashboard data
		window.location.reload();
	};

	const handleLogout = async () => {
		try {
			// Call logout API
			await fetch("/api/auth/patient/logout", {
				method: "POST",
			});

			// Redirect to login page
			router.push("/patient/auth/signin");
		} catch (error) {
			console.error("Error logging out:", error);
			// Still redirect even if API call fails
			router.push("/patient/auth/signin");
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
					<p className="mt-4 text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (!user || !patient) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<ToothIcon className="mr-3 h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-gray-900 text-xl">
								DentalExpresso
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-700 text-sm">
								Welcome, {user.firstName} {user.lastName}
							</span>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-medium text-sm text-white">
								{user.firstName.charAt(0)}
								{user.lastName.charAt(0)}
							</div>
							<button
								onClick={handleLogout}
								className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm hover:bg-gray-50"
								title="Logout"
							>
								<LogOut className="h-4 w-4" />
								<span>Logout</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h2 className="font-bold text-2xl text-gray-900">
						Patient Dashboard
					</h2>
					<p className="mt-1 text-gray-600">
						Manage your appointments, view treatment history, and communicate
						with your dental team.
					</p>
				</div>

				{/* Quick Actions */}
				<div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
								<Calendar className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<h3 className="font-medium text-gray-900">Book Appointment</h3>
								<p className="text-gray-500 text-sm">
									Schedule your next visit
								</p>
							</div>
						</div>
						<Link href="/patient/appointments/book">
							<button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700">
								Book Now
							</button>
						</Link>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
								<FileText className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<h3 className="font-medium text-gray-900">Treatment History</h3>
								<p className="text-gray-500 text-sm">View past treatments</p>
							</div>
						</div>
						<Link href="/patient/history">
							<button className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700">
								View History
							</button>
						</Link>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
								<MessageSquare className="h-6 w-6 text-purple-600" />
							</div>
							<div className="ml-4">
								<h3 className="font-medium text-gray-900">Messages</h3>
								<p className="text-gray-500 text-sm">
									Contact your dental team
								</p>
							</div>
						</div>
						<Link href="/patient/messages">
							<button className="mt-4 w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-sm text-white hover:bg-purple-700">
								Send Message
							</button>
						</Link>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
								<User className="h-6 w-6 text-orange-600" />
							</div>
							<div className="ml-4">
								<h3 className="font-medium text-gray-900">Profile</h3>
								<p className="text-gray-500 text-sm">Update your information</p>
							</div>
						</div>
						<Link href="/patient/profile">
							<button className="mt-4 w-full rounded-md bg-orange-600 px-4 py-2 font-medium text-sm text-white hover:bg-orange-700">
								Edit Profile
							</button>
						</Link>
					</div>
				</div>

				{/* Main Dashboard Content */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Upcoming Appointments */}
					<div className="lg:col-span-2">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-semibold text-gray-900 text-lg">
									Upcoming Appointments
								</h3>
								<button className="text-blue-600 text-sm hover:text-blue-500">
									View All
								</button>
							</div>
							<div className="space-y-4">
								{patient.appointments.length > 0 ? (
									patient.appointments.map((appointment) => (
										<div
											key={appointment.id}
											className="flex items-center rounded-lg border border-gray-200 p-4"
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
												<Calendar className="h-6 w-6 text-blue-600" />
											</div>
											<div className="ml-4 flex-1">
												<h4 className="font-medium text-gray-900">
													{appointment.appointmentType || "Appointment"}
												</h4>
												<p className="text-gray-500 text-sm">
													{appointment.practiceUser.firstName}{" "}
													{appointment.practiceUser.lastName} •{" "}
													{new Date(appointment.start).toLocaleDateString()} at{" "}
													{new Date(appointment.start).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											<AppointmentActions
												appointmentId={appointment.id}
												onUpdate={handleAppointmentUpdate}
											/>
										</div>
									))
								) : (
									<div className="flex items-center justify-center py-8">
										<div className="text-center">
											<Clock className="mx-auto h-12 w-12 text-gray-400" />
											<h4 className="mt-2 font-medium text-gray-900">
												No upcoming appointments
											</h4>
											<p className="text-gray-500 text-sm">
												Book your next appointment to maintain your oral health
											</p>
											<Link href="/patient/appointments/book">
												<button className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700">
													Book Appointment
												</button>
											</Link>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Recent Messages */}
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-semibold text-gray-900 text-lg">
									Recent Messages
								</h3>
								<button className="text-blue-600 text-sm hover:text-blue-500">
									View All
								</button>
							</div>
							<div className="space-y-3">
								{patient.messages.length > 0 ? (
									patient.messages.map((message) => (
										<div
											key={message.id}
											className="flex items-start space-x-3"
										>
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-medium text-white text-xs">
												{message.sender.firstName.charAt(0)}
												{message.sender.lastName.charAt(0)}
											</div>
											<div className="flex-1">
												<p className="font-medium text-gray-900 text-sm">
													{message.sender.firstName} {message.sender.lastName}
												</p>
												<p className="text-gray-500 text-xs">
													{message.content}
												</p>
												<p className="text-gray-400 text-xs">
													{new Date(message.timestamp).toLocaleDateString()}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="text-center">
										<p className="text-gray-500 text-sm">No messages yet</p>
										<Link href="/patient/messages">
											<button className="mt-2 text-blue-600 text-sm hover:text-blue-500">
												Send a message
											</button>
										</Link>
									</div>
								)}
							</div>
						</div>

						{/* Quick Stats */}
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<h3 className="mb-4 font-semibold text-gray-900 text-lg">
								Your Stats
							</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">
										Next Appointment
									</span>
									<span className="font-medium text-gray-900 text-sm">
										{stats.nextAppointment
											? new Date(stats.nextAppointment).toLocaleDateString()
											: "None scheduled"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Last Visit</span>
									<span className="font-medium text-gray-900 text-sm">
										{stats.lastAppointment
											? new Date(stats.lastAppointment).toLocaleDateString()
											: "No visits yet"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Total Visits</span>
									<span className="font-medium text-gray-900 text-sm">
										{stats.totalAppointments}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
