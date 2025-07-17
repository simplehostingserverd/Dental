"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Activity,
	AlertTriangle,
	Bell,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	MessageSquare,
	Phone,
	TrendingDown,
	TrendingUp,
	UserPlus,
	Users,
} from "lucide-react";

export default function ReceptionistDashboard() {
	const currentTime = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	// Mock data for dashboard
	const todayStats = {
		totalAppointments: 24,
		checkedIn: 8,
		waiting: 3,
		completed: 12,
		noShows: 1,
		revenue: 3250,
		newPatients: 2,
		pendingTasks: 5,
	};

	const upcomingAppointments = [
		{
			id: "1",
			time: "2:30 PM",
			patient: "Sarah Johnson",
			provider: "Dr. Smith",
			type: "Cleaning",
			status: "checked-in",
			phone: "(555) 123-4567",
		},
		{
			id: "2",
			time: "3:00 PM",
			patient: "Michael Chen",
			provider: "Dr. Johnson",
			type: "Consultation",
			status: "confirmed",
			phone: "(555) 234-5678",
		},
		{
			id: "3",
			time: "3:30 PM",
			patient: "Emily Davis",
			provider: "Dr. Smith",
			type: "Filling",
			status: "pending",
			phone: "(555) 345-6789",
		},
		{
			id: "4",
			time: "4:00 PM",
			patient: "David Wilson",
			provider: "Dr. Johnson",
			type: "Check-up",
			status: "late",
			phone: "(555) 456-7890",
		},
	];

	const pendingTasks = [
		{
			id: "1",
			task: "Verify insurance for Sarah Johnson",
			priority: "high",
			time: "10 min ago",
		},
		{
			id: "2",
			task: "Call Michael Chen for appointment confirmation",
			priority: "medium",
			time: "30 min ago",
		},
		{
			id: "3",
			task: "Process payment for Emily Davis",
			priority: "high",
			time: "1 hour ago",
		},
		{
			id: "4",
			task: "Upload documents for David Wilson",
			priority: "low",
			time: "2 hours ago",
		},
		{
			id: "5",
			task: "Send reminder to Lisa Brown",
			priority: "medium",
			time: "3 hours ago",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "checked-in":
				return "bg-green-100 text-green-800";
			case "confirmed":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "late":
				return "bg-red-100 text-red-800";
			case "completed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl text-gray-900">
						Good afternoon, Receptionist!
					</h1>
					<p className="text-gray-600">
						Here's what's happening at your practice today
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Button>
						<UserPlus className="mr-2 h-4 w-4" />
						New Patient
					</Button>
					<Button variant="outline">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Today's Appointments
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{todayStats.totalAppointments}
						</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+2</span> from yesterday
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Patients Waiting
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{todayStats.waiting}</div>
						<p className="text-muted-foreground text-xs">
							Average wait: 12 min
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Today's Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							${todayStats.revenue.toLocaleString()}
						</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+12%</span> from last week
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Pending Tasks</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{todayStats.pendingTasks}</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-red-600">2 urgent</span> tasks
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Upcoming Appointments */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Upcoming Appointments</span>
								<Badge variant="outline">
									{upcomingAppointments.length} remaining
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
									>
										<div className="flex items-center space-x-4">
											<div className="text-center">
												<div className="font-semibold text-gray-900 text-lg">
													{appointment.time}
												</div>
											</div>
											<div className="flex-1">
												<h3 className="font-medium text-gray-900">
													{appointment.patient}
												</h3>
												<div className="flex items-center space-x-2 text-gray-600 text-sm">
													<span>{appointment.provider}</span>
													<span>•</span>
													<span>{appointment.type}</span>
												</div>
												<div className="flex items-center text-gray-500 text-sm">
													<Phone className="mr-1 h-3 w-3" />
													{appointment.phone}
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Badge className={getStatusColor(appointment.status)}>
												{appointment.status.replace("-", " ")}
											</Badge>
											<Button variant="ghost" size="sm">
												<MessageSquare className="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="sm">
												<Phone className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Pending Tasks */}
					<Card>
						<CardHeader>
							<CardTitle>Pending Tasks</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{pendingTasks.slice(0, 5).map((task) => (
									<div key={task.id} className="flex items-start space-x-3">
										<div className="flex-1">
											<p className="font-medium text-gray-900 text-sm">
												{task.task}
											</p>
											<div className="flex items-center space-x-2">
												<Badge
													variant="outline"
													className={getPriorityColor(task.priority)}
												>
													{task.priority}
												</Badge>
												<span className="text-gray-500 text-xs">
													{task.time}
												</span>
											</div>
										</div>
										<Button variant="ghost" size="sm">
											<CheckCircle className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button variant="outline" className="w-full justify-start">
									<Calendar className="mr-2 h-4 w-4" />
									Book Appointment
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<CreditCard className="mr-2 h-4 w-4" />
									Process Payment
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<Bell className="mr-2 h-4 w-4" />
									Send Reminder
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<FileText className="mr-2 h-4 w-4" />
									Print Schedule
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
