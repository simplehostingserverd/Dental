"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	Activity,
	AlertCircle,
	Bell,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	Heart,
	MessageSquare,
	Phone,
	Settings,
	Upload,
	User,
	Users,
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
	const [upcomingAppointments, setUpcomingAppointments] = useState<
		Appointment[]
	>([]);
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
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-purple-600 border-b-2" />
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	const healthStats = [
		{
			title: "Upcoming Appointments",
			value: upcomingAppointments.length,
			icon: Calendar,
			color: "text-blue-600",
		},
		{ title: "Health Score", value: "85%", icon: Heart, color: "text-red-600" },
		{
			title: "Last Visit",
			value: "2 weeks ago",
			icon: Activity,
			color: "text-green-600",
		},
		{
			title: "Next Cleaning",
			value: "3 months",
			icon: CheckCircle,
			color: "text-purple-600",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
			{/* Navigation Header */}
			<nav className="border-gray-200 border-b bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<HeaderLogo className="text-purple-600" />
							</Link>
							<div className="ml-6 hidden md:block">
								<div className="flex items-baseline space-x-4">
									<Link
										href="/dashboard/patient"
										className="rounded-md bg-purple-100 px-3 py-2 font-medium text-purple-700 text-sm"
									>
										Dashboard
									</Link>
									<Link
										href="/dashboard/appointments"
										className="rounded-md px-3 py-2 font-medium text-gray-500 text-sm hover:text-gray-700"
									>
										Appointments
									</Link>
									<Link
										href="/dashboard/health"
										className="rounded-md px-3 py-2 font-medium text-gray-500 text-sm hover:text-gray-700"
									>
										Health Records
									</Link>
									<Link
										href="/dashboard/billing"
										className="rounded-md px-3 py-2 font-medium text-gray-500 text-sm hover:text-gray-700"
									>
										Billing
									</Link>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-500 text-sm">
								{new Date().toLocaleDateString("en-US", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
							<Link
								href="/dashboard/settings"
								className="rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-200"
							>
								Settings
							</Link>
							<button
								onClick={handleLogout}
								className="rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700"
							>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-gray-900">
						Welcome back, {user.firstName}
					</h1>
					<p className="mt-2 text-gray-600">
						Manage your dental health and appointments.
					</p>
				</div>

				{/* Health Stats Overview */}
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{healthStats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<Card key={index} className="border-gray-200 bg-white">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-600 text-sm">
												{stat.title}
											</p>
											<p className="font-bold text-2xl text-gray-900">
												{stat.value}
											</p>
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
					<h2 className="mb-4 font-semibold text-gray-900 text-xl">
						Quick Actions
					</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
						<Link href="/dashboard/appointments/book">
							<Button
								variant="outline"
								className="flex h-20 w-full flex-col gap-2 border-blue-200 hover:bg-blue-50"
							>
								<Calendar className="h-6 w-6 text-blue-600" />
								<span className="text-sm">Book Appointment</span>
							</Button>
						</Link>
						<Link href="/dashboard/health">
							<Button
								variant="outline"
								className="flex h-20 w-full flex-col gap-2 border-green-200 hover:bg-green-50"
							>
								<Heart className="h-6 w-6 text-green-600" />
								<span className="text-sm">Health Records</span>
							</Button>
						</Link>
						<Link href="/dashboard/prescriptions">
							<Button
								variant="outline"
								className="flex h-20 w-full flex-col gap-2 border-purple-200 hover:bg-purple-50"
							>
								<FileText className="h-6 w-6 text-purple-600" />
								<span className="text-sm">Prescriptions</span>
							</Button>
						</Link>
						<Link href="/dashboard/billing">
							<Button
								variant="outline"
								className="flex h-20 w-full flex-col gap-2 border-orange-200 hover:bg-orange-50"
							>
								<CreditCard className="h-6 w-6 text-orange-600" />
								<span className="text-sm">Billing</span>
							</Button>
						</Link>
						<Link href="/dashboard/communication">
							<Button
								variant="outline"
								className="flex h-20 w-full flex-col gap-2 border-red-200 hover:bg-red-50"
							>
								<MessageSquare className="h-6 w-6 text-red-600" />
								<span className="text-sm">Messages</span>
							</Button>
						</Link>
						<Link href="/dashboard/settings">
							<Button
								variant="outline"
								className="flex h-20 w-full flex-col gap-2 border-gray-200 hover:bg-gray-50"
							>
								<Settings className="h-6 w-6 text-gray-600" />
								<span className="text-sm">Settings</span>
							</Button>
						</Link>
					</div>
				</div>
				{/* Upcoming Appointments and Patient Information */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card className="border-gray-200 bg-white">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<Calendar className="h-5 w-5" />
								Upcoming Appointments
							</CardTitle>
							<CardDescription>Your scheduled dental visits</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingAppointments.length > 0 ? (
									upcomingAppointments.map((appointment) => (
										<div
											key={appointment.id}
											className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
										>
											<div>
												<div className="font-medium text-gray-900">
													Dr. {appointment.practiceUser.firstName}{" "}
													{appointment.practiceUser.lastName}
												</div>
												<div className="text-gray-600 text-sm">
													{appointment.practice.name}
												</div>
												<div className="text-gray-500 text-xs">
													{appointment.practice.address}
												</div>
											</div>
											<div className="text-right">
												<div className="font-medium text-blue-600">
													{appointment.start.toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
													})}
												</div>
												<div className="text-gray-600 text-sm">
													{appointment.start.toLocaleTimeString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</div>
												<Badge
													variant="outline"
													className="border-green-600 text-green-600 text-xs"
												>
													{appointment.status}
												</Badge>
											</div>
										</div>
									))
								) : (
									<div className="py-8 text-center text-gray-500">
										<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
										<p>No upcoming appointments</p>
										<Link href="/dashboard/appointments/book">
											<Button className="mt-4">Book an Appointment</Button>
										</Link>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					<Card className="border-gray-200 bg-white">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-gray-800">
								<User className="h-5 w-5" />
								Patient Information
							</CardTitle>
							<CardDescription>Your personal details</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h4 className="mb-2 font-semibold text-gray-800">
										Personal Details
									</h4>
									<div className="space-y-1 text-sm">
										<div>
											👤 {user.firstName} {user.lastName}
										</div>
										<div>📧 {user.email}</div>
										<div>📞 {user.phone || "Not provided"}</div>
										<div>
											🎂{" "}
											{user.dateOfBirth
												? new Date(user.dateOfBirth).toLocaleDateString()
												: "Not provided"}
										</div>
									</div>
								</div>
								{user.emergencyContact && (
									<div>
										<h4 className="mb-2 font-semibold text-gray-800">
											Emergency Contact
										</h4>
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
					<p>
						Secure and private health information | Support:
						support@cognident.org
					</p>
				</div>
			</main>
		</div>
	);
}
