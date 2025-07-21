"use client";

import { ToothIcon } from "@/components/icons/tooth-icon";
import { CognidentTextLogo } from "@/components/icons/cognident-logo";
import { useAppTranslations } from "@/lib/i18n/translation-context";
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
	{ key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ key: "receptionist", href: "/dashboard/receptionist", icon: Calendar },
	{ key: "appointments", href: "/dashboard/schedule", icon: Calendar },
	{ key: "patients", href: "/dashboard/patients", icon: Users },
	{ key: "charting", href: "/dashboard/charting", icon: ToothIcon },
	{
		key: "treatment_plans",
		href: "/dashboard/treatment-plans",
		icon: FileText,
	},
	{ key: "billing", href: "/dashboard/billing", icon: CreditCard },
	{ key: "imaging", href: "/dashboard/imaging", icon: Camera },
	{ key: "prescriptions", href: "/dashboard/prescriptions", icon: Pill },
	{ key: "messages", href: "/dashboard/messages", icon: MessageSquare },
	{ key: "settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();
	const { navigation } = useAppTranslations();

	return (
		<div className="flex h-full w-64 flex-col border-gray-200 border-r bg-white shadow-sm">
			{/* Logo */}
			<div className="flex items-center border-gray-200 border-b px-6 py-4">
				<CognidentTextLogo logoSize={32} className="text-gray-900" />
			</div>

			{/* Navigation */}
			<nav className="mt-6 px-3">
				<ul className="space-y-1">
					{navigationItems.map((item) => {
						const isActive = pathname === item.href;
						const IconComponent = item.icon;
						return (
							<li key={item.key}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center rounded-md px-3 py-2 font-medium text-sm transition-colors",
										isActive
											? "border-blue-700 border-r-2 bg-blue-50 text-blue-700"
											: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
									)}
								>
									<IconComponent className="mr-3 h-5 w-5" />
									{navigation(item.key)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* AI Assistant */}
			<div className="mt-auto border-gray-200 border-t p-3">
				<div className="rounded-lg bg-blue-50 p-3">
					<div className="flex items-center">
						<Bot className="h-4 w-4 text-blue-600" />
						<h3 className="ml-2 font-medium text-blue-900 text-xs">
							AI Assistant
						</h3>
					</div>
					<p className="mt-1 text-gray-600 text-xs">
						Need help with diagnosis?
					</p>
					<button
						type="button"
						className="mt-2 w-full rounded-md bg-blue-600 px-2 py-1.5 text-white text-xs transition-colors hover:bg-blue-700"
					>
						Ask AI
					</button>
				</div>
			</div>
		</div>
	);
}
