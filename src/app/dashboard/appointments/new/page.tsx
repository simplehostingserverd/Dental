"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AppointmentForm {
	patientId: string;
	date: string;
	time: string;
	duration: string;
	treatment: string;
	provider: string;
	room: string;
	notes: string;
}

// Mock data - in real app this would come from database
const patients = [
	{ id: "1", name: "John Smith", phone: "(555) 123-4567" },
	{ id: "2", name: "Sarah Johnson", phone: "(555) 987-6543" },
	{ id: "3", name: "Michael Brown", phone: "(555) 456-7890" },
	{ id: "4", name: "Emily Davis", phone: "(555) 321-0987" },
];

const providers = [
	"Dr. Sarah Chen",
	"Dr. Michael Rodriguez",
	"Dr. Jennifer Kim",
];

const treatments = [
	"Routine Cleaning",
	"Dental Exam",
	"Filling",
	"Root Canal",
	"Crown",
	"Extraction",
	"Consultation",
	"Whitening",
];

const timeSlots = [
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
];

const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];

export default function NewAppointmentPage() {
	const [formData, setFormData] = useState<AppointmentForm>({
		patientId: "",
		date: "",
		time: "",
		duration: "60",
		treatment: "",
		provider: "",
		room: "",
		notes: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		console.log("Creating appointment:", formData);
		// Redirect to schedule page after creation
		window.location.href = "/dashboard/schedule";
	};

	const updateFormData = (field: keyof AppointmentForm, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center space-x-4">
				<Link href="/dashboard/schedule">
					<Button variant="outline" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Schedule
					</Button>
				</Link>
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						New Appointment
					</h1>
					<p className="text-gray-600">Schedule a new patient appointment</p>
				</div>
			</div>

			{/* Form */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Patient Selection */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Label htmlFor="patient">Patient *</Label>
							<Select
								value={formData.patientId}
								onValueChange={(value) => updateFormData("patientId", value)}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient..." />
								</SelectTrigger>
								<SelectContent>
									{patients.map((patient) => (
										<SelectItem key={patient.id} value={patient.id}>
											{patient.name} - {patient.phone}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="provider">Provider *</Label>
							<Select
								value={formData.provider}
								onValueChange={(value) => updateFormData("provider", value)}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select provider..." />
								</SelectTrigger>
								<SelectContent>
									{providers.map((provider) => (
										<SelectItem key={provider} value={provider}>
											{provider}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Date and Time */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<Label htmlFor="date">Date *</Label>
							<div className="relative">
								<Calendar className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input
									id="date"
									type="date"
									value={formData.date}
									onChange={(e) => updateFormData("date", e.target.value)}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="time">Time *</Label>
							<Select
								value={formData.time}
								onValueChange={(value) => updateFormData("time", value)}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select time..." />
								</SelectTrigger>
								<SelectContent>
									{timeSlots.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="duration">Duration (minutes) *</Label>
							<Select
								value={formData.duration}
								onValueChange={(value) => updateFormData("duration", value)}
								required
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="30">30 minutes</SelectItem>
									<SelectItem value="45">45 minutes</SelectItem>
									<SelectItem value="60">60 minutes</SelectItem>
									<SelectItem value="90">90 minutes</SelectItem>
									<SelectItem value="120">120 minutes</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Treatment and Room */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Label htmlFor="treatment">Treatment *</Label>
							<Select
								value={formData.treatment}
								onValueChange={(value) => updateFormData("treatment", value)}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select treatment..." />
								</SelectTrigger>
								<SelectContent>
									{treatments.map((treatment) => (
										<SelectItem key={treatment} value={treatment}>
											{treatment}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="room">Room</Label>
							<Select
								value={formData.room}
								onValueChange={(value) => updateFormData("room", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select room..." />
								</SelectTrigger>
								<SelectContent>
									{rooms.map((room) => (
										<SelectItem key={room} value={room}>
											{room}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Notes */}
					<div>
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							placeholder="Additional notes about the appointment..."
							value={formData.notes}
							onChange={(e) => updateFormData("notes", e.target.value)}
							rows={3}
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-4">
						<Link href="/dashboard/schedule">
							<Button variant="outline">Cancel</Button>
						</Link>
						<Button type="submit">
							<Calendar className="mr-2 h-4 w-4" />
							Create Appointment
						</Button>
					</div>
				</form>
			</div>

			{/* Quick Actions */}
			<div className="rounded-lg border border-gray-200 bg-white p-4">
				<h3 className="mb-3 font-medium text-gray-900">Quick Actions</h3>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="sm">
						<User className="mr-2 h-4 w-4" />
						Add New Patient
					</Button>
					<Button variant="outline" size="sm">
						<Clock className="mr-2 h-4 w-4" />
						Check Availability
					</Button>
				</div>
			</div>
		</div>
	);
}
