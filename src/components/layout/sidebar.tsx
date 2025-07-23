"use client";

import { HeaderLogo, IconOnly } from "@/components/ui/tooth-logo";
import { cn } from "@/lib/utils";
import {
	Bot,
	Calendar,
	Camera,
	CreditCard,
	FileText,
	LayoutDashboard,
	MessageSquare,
	Pill,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
	{
		key: "dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		label: "Dashboard",
	},
	{
		key: "appointments",
		href: "/dashboard/schedule",
		icon: Calendar,
		label: "Appointments",
	},
	{
		key: "patients",
		href: "/dashboard/patients",
		icon: Users,
		label: "Patients",
	},
	{
		key: "charting",
		href: "/dashboard/charting",
		icon: () => <IconOnly size="sm" />,
		label: "Charting",
	},
	{
		key: "treatment_plans",
		href: "/dashboard/treatment-plans",
		icon: FileText,
		label: "Treatment Plans",
	},
	{
		key: "billing",
		href: "/dashboard/billing",
		icon: CreditCard,
		label: "Billing",
	},
	{
		key: "imaging",
		href: "/dashboard/imaging",
		icon: Camera,
		label: "Imaging",
	},
	{
		key: "prescriptions",
		href: "/dashboard/prescriptions",
		icon: Pill,
		label: "Prescriptions",
	},
	{
		key: "messages",
		href: "/dashboard/messages",
		icon: MessageSquare,
		label: "Messages",
	},
	{
		key: "settings",
		href: "/dashboard/settings",
		icon: Settings,
		label: "Settings",
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="dashboard-sidebar flex h-full w-64 flex-col">
			{/* Logo */}
			<div className="flex items-center border-slate-700 border-b px-6 py-6">
				<HeaderLogo className="text-white" />
				<span className="ml-2 font-bold text-white text-xl">Cognident</span>
			</div>

			{/* Navigation */}
			<nav className="mt-6 px-3">
				<ul className="space-y-2">
					{navigationItems.map((item) => {
						const isActive = pathname === item.href;
						const IconComponent = item.icon;
						return (
							<li key={item.key}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center rounded-lg px-4 py-3 font-medium text-sm transition-all duration-300",
										isActive
											? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
											: "text-slate-300 hover:translate-x-1 hover:bg-slate-700/50 hover:text-white",
									)}
								>
									<IconComponent className="mr-3 h-5 w-5" />
									{item.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* AI Assistant */}
			<div className="mt-auto border-slate-700 border-t p-4">
				<div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 backdrop-blur-sm">
					<div className="flex items-center">
						<Bot className="h-5 w-5 text-indigo-400" />
						<h3 className="ml-2 font-semibold text-sm text-white">
							AI Assistant
						</h3>
					</div>
					<p className="mt-2 text-slate-300 text-xs leading-relaxed">
						Need help with diagnosis or treatment planning?
					</p>
					<button
						type="button"
						className="dashboard-button mt-3 w-full py-2 text-sm"
					>
						Ask AI
					</button>
				</div>
			</div>
		</div>
	);
}
