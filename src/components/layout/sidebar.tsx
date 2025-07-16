"use client";

import { cn } from "@/lib/utils";
import {
	Bot,
	Calendar,
	Camera,
	CreditCard,
	FileText,
	Heart,
	LayoutDashboard,
	MessageSquare,
	Pill,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
	{ name: "Patients", href: "/dashboard/patients", icon: Users },
	{ name: "Charting", href: "/dashboard/charting", icon: Heart },
	{ name: "Treatment Plans", href: "/dashboard/treatments", icon: FileText },
	{ name: "Billing", href: "/dashboard/billing", icon: CreditCard },
	{ name: "Imaging", href: "/dashboard/imaging", icon: Camera },
	{ name: "Prescriptions", href: "/dashboard/prescriptions", icon: Pill },
	{ name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
	{ name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-full w-64 flex-col border-gray-200 border-r bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
			{/* Logo */}
			<div className="flex items-center border-gray-200 border-b px-6 py-4 dark:border-gray-700">
				<Heart className="h-8 w-8 text-blue-600" />
				<span className="ml-2 font-semibold text-gray-900 text-xl dark:text-white">
					DentalCloud
				</span>
			</div>

			{/* Navigation */}
			<nav className="mt-6 px-3">
				<ul className="space-y-1">
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center rounded-md px-3 py-2 font-medium text-sm transition-colors",
										isActive
											? "border-blue-700 border-r-2 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300"
											: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
									)}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* AI Assistant */}
			<div className="mt-auto border-gray-200 border-t p-3 dark:border-gray-700">
				<div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
					<div className="flex items-center">
						<Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<h3 className="ml-2 font-medium text-blue-900 text-xs dark:text-blue-100">
							AI Assistant
						</h3>
					</div>
					<p className="mt-1 text-gray-600 text-xs dark:text-gray-300">
						Need help with diagnosis?
					</p>
					<button
						type="button"
						className="mt-2 w-full rounded-md bg-blue-600 px-2 py-1.5 text-white text-xs transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						Ask AI
					</button>
				</div>
			</div>
		</div>
	);
}
