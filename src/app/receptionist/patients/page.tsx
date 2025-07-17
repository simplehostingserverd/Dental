"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Edit,
	Eye,
	FileText,
	Filter,
	Mail,
	MapPin,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Shield,
	Upload,
	User,
	UserPlus,
	XCircle,
} from "lucide-react";
import { useState } from "react";

// Mock patient data
const patients = [
	{
		id: "p1",
		firstName: "Sarah",
		lastName: "Johnson",
		dateOfBirth: "1985-03-15",
		phone: "(555) 123-4567",
		email: "sarah.johnson@email.com",
		address: "123 Main St, Anytown, ST 12345",
		insurance: {
			provider: "Blue Cross Blue Shield",
			policyNumber: "BC123456789",
			groupNumber: "GRP001",
			status: "verified",
			lastVerified: "2025-07-10",
		},
		medicalAlerts: ["Penicillin allergy", "High blood pressure"],
		balance: 0,
		lastVisit: "2025-06-15",
		nextAppointment: "2025-07-20",
		status: "active",
		emergencyContact: {
			name: "John Johnson",
			phone: "(555) 123-4568",
			relationship: "Spouse",
		},
	},
	{
		id: "p2",
		firstName: "Michael",
		lastName: "Chen",
		dateOfBirth: "1978-11-22",
		phone: "(555) 234-5678",
		email: "michael.chen@email.com",
		address: "456 Oak Ave, Anytown, ST 12345",
		insurance: {
			provider: "Aetna",
			policyNumber: "AET987654321",
			groupNumber: "GRP002",
			status: "pending",
			lastVerified: "2025-06-01",
		},
		medicalAlerts: ["Latex allergy"],
		balance: 150.0,
		lastVisit: "2025-07-01",
		nextAppointment: null,
		status: "active",
		emergencyContact: {
			name: "Lisa Chen",
			phone: "(555) 234-5679",
			relationship: "Wife",
		},
	},
	{
		id: "p3",
		firstName: "Emily",
		lastName: "Davis",
		dateOfBirth: "1992-07-08",
		phone: "(555) 345-6789",
		email: "emily.davis@email.com",
		address: "789 Pine St, Anytown, ST 12345",
		insurance: {
			provider: "Cigna",
			policyNumber: "CIG456789123",
			groupNumber: "GRP003",
			status: "expired",
			lastVerified: "2024-12-15",
		},
		medicalAlerts: [],
		balance: 75.5,
		lastVisit: "2025-05-20",
		nextAppointment: "2025-07-18",
		status: "active",
		emergencyContact: {
			name: "Robert Davis",
			phone: "(555) 345-6790",
			relationship: "Father",
		},
	},
];

