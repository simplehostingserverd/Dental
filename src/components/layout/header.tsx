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
		// Clear the authentication cookie
		document.cookie =
			"practice-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		// Redirect to sign in page
		router.push("/auth/signin");
	};
	return (
		<header className="border-gray-200 border-b bg-white px-6 py-4">
			<div className="flex items-center justify-between">
				{/* Search */}
				<div className="max-w-lg flex-1">
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						<input
							type="text"
							placeholder="Search patients, appointments, or treatments..."
							className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Right side */}
				<div className="flex items-center space-x-4">
					{/* Notifications */}
					<button
						type="button"
						className="relative p-2 text-gray-400 transition-colors hover:text-gray-600"
					>
						<Bell className="h-5 w-5" />
						<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
					</button>

					{/* Language switcher */}
					<LanguageSwitcher />

					{/* User menu */}
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center space-x-2 font-medium text-gray-700 text-sm transition-colors hover:text-gray-900">
							<Avatar className="h-8 w-8">
								<AvatarImage
									src="/placeholder-avatar.jpg"
									alt={getUserDisplayName(user)}
								/>
								<AvatarFallback>
									{getUserInitials(user.firstName, user.lastName)}
								</AvatarFallback>
							</Avatar>
							<span>{getUserDisplayName(user)}</span>
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
