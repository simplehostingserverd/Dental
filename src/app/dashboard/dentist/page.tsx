"use client";

import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
	Activity,
	CheckCircle,
	Phone,
	MessageSquare
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
	procedure: string;
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

export default function DentistDashboard() {
	const router = useRouter();
	const [practiceUser, setPracticeUser] = useState<PracticeUser | null>(null);
	const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.title = "Cognident - Dentist Dashboard";

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
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	const todayStats = [
		{ title: "Today's Patients", value: recentAppointments.length, icon: Users, color: "text-blue-600" },
		{ title: "Completed", value: recentAppointments.filter(a => a.status === "completed").length, icon: CheckCircle, color: "text-green-600" },
		{ title: "Pending", value: recentAppointments.filter(a => a.status === "scheduled").length, icon: Clock, color: "text-orange-600" },
		{ title: "Revenue", value: "$2,450", icon: DollarSign, color: "text-purple-600" }
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Navigation Header */}
			<nav className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<HeaderLogo className="text-blue-600" />
							</Link>
							<div className="hidden md:block ml-6">
								<div className="flex items-baseline space-x-4">
									<Link href="/dashboard/dentist" className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
										Dashboard
									</Link>
									<Link href="/dashboard/appointments" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Appointments
									</Link>
									<Link href="/dashboard/patients" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Patients
									</Link>
									<Link href="/dashboard/treatments" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Treatments
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
						Welcome back, Dr. {practiceUser?.firstName}
					</h1>
					<p className="mt-2 text-gray-600">Here's what's happening at your practice today.</p>
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
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						<Link href="/dashboard/appointments/new">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-200 hover:bg-blue-50">
								<Calendar className="h-6 w-6 text-blue-600" />
								<span className="text-sm">New Appointment</span>
							</Button>
						</Link>
						<Link href="/dashboard/patients/new">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-200 hover:bg-green-50">
								<Users className="h-6 w-6 text-green-600" />
								<span className="text-sm">Add Patient</span>
							</Button>
						</Link>
						<Link href="/dashboard/treatments">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-purple-200 hover:bg-purple-50">
								<Activity className="h-6 w-6 text-purple-600" />
								<span className="text-sm">Treatment Plans</span>
							</Button>
						</Link>
						<Link href="/dashboard/reports">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-orange-200 hover:bg-orange-50">
								<FileText className="h-6 w-6 text-orange-600" />
								<span className="text-sm">Reports</span>
							</Button>
						</Link>
						<Link href="/dashboard/billing">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-indigo-200 hover:bg-indigo-50">
								<DollarSign className="h-6 w-6 text-indigo-600" />
								<span className="text-sm">Billing</span>
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

				{/* Main Dashboard Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Today's Schedule */}
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
													{appointment.procedure || "General Consultation"}
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

					{/* Practice Tools */}
					<Card className="bg-white border-gray-200">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Activity className="h-5 w-5" />
								Practice Management
							</CardTitle>
							<CardDescription>
								Essential tools and resources
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Link href="/dashboard/patients">
									<Button variant="outline" className="w-full justify-start">
										<Users className="h-4 w-4 mr-2" />
										Patient Records
									</Button>
								</Link>
								<Link href="/dashboard/treatments">
									<Button variant="outline" className="w-full justify-start">
										<Activity className="h-4 w-4 mr-2" />
										Treatment Plans
									</Button>
								</Link>
								<Link href="/dashboard/billing">
									<Button variant="outline" className="w-full justify-start">
										<DollarSign className="h-4 w-4 mr-2" />
										Billing & Insurance
									</Button>
								</Link>
								<Link href="/dashboard/reports">
									<Button variant="outline" className="w-full justify-start">
										<FileText className="h-4 w-4 mr-2" />
										Analytics & Reports
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
