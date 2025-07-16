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
		<div className="w-64 border-gray-200 border-r bg-white shadow-sm">
			{/* Logo */}
			<div className="flex items-center border-gray-200 border-b px-6 py-4">
				<Heart className="h-8 w-8 text-blue-600" />
				<span className="ml-2 font-semibold text-gray-900 text-xl">
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
											? "border-blue-700 border-r-2 bg-blue-50 text-blue-700"
											: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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
			<div className="absolute right-0 bottom-0 left-0 border-gray-200 border-t p-4">
				<Link
					href="/dashboard/ai-assistant"
					className="flex items-center rounded-md px-3 py-2 font-medium text-gray-600 text-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
				>
					<Bot className="mr-3 h-5 w-5" />
					AI Assistant
				</Link>
				<p className="mt-2 px-3 text-gray-500 text-xs">
					Need help with diagnosis or treatment planning?
				</p>
				<button
					type="button"
					className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
				>
					Ask AI Assistant
				</button>
			</div>
		</div>
	);
}