export default function PatientsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedPatient, setSelectedPatient] = useState<
		(typeof patients)[0] | null
	>(null);
	const [showNewPatientForm, setShowNewPatientForm] = useState(false);
	const [newPatientData, setNewPatientData] = useState({
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		phone: "",
		email: "",
		address: "",
		emergencyContactName: "",
		emergencyContactPhone: "",
		emergencyContactRelationship: "",
		insuranceProvider: "",
		policyNumber: "",
		groupNumber: "",
	});

	const filteredPatients = patients.filter((patient) => {
		const matchesSearch =
			patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.phone.includes(searchTerm) ||
			patient.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || patient.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getInsuranceStatusColor = (status: string) => {
		switch (status) {
			case "verified":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "expired":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getBalanceColor = (balance: number) => {
		if (balance === 0) return "text-green-600";
		if (balance > 0) return "text-red-600";
		return "text-gray-600";
	};

	const handleNewPatientSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Submit new patient data
		console.log("New patient data:", newPatientData);
		setShowNewPatientForm(false);
		setNewPatientData({
			firstName: "",
			lastName: "",
			dateOfBirth: "",
			phone: "",
			email: "",
			address: "",
			emergencyContactName: "",
			emergencyContactPhone: "",
			emergencyContactRelationship: "",
			insuranceProvider: "",
			policyNumber: "",
			groupNumber: "",
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Patient Management
					</h1>
					<p className="text-gray-600">
						Search patients, manage demographics, and handle intake
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline">
						<Upload className="mr-2 h-4 w-4" />
						Import Patients
					</Button>
					<Dialog
						open={showNewPatientForm}
						onOpenChange={setShowNewPatientForm}
					>
						<DialogTrigger asChild>
							<Button>
								<UserPlus className="mr-2 h-4 w-4" />
								New Patient
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
							<DialogHeader>
								<DialogTitle>New Patient Intake</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleNewPatientSubmit} className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="firstName">First Name *</Label>
										<Input
											id="firstName"
											value={newPatientData.firstName}
											onChange={(e) =>
												setNewPatientData((prev) => ({
													...prev,
													firstName: e.target.value,
												}))
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="lastName">Last Name *</Label>
										<Input
											id="lastName"
											value={newPatientData.lastName}
											onChange={(e) =>
												setNewPatientData((prev) => ({
													...prev,
													lastName: e.target.value,
												}))
											}
											required
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="dateOfBirth">Date of Birth *</Label>
										<Input
											id="dateOfBirth"
											type="date"
											value={newPatientData.dateOfBirth}
											onChange={(e) =>
												setNewPatientData((prev) => ({
													...prev,
													dateOfBirth: e.target.value,
												}))
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="phone">Phone Number *</Label>
										<Input
											id="phone"
											value={newPatientData.phone}
											onChange={(e) =>
												setNewPatientData((prev) => ({
													...prev,
													phone: e.target.value,
												}))
											}
											placeholder="(555) 123-4567"
											required
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										value={newPatientData.email}
										onChange={(e) =>
											setNewPatientData((prev) => ({
												...prev,
												email: e.target.value,
											}))
										}
									/>
								</div>

								<div>
									<Label htmlFor="address">Address</Label>
									<Textarea
										id="address"
										value={newPatientData.address}
										onChange={(e) =>
											setNewPatientData((prev) => ({
												...prev,
												address: e.target.value,
											}))
										}
										rows={2}
									/>
								</div>

								<div className="border-t pt-4">
									<h3 className="mb-3 font-medium text-lg">
										Emergency Contact
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="emergencyContactName">Contact Name</Label>
											<Input
												id="emergencyContactName"
												value={newPatientData.emergencyContactName}
												onChange={(e) =>
													setNewPatientData((prev) => ({
														...prev,
														emergencyContactName: e.target.value,
													}))
												}
											/>
										</div>
										<div>
											<Label htmlFor="emergencyContactPhone">
												Contact Phone
											</Label>
											<Input
												id="emergencyContactPhone"
												value={newPatientData.emergencyContactPhone}
												onChange={(e) =>
													setNewPatientData((prev) => ({
														...prev,
														emergencyContactPhone: e.target.value,
													}))
												}
											/>
										</div>
									</div>
									<div className="mt-4">
										<Label htmlFor="emergencyContactRelationship">
											Relationship
										</Label>
										<Select
											value={newPatientData.emergencyContactRelationship}
											onValueChange={(value) =>
												setNewPatientData((prev) => ({
													...prev,
													emergencyContactRelationship: value,
												}))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select relationship" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="spouse">Spouse</SelectItem>
												<SelectItem value="parent">Parent</SelectItem>
												<SelectItem value="child">Child</SelectItem>
												<SelectItem value="sibling">Sibling</SelectItem>
												<SelectItem value="friend">Friend</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="border-t pt-4">
									<h3 className="mb-3 font-medium text-lg">
										Insurance Information
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="insuranceProvider">
												Insurance Provider
											</Label>
											<Input
												id="insuranceProvider"
												value={newPatientData.insuranceProvider}
												onChange={(e) =>
													setNewPatientData((prev) => ({
														...prev,
														insuranceProvider: e.target.value,
													}))
												}
											/>
										</div>
										<div>
											<Label htmlFor="policyNumber">Policy Number</Label>
											<Input
												id="policyNumber"
												value={newPatientData.policyNumber}
												onChange={(e) =>
													setNewPatientData((prev) => ({
														...prev,
														policyNumber: e.target.value,
													}))
												}
											/>
										</div>
									</div>
									<div className="mt-4">
										<Label htmlFor="groupNumber">Group Number</Label>
										<Input
											id="groupNumber"
											value={newPatientData.groupNumber}
											onChange={(e) =>
												setNewPatientData((prev) => ({
													...prev,
													groupNumber: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<div className="flex justify-end space-x-3 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowNewPatientForm(false)}
									>
										Cancel
									</Button>
									<Button type="submit">Create Patient</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="flex items-center space-x-4">
				<div className="relative max-w-md flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search patients by name, phone, or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							<Filter className="mr-2 h-4 w-4" />
							Status: {statusFilter === "all" ? "All" : statusFilter}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => setStatusFilter("all")}>
							All Patients
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("active")}>
							Active
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
							Inactive
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Patients List */}
			<div className="space-y-4">
				{filteredPatients.length > 0 ? (
					filteredPatients.map((patient) => (
						<Card
							key={patient.id}
							className="transition-shadow hover:shadow-md"
						>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-start space-x-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
											<User className="h-6 w-6 text-blue-600" />
										</div>
										<div className="flex-1">
											<div className="mb-2 flex items-center space-x-3">
												<h3 className="font-medium text-gray-900 text-lg">
													{patient.firstName} {patient.lastName}
												</h3>
												<Badge
													className={getInsuranceStatusColor(
														patient.insurance.status,
													)}
												>
													{patient.insurance.status === "verified" && (
														<CheckCircle className="mr-1 h-3 w-3" />
													)}
													{patient.insurance.status === "pending" && (
														<Clock className="mr-1 h-3 w-3" />
													)}
													{patient.insurance.status === "expired" && (
														<XCircle className="mr-1 h-3 w-3" />
													)}
													Insurance {patient.insurance.status}
												</Badge>
												{patient.medicalAlerts.length > 0 && (
													<Badge className="bg-red-100 text-red-800">
														<AlertTriangle className="mr-1 h-3 w-3" />
														{patient.medicalAlerts.length} Alert
														{patient.medicalAlerts.length > 1 ? "s" : ""}
													</Badge>
												)}
												{patient.balance > 0 && (
													<Badge className="bg-orange-100 text-orange-800">
														<DollarSign className="mr-1 h-3 w-3" />$
														{patient.balance}
													</Badge>
												)}
											</div>
											<div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
												<div className="flex items-center">
													<Phone className="mr-2 h-4 w-4" />
													{patient.phone}
												</div>
												<div className="flex items-center">
													<Mail className="mr-2 h-4 w-4" />
													{patient.email}
												</div>
												<div className="flex items-center">
													<Calendar className="mr-2 h-4 w-4" />
													DOB:{" "}
													{new Date(patient.dateOfBirth).toLocaleDateString()}
												</div>
												<div className="flex items-center">
													<Shield className="mr-2 h-4 w-4" />
													{patient.insurance.provider}
												</div>
											</div>
											{patient.medicalAlerts.length > 0 && (
												<div className="mt-2 text-sm">
													<span className="font-medium text-red-600">
														Medical Alerts:
													</span>
													<span className="ml-2 text-red-600">
														{patient.medicalAlerts.join(", ")}
													</span>
												</div>
											)}
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSelectedPatient(patient)}
										>
											<Eye className="mr-1 h-4 w-4" />
											View
										</Button>
										<Button variant="ghost" size="sm">
											<Edit className="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="sm">
											<Phone className="h-4 w-4" />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>
													Schedule Appointment
												</DropdownMenuItem>
												<DropdownMenuItem>Verify Insurance</DropdownMenuItem>
												<DropdownMenuItem>Send Forms</DropdownMenuItem>
												<DropdownMenuItem>View History</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">
													Deactivate Patient
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="flex h-64 flex-col items-center justify-center">
							<User className="mb-4 h-12 w-12 text-gray-400" />
							<p className="text-gray-500">No patients found</p>
							<p className="text-gray-400 text-sm">
								Try adjusting your search or add a new patient
							</p>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Patient Details Modal */}
			{selectedPatient && (
				<Dialog
					open={!!selectedPatient}
					onOpenChange={() => setSelectedPatient(null)}
				>
					<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{selectedPatient.firstName} {selectedPatient.lastName}
							</DialogTitle>
						</DialogHeader>
						<Tabs defaultValue="demographics" className="space-y-4">
							<TabsList>
								<TabsTrigger value="demographics">Demographics</TabsTrigger>
								<TabsTrigger value="insurance">Insurance</TabsTrigger>
								<TabsTrigger value="medical">Medical Info</TabsTrigger>
								<TabsTrigger value="billing">Billing</TabsTrigger>
							</TabsList>

							<TabsContent value="demographics" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label>Full Name</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.firstName} {selectedPatient.lastName}
										</p>
									</div>
									<div>
										<Label>Date of Birth</Label>
										<p className="text-gray-900 text-sm">
											{new Date(
												selectedPatient.dateOfBirth,
											).toLocaleDateString()}
										</p>
									</div>
									<div>
										<Label>Phone</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.phone}
										</p>
									</div>
									<div>
										<Label>Email</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.email}
										</p>
									</div>
									<div className="col-span-2">
										<Label>Address</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.address}
										</p>
									</div>
									<div className="col-span-2">
										<Label>Emergency Contact</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.emergencyContact.name} (
											{selectedPatient.emergencyContact.relationship}) -{" "}
											{selectedPatient.emergencyContact.phone}
										</p>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="insurance" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label>Insurance Provider</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.insurance.provider}
										</p>
									</div>
									<div>
										<Label>Status</Label>
										<Badge
											className={getInsuranceStatusColor(
												selectedPatient.insurance.status,
											)}
										>
											{selectedPatient.insurance.status}
										</Badge>
									</div>
									<div>
										<Label>Policy Number</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.insurance.policyNumber}
										</p>
									</div>
									<div>
										<Label>Group Number</Label>
										<p className="text-gray-900 text-sm">
											{selectedPatient.insurance.groupNumber}
										</p>
									</div>
									<div>
										<Label>Last Verified</Label>
										<p className="text-gray-900 text-sm">
											{new Date(
												selectedPatient.insurance.lastVerified,
											).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex space-x-2">
									<Button size="sm">Verify Insurance</Button>
									<Button variant="outline" size="sm">
										Upload Card
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="medical" className="space-y-4">
								<div>
									<Label>Medical Alerts</Label>
									{selectedPatient.medicalAlerts.length > 0 ? (
										<div className="space-y-2">
											{selectedPatient.medicalAlerts.map((alert, index) => (
												<Badge
													key={index}
													className="mr-2 bg-red-100 text-red-800"
												>
													<AlertTriangle className="mr-1 h-3 w-3" />
													{alert}
												</Badge>
											))}
										</div>
									) : (
										<p className="text-gray-500 text-sm">
											No medical alerts on file
										</p>
									)}
								</div>
								<div className="flex space-x-2">
									<Button size="sm">Add Alert</Button>
									<Button variant="outline" size="sm">
										Medical History
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="billing" className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label>Current Balance</Label>
										<p
											className={`font-semibold text-lg ${getBalanceColor(selectedPatient.balance)}`}
										>
											${selectedPatient.balance.toFixed(2)}
										</p>
									</div>
									<div>
										<Label>Last Visit</Label>
										<p className="text-gray-900 text-sm">
											{new Date(selectedPatient.lastVisit).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex space-x-2">
									<Button size="sm">Process Payment</Button>
									<Button variant="outline" size="sm">
										View Statements
									</Button>
									<Button variant="outline" size="sm">
										Send Invoice
									</Button>
								</div>
							</TabsContent>
						</Tabs>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
