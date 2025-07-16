"use client";

import { Clock, AlertCircle } from "lucide-react";

interface Treatment {
	id: string;
	patientName: string;
	treatmentType: string;
	priority: "high" | "medium" | "low";
	dueDate: string;
	status: "pending" | "in_progress" | "scheduled";
}

// Sample data - in a real app this would come from an API
const sampleTreatments: Treatment[] = [
	{
		id: "1",
		patientName: "Sarah Johnson",
		treatmentType: "Root Canal",
		priority: "high",
		dueDate: "2025-01-18",
		status: "pending",
	},
	{
		id: "2",
		patientName: "Mike Chen",
		treatmentType: "Crown Placement",
		priority: "medium",
		dueDate: "2025-01-20",
		status: "scheduled",
	},
	{
		id: "3",
		patientName: "Emma Davis",
		treatmentType: "Filling Replacement",
		priority: "low",
		dueDate: "2025-01-22",
		status: "pending",
	},
];

export function PendingTreatments() {
	const getPriorityColor = (priority: Treatment["priority"]) => {
		switch (priority) {
			case "high":
				return "text-red-600 bg-red-50";
			case "medium":
				return "text-yellow-600 bg-yellow-50";
			case "low":
				return "text-green-600 bg-green-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getStatusIcon = (status: Treatment["status"]) => {
		switch (status) {
			case "pending":
				return <AlertCircle className="h-4 w-4 text-orange-500" />;
			case "scheduled":
				return <Clock className="h-4 w-4 text-blue-500" />;
			default:
				return <Clock className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<div className="rounded-lg bg-white p-6 shadow">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-medium text-lg text-gray-900">Pending Treatments</h3>
				<span className="rounded-full bg-red-100 px-2 py-1 text-red-800 text-xs font-medium">
					{sampleTreatments.filter(t => t.status === "pending").length} pending
				</span>
			</div>

			<div className="space-y-3">
				{sampleTreatments.map((treatment) => (
					<div
						key={treatment.id}
						className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
					>
						<div className="flex items-center space-x-3">
							{getStatusIcon(treatment.status)}
							<div>
								<p className="font-medium text-gray-900 text-sm">
									{treatment.patientName}
								</p>
								<p className="text-gray-600 text-xs">{treatment.treatmentType}</p>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<span
								className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
									treatment.priority
								)}`}
							>
								{treatment.priority}
							</span>
							<span className="text-gray-500 text-xs">
								{new Date(treatment.dueDate).toLocaleDateString()}
							</span>
						</div>
					</div>
				))}
			</div>

			{sampleTreatments.length === 0 && (
				<div className="py-8 text-center">
					<AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 font-medium text-gray-900 text-sm">No pending treatments</h3>
					<p className="mt-1 text-gray-500 text-sm">
						All treatments are up to date.
					</p>
				</div>
			)}

			<div className="mt-4 pt-4 border-t border-gray-200">
				<button className="w-full rounded-md bg-gray-50 px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-100">
					View All Treatments
				</button>
			</div>
		</div>
	);
}
