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
	DollarSign,
	User,
	Heart,
	Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Appointment {
	id: string;
	start: Date;
	status: string;
	practiceUser: {
		firstName: string;
		lastName: string;
	};
	practice: {
		name: string;
		address: string;
		phone: string;
	};
}

interface PatientUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role?: string;
	type: string;
	patientId?: string;
	phone?: string;
	dateOfBirth?: string;
	emergencyContact?: {
		name: string;
		phone: string;
		relationship: string;
	};
}

interface PatientDashboardClientProps {
	user: PatientUser;
}

export default function PatientDashboardClient({
	user,
}: PatientDashboardClientProps) {
	const router = useRouter();
	const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.title = "Cognident - Patient Portal";

		const fetchAppointments = async () => {
			try {
				const response = await fetch("/api/appointments/upcoming");
				if (response.ok) {
					const data = await response.json();
					setUpcomingAppointments(data.appointments || []);
				}
			} catch (error) {
				console.error("Error fetching appointments:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
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
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	const healthStats = [
		{ title: "Upcoming Appointments", value: upcomingAppointments.length, icon: Calendar, color: "text-blue-600" },
		{ title: "Health Score", value: "85%", icon: Heart, color: "text-red-600" },
		{ title: "Last Visit", value: "2 weeks ago", icon: Activity, color: "text-green-600" },
		{ title: "Next Cleaning", value: "3 months", icon: CheckCircle, color: "text-purple-600" }
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
			{/* Navigation Header */}
			<nav className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<HeaderLogo className="text-purple-600" />
							</Link>
							<div className="hidden md:block ml-6">
								<div className="flex items-baseline space-x-4">
									<Link href="/dashboard/patient" className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md text-sm font-medium">
										Dashboard
									</Link>
									<Link href="/dashboard/appointments" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Appointments
									</Link>
									<Link href="/dashboard/health" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
										Health Records
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
						Welcome back, {user.firstName}
					</h1>
					<p className="mt-2 text-gray-600">Manage your dental health and appointments.</p>
				</div>

				{/* Health Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{healthStats.map((stat, index) => {
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
						<Link href="/dashboard/appointments/book">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-blue-200 hover:bg-blue-50">
								<Calendar className="h-6 w-6 text-blue-600" />
								<span className="text-sm">Book Appointment</span>
							</Button>
						</Link>
						<Link href="/dashboard/health">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-green-200 hover:bg-green-50">
								<Heart className="h-6 w-6 text-green-600" />
								<span className="text-sm">Health Records</span>
							</Button>
						</Link>
						<Link href="/dashboard/prescriptions">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-purple-200 hover:bg-purple-50">
								<FileText className="h-6 w-6 text-purple-600" />
								<span className="text-sm">Prescriptions</span>
							</Button>
						</Link>
						<Link href="/dashboard/billing">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-orange-200 hover:bg-orange-50">
								<CreditCard className="h-6 w-6 text-orange-600" />
								<span className="text-sm">Billing</span>
							</Button>
						</Link>
						<Link href="/dashboard/communication">
							<Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-red-200 hover:bg-red-50">
								<MessageSquare className="h-6 w-6 text-red-600" />
								<span className="text-sm">Messages</span>
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
				{/* Upcoming Appointments and Patient Information */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className="bg-white border-gray-200">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Calendar className="h-5 w-5" />
								Upcoming Appointments
							</CardTitle>
							<CardDescription>
								Your scheduled dental visits
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingAppointments.length > 0 ? (
									upcomingAppointments.map((appointment) => (
										<div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div>
												<div className="font-medium text-gray-900">
													Dr. {appointment.practiceUser.firstName} {appointment.practiceUser.lastName}
												</div>
												<div className="text-sm text-gray-600">
													{appointment.practice.name}
												</div>
												<div className="text-xs text-gray-500">
													{appointment.practice.address}
												</div>
											</div>
											<div className="text-right">
												<div className="font-medium text-blue-600">
													{appointment.start.toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric'
													})}
												</div>
												<div className="text-sm text-gray-600">
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
										<p>No upcoming appointments</p>
										<Link href="/dashboard/appointments/book">
											<Button className="mt-4">Book an Appointment</Button>
										</Link>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white border-gray-200">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<User className="h-5 w-5" />
								Patient Information
							</CardTitle>
							<CardDescription>
								Your personal details
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold mb-2 text-gray-800">Personal Details</h4>
									<div className="space-y-1 text-sm">
										<div>👤 {user.firstName} {user.lastName}</div>
										<div>📧 {user.email}</div>
										<div>📞 {user.phone || 'Not provided'}</div>
										<div>🎂 {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</div>
									</div>
								</div>
								{user.emergencyContact && (
									<div>
										<h4 className="font-semibold mb-2 text-gray-800">Emergency Contact</h4>
										<div className="space-y-1 text-sm">
											<div>👤 {user.emergencyContact.name}</div>
											<div>📞 {user.emergencyContact.phone}</div>
											<div>🔗 {user.emergencyContact.relationship}</div>
										</div>
									</div>
								)}
								<div className="pt-4">
									<Link href="/dashboard/settings">
										<Button variant="outline" className="w-full">
											Update Information
										</Button>
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center text-gray-500 text-sm">
					<p>🇺🇸 Patient Portal | Cognident</p>
					<p>Secure and private health information | Support: support@cognident.org</p>
				</div>
			</main>
		</div>
	);
}


