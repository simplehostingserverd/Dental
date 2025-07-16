import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const recentPatients = [
	{
		id: 1,
		name: "Michael Johnson",
		lastVisit: "July 12, 2025",
		avatar: "/placeholder-avatar.jpg",
		initials: "MJ",
	},
	{
		id: 2,
		name: "Emily Williams",
		lastVisit: "July 10, 2025",
		avatar: "/placeholder-avatar.jpg",
		initials: "EW",
	},
	{
		id: 3,
		name: "David Brown",
		lastVisit: "July 8, 2025",
		avatar: "/placeholder-avatar.jpg",
		initials: "DB",
	},
	{
		id: 4,
		name: "Sarah Miller",
		lastVisit: "July 5, 2025",
		avatar: "/placeholder-avatar.jpg",
		initials: "SM",
	},
];

export function RecentPatients() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="border-gray-200 border-b px-6 py-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-gray-900 text-lg">
						Recent Patients
					</h2>
					<Link
						href="/dashboard/patients"
						className="font-medium text-blue-600 text-sm hover:text-blue-700"
					>
						View All
					</Link>
				</div>
			</div>

			<div className="p-6">
				<div className="space-y-4">
					{recentPatients.map((patient) => (
						<div key={patient.id} className="flex items-center space-x-3">
							<Avatar className="h-10 w-10">
								<AvatarImage src={patient.avatar} />
								<AvatarFallback>{patient.initials}</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-gray-900 text-sm">
									{patient.name}
								</p>
								<p className="text-gray-500 text-sm">
									Last visit: {patient.lastVisit}
								</p>
							</div>
							<button type="button" className="rounded p-1 hover:bg-gray-100">
								<MoreHorizontal className="h-4 w-4 text-gray-400" />
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
