"use client";

import { Button } from "@/components/ui/button";
import {
	BarChart3,
	Bell,
	Calendar,
	CheckSquare,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	Home,
	MessageSquare,
	Phone,
	Search,
	Settings,
	Share2,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
	{ key: "dashboard", href: "/receptionist", icon: Home, label: "Dashboard" },
	{
		key: "appointments",
		href: "/receptionist/appointments",
		icon: Calendar,
		label: "Appointments",
	},
	{
		key: "patients",
		href: "/receptionist/patients",
		icon: Users,
		label: "Patients",
	},
	{
		key: "communication",
		href: "/receptionist/communication",
		icon: MessageSquare,
		label: "Communication",
	},
	{
		key: "billing",
		href: "/receptionist/billing",
		icon: CreditCard,
		label: "Billing & Payments",
	},
	{
		key: "documents",
		href: "/receptionist/documents",
		icon: FileText,
		label: "Documents",
	},
	{
		key: "tasks",
		href: "/receptionist/tasks",
		icon: CheckSquare,
		label: "Tasks & Workflow",
	},
	{
		key: "quick-actions",
		href: "/receptionist/quick-actions",
		icon: Clock,
		label: "Quick Actions",
	},
	{
		key: "reports",
		href: "/receptionist/reports",
		icon: BarChart3,
		label: "Reports",
	},
	{
		key: "marketing",
		href: "/receptionist/marketing",
		icon: Share2,
		label: "Marketing",
	},
	{
		key: "calendar-demo",
		href: "/receptionist/calendar-demo",
		icon: Calendar,
		label: "Calendar Demo",
	},
	{
		key: "settings",
		href: "/receptionist/settings",
		icon: Settings,
		label: "Settings",
	},
];

export function ReceptionistSidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-full w-64 flex-col dashboard-sidebar">
			{/* Logo */}
			<div className="flex items-center justify-between border-slate-700 border-b px-6 py-6">
				<div className="flex items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
						<Calendar className="h-6 w-6 text-white" />
					</div>
					<span className="ml-3 font-bold text-white text-xl">
						Reception
					</span>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="border-gray-200 border-b p-4">
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600">Today's Appointments</span>
						<span className="font-semibold text-blue-600">12</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600">Waiting Patients</span>
						<span className="font-semibold text-orange-600">3</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600">Pending Tasks</span>
						<span className="font-semibold text-red-600">5</span>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 p-4">
				{navigationItems.map((item) => {
					const isActive = pathname === item.href;
					const IconComponent = item.icon;
					return (
						<Link
							key={item.key}
							href={item.href}
							className={`flex items-center rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
								isActive
									? "bg-blue-100 text-blue-700"
									: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							}`}
						>
							<IconComponent className="mr-3 h-5 w-5" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* Quick Actions */}
			<div className="border-gray-200 border-t p-4">
				<div className="space-y-2">
					<Button variant="outline" size="sm" className="w-full justify-start">
						<UserPlus className="mr-2 h-4 w-4" />
						New Patient
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start">
						<Phone className="mr-2 h-4 w-4" />
						Quick Call
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start">
						<Bell className="mr-2 h-4 w-4" />
						Send Reminder
					</Button>
				</div>
			</div>

			{/* User Info */}
			<div className="border-gray-200 border-t p-4">
				<div className="flex items-center">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
						<span className="font-medium text-gray-700 text-sm">RC</span>
					</div>
					<div className="ml-3">
						<p className="font-medium text-gray-900 text-sm">Receptionist</p>
						<p className="text-gray-500 text-xs">Front Desk</p>
					</div>
				</div>
			</div>
		</div>
	);
}
