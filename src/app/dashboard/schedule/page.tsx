import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	Calendar, 
	Clock, 
	Plus, 
	ChevronLeft, 
	ChevronRight,
	User,
	MapPin,
	Phone
} from "lucide-react";
import Link from "next/link";

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
	"08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
	"11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
	"14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

export default function SchedulePage() {
	const currentDate = new Date();
	const dateString = currentDate.toLocaleDateString('en-US', { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	});

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
					<h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
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
					<Button variant="outline" size="sm">
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="flex items-center space-x-2">
						<Calendar className="h-5 w-5 text-gray-400" />
						<span className="text-lg font-medium">{dateString}</span>
					</div>
					<Button variant="outline" size="sm">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm">Day</Button>
					<Button variant="outline" size="sm">Week</Button>
					<Button variant="outline" size="sm">Month</Button>
				</div>
			</div>

			{/* Schedule Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Time Column */}
				<div className="lg:col-span-1">
					<div className="rounded-lg border bg-white p-4">
						<h3 className="font-medium text-gray-900 mb-4">Time Slots</h3>
						<div className="space-y-2">
							{timeSlots.map((time) => (
								<div key={time} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
									<span className="text-sm text-gray-600">{time}</span>
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
						<h3 className="font-medium text-gray-900 mb-4">Today's Appointments</h3>
						<div className="space-y-4">
							{appointments.map((appointment) => (
								<div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
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
											
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<div className="flex items-center space-x-2 mb-1">
														<User className="h-4 w-4 text-gray-400" />
														<span className="font-medium text-gray-900">
															{appointment.patient.name}
														</span>
													</div>
													<div className="flex items-center space-x-2 mb-1">
														<Phone className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-600">
															{appointment.patient.phone}
														</span>
													</div>
													<div className="flex items-center space-x-2">
														<MapPin className="h-4 w-4 text-gray-400" />
														<span className="text-sm text-gray-600">
															{appointment.room}
														</span>
													</div>
												</div>
												
												<div>
													<p className="font-medium text-gray-900 mb-1">
														{appointment.treatment}
													</p>
													<p className="text-sm text-gray-600 mb-1">
														Provider: {appointment.provider}
													</p>
													{appointment.notes && (
														<p className="text-sm text-gray-500 italic">
															{appointment.notes}
														</p>
													)}
												</div>
											</div>
										</div>
										
										<div className="flex space-x-2 ml-4">
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
							<div className="text-center py-8">
								<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">No appointments scheduled for today</p>
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

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="text-2xl font-bold text-blue-600">12</div>
					<div className="text-sm text-gray-600">Total Today</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="text-2xl font-bold text-green-600">8</div>
					<div className="text-sm text-gray-600">Completed</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="text-2xl font-bold text-yellow-600">3</div>
					<div className="text-sm text-gray-600">Pending</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="text-2xl font-bold text-red-600">1</div>
					<div className="text-sm text-gray-600">Cancelled</div>
				</div>
			</div>
		</div>
	);
}
