"use client";

import { LanguageSwitcher } from "@/components/language/language-switcher";
import { CallInterface } from "@/components/receptionist/call-interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	AlertCircle,
	Bell,
	Calendar,
	Clock,
	LogOut,
	Phone,
	Search,
	Settings,
	User,
} from "lucide-react";

export function ReceptionistHeader() {
	const currentTime = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	const currentDate = new Date().toLocaleDateString([], {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const handleLogout = async () => {
		try {
			// Call logout API to properly clear server-side session
			await fetch("/api/auth/practice/logout", {
				method: "POST",
			});
		} catch (error) {
			console.error("Logout API error:", error);
		}

		// Clear all authentication cookies
		document.cookie =
			"practice-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"test-user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

		// Clear localStorage
		localStorage.removeItem("testUser");

		// Redirect to sign in page
		window.location.href = "/auth/signin";
	};

	return (
		<header className="border-gray-200 border-b bg-white px-6 py-4 shadow-sm">
			<div className="flex items-center justify-between">
				{/* Left side - Search and current info */}
				<div className="flex items-center space-x-4">
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search patients, appointments..."
							className="w-80 pl-10"
						/>
					</div>
					<div className="hidden items-center space-x-4 text-gray-600 text-sm md:flex">
						<div className="flex items-center">
							<Calendar className="mr-1 h-4 w-4" />
							{currentDate}
						</div>
						<div className="flex items-center">
							<Clock className="mr-1 h-4 w-4" />
							{currentTime}
						</div>
					</div>
				</div>

				{/* Right side - Actions and notifications */}
				<div className="flex items-center space-x-4">
					{/* Emergency Alert */}
					<Button
						variant="outline"
						size="sm"
						className="border-red-200 text-red-600"
					>
						<AlertCircle className="mr-2 h-4 w-4" />
						Emergency
					</Button>

					{/* Quick Call */}
					<CallInterface
						patients={[]} // TODO: Pass actual patient data
						onCallInitiated={(callData) => {
							console.log("Call initiated:", callData);
							// TODO: Handle call initiated event
						}}
					/>

					{/* Language Switcher */}
					<LanguageSwitcher variant="compact" data-testid="language-switcher" />

					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="relative">
								<Bell className="h-5 w-5" />
								<Badge className="-top-1 -right-1 absolute h-5 w-5 rounded-full bg-red-500 p-0 text-xs">
									3
								</Badge>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<div className="p-4">
								<h3 className="font-semibold text-gray-900">Notifications</h3>
								<div className="mt-2 space-y-2">
									<div className="rounded-lg bg-blue-50 p-3">
										<p className="font-medium text-blue-900 text-sm">
											Patient Check-in
										</p>
										<p className="text-blue-700 text-xs">
											Sarah Johnson has arrived for 2:30 PM appointment
										</p>
									</div>
									<div className="rounded-lg bg-orange-50 p-3">
										<p className="font-medium text-orange-900 text-sm">
											Late Appointment
										</p>
										<p className="text-orange-700 text-xs">
											Michael Chen is 15 minutes late for cleaning
										</p>
									</div>
									<div className="rounded-lg bg-green-50 p-3">
										<p className="font-medium text-green-900 text-sm">
											Payment Received
										</p>
										<p className="text-green-700 text-xs">
											$150 co-pay collected from Emily Davis
										</p>
									</div>
								</div>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center space-x-2"
							>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
									<span className="font-medium text-sm text-white">RC</span>
								</div>
								<span className="hidden font-medium text-sm md:block">
									Receptionist
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600" onClick={handleLogout}>
								<LogOut className="mr-2 h-4 w-4" />
								Sign Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
