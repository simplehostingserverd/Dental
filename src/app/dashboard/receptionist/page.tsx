"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Calendar,
	Clock,
	Users,
	FileText,
	Settings,
	Phone,
	MessageSquare,
	CreditCard,
	Upload,
	Bell,
	CheckCircle,
	AlertCircle,
	DollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Appointment {
	id: string;
	patient: {
		firstName: string;
		lastName: string;
		phone: string;
	};
	start: Date;
	status: string;
	practiceUser: {
		firstName: string;
		lastName: string;
	};
}

interface PracticeUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	practice: {
		id: string;
		name: string;
		address: string;
		city: string;
		state: string;
		zipCode: string;
		phone: string;
		email: string;
		website: string;
		timezone: string;
	};
}

export default function ReceptionistDashboard() {
	const router = useRouter();
	const [practiceUser, setPracticeUser] = useState<PracticeUser | null>(null);
	const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [userResponse, appointmentsResponse] = await Promise.all([
					fetch("/api/auth/me"),
					fetch("/api/appointments/today")
				]);

				if (userResponse.ok) {
					const userData = await userResponse.json();
					setPracticeUser(userData.user);
				}

				if (appointmentsResponse.ok) {
					const appointmentsData = await appointmentsResponse.json();
					setRecentAppointments(appointmentsData.appointments || []);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", { method: "POST" });
			router.push("/auth/signin");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	};

	const todayStats = [
		{ title: "Today's Appointments", value: recentAppointments.length, icon: Calendar, color: "text-blue-600" },
		{ title: "Checked In", value: recentAppointments.filter(a => a.status === "checked-in").length, icon: CheckCircle, color: "text-green-600" },
		{ title: "Waiting", value: recentAppointments.filter(a => a.status === "waiting").length, icon: Clock, color: "text-orange-600" },
		{ title: "Completed", value: recentAppointments.filter(a => a.status === "completed").length, icon: Users, color: "text-purple-600" }
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
			{/* Navigation Header */}
			<nav className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<HeaderLogo className="text-green-600" />
							</Link>
							<div className="hidden md:block ml-6">
								<div className="flex items-baseline space-x-4">
									<Link href="/dashboard/receptionist" className="bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium">
										Dashboard
									</Link>
									<Link href="/dashboard/appointments" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Appointments
									</Link>
									<Link href="/dashboard/patients" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Patients
									</Link>
									<Link href="/dashboard/billing" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Billing
									</Link>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-500">
								{new Date().toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</span>
							<Link href="/dashboard/settings" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
								Settings
							</Link>
							<button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</nav>
			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Welcome, {practiceUser?.firstName}
					</h1>
					<p className="mt-2 text-gray-600">Manage appointments, patients, and front desk operations.</p>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{todayStats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<Card key={index} className="bg-white border-gray-200">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">{stat.title}</p>
											<p className="text-2xl font-bold text-gray-900">{stat.value}</p>
										</div>
										<IconComponent className={`h-8 w-8 ${stat.color}`} />
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Quick Actions */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						<Link href="/dashboard/appointments/new">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-200 hover:bg-blue-50">
								<Calendar className="h-6 w-6 text-blue-600" />
								<span className="text-sm">Schedule</span>
							</Button>
						</Link>
						<Link href="/dashboard/patients/new">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-200 hover:bg-green-50">
								<Users className="h-6 w-6 text-green-600" />
								<span className="text-sm">Add Patient</span>
							</Button>
						</Link>
						<Link href="/dashboard/check-in">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-purple-200 hover:bg-purple-50">
								<CheckCircle className="h-6 w-6 text-purple-600" />
								<span className="text-sm">Check In</span>
							</Button>
						</Link>
						<Link href="/dashboard/billing">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-orange-200 hover:bg-orange-50">
								<CreditCard className="h-6 w-6 text-orange-600" />
								<span className="text-sm">Billing</span>
							</Button>
						</Link>
						<Link href="/dashboard/data-import">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-red-200 hover:bg-red-50">
								<Upload className="h-6 w-6 text-red-600" />
								<span className="text-sm">Import Data</span>
							</Button>
						</Link>
						<Link href="/dashboard/settings">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-gray-200 hover:bg-gray-50">
								<Settings className="h-6 w-6 text-gray-600" />
								<span className="text-sm">Settings</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Today's Schedule and Communication Tools */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className="bg-white border-gray-200">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Clock className="h-5 w-5" />
								Today's Schedule
							</CardTitle>
							<CardDescription>
								Upcoming appointments
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentAppointments.length > 0 ? (
									recentAppointments.map((appointment) => (
										<div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div>
												<div className="font-medium text-gray-900">
													{appointment.patient.firstName} {appointment.patient.lastName}
												</div>
												<div className="text-sm text-gray-600">
													Dr. {appointment.practiceUser.firstName} {appointment.practiceUser.lastName}
												</div>
												<div className="text-xs text-gray-500">
													{appointment.patient.phone}
												</div>
											</div>
											<div className="text-right">
												<div className="font-medium text-blue-600">
													{appointment.start.toLocaleTimeString('en-US', {
														hour: '2-digit',
														minute: '2-digit'
													})}
												</div>
												<Badge variant="outline" className="border-green-600 text-green-600 text-xs">
													{appointment.status}
												</Badge>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-8 text-gray-500">
										<Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
										<p>No appointments scheduled for today</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white border-gray-200">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Phone className="h-5 w-5" />
								Communication Tools
							</CardTitle>
							<CardDescription>
								Patient communication management
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Link href="/dashboard/communication">
									<Button variant="outline" className="w-full justify-start">
										<MessageSquare className="h-4 w-4 mr-2" />
										Messages & WhatsApp
									</Button>
								</Link>
								<Link href="/dashboard/reminders">
									<Button variant="outline" className="w-full justify-start">
										<Bell className="h-4 w-4 mr-2" />
										Appointment Reminders
									</Button>
								</Link>
								<Link href="/dashboard/reports">
									<Button variant="outline" className="w-full justify-start">
										<FileText className="h-4 w-4 mr-2" />
										Reports & Analytics
									</Button>
								</Link>
								<Link href="/dashboard/settings">
									<Button variant="outline" className="w-full justify-start">
										<Settings className="h-4 w-4 mr-2" />
										Settings
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Practice Information */}
				<Card className="mt-6 bg-white border-gray-200">
					<CardHeader>
						<CardTitle className="text-gray-800">Practice Information</CardTitle>
						<CardDescription>
							Contact details and location
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<h4 className="font-semibold mb-2 text-gray-800">Contact</h4>
								<div className="space-y-1 text-sm">
									<div>📞 {practiceUser?.practice.phone}</div>
									<div>📧 {practiceUser?.practice.email}</div>
									<div>🌐 {practiceUser?.practice.website}</div>
								</div>
							</div>
							<div>
								<h4 className="font-semibold mb-2 text-gray-800">Location</h4>
								<div className="space-y-1 text-sm">
									<div>📍 {practiceUser?.practice.address}</div>
									<div>{practiceUser?.practice.city}, {practiceUser?.practice.state}</div>
									<div>ZIP: {practiceUser?.practice.zipCode}</div>
								</div>
							</div>
							<div>
								<h4 className="font-semibold mb-2 text-gray-800">System</h4>
								<div className="space-y-1 text-sm">
									<div>🆔 ID: {practiceUser?.practice.id}</div>
									<div>🕐 Timezone: {practiceUser?.practice.timezone}</div>
									<div>✅ Status: Active</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-gray-500 text-sm">
					<p>🇺🇸 Dental Practice Management System | Cognident</p>
					<p>Secure and isolated practice data | Support: support@cognident.org</p>
				</div>
			</main>
		</div>
	);
}









