"use client";

import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";

interface AppointmentActionsProps {
	appointmentId: string;
	onUpdate: () => void;
}

export function AppointmentActions({ appointmentId, onUpdate }: AppointmentActionsProps) {
	const [showReschedule, setShowReschedule] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [rescheduleDate, setRescheduleDate] = useState("");
	const [rescheduleTime, setRescheduleTime] = useState("");

	const handleCancel = async () => {
		if (!confirm("Are you sure you want to cancel this appointment?")) {
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(`/api/patient/appointments/${appointmentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ action: "cancel" }),
			});

			if (response.ok) {
				alert("Appointment cancelled successfully");
				onUpdate();
			} else {
				const error = await response.json();
				alert(error.error || "Failed to cancel appointment");
			}
		} catch (error) {
			alert("Error cancelling appointment");
		} finally {
			setIsLoading(false);
		}
	};

	const handleReschedule = async () => {
		if (!rescheduleDate || !rescheduleTime) {
			alert("Please select both date and time");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(`/api/patient/appointments/${appointmentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action: "reschedule",
					date: rescheduleDate,
					time: rescheduleTime
				}),
			});

			if (response.ok) {
				alert("Appointment rescheduled successfully");
				setShowReschedule(false);
				setRescheduleDate("");
				setRescheduleTime("");
				onUpdate();
			} else {
				const error = await response.json();
				alert(error.error || "Failed to reschedule appointment");
			}
		} catch (error) {
			alert("Error rescheduling appointment");
		} finally {
			setIsLoading(false);
		}
	};

	const today = new Date();
	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 3);

	const timeSlots = [
		"09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
		"12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
		"15:00", "15:30", "16:00", "16:30"
	];

	return (
		<div className="flex space-x-2">
			<button
				onClick={() => setShowReschedule(true)}
				disabled={isLoading}
				className="rounded-md border border-blue-600 bg-white px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Reschedule
			</button>
			<button
				onClick={handleCancel}
				disabled={isLoading}
				className="rounded-md border border-red-600 bg-white px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Cancel
			</button>

			{/* Reschedule Modal */}
			{showReschedule && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-md rounded-lg bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
							<button
								onClick={() => setShowReschedule(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									New Date
								</label>
								<input
									type="date"
									value={rescheduleDate}
									onChange={(e) => setRescheduleDate(e.target.value)}
									min={today.toISOString().split('T')[0]}
									max={maxDate.toISOString().split('T')[0]}
									className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									New Time
								</label>
								<select
									value={rescheduleTime}
									onChange={(e) => setRescheduleTime(e.target.value)}
									className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								>
									<option value="">Select time</option>
									{timeSlots.map((time) => (
										<option key={time} value={time}>
											{time}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="mt-6 flex justify-end space-x-3">
							<button
								onClick={() => setShowReschedule(false)}
								className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleReschedule}
								disabled={isLoading || !rescheduleDate || !rescheduleTime}
								className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isLoading ? "Rescheduling..." : "Reschedule"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
