"use client";

import { ArrowLeft, Calendar, Clock, FileText, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TimeSlot {
	time: string;
	available: boolean;
}

interface AppointmentType {
	id: string;
	name: string;
	duration: number;
	description: string;
}

const appointmentTypes: AppointmentType[] = [
	{
		id: "cleaning",
		name: "Routine Cleaning",
		duration: 60,
		description: "Regular dental cleaning and checkup",
	},
	{
		id: "checkup",
		name: "Dental Checkup",
		duration: 30,
		description: "Comprehensive dental examination",
	},
	{
		id: "consultation",
		name: "Consultation",
		duration: 45,
		description: "Initial consultation for treatment planning",
	},
	{
		id: "emergency",
		name: "Emergency Visit",
		duration: 30,
		description: "Urgent dental care",
	},
];

const generateTimeSlots = (date: Date): TimeSlot[] => {
	const slots: TimeSlot[] = [];
	const startHour = 9;
	const endHour = 17;

	for (let hour = startHour; hour < endHour; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
			// Simulate some slots being unavailable
			const available = Math.random() > 0.3;
			slots.push({ time, available });
		}
	}

	return slots;
};

export default function BookAppointmentPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string>("");
	const [selectedType, setSelectedType] = useState<string>("");
	const [notes, setNotes] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const today = new Date();
	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months ahead

	const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.target.value);
		setSelectedDate(date);
		setSelectedTime(""); // Reset time when date changes
	};

	const handleSubmit = async () => {
		if (!selectedDate || !selectedTime || !selectedType) {
			alert("Please fill in all required fields");
			return;
		}

		setIsLoading(true);

		try {
			const appointmentData = {
				date: selectedDate.toISOString().split("T")[0],
				time: selectedTime,
				type: selectedType,
				notes: notes,
			};

			const response = await fetch("/api/patient/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(appointmentData),
			});

			if (response.ok) {
				router.push("/patient/dashboard?success=appointment-booked");
			} else {
				const error = await response.json();
				alert(error.message || "Failed to book appointment");
			}
		} catch (error) {
			alert("An error occurred while booking the appointment");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link
								href="/patient/dashboard"
								className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
							>
								<ArrowLeft className="h-5 w-5" />
							</Link>
							<h1 className="font-bold text-gray-900 text-xl">
								Book Appointment
							</h1>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex items-center justify-center space-x-8">
						{[1, 2, 3].map((stepNumber) => (
							<div key={stepNumber} className="flex items-center">
								<div
									className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${
										step >= stepNumber
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-600"
									}`}
								>
									{stepNumber}
								</div>
								<span
									className={`ml-2 text-sm ${
										step >= stepNumber ? "text-blue-600" : "text-gray-500"
									}`}
								>
									{stepNumber === 1 && "Select Type"}
									{stepNumber === 2 && "Choose Date & Time"}
									{stepNumber === 3 && "Confirm Details"}
								</span>
								{stepNumber < 3 && (
									<div
										className={`ml-8 h-0.5 w-16 ${
											step > stepNumber ? "bg-blue-600" : "bg-gray-200"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="rounded-lg bg-white p-8 shadow-sm">
					{/* Step 1: Select Appointment Type */}
					{step === 1 && (
						<div>
							<h2 className="mb-6 font-semibold text-gray-900 text-xl">
								Select Appointment Type
							</h2>
							<div className="grid gap-4 sm:grid-cols-2">
								{appointmentTypes.map((type) => (
									<div
										key={type.id}
										onClick={() => setSelectedType(type.id)}
										className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
											selectedType === type.id
												? "border-blue-600 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<h3 className="font-medium text-gray-900">{type.name}</h3>
										<p className="mt-1 text-gray-600 text-sm">
											{type.description}
										</p>
										<p className="mt-2 text-blue-600 text-sm">
											{type.duration} minutes
										</p>
									</div>
								))}
							</div>
							<div className="mt-8 flex justify-end">
								<button
									onClick={() => setStep(2)}
									disabled={!selectedType}
									className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Next
								</button>
							</div>
						</div>
					)}

					{/* Step 2: Select Date and Time */}
					{step === 2 && (
						<div>
							<h2 className="mb-6 font-semibold text-gray-900 text-xl">
								Choose Date & Time
							</h2>

							{/* Date Selection */}
							<div className="mb-6">
								<label className="mb-2 block font-medium text-gray-700 text-sm">
									Select Date
								</label>
								<input
									type="date"
									min={today.toISOString().split("T")[0]}
									max={maxDate.toISOString().split("T")[0]}
									onChange={handleDateChange}
									className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							{/* Time Selection */}
							{selectedDate && (
								<div>
									<label className="mb-2 block font-medium text-gray-700 text-sm">
										Available Times
									</label>
									<div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
										{timeSlots.map((slot) => (
											<button
												key={slot.time}
												onClick={() =>
													slot.available && setSelectedTime(slot.time)
												}
												disabled={!slot.available}
												className={`rounded-md px-3 py-2 text-sm ${
													selectedTime === slot.time
														? "bg-blue-600 text-white"
														: slot.available
															? "bg-gray-100 text-gray-900 hover:bg-gray-200"
															: "cursor-not-allowed bg-gray-50 text-gray-400"
												}`}
											>
												{slot.time}
											</button>
										))}
									</div>
								</div>
							)}

							<div className="mt-8 flex justify-between">
								<button
									onClick={() => setStep(1)}
									className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
								>
									Back
								</button>
								<button
									onClick={() => setStep(3)}
									disabled={!selectedDate || !selectedTime}
									className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Next
								</button>
							</div>
						</div>
					)}

					{/* Step 3: Confirm Details */}
					{step === 3 && (
						<div>
							<h2 className="mb-6 font-semibold text-gray-900 text-xl">
								Confirm Appointment Details
							</h2>

							{/* Appointment Summary */}
							<div className="mb-6 rounded-lg bg-gray-50 p-4">
								<div className="space-y-3">
									<div className="flex items-center">
										<User className="mr-3 h-5 w-5 text-gray-400" />
										<span className="font-medium">
											{
												appointmentTypes.find((t) => t.id === selectedType)
													?.name
											}
										</span>
									</div>
									<div className="flex items-center">
										<Calendar className="mr-3 h-5 w-5 text-gray-400" />
										<span>{selectedDate?.toLocaleDateString()}</span>
									</div>
									<div className="flex items-center">
										<Clock className="mr-3 h-5 w-5 text-gray-400" />
										<span>{selectedTime}</span>
									</div>
								</div>
							</div>

							{/* Notes */}
							<div className="mb-6">
								<label className="mb-2 block font-medium text-gray-700 text-sm">
									Additional Notes (Optional)
								</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={3}
									className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									placeholder="Any specific concerns or requests..."
								/>
							</div>

							<div className="flex justify-between">
								<button
									onClick={() => setStep(2)}
									className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
								>
									Back
								</button>
								<button
									onClick={handleSubmit}
									disabled={isLoading}
									className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isLoading ? "Booking..." : "Book Appointment"}
								</button>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
