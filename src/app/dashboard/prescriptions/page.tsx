"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	ArrowLeft,
	Calendar,
	Edit,
	Eye,
	Filter,
	MoreHorizontal,
	Pill,
	Plus,
	Search,
	Trash2,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Prescription {
	id: string;
	drugName: string;
	dosage: string;
	issuedAt: string;
	patientId: string;
	patient: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		dateOfBirth: string;
	};
}

interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth: string;
}

export default function PrescriptionsPage() {
	const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterPatient, setFilterPatient] = useState("all");
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingPrescription, setEditingPrescription] =
		useState<Prescription | null>(null);
	const [formData, setFormData] = useState({
		drugName: "",
		dosage: "",
		patientId: "",
		instructions: "",
	});
	const [isSaving, setIsSaving] = useState(false);

	// Fetch prescriptions and patients from API
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Fetch prescriptions
				const prescriptionsResponse = await fetch(
					"/api/dashboard/prescriptions",
				);
				if (prescriptionsResponse.ok) {
					const prescriptionsData = await prescriptionsResponse.json();
					setPrescriptions(prescriptionsData.prescriptions || []);
				}

				// Fetch patients
				const patientsResponse = await fetch("/api/dashboard/patients");
				if (patientsResponse.ok) {
					const patientsData = await patientsResponse.json();
					setPatients(patientsData.patients || []);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredPrescriptions = prescriptions.filter((prescription) => {
		const matchesSearch =
			prescription.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			prescription.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
			prescription.patient.firstName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			prescription.patient.lastName
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesFilter =
			filterPatient === "all" || prescription.patientId === filterPatient;

		return matchesSearch && matchesFilter;
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString([], {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const handleCreatePrescription = async () => {
		if (
			!formData.drugName.trim() ||
			!formData.dosage.trim() ||
			!formData.patientId
		)
			return;

		setIsSaving(true);
		try {
			const response = await fetch("/api/dashboard/prescriptions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					drugName: formData.drugName.trim(),
					dosage: formData.dosage.trim(),
					patientId: formData.patientId,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setPrescriptions((prev) => [data.prescription, ...prev]);
				setFormData({
					drugName: "",
					dosage: "",
					patientId: "",
					instructions: "",
				});
				setShowCreateForm(false);
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to create prescription");
			}
		} catch (error) {
			console.error("Error creating prescription:", error);
			alert("Error creating prescription");
		} finally {
			setIsSaving(false);
		}
	};

	const handleUpdatePrescription = async () => {
		if (
			!editingPrescription ||
			!formData.drugName.trim() ||
			!formData.dosage.trim()
		)
			return;

		setIsSaving(true);
		try {
			const response = await fetch(
				`/api/dashboard/prescriptions/${editingPrescription.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						drugName: formData.drugName.trim(),
						dosage: formData.dosage.trim(),
					}),
				},
			);

			if (response.ok) {
				const data = await response.json();
				setPrescriptions((prev) =>
					prev.map((p) =>
						p.id === editingPrescription.id ? data.prescription : p,
					),
				);
				setFormData({
					drugName: "",
					dosage: "",
					patientId: "",
					instructions: "",
				});
				setEditingPrescription(null);
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to update prescription");
			}
		} catch (error) {
			console.error("Error updating prescription:", error);
			alert("Error updating prescription");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeletePrescription = async (prescriptionId: string) => {
		if (!confirm("Are you sure you want to delete this prescription?")) return;

		try {
			const response = await fetch(
				`/api/dashboard/prescriptions/${prescriptionId}`,
				{
					method: "DELETE",
				},
			);

			if (response.ok) {
				setPrescriptions((prev) => prev.filter((p) => p.id !== prescriptionId));
			} else {
				const errorData = await response.json();
				alert(errorData.error || "Failed to delete prescription");
			}
		} catch (error) {
			console.error("Error deleting prescription:", error);
			alert("Error deleting prescription");
		}
	};

	const startEdit = (prescription: Prescription) => {
		setEditingPrescription(prescription);
		setFormData({
			drugName: prescription.drugName,
			dosage: prescription.dosage,
			patientId: prescription.patientId,
			instructions: "",
		});
	};

	const cancelEdit = () => {
		setEditingPrescription(null);
		setFormData({ drugName: "", dosage: "", patientId: "", instructions: "" });
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Prescriptions
					</h1>
					<p className="text-gray-600">
						Manage patient prescriptions and medication records
					</p>
				</div>
				<Button onClick={() => setShowCreateForm(true)}>
					<Plus className="mr-2 h-4 w-4" />
					New Prescription
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="flex items-center space-x-4">
				<div className="relative max-w-md flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search prescriptions or patients..."
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Select value={filterPatient} onValueChange={setFilterPatient}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Filter by patient" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Patients</SelectItem>
						{patients.map((patient) => (
							<SelectItem key={patient.id} value={patient.id}>
								{patient.firstName} {patient.lastName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Prescriptions Table */}
			<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-gray-200 border-b px-6 py-4">
					<h2 className="font-semibold text-gray-900 text-lg">
						Prescriptions ({filteredPrescriptions.length})
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Patient
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Medication
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Dosage
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Issued Date
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{isLoading ? (
								<tr>
									<td colSpan={5} className="px-6 py-12 text-center">
										<div className="text-gray-500">
											Loading prescriptions...
										</div>
									</td>
								</tr>
							) : filteredPrescriptions.length > 0 ? (
								filteredPrescriptions.map((prescription) => (
									<tr key={prescription.id} className="hover:bg-gray-50">
										<td className="whitespace-nowrap px-6 py-4">
											<div className="flex items-center">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-sm text-white">
													{prescription.patient.firstName.charAt(0)}
													{prescription.patient.lastName.charAt(0)}
												</div>
												<div className="ml-4">
													<div className="font-medium text-gray-900 text-sm">
														{prescription.patient.firstName}{" "}
														{prescription.patient.lastName}
													</div>
													<div className="text-gray-500 text-sm">
														{prescription.patient.email}
													</div>
												</div>
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
											{prescription.drugName}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
											{prescription.dosage}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
											{formatDate(prescription.issuedAt)}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => startEdit(prescription)}
													>
														<Edit className="mr-2 h-4 w-4" />
														Edit Prescription
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-red-600"
														onClick={() =>
															handleDeletePrescription(prescription.id)
														}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete Prescription
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="px-6 py-12 text-center">
										<div className="flex flex-col items-center">
											<Pill className="mb-4 h-12 w-12 text-gray-400" />
											<p className="text-gray-500">No prescriptions found</p>
											<p className="text-gray-400 text-sm">
												Try adjusting your search or filter criteria
											</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Create Prescription Modal */}
			{showCreateForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 text-lg">
								New Prescription
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setShowCreateForm(false);
									setFormData({
										drugName: "",
										dosage: "",
										patientId: "",
										instructions: "",
									});
								}}
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</div>

						<div className="space-y-4">
							<div>
								<Label htmlFor="patient-select">Select Patient</Label>
								<Select
									value={formData.patientId}
									onValueChange={(value) =>
										setFormData((prev) => ({ ...prev, patientId: value }))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Choose a patient..." />
									</SelectTrigger>
									<SelectContent>
										{patients.map((patient) => (
											<SelectItem key={patient.id} value={patient.id}>
												{patient.firstName} {patient.lastName} - {patient.email}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="drug-name">Medication Name</Label>
								<Input
									id="drug-name"
									placeholder="Enter medication name..."
									value={formData.drugName}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											drugName: e.target.value,
										}))
									}
								/>
							</div>

							<div>
								<Label htmlFor="dosage">Dosage Instructions</Label>
								<Input
									id="dosage"
									placeholder="e.g., 500mg twice daily with food"
									value={formData.dosage}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, dosage: e.target.value }))
									}
								/>
							</div>

							<div>
								<Label htmlFor="instructions">
									Additional Instructions (Optional)
								</Label>
								<Textarea
									id="instructions"
									placeholder="Any additional instructions for the patient..."
									value={formData.instructions}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											instructions: e.target.value,
										}))
									}
									rows={3}
								/>
							</div>

							<div className="flex space-x-3">
								<Button
									onClick={handleCreatePrescription}
									disabled={
										!formData.drugName.trim() ||
										!formData.dosage.trim() ||
										!formData.patientId ||
										isSaving
									}
									className="flex-1"
								>
									<Pill className="mr-2 h-4 w-4" />
									{isSaving ? "Creating..." : "Create Prescription"}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setShowCreateForm(false);
										setFormData({
											drugName: "",
											dosage: "",
											patientId: "",
											instructions: "",
										});
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Edit Prescription Modal */}
			{editingPrescription && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 text-lg">
								Edit Prescription
							</h3>
							<Button variant="ghost" size="sm" onClick={cancelEdit}>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</div>

						<div className="space-y-4">
							<div>
								<Label>Patient</Label>
								<div className="flex items-center space-x-3 rounded-md border border-gray-300 bg-gray-50 p-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-medium text-sm text-white">
										{editingPrescription.patient.firstName.charAt(0)}
										{editingPrescription.patient.lastName.charAt(0)}
									</div>
									<div>
										<div className="font-medium text-gray-900 text-sm">
											{editingPrescription.patient.firstName}{" "}
											{editingPrescription.patient.lastName}
										</div>
										<div className="text-gray-500 text-sm">
											{editingPrescription.patient.email}
										</div>
									</div>
								</div>
							</div>

							<div>
								<Label htmlFor="edit-drug-name">Medication Name</Label>
								<Input
									id="edit-drug-name"
									placeholder="Enter medication name..."
									value={formData.drugName}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											drugName: e.target.value,
										}))
									}
								/>
							</div>

							<div>
								<Label htmlFor="edit-dosage">Dosage Instructions</Label>
								<Input
									id="edit-dosage"
									placeholder="e.g., 500mg twice daily with food"
									value={formData.dosage}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, dosage: e.target.value }))
									}
								/>
							</div>

							<div className="flex space-x-3">
								<Button
									onClick={handleUpdatePrescription}
									disabled={
										!formData.drugName.trim() ||
										!formData.dosage.trim() ||
										isSaving
									}
									className="flex-1"
								>
									<Pill className="mr-2 h-4 w-4" />
									{isSaving ? "Updating..." : "Update Prescription"}
								</Button>
								<Button variant="outline" onClick={cancelEdit}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
