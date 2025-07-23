import { auth } from "@/server/auth";
import type { NextRequest } from "next/server";

export interface User {
	id: string;
	email: string;
	name: string;
	type: "practice" | "dentist" | "patient" | "receptionist";
	practiceId?: string;
	role?: string;
	permissions?: string[];
}

// Mock user data - in production, this would come from a database
const mockUsers: Record<string, User> = {
	"practice-1": {
		id: "practice-1",
		email: "admin@dentalclinic.com",
		name: "Dental Clinic Admin",
		type: "practice",
		role: "admin",
		permissions: ["all"],
	},
	"receptionist-1": {
		id: "receptionist-1",
		email: "receptionist@dentalclinic.com",
		name: "Jane Receptionist",
		type: "receptionist",
		practiceId: "practice-1",
		role: "receptionist",
		permissions: ["appointments", "patients", "marketing", "billing"],
	},
	"dentist-1": {
		id: "dentist-1",
		email: "dr.johnson@dentalclinic.com",
		name: "Dr. Sarah Johnson",
		type: "dentist",
		practiceId: "practice-1",
		role: "dentist",
		permissions: ["appointments", "patients", "treatments"],
	},
	"patient-1": {
		id: "patient-1",
		email: "john.smith@email.com",
		name: "John Smith",
		type: "patient",
		practiceId: "practice-1",
		role: "patient",
		permissions: ["appointments", "profile"],
	},
};

export async function getCurrentUser(): Promise<User | null> {
	try {
		// In a real application, this would get the session from NextAuth
		// For now, we'll return a mock user for development

		// Try to get session from NextAuth
		const session = await auth();

		if (session?.user?.email) {
			// Find user by email in mock data
			const user = Object.values(mockUsers).find(
				(u) => u.email === session.user.email,
			);
			if (user) {
				return user;
			}
		}

		// Fallback to practice admin for development
		return mockUsers["practice-1"] || null;
	} catch (error) {
		console.error("Error getting current user:", error);
		// Return practice admin as fallback for development
		return mockUsers["practice-1"] || null;
	}
}

export async function getUserById(id: string): Promise<User | null> {
	try {
		return mockUsers[id] || null;
	} catch (error) {
		console.error("Error getting user by ID:", error);
		return null;
	}
}

export async function validateUserPermission(
	user: User,
	permission: string,
): Promise<boolean> {
	try {
		if (!user || !user.permissions) {
			return false;
		}

		// Admin has all permissions
		if (user.permissions.includes("all")) {
			return true;
		}

		// Check specific permission
		return user.permissions.includes(permission);
	} catch (error) {
		console.error("Error validating user permission:", error);
		return false;
	}
}

export async function getUserFromRequest(
	request: NextRequest,
): Promise<User | null> {
	try {
		// In production, this would extract user info from JWT token or session
		const authHeader = request.headers.get("authorization");

		if (authHeader?.startsWith("Bearer ")) {
			const token = authHeader.substring(7);
			// Decode JWT token and get user info
			// For now, return mock user
			return mockUsers["practice-1"] || null;
		}

		// Try to get from cookies or session
		return await getCurrentUser();
	} catch (error) {
		console.error("Error getting user from request:", error);
		return null;
	}
}

export function createUserSession(user: User) {
	// In production, this would create a JWT token or session
	return {
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			type: user.type,
			practiceId: user.practiceId,
			role: user.role,
		},
		token: `mock-token-${user.id}`,
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
	};
}

export async function validateSession(token: string): Promise<User | null> {
	try {
		// In production, this would validate JWT token
		if (token.startsWith("mock-token-")) {
			const userId = token.replace("mock-token-", "");
			return mockUsers[userId] || null;
		}

		return null;
	} catch (error) {
		console.error("Error validating session:", error);
		return null;
	}
}

export function hasPermission(user: User | null, permission: string): boolean {
	if (!user || !user.permissions) {
		return false;
	}

	return (
		user.permissions.includes("all") || user.permissions.includes(permission)
	);
}

export function isSamePractice(user1: User, user2: User): boolean {
	if (user1.type === "practice") {
		return user1.id === user2.practiceId || user1.id === user2.id;
	}

	if (user2.type === "practice") {
		return user2.id === user1.practiceId || user2.id === user1.id;
	}

	return user1.practiceId === user2.practiceId;
}

// Role-based access control helpers
export const ROLES = {
	ADMIN: "admin",
	DENTIST: "dentist",
	RECEPTIONIST: "receptionist",
	PATIENT: "patient",
} as const;

export const PERMISSIONS = {
	// Practice management
	MANAGE_PRACTICE: "manage_practice",
	VIEW_PRACTICE: "view_practice",

	// Appointments
	CREATE_APPOINTMENT: "create_appointment",
	VIEW_APPOINTMENTS: "view_appointments",
	UPDATE_APPOINTMENT: "update_appointment",
	DELETE_APPOINTMENT: "delete_appointment",

	// Patients
	CREATE_PATIENT: "create_patient",
	VIEW_PATIENTS: "view_patients",
	UPDATE_PATIENT: "update_patient",
	DELETE_PATIENT: "delete_patient",

	// Marketing
	MANAGE_MARKETING: "manage_marketing",
	VIEW_MARKETING: "view_marketing",

	// Billing
	MANAGE_BILLING: "manage_billing",
	VIEW_BILLING: "view_billing",

	// Reports
	VIEW_REPORTS: "view_reports",
	EXPORT_REPORTS: "export_reports",
} as const;

export const ROLE_PERMISSIONS = {
	[ROLES.ADMIN]: Object.values(PERMISSIONS),
	[ROLES.DENTIST]: [
		PERMISSIONS.VIEW_PRACTICE,
		PERMISSIONS.VIEW_APPOINTMENTS,
		PERMISSIONS.UPDATE_APPOINTMENT,
		PERMISSIONS.VIEW_PATIENTS,
		PERMISSIONS.UPDATE_PATIENT,
		PERMISSIONS.VIEW_REPORTS,
	],
	[ROLES.RECEPTIONIST]: [
		PERMISSIONS.VIEW_PRACTICE,
		PERMISSIONS.CREATE_APPOINTMENT,
		PERMISSIONS.VIEW_APPOINTMENTS,
		PERMISSIONS.UPDATE_APPOINTMENT,
		PERMISSIONS.DELETE_APPOINTMENT,
		PERMISSIONS.CREATE_PATIENT,
		PERMISSIONS.VIEW_PATIENTS,
		PERMISSIONS.UPDATE_PATIENT,
		PERMISSIONS.MANAGE_MARKETING,
		PERMISSIONS.VIEW_MARKETING,
		PERMISSIONS.VIEW_BILLING,
	],
	[ROLES.PATIENT]: [
		PERMISSIONS.VIEW_APPOINTMENTS,
		PERMISSIONS.UPDATE_APPOINTMENT,
	],
} as const;
