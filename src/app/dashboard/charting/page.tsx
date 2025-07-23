"use client";

import { Badge } from "@/components/ui/badge";
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
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	FileText,
	Filter,
	Plus,
	Save,
	Search,
} from "lucide-react";
import { useState } from "react";

interface ToothCondition {
	id: string;
	toothNumber: number;
	surface: string;
	condition: string;
	treatment: string;
	status: "planned" | "in-progress" | "completed" | "needs-approval";
	priority: "low" | "medium" | "high" | "urgent";
	insuranceCovered: boolean;
	estimatedCost: number;
	dateAdded: string;
	notes?: string;
}

interface Patient {
	id: string;
	name: string;
	dateOfBirth: string;
	insuranceProvider: string;
	lastVisit: string;
}

export default function ChartingPage() {
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
	const [conditions, setConditions] = useState<ToothCondition[]>([
		{
			id: "1",
			toothNumber: 14,
			surface: "Occlusal",
			condition: "Caries",
			treatment: "Composite Filling",
			status: "planned",
			priority: "medium",
			insuranceCovered: true,
			estimatedCost: 185,
			dateAdded: "2025-01-15",
			notes: "Small cavity on chewing surface",
		},
		{
			id: "2",
			toothNumber: 3,
			surface: "Mesial",
			condition: "Deep Caries",
			treatment: "Root Canal + Crown",
			status: "needs-approval",
			priority: "high",
			insuranceCovered: false,
			estimatedCost: 1850,
			dateAdded: "2025-01-10",
			notes: "Patient experiencing pain, needs pre-authorization",
		},
	]);

	const [newCondition, setNewCondition] = useState({
		toothNumber: "",
		surface: "",
		condition: "",
		treatment: "",
		priority: "medium" as "low" | "medium" | "high" | "urgent",
		notes: "",
	});

	// Mock patient data
	const patients = [
		{
			id: "1",
			name: "Sarah Johnson",
			dateOfBirth: "1985-03-15",
			insuranceProvider: "Delta Dental",
			lastVisit: "2025-01-10",
		},
		{
			id: "2",
			name: "Michael Chen",
			dateOfBirth: "1978-11-22",
			insuranceProvider: "Medicaid",
			lastVisit: "2025-01-08",
		},
	];

	const toothNumbers = Array.from({ length: 32 }, (_, i) => i + 1);

	const surfaces = [
		"Occlusal",
		"Mesial",
		"Distal",
		"Buccal",
		"Lingual",
		"Incisal",
	];

	const conditionTypes = [
		"Caries",
		"Deep Caries",
		"Fracture",
		"Wear",
		"Erosion",
		"Abrasion",
		"Existing Restoration",
		"Failed Restoration",
		"Missing Tooth",
		"Impacted",
	];

	const treatments = [
		"Composite Filling",
		"Amalgam Filling",
		"Crown",
		"Bridge",
		"Implant",
		"Root Canal",
		"Extraction",
		"Cleaning",
		"Sealant",
		"Veneer",
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in-progress":
				return "bg-blue-100 text-blue-800";
			case "planned":
				return "bg-yellow-100 text-yellow-800";
			case "needs-approval":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "bg-red-500 text-white";
			case "high":
				return "bg-orange-500 text-white";
			case "medium":
				return "bg-yellow-500 text-white";
			case "low":
				return "bg-green-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	const toggleToothSelection = (toothNumber: number) => {
		setSelectedTeeth((prev) => {
			if (prev.includes(toothNumber)) {
				return prev.filter((t) => t !== toothNumber);
			}
			return [...prev, toothNumber];
		});
	};

	const clearToothSelection = () => {
		setSelectedTeeth([]);
	};

	const addCondition = () => {
		if (!newCondition.condition || !newCondition.treatment) {
			return;
		}

		// Use selected teeth or the manually entered tooth number
		const teethToProcess =
			selectedTeeth.length > 0
				? selectedTeeth
				: newCondition.toothNumber
					? [Number.parseInt(newCondition.toothNumber)]
					: [];

		if (teethToProcess.length === 0) {
			return;
		}

		const newConditions: ToothCondition[] = teethToProcess.map((toothNum) => ({
			id: `${Date.now()}-${toothNum}`,
			toothNumber: toothNum,
			surface: newCondition.surface,
			condition: newCondition.condition,
			treatment: newCondition.treatment,
			status: "planned" as const,
			priority: (newCondition.priority || "medium") as
				| "low"
				| "medium"
				| "high"
				| "urgent",
			insuranceCovered: true, // Default, can be updated
			estimatedCost: 0, // Will be calculated based on treatment
			dateAdded:
				new Date().toISOString().split("T")[0] ||
				new Date().toLocaleDateString(),
			notes: newCondition.notes || "",
		}));

		setConditions([...conditions, ...newConditions]);
		setNewCondition({
			toothNumber: "",
			surface: "",
			condition: "",
			treatment: "",
			priority: "medium",
			notes: "",
		});
		// Clear selection after adding conditions
		setSelectedTeeth([]);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Dental Charting
					</h1>
					<p className="text-gray-600">
						Comprehensive dental charting with insurance integration
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline">
						<FileText className="mr-2 h-4 w-4" />
						Export Chart
					</Button>
					<Button>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</div>
			</div>

			{/* Patient Selection */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="mb-4 font-medium text-gray-900 text-lg">
					Patient Selection
				</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<Label htmlFor="patient-search">Search Patient</Label>
						<div className="relative">
							<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
							<Input
								id="patient-search"
								placeholder="Search by name or ID..."
								className="pl-10"
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="patient-select">Select Patient</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Choose patient..." />
							</SelectTrigger>
							<SelectContent>
								{patients.map((patient) => (
									<SelectItem key={patient.id} value={patient.id}>
										{patient.name} - {patient.insuranceProvider}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="insurance-status">Insurance Status</Label>
						<div className="flex items-center space-x-2 pt-2">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<span className="text-gray-600 text-sm">
								Active - Delta Dental
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Dental Chart Visualization */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-medium text-gray-900 text-lg">Dental Chart</h2>
					<div className="flex items-center space-x-2">
						<span className="text-gray-600 text-sm">
							Selected: {selectedTeeth.length} teeth
						</span>
						{selectedTeeth.length > 0 && (
							<Button variant="outline" size="sm" onClick={clearToothSelection}>
								Clear Selection
							</Button>
						)}
					</div>
				</div>
				<div className="space-y-6">
					{/* Upper Teeth */}
					<div>
						<h3 className="mb-2 font-medium text-gray-700">
							Upper Teeth (1-16)
						</h3>
						<div className="grid grid-cols-16 gap-1">
							{Array.from({ length: 16 }, (_, i) => i + 1).map((toothNum) => (
								<button
									key={toothNum}
									type="button"
									onClick={() => toggleToothSelection(toothNum)}
									className={`aspect-square rounded border-2 p-1 font-medium text-xs transition-colors ${
										selectedTeeth.includes(toothNum)
											? "border-blue-500 bg-blue-50 text-blue-700"
											: "border-gray-300 bg-white hover:bg-gray-50"
									}`}
								>
									{toothNum}
								</button>
							))}
						</div>
					</div>

					{/* Lower Teeth */}
					<div>
						<h3 className="mb-2 font-medium text-gray-700">
							Lower Teeth (17-32)
						</h3>
						<div className="grid grid-cols-16 gap-1">
							{Array.from({ length: 16 }, (_, i) => i + 17).map((toothNum) => (
								<button
									key={toothNum}
									type="button"
									onClick={() => toggleToothSelection(toothNum)}
									className={`aspect-square rounded border-2 p-1 font-medium text-xs transition-colors ${
										selectedTeeth.includes(toothNum)
											? "border-blue-500 bg-blue-50 text-blue-700"
											: "border-gray-300 bg-white hover:bg-gray-50"
									}`}
								>
									{toothNum}
								</button>
							))}
						</div>
					</div>
				</div>
				{selectedTeeth.length > 0 && (
					<div className="mt-4 rounded-lg bg-blue-50 p-3">
						<p className="text-blue-800 text-sm">
							<strong>Multi-tooth selection:</strong> You can add the same
							condition/treatment to multiple teeth for same-day procedures.
						</p>
					</div>
				)}
			</div>

			{/* Add New Condition */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="mb-4 font-medium text-gray-900 text-lg">
					Add New Condition
				</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<Label htmlFor="tooth-number">Tooth Number</Label>
						<Select
							value={newCondition.toothNumber}
							onValueChange={(value) =>
								setNewCondition({ ...newCondition, toothNumber: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select tooth..." />
							</SelectTrigger>
							<SelectContent>
								{toothNumbers.map((num) => (
									<SelectItem key={num} value={num.toString()}>
										Tooth {num}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="surface">Surface</Label>
						<Select
							value={newCondition.surface}
							onValueChange={(value) =>
								setNewCondition({ ...newCondition, surface: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select surface..." />
							</SelectTrigger>
							<SelectContent>
								{surfaces.map((surface) => (
									<SelectItem key={surface} value={surface}>
										{surface}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="condition">Condition</Label>
						<Select
							value={newCondition.condition}
							onValueChange={(value) =>
								setNewCondition({ ...newCondition, condition: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select condition..." />
							</SelectTrigger>
							<SelectContent>
								{conditionTypes.map((condition) => (
									<SelectItem key={condition} value={condition}>
										{condition}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label htmlFor="treatment">Recommended Treatment</Label>
						<Select
							value={newCondition.treatment}
							onValueChange={(value) =>
								setNewCondition({ ...newCondition, treatment: value })
							}
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
						<Label htmlFor="priority">Priority</Label>
						<Select
							value={newCondition.priority}
							onValueChange={(value) =>
								setNewCondition({
									...newCondition,
									priority: value as "low" | "medium" | "high" | "urgent",
								})
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
								<SelectItem value="urgent">Urgent</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-4">
					<Label htmlFor="notes">Notes</Label>
					<Textarea
						id="notes"
						placeholder="Additional notes about the condition..."
						value={newCondition.notes}
						onChange={(e) =>
							setNewCondition({ ...newCondition, notes: e.target.value })
						}
					/>
				</div>

				<div className="mt-4">
					<Button onClick={addCondition}>
						<Plus className="mr-2 h-4 w-4" />
						Add Condition
					</Button>
				</div>
			</div>

			{/* Current Conditions */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-medium text-gray-900 text-lg">
						Current Conditions & Treatments
					</h2>
					<div className="flex items-center space-x-2">
						<Button variant="outline" size="sm">
							<Filter className="mr-2 h-4 w-4" />
							Filter
						</Button>
					</div>
				</div>

				<div className="space-y-4">
					{conditions.map((condition) => (
						<div
							key={condition.id}
							className="rounded-lg border border-gray-200 p-4"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center space-x-3">
										<span className="font-medium text-gray-900">
											Tooth #{condition.toothNumber} - {condition.surface}
										</span>
										<Badge className={getPriorityColor(condition.priority)}>
											{condition.priority.toUpperCase()}
										</Badge>
										<Badge className={getStatusColor(condition.status)}>
											{condition.status.replace("-", " ").toUpperCase()}
										</Badge>
									</div>

									<div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
										<div>
											<span className="text-gray-500 text-sm">Condition:</span>
											<p className="font-medium text-gray-900">
												{condition.condition}
											</p>
										</div>
										<div>
											<span className="text-gray-500 text-sm">Treatment:</span>
											<p className="font-medium text-gray-900">
												{condition.treatment}
											</p>
										</div>
										<div>
											<span className="text-gray-500 text-sm">
												Estimated Cost:
											</span>
											<div className="flex items-center space-x-2">
												<p className="font-medium text-gray-900">
													${condition.estimatedCost}
												</p>
												{condition.insuranceCovered ? (
													<CheckCircle
														className="h-4 w-4 text-green-500"
														aria-label="Insurance Covered"
													/>
												) : (
													<AlertTriangle
														className="h-4 w-4 text-yellow-500"
														aria-label="Not Covered"
													/>
												)}
											</div>
										</div>
									</div>

									{condition.notes && (
										<div className="mt-2">
											<span className="text-gray-500 text-sm">Notes:</span>
											<p className="text-gray-700 text-sm">{condition.notes}</p>
										</div>
									)}

									<div className="mt-2 flex items-center space-x-4 text-gray-500 text-sm">
										<span>Added: {condition.dateAdded}</span>
										{condition.status === "needs-approval" && (
											<span className="flex items-center text-red-600">
												<Clock className="mr-1 h-3 w-3" />
												Pending Insurance Approval
											</span>
										)}
									</div>
								</div>

								<div className="ml-4 flex flex-col space-y-2">
									<Button size="sm" variant="outline">
										Edit
									</Button>
									{condition.status === "planned" && (
										<Button size="sm">Start Treatment</Button>
									)}
									{condition.status === "needs-approval" && (
										<Button
											size="sm"
											variant="outline"
											className="border-blue-500 text-blue-600 hover:bg-blue-50"
										>
											Check Status
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Insurance Integration Panel */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="mb-4 font-medium text-gray-900 text-lg">
					Insurance Integration
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<h3 className="mb-3 font-medium text-gray-900">Coverage Summary</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
								<span className="text-gray-600 text-sm">Annual Maximum</span>
								<span className="font-medium text-gray-900">$1,500</span>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
								<span className="text-gray-600 text-sm">Used This Year</span>
								<span className="font-medium text-gray-900">$450</span>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
								<span className="text-gray-600 text-sm">Remaining</span>
								<span className="font-medium text-green-600">$1,050</span>
							</div>
						</div>
					</div>

					<div>
						<h3 className="mb-3 font-medium text-gray-900">
							Pre-Authorization Status
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
								<div>
									<p className="font-medium text-sm text-yellow-800">
										Root Canal + Crown
									</p>
									<p className="text-xs text-yellow-600">Tooth #3</p>
								</div>
								<Badge className="bg-yellow-500 text-white">Pending</Badge>
							</div>
							<Button variant="outline" className="w-full">
								<DollarSign className="mr-2 h-4 w-4" />
								Submit New Pre-Auth
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
