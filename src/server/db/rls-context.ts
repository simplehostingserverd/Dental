import { db } from "@/server/db";

export interface RLSContext {
	userId?: string;
	practiceId?: string;
	role?: string;
	patientUserId?: string;
	patientId?: string;
	bypassRLS?: boolean;
}

export async function setRLSContext(context: RLSContext) {
	const queries: string[] = [];

	if (context.userId) {
		queries.push(`SET app.current_user_id = '${context.userId}'`);
	}

	if (context.practiceId) {
		queries.push(`SET app.current_practice_id = '${context.practiceId}'`);
	}

	if (context.role) {
		queries.push(`SET app.current_user_role = '${context.role}'`);
	}

	if (context.patientUserId) {
		queries.push(
			`SET app.current_patient_user_id = '${context.patientUserId}'`,
		);
	}

	if (context.patientId) {
		queries.push(`SET app.current_patient_id = '${context.patientId}'`);
	}

	if (context.bypassRLS) {
		queries.push("SET app.bypass_rls = true");
	}

	// Execute all context setting queries
	for (const query of queries) {
		await db.$executeRawUnsafe(query);
	}
}

export async function clearRLSContext() {
	const resetQueries = [
		"RESET app.current_user_id",
		"RESET app.current_practice_id",
		"RESET app.current_user_role",
		"RESET app.current_patient_user_id",
		"RESET app.current_patient_id",
		"RESET app.bypass_rls",
	];

	// Execute each reset query separately
	for (const query of resetQueries) {
		try {
			await db.$executeRawUnsafe(query);
		} catch (error) {
			// Ignore errors for variables that don't exist
			console.warn(`Failed to reset ${query}:`, error);
		}
	}
}

export async function withRLSContext<T>(
	context: RLSContext,
	operation: () => Promise<T>,
): Promise<T> {
	await setRLSContext(context);
	try {
		return await operation();
	} finally {
		await clearRLSContext();
	}
}
