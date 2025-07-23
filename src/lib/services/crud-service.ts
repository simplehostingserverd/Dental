/**
 * Comprehensive CRUD Service
 * Provides standardized Create, Read, Update, Delete operations for all entities
 */

import { toast } from "sonner";

export interface CrudOptions {
	endpoint: string;
	headers?: Record<string, string>;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface CrudResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export class CrudService {
	private baseUrl: string;
	private defaultHeaders: Record<string, string>;

	constructor(baseUrl = "/api") {
		this.baseUrl = baseUrl;
		this.defaultHeaders = {
			"Content-Type": "application/json",
		};
	}

	/**
	 * Generic GET request
	 */
	async get<T>(
		endpoint: string,
		params?: PaginationParams,
	): Promise<CrudResponse<T>> {
		try {
			const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);

			if (params) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						url.searchParams.append(key, value.toString());
					}
				});
			}

			const response = await fetch(url.toString(), {
				method: "GET",
				headers: this.defaultHeaders,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Request failed");
			}

			return {
				success: true,
				data: data.data || data,
				pagination: data.pagination,
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : "Request failed";
			toast.error(message);
			return {
				success: false,
				error: message,
			};
		}
	}

	/**
	 * Generic POST request (Create)
	 */
	async create<T>(endpoint: string, data: any): Promise<CrudResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "POST",
				headers: this.defaultHeaders,
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Create failed");
			}

			toast.success(result.message || "Created successfully");
			return {
				success: true,
				data: result.data || result,
				message: result.message,
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : "Create failed";
			toast.error(message);
			return {
				success: false,
				error: message,
			};
		}
	}

	/**
	 * Generic PUT request (Update)
	 */
	async update<T>(endpoint: string, data: any): Promise<CrudResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "PUT",
				headers: this.defaultHeaders,
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Update failed");
			}

			toast.success(result.message || "Updated successfully");
			return {
				success: true,
				data: result.data || result,
				message: result.message,
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : "Update failed";
			toast.error(message);
			return {
				success: false,
				error: message,
			};
		}
	}

	/**
	 * Generic DELETE request
	 */
	async delete<T>(endpoint: string, data?: any): Promise<CrudResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "DELETE",
				headers: this.defaultHeaders,
				body: data ? JSON.stringify(data) : undefined,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Delete failed");
			}

			toast.success(result.message || "Deleted successfully");
			return {
				success: true,
				data: result.data || result,
				message: result.message,
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : "Delete failed";
			toast.error(message);
			return {
				success: false,
				error: message,
			};
		}
	}

	/**
	 * Bulk operations
	 */
	async bulkUpdate<T>(
		endpoint: string,
		ids: string[],
		updates: any,
	): Promise<CrudResponse<T>> {
		return this.update(endpoint, { ids, updates });
	}

	async bulkDelete<T>(
		endpoint: string,
		ids: string[],
	): Promise<CrudResponse<T>> {
		return this.delete(endpoint, { ids });
	}
}

// Specialized services for different entities
export class PatientService extends CrudService {
	constructor() {
		super("/api");
	}

	async getPatients(params?: PaginationParams) {
		return this.get("/dashboard/patients", params);
	}

	async getPatient(id: string) {
		return this.get(`/dashboard/patients/${id}`);
	}

	async createPatient(patientData: any) {
		return this.create("/dashboard/patients", patientData);
	}

	async updatePatient(id: string, patientData: any) {
		return this.update(`/dashboard/patients/${id}`, patientData);
	}

	async deletePatient(id: string) {
		return this.delete(`/dashboard/patients/${id}`);
	}

	async bulkUpdatePatients(ids: string[], updates: any) {
		return this.bulkUpdate("/dashboard/patients", ids, updates);
	}

	async bulkDeletePatients(ids: string[]) {
		return this.bulkDelete("/dashboard/patients", ids);
	}
}

export class AppointmentService extends CrudService {
	constructor() {
		super("/api");
	}

	async getAppointments(params?: PaginationParams) {
		return this.get("/dashboard/appointments", params);
	}

	async getAppointment(id: string) {
		return this.get(`/dashboard/appointments/${id}`);
	}

	async createAppointment(appointmentData: any) {
		return this.create("/dashboard/appointments", appointmentData);
	}

	async updateAppointment(id: string, appointmentData: any) {
		return this.update(`/dashboard/appointments/${id}`, appointmentData);
	}

	async deleteAppointment(id: string) {
		return this.delete(`/dashboard/appointments/${id}`);
	}

	async checkInPatient(appointmentId: string, patientId: string) {
		return this.update("/dashboard/appointments/checkin", {
			appointmentId,
			patientId,
			checkInTime: new Date().toISOString(),
		});
	}
}

export class TreatmentService extends CrudService {
	constructor() {
		super("/api");
	}

	async getTreatments(params?: PaginationParams) {
		return this.get("/dashboard/treatments", params);
	}

	async getTreatment(id: string) {
		return this.get(`/dashboard/treatments/${id}`);
	}

	async createTreatment(treatmentData: any) {
		return this.create("/dashboard/treatments", treatmentData);
	}

	async updateTreatment(id: string, treatmentData: any) {
		return this.update(`/dashboard/treatments/${id}`, treatmentData);
	}

	async deleteTreatment(id: string) {
		return this.delete(`/dashboard/treatments/${id}`);
	}
}

export class PrescriptionService extends CrudService {
	constructor() {
		super("/api");
	}

	async getPrescriptions(params?: PaginationParams) {
		return this.get("/dashboard/prescriptions", params);
	}

	async getPrescription(id: string) {
		return this.get(`/dashboard/prescriptions/${id}`);
	}

	async createPrescription(prescriptionData: any) {
		return this.create("/dashboard/prescriptions", prescriptionData);
	}

	async updatePrescription(id: string, prescriptionData: any) {
		return this.update(`/dashboard/prescriptions/${id}`, prescriptionData);
	}

	async deletePrescription(id: string) {
		return this.delete(`/dashboard/prescriptions/${id}`);
	}
}

// Export singleton instances
export const patientService = new PatientService();
export const appointmentService = new AppointmentService();
export const treatmentService = new TreatmentService();
export const prescriptionService = new PrescriptionService();
