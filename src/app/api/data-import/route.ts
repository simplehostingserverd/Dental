import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { parse } from "csv-parse/sync";
import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { z } from "zod";

// Validation schema for patient data
const PatientImportSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	dateOfBirth: z
		.string()
		.refine((date) => !Number.isNaN(Date.parse(date)), "Invalid date format"),
	gender: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email().optional().or(z.literal("")),
	address: z
		.object({
			street: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			zipCode: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),
	emergencyContact: z
		.object({
			name: z.string().optional(),
			phone: z.string().optional(),
			relationship: z.string().optional(),
		})
		.optional(),
	insurance: z
		.object({
			provider: z.string().optional(),
			policyNumber: z.string().optional(),
			groupNumber: z.string().optional(),
		})
		.optional(),
	medicalHistory: z
		.object({
			allergies: z.array(z.string()).optional(),
			medications: z.array(z.string()).optional(),
			conditions: z.array(z.string()).optional(),
			notes: z.string().optional(),
		})
		.optional(),
});

interface ImportProgress {
	total: number;
	processed: number;
	successful: number;
	failed: number;
	errors: Array<{ row: number; error: string; data?: any }>;
}

// POST /api/data-import - Import patient data
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user has admin role or is practice owner
		if (user.role !== "ADMIN" && user.role !== "DENTIST") {
			return NextResponse.json(
				{ error: "Insufficient permissions" },
				{ status: 403 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;
		const practiceId = formData.get("practiceId") as string;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		if (!practiceId) {
			return NextResponse.json(
				{ error: "Practice ID is required" },
				{ status: 400 },
			);
		}

		// Verify user has access to this practice
		const practice = await db.practice.findFirst({
			where: {
				id: practiceId,
				practiceUsers: {
					some: {
						id: user.id,
					},
				},
			},
		});

		if (!practice) {
			return NextResponse.json(
				{ error: "Practice not found or access denied" },
				{ status: 404 },
			);
		}

		const fileBuffer = await file.arrayBuffer();
		const fileExtension = file.name.split(".").pop()?.toLowerCase();

		let rawData: any[] = [];

		// Parse file based on extension
		try {
			switch (fileExtension) {
				case "csv": {
					const csvText = new TextDecoder().decode(fileBuffer);
					rawData = parse(csvText, {
						columns: true,
						skip_empty_lines: true,
						trim: true,
					});
					break;
				}

				case "xlsx":
				case "xls": {
					const workbook = XLSX.read(fileBuffer, { type: "buffer" });
					const sheetName = workbook.SheetNames[0];
					if (!sheetName) {
						throw new Error("No sheets found in the Excel file");
					}
					const worksheet = workbook.Sheets[sheetName];
					if (!worksheet) {
						throw new Error("Could not read worksheet");
					}
					rawData = XLSX.utils.sheet_to_json(worksheet);
					break;
				}

				case "json": {
					const jsonText = new TextDecoder().decode(fileBuffer);
					rawData = JSON.parse(jsonText);
					if (!Array.isArray(rawData)) {
						rawData = [rawData];
					}
					break;
				}

				default:
					return NextResponse.json(
						{
							error: "Unsupported file format. Please use CSV, Excel, or JSON.",
						},
						{ status: 400 },
					);
			}
		} catch (error) {
			return NextResponse.json(
				{ error: "Failed to parse file. Please check the file format." },
				{ status: 400 },
			);
		}

		// Initialize progress tracking
		const progress: ImportProgress = {
			total: rawData.length,
			processed: 0,
			successful: 0,
			failed: 0,
			errors: [],
		};

		const importedPatients: any[] = [];

		// Process each row
		for (let i = 0; i < rawData.length; i++) {
			const row = rawData[i];
			progress.processed++;

			try {
				// Normalize field names (handle common variations)
				const normalizedRow = normalizePatientData(row);

				// Validate data
				const validatedData = PatientImportSchema.parse(normalizedRow);

				// Check for existing patient
				const existingPatient = await db.patient.findFirst({
					where: {
						practiceId: practiceId,
						OR: [
							{
								AND: [
									{ firstName: validatedData.firstName },
									{ lastName: validatedData.lastName },
									{ dateOfBirth: new Date(validatedData.dateOfBirth) },
								],
							},
							...(validatedData.email ? [{ email: validatedData.email }] : []),
						],
					},
				});

				if (existingPatient) {
					progress.errors.push({
						row: i + 1,
						error: "Patient already exists",
						data: validatedData,
					});
					progress.failed++;
					continue;
				}

				// Create patient
				const patient = await db.patient.create({
					data: {
						firstName: validatedData.firstName,
						lastName: validatedData.lastName,
						dateOfBirth: new Date(validatedData.dateOfBirth),
						gender: validatedData.gender,
						phone: validatedData.phone,
						email: validatedData.email || null,
						address: validatedData.address || undefined,
						emergencyContact: validatedData.emergencyContact || undefined,
						insurance: validatedData.insurance || undefined,
						medicalHistory: validatedData.medicalHistory || undefined,
						practiceId: practiceId,
						totalVisits: 0,
						outstandingBalance: 0,
					},
				});

				importedPatients.push(patient);
				progress.successful++;
			} catch (error) {
				progress.failed++;
				progress.errors.push({
					row: i + 1,
					error: error instanceof Error ? error.message : "Unknown error",
					data: row,
				});
			}
		}

		// Create audit log
		await db.auditLog.create({
			data: {
				action: "DATA_IMPORT",
				entityType: "PATIENT",
				entityId: practiceId,
				details: {
					importSummary: {
						total: progress.total,
						successful: progress.successful,
						failed: progress.failed,
						fileName: file.name,
						fileSize: file.size,
					},
				},
				practiceId: practiceId,
				userId: user.id,
			},
		});

		return NextResponse.json({
			success: true,
			progress,
			importedCount: progress.successful,
			message: `Successfully imported ${progress.successful} out of ${progress.total} patients`,
		});
	} catch (error) {
		console.error("Data import error:", error);
		return NextResponse.json(
			{ error: "Internal server error during import" },
			{ status: 500 },
		);
	}
}

// Helper function to normalize patient data field names
function normalizePatientData(row: any): any {
	const fieldMappings: Record<string, string> = {
		// Name fields
		first_name: "firstName",
		firstname: "firstName",
		first: "firstName",
		last_name: "lastName",
		lastname: "lastName",
		last: "lastName",

		// Date fields
		date_of_birth: "dateOfBirth",
		dob: "dateOfBirth",
		birth_date: "dateOfBirth",
		birthdate: "dateOfBirth",

		// Contact fields
		phone_number: "phone",
		telephone: "phone",
		mobile: "phone",
		email_address: "email",

		// Address fields
		street_address: "address.street",
		address_line_1: "address.street",
		city: "address.city",
		state: "address.state",
		zip_code: "address.zipCode",
		zip: "address.zipCode",
		postal_code: "address.zipCode",
		country: "address.country",
	};

	const normalized: any = {};

	// Copy and normalize field names
	for (const [key, value] of Object.entries(row)) {
		const normalizedKey = fieldMappings[key.toLowerCase()] || key;

		if (normalizedKey.includes(".")) {
			const [parent, child] = normalizedKey.split(".");
			if (parent && child) {
				if (!normalized[parent]) normalized[parent] = {};
				(normalized[parent] as Record<string, unknown>)[child] = value;
			}
		} else {
			normalized[normalizedKey] = value;
		}
	}

	return normalized;
}
