"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import type { CurrentUser } from "@/lib/auth/get-user";
import { getUserDisplayName, getUserInitials } from "@/lib/utils/user-utils";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
	user: CurrentUser;
}

export function Header({ user }: HeaderProps) {
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			// Call logout API to properly clear server-side session
			await fetch("/api/auth/practice/logout", {
				method: "POST",
			});
		} catch (error) {
			console.error("Logout API error:", error);
		}

		// Clear all authentication cookies
		document.cookie = "practice-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie = "test-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie = "test-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie = "test-user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie = "test-user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

		// Clear localStorage
		localStorage.removeItem("testUser");

		// Redirect to sign in page
		window.location.href = "/auth/signin";
	};
	return (
		<header className="dashboard-header border-b border-slate-200 px-6 py-4">
			<div className="flex items-center justify-between">
				{/* Search */}
				<div className="max-w-lg flex-1">
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-slate-400" />
						<input
							type="text"
							placeholder="Search patients, appointments, or treatments..."
							className="dashboard-input w-full pl-10"
						/>
					</div>
				</div>

				{/* Right side */}
				<div className="flex items-center space-x-4">
					{/* Notifications */}
					<button
						type="button"
						className="relative p-3 text-slate-500 transition-all duration-300 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
					>
						<Bell className="h-5 w-5" />
						<span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse" />
					</button>

					{/* Language switcher */}
					<LanguageSwitcher />

					{/* User menu */}
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center space-x-3 font-medium text-slate-700 text-sm transition-all duration-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-2">
							<Avatar className="h-9 w-9 ring-2 ring-indigo-100">
								<AvatarImage
									src="/placeholder-avatar.jpg"
									alt={getUserDisplayName(user)}
								/>
								<AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
									{getUserInitials(user.firstName, user.lastName)}
								</AvatarFallback>
							</Avatar>
							<span className="font-semibold">{getUserDisplayName(user)}</span>
							<ChevronDown className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
