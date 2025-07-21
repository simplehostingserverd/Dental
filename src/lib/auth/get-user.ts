import { db } from "@/server/db";
import { headers } from "next/headers";

export interface CurrentUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role?: string;
	practiceId: string;
	patientId?: string;
	type: "practice" | "patient";
}

/**
 * Get current user from middleware headers (server-side)
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
	try {
		const headersList = await headers();

		// Check for test authentication first
		const isTestAuth = headersList.get("x-test-auth");
		const testUserRole = headersList.get("x-test-user-role");

		if (isTestAuth === "true" && testUserRole) {
			// Get the actual test user data from cookies/session
			const testUserId = headersList.get("x-test-user-id");
			const testUserEmail = headersList.get("x-test-user-email");
			const testUserFirstName = headersList.get("x-test-user-first-name");
			const testUserLastName = headersList.get("x-test-user-last-name");

			// If we have detailed user info, use it; otherwise fall back to generic
			if (
				testUserId &&
				testUserEmail &&
				testUserFirstName &&
				testUserLastName
			) {
				return {
					id: testUserId,
					email: testUserEmail,
					firstName: testUserFirstName,
					lastName: testUserLastName,
					role: testUserRole.toUpperCase(),
					practiceId: "test-practice",
					type: testUserRole === "patient" ? "patient" : "practice",
					...(testUserRole === "patient" && { patientId: testUserId }),
				};
			}

			// Fallback to generic test user
			return {
				id: "test-user",
				email: "test@cognident.org",
				firstName: "Test",
				lastName: "User",
				role: testUserRole.toUpperCase(),
				practiceId: "test-practice",
				type: testUserRole === "patient" ? "patient" : "practice",
				...(testUserRole === "patient" && { patientId: "test-user" }),
			};
		}

		// Fallback to Stack Auth
		const userId = headersList.get("x-user-id");
		const email = headersList.get("x-user-email");
		const practiceId = headersList.get("x-practice-id");
		const role = headersList.get("x-user-role");
		const patientId = headersList.get("x-patient-id");

		if (!userId || !email) {
			return null;
		}

		// Determine user type based on available headers
		const userType = role ? "practice" : "patient";

		// For practice users, practiceId is required
		if (userType === "practice" && !practiceId) {
			return null;
		}

		if (userType === "practice") {
			// Fetch practice user details
			const user = await db.practiceUser.findUnique({
				where: { id: userId },
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					role: true,
					practiceId: true,
				},
			});

			if (!user) return null;

			return {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				practiceId: user.practiceId,
				type: "practice",
			};
		}
		// Fetch patient user details
		const user = await db.patientUser.findUnique({
			where: { id: userId },
			include: {
				patient: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						practiceId: true,
					},
				},
			},
		});

		if (!user || !user.patient) return null;

		return {
			id: user.id,
			email: user.email,
			firstName: user.patient.firstName,
			lastName: user.patient.lastName,
			practiceId: user.patient.practiceId || "",
			patientId: user.patient.id,
			type: "patient",
		};
	} catch (error) {
		console.error("Error getting current user:", error);
		return null;
	}
}

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
		const title = user.role === "DENTIST" ? "Dr." : "";
		return `${title} ${user.firstName} ${user.lastName}`.trim();
	}
	return `${user.firstName} ${user.lastName}`;
}
