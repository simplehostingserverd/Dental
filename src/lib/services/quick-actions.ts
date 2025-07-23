/**
 * Quick Actions Service
 * Handles all quick action functionality across the application
 */

import { toast } from "sonner";

export interface QuickActionData {
	patientId?: string;
	appointmentDate?: string;
	appointmentTime?: string;
	paymentAmount?: string;
	paymentMethod?: string;
	message?: string;
	formType?: string;
	reportType?: string;
	[key: string]: any;
}

export interface QuickActionResult {
	success: boolean;
	message: string;
	data?: any;
}

export class QuickActionsService {
	/**
	 * Schedule Emergency Appointment
	 */
	static async scheduleEmergencyAppointment(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId: data.patientId,
					date: data.appointmentDate,
					time: data.appointmentTime,
					type: "emergency",
					priority: "urgent",
					status: "scheduled",
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to schedule emergency appointment");
			}

			const result = await response.json();
			toast.success("Emergency appointment scheduled successfully");

			return {
				success: true,
				message: "Emergency appointment scheduled",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to schedule appointment";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Process Payment Collection
	 */
	static async processPayment(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/billing/payments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId: data.patientId,
					amount: Number.parseFloat(data.paymentAmount || "0"),
					method: data.paymentMethod,
					type: "payment",
					status: "completed",
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to process payment");
			}

			const result = await response.json();
			toast.success(`Payment of $${data.paymentAmount} processed successfully`);

			return {
				success: true,
				message: "Payment processed",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to process payment";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Verify Insurance Coverage
	 */
	static async verifyInsurance(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/insurance/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId: data.patientId,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to verify insurance");
			}

			const result = await response.json();
			toast.success("Insurance verification completed");

			return {
				success: true,
				message: "Insurance verified",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to verify insurance";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Send Forms to Patient
	 */
	static async sendForms(data: QuickActionData): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/communications/send-forms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId: data.patientId,
					formType: data.formType,
					message: data.message,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send forms");
			}

			const result = await response.json();
			toast.success("Forms sent to patient successfully");

			return {
				success: true,
				message: "Forms sent",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to send forms";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Print Schedule
	 */
	static async printSchedule(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/reports/schedule", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to generate schedule");
			}

			const result = await response.json();

			// Open print dialog
			const printWindow = window.open("", "_blank");
			if (printWindow) {
				printWindow.document.write(`
          <html>
            <head>
              <title>Daily Schedule - ${new Date().toLocaleDateString()}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .appointment { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; }
                .time { font-weight: bold; color: #2563eb; }
                .patient { font-size: 18px; margin: 5px 0; }
                .details { color: #666; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Daily Schedule</h1>
                <h2>${new Date().toLocaleDateString()}</h2>
              </div>
              ${
								result.appointments
									?.map(
										(apt: any) => `
                <div class="appointment">
                  <div class="time">${apt.time}</div>
                  <div class="patient">${apt.patientName}</div>
                  <div class="details">${apt.type} - ${apt.duration} minutes</div>
                </div>
              `,
									)
									.join("") || "<p>No appointments scheduled</p>"
							}
            </body>
          </html>
        `);
				printWindow.document.close();
				printWindow.print();
			}

			toast.success("Schedule printed successfully");

			return {
				success: true,
				message: "Schedule printed",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to print schedule";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Start New Patient Intake
	 */
	static async startPatientIntake(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			// Redirect to new patient form
			window.location.href = "/dashboard/patients/new";

			return {
				success: true,
				message: "Redirecting to patient intake form",
			};
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to start patient intake";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Send Appointment Reminders
	 */
	static async sendAppointmentReminders(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/communications/reminders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "appointment_reminder",
					date: data.appointmentDate || new Date().toISOString().split("T")[0],
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send reminders");
			}

			const result = await response.json();
			toast.success(`Sent ${result.count || 0} appointment reminders`);

			return {
				success: true,
				message: "Reminders sent",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to send reminders";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Check In Patient
	 */
	static async checkInPatient(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			const response = await fetch("/api/dashboard/appointments/checkin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId: data.patientId,
					appointmentId: data.appointmentId,
					checkInTime: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to check in patient");
			}

			const result = await response.json();
			toast.success("Patient checked in successfully");

			return {
				success: true,
				message: "Patient checked in",
				data: result,
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to check in patient";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Make Quick Call
	 */
	static async makeQuickCall(
		data: QuickActionData,
	): Promise<QuickActionResult> {
		try {
			if (data.phoneNumber) {
				window.open(`tel:${data.phoneNumber}`);
				toast.success("Initiating call...");
			} else {
				throw new Error("Phone number required");
			}

			return {
				success: true,
				message: "Call initiated",
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to make call";
			toast.error(message);
			return {
				success: false,
				message,
			};
		}
	}

	/**
	 * Execute Quick Action by Type
	 */
	static async executeAction(
		actionType: string,
		data: QuickActionData,
	): Promise<QuickActionResult> {
		switch (actionType) {
			case "emergency-appointment":
				return QuickActionsService.scheduleEmergencyAppointment(data);
			case "payment-collection":
				return QuickActionsService.processPayment(data);
			case "insurance-verification":
				return QuickActionsService.verifyInsurance(data);
			case "send-forms":
				return QuickActionsService.sendForms(data);
			case "print-schedule":
				return QuickActionsService.printSchedule(data);
			case "patient-intake":
				return QuickActionsService.startPatientIntake(data);
			case "send-reminders":
				return QuickActionsService.sendAppointmentReminders(data);
			case "check-in":
				return QuickActionsService.checkInPatient(data);
			case "quick-call":
				return QuickActionsService.makeQuickCall(data);
			default:
				return {
					success: false,
					message: `Unknown action type: ${actionType}`,
				};
		}
	}
}
