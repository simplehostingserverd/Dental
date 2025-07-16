import { DollarSign, FileText, UserPlus, Users } from "lucide-react";

const stats = [
	{
		name: "Today's Patients",
		value: "12",
		change: "+2 from yesterday",
		icon: Users,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	{
		name: "Pending Treatments",
		value: "8",
		change: "3 require follow-up",
		icon: FileText,
		color: "text-green-600",
		bgColor: "bg-green-50",
	},
	{
		name: "Unpaid Invoices",
		value: "$4,320",
		change: "5 invoices pending",
		icon: DollarSign,
		color: "text-yellow-600",
		bgColor: "bg-yellow-50",
	},
	{
		name: "New Patient Requests",
		value: "3",
		change: "Needs approval",
		icon: UserPlus,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
	},
];

export function StatsCards() {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<div
					key={stat.name}
					className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
				>
					<div className="flex items-center">
						<div className={`rounded-lg p-2 ${stat.bgColor}`}>
							<stat.icon className={`h-6 w-6 ${stat.color}`} />
						</div>
						<div className="ml-4 flex-1">
							<p className="font-medium text-gray-600 text-sm">
								{stat.name}
							</p>
							<p className="font-semibold text-2xl text-gray-900">
								{stat.value}
							</p>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-gray-500 text-sm">
							{stat.change}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
