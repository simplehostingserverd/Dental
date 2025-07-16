import type { CurrentUser } from "@/lib/auth/get-user";

/**
 * Get user initials for avatar
 */
export function getUserInitials(firstName: string, lastName: string): string {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: CurrentUser): string {
	if (user.type === "practice" && user.role) {
		// Add title for practice users based on role
		const title = user.role === "DOCTOR" ? "Dr." : "";
		return `${title} ${user.firstName} ${user.lastName}`.trim();
	}
	return `${user.firstName} ${user.lastName}`;
}
