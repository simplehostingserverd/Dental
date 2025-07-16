import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const appointments = [
	{
		id: 1,
		time: "9:00 AM - 10:00 AM",
		patient: {
			name: "Michael Johnson",
			avatar: "/placeholder-avatar.jpg",
			initials: "MJ",
		},
		type: "Check-up",
		status: "check-up",
		description: "Annual check-up",
	},
	{
		id: 2,
		time: "10:30 AM - 11:30 AM",
		patient: {
			name: "Emily Williams",
			avatar: "/placeholder-avatar.jpg",
			initials: "EW",
		},
		type: "Cleaning",
		status: "cleaning",
		description: "Regular cleaning",
	},
	{
		id: 3,
		time: "1:00 PM - 2:30 PM",
		patient: {
			name: "David Brown",
			avatar: "/placeholder-avatar.jpg",
			initials: "DB",
		},
		type: "Root Canal",
		status: "root-canal",
		description: "Root canal treatment",
	},
	{
		id: 4,
		time: "3:00 PM - 4:00 PM",
		patient: {
			name: "Sarah Miller",
			avatar: "/placeholder-avatar.jpg",
			initials: "SM",
		},
		type: "Consultation",
		status: "consultation",
		description: "Orthodontic consultation",
	},
	{
		id: 5,
		time: "4:30 PM - 5:30 PM",
		patient: {
			name: "James Wilson",
			avatar: "/placeholder-avatar.jpg",
			initials: "JW",
		},
		type: "Emergency",
		status: "emergency",
		description: "Tooth pain emergency",
	},
	{
		id: 6,
		time: "6:00 PM - 7:00 PM",
		patient: {
			name: "Jennifer Taylor",
			avatar: "/placeholder-avatar.jpg",
			initials: "JT",
		},
		type: "Cleaning",
		status: "cleaning",
		description: "Regular cleaning",
	},
];

const timeSlots = ["Morning", "Afternoon", "Evening"];

export function TodaysSchedule() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="border-gray-200 border-b px-6 py-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-gray-900 text-lg">
						Today's Schedule
					</h2>
					<div className="flex items-center space-x-2">
						<button type="button" className="rounded p-1 hover:bg-gray-100">
							<ChevronLeft className="h-4 w-4" />
						</button>
						<span className="font-medium text-sm">July 16, 2025</span>
						<button type="button" className="rounded p-1 hover:bg-gray-100">
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			<div className="p-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{timeSlots.map((timeSlot, index) => (
						<div key={timeSlot}>
							<h3 className="mb-4 font-medium text-gray-500 text-sm">
								{timeSlot}
							</h3>
							<div className="space-y-3">
								{appointments
									.filter((_, i) => {
										if (timeSlot === "Morning") return i < 2;
										if (timeSlot === "Afternoon") return i >= 2 && i < 4;
										return i >= 4;
									})
									.map((appointment) => (
										<div
											key={appointment.id}
											className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-sm"
										>
											<div className="flex items-start space-x-3">
												<Avatar className="h-8 w-8">
													<AvatarImage src={appointment.patient.avatar} />
													<AvatarFallback className="text-xs">
														{appointment.patient.initials}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<p className="truncate font-medium text-gray-900 text-sm">
														{appointment.patient.name}
													</p>
													<p className="text-gray-500 text-xs">
														{appointment.description}
													</p>
													<div className="mt-1 flex items-center">
														<span
															className={`inline-flex items-center rounded px-2 py-0.5 font-medium text-xs ${
																appointment.status === "emergency"
																	? "bg-red-100 text-red-800"
																	: appointment.status === "consultation"
																		? "bg-blue-100 text-blue-800"
																		: appointment.status === "cleaning"
																			? "bg-green-100 text-green-800"
																			: "bg-gray-100 text-gray-800"
															}`}
														>
															{appointment.type}
														</span>
													</div>
												</div>
											</div>
											<div className="mt-2 text-gray-500 text-xs">
												{appointment.time}
											</div>
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
