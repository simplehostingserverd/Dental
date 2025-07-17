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
	Download,
	Edit,
	Eye,
	FileCheck,
	FileImage,
	FileText,
	Filter,
	MoreHorizontal,
	Plus,
	Search,
	Send,
	Shield,
	Signature,
	Trash2,
	Upload,
	User,
	XCircle,
} from "lucide-react";
import { useState } from "react";

// Mock data
const documents = [
	{
		id: "1",
		name: "Insurance Card - Front",
		type: "insurance_card",
		patient: "Sarah Johnson",
		uploadedAt: "2025-07-17T10:30:00",
		fileSize: "2.4 MB",
		status: "verified",
		isRequired: true,
		expiresAt: "2025-12-31",
	},
	{
		id: "2",
		name: "Medical History Form",
		type: "medical_history",
		patient: "Michael Chen",
		uploadedAt: "2025-07-16T14:20:00",
		fileSize: "1.8 MB",
		status: "pending_review",
		isRequired: true,
		expiresAt: null,
	},
	{
		id: "3",
		name: "Consent for Treatment",
		type: "consent_form",
		patient: "Emily Davis",
		uploadedAt: "2025-07-15T09:15:00",
		fileSize: "856 KB",
		status: "signed",
		isRequired: true,
		expiresAt: null,
	},
	{
		id: "4",
		name: "X-Ray Results",
		type: "xray",
		patient: "David Wilson",
		uploadedAt: "2025-07-14T16:45:00",
		fileSize: "5.2 MB",
		status: "reviewed",
		isRequired: false,
		expiresAt: null,
	},
];

const formTemplates = [
	{
		id: "1",
		name: "New Patient Intake Form",
		description: "Comprehensive intake form for new patients",
		fields: 15,
		isActive: true,
		lastUpdated: "2025-07-10",
	},
	{
		id: "2",
		name: "Medical History Update",
		description: "Annual medical history update form",
		fields: 8,
		isActive: true,
		lastUpdated: "2025-07-05",
	},
	{
		id: "3",
		name: "Consent for Sedation",
		description: "Consent form for sedation procedures",
		fields: 6,
		isActive: true,
		lastUpdated: "2025-06-28",
	},
	{
		id: "4",
		name: "Financial Agreement",
		description: "Payment and financial responsibility agreement",
		fields: 10,
		isActive: false,
		lastUpdated: "2025-06-15",
	},
];

const pendingSignatures = [
	{
		id: "1",
		patient: "John Smith",
		document: "Treatment Plan Consent",
		sentAt: "2025-07-17T08:30:00",
		status: "pending",
		remindersSent: 1,
	},
	{
		id: "2",
		patient: "Maria Garcia",
		document: "Financial Agreement",
		sentAt: "2025-07-16T15:20:00",
		status: "viewed",
		remindersSent: 0,
	},
	{
		id: "3",
		patient: "Robert Taylor",
		document: "Consent for Extraction",
		sentAt: "2025-07-15T11:10:00",
		status: "signed",
		remindersSent: 2,
	},
];

export default function DocumentsPage() {
	const [showUploadDialog, setShowUploadDialog] = useState(false);
	const [showFormDialog, setShowFormDialog] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedPatient, setSelectedPatient] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const getStatusColor = (status: string) => {
		switch (status) {
			case "verified":
				return "bg-green-100 text-green-800";
			case "signed":
				return "bg-green-100 text-green-800";
			case "reviewed":
				return "bg-blue-100 text-blue-800";
			case "pending_review":
				return "bg-yellow-100 text-yellow-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "viewed":
				return "bg-blue-100 text-blue-800";
			case "expired":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "verified":
				return <CheckCircle className="h-4 w-4" />;
			case "signed":
				return <Signature className="h-4 w-4" />;
			case "reviewed":
				return <Eye className="h-4 w-4" />;
			case "pending_review":
				return <Clock className="h-4 w-4" />;
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "viewed":
				return <Eye className="h-4 w-4" />;
			case "expired":
				return <XCircle className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const getDocumentIcon = (type: string) => {
		switch (type) {
			case "insurance_card":
				return <Shield className="h-5 w-5" />;
			case "xray":
				return <FileImage className="h-5 w-5" />;
			case "consent_form":
				return <FileCheck className="h-5 w-5" />;
			default:
				return <FileText className="h-5 w-5" />;
		}
	};

	const handleFileUpload = () => {
		if (!selectedFile || !selectedPatient || !documentType) {
			alert("Please fill in all required fields");
			return;
		}

		// TODO: Implement file upload
		console.log("Uploading file:", {
			selectedFile,
			selectedPatient,
			documentType,
		});
		setShowUploadDialog(false);
		setSelectedFile(null);
		setSelectedPatient("");
		setDocumentType("");
	};

	const handleSendForm = (templateId: string) => {
		// TODO: Implement form sending
		console.log("Sending form:", templateId);
	};

	const filteredDocuments = documents.filter(
		(doc) =>
			doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doc.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doc.type.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Document Management
					</h1>
					<p className="text-gray-600">
						Manage patient documents, forms, and digital signatures
					</p>
				</div>
				<div className="flex space-x-3">
					<Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
						<DialogTrigger asChild>
							<Button type="button" variant="outline">
								<Send className="mr-2 h-4 w-4" />
								Send Form
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Send Form to Patient</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Patient</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select patient" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="patient1">Sarah Johnson</SelectItem>
											<SelectItem value="patient2">Michael Chen</SelectItem>
											<SelectItem value="patient3">Emily Davis</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Form Template</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select form" />
										</SelectTrigger>
										<SelectContent>
											{formTemplates.map((template) => (
												<SelectItem key={template.id} value={template.id}>
													{template.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Message (Optional)</Label>
									<Textarea placeholder="Add a personal message..." rows={3} />
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowFormDialog(false)}
									>
										Cancel
									</Button>
									<Button type="button">
										<Send className="mr-2 h-4 w-4" />
										Send Form
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
						<DialogTrigger asChild>
							<Button type="button">
								<Upload className="mr-2 h-4 w-4" />
								Upload Document
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Upload Document</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Patient</Label>
									<Select
										value={selectedPatient}
										onValueChange={setSelectedPatient}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select patient" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="patient1">Sarah Johnson</SelectItem>
											<SelectItem value="patient2">Michael Chen</SelectItem>
											<SelectItem value="patient3">Emily Davis</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Document Type</Label>
									<Select value={documentType} onValueChange={setDocumentType}>
										<SelectTrigger>
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="insurance_card">
												Insurance Card
											</SelectItem>
											<SelectItem value="id_document">ID Document</SelectItem>
											<SelectItem value="medical_history">
												Medical History
											</SelectItem>
											<SelectItem value="consent_form">Consent Form</SelectItem>
											<SelectItem value="xray">X-Ray</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>File</Label>
									<Input
										type="file"
										onChange={(e) =>
											setSelectedFile(e.target.files?.[0] || null)
										}
										accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
									/>
									<p className="mt-1 text-gray-500 text-xs">
										Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
									</p>
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowUploadDialog(false)}
									>
										Cancel
									</Button>
									<Button type="button" onClick={handleFileUpload}>
										<Upload className="mr-2 h-4 w-4" />
										Upload
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Total Documents
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{documents.length}</div>
						<p className="text-muted-foreground text-xs">
							{documents.filter((d) => d.isRequired).length} required documents
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Pending Review
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{documents.filter((d) => d.status === "pending_review").length}
						</div>
						<p className="text-muted-foreground text-xs">Require attention</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Pending Signatures
						</CardTitle>
						<Signature className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{pendingSignatures.filter((s) => s.status === "pending").length}
						</div>
						<p className="text-muted-foreground text-xs">
							Awaiting patient signatures
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Expiring Soon</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">2</div>
						<p className="text-muted-foreground text-xs">
							Documents expire within 30 days
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Document Tabs */}
			<Tabs defaultValue="documents" className="space-y-4">
				<TabsList>
					<TabsTrigger value="documents">Patient Documents</TabsTrigger>
					<TabsTrigger value="forms">Form Templates</TabsTrigger>
					<TabsTrigger value="signatures">Digital Signatures</TabsTrigger>
					<TabsTrigger value="compliance">Compliance</TabsTrigger>
				</TabsList>

				{/* Patient Documents Tab */}
				<TabsContent value="documents" className="space-y-4">
					<div className="flex items-center space-x-4">
						<div className="relative max-w-md flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search documents..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button type="button" variant="outline">
							<Filter className="mr-2 h-4 w-4" />
							Filter
						</Button>
					</div>

					<div className="space-y-4">
						{filteredDocuments.map((document) => (
							<Card key={document.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
												{getDocumentIcon(document.type)}
											</div>
											<div>
												<h4 className="font-medium">{document.name}</h4>
												<p className="text-gray-600 text-sm">
													<User className="mr-1 inline h-3 w-3" />
													{document.patient}
												</p>
												<p className="text-gray-500 text-xs">
													<Calendar className="mr-1 inline h-3 w-3" />
													{new Date(document.uploadedAt).toLocaleDateString()} •{" "}
													{document.fileSize}
												</p>
												{document.expiresAt && (
													<p className="text-orange-600 text-xs">
														Expires:{" "}
														{new Date(document.expiresAt).toLocaleDateString()}
													</p>
												)}
											</div>
										</div>
										<div className="text-right">
											<Badge className={getStatusColor(document.status)}>
												{getStatusIcon(document.status)}
												<span className="ml-1">
													{document.status.replace("_", " ")}
												</span>
											</Badge>
											{document.isRequired && (
												<Badge variant="outline" className="ml-2">
													Required
												</Badge>
											)}
											<div className="mt-2 flex space-x-2">
												<Button type="button" variant="outline" size="sm">
													<Eye className="h-4 w-4" />
												</Button>
												<Button type="button" variant="outline" size="sm">
													<Download className="h-4 w-4" />
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button type="button" variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>Edit Details</DropdownMenuItem>
														<DropdownMenuItem>
															Share with Patient
														</DropdownMenuItem>
														<DropdownMenuItem>
															Request Signature
														</DropdownMenuItem>
														<DropdownMenuItem className="text-red-600">
															Delete Document
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Form Templates Tab */}
				<TabsContent value="forms" className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-lg">Form Templates</h3>
						<Button type="button" variant="outline">
							<Plus className="mr-2 h-4 w-4" />
							Create Template
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{formTemplates.map((template) => (
							<Card key={template.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-base">{template.name}</CardTitle>
										<Badge
											variant={template.isActive ? "default" : "secondary"}
										>
											{template.isActive ? "Active" : "Inactive"}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-gray-600 text-sm">
										{template.description}
									</p>
									<div className="mb-4 flex items-center justify-between text-gray-500 text-sm">
										<span>{template.fields} fields</span>
										<span>
											Updated{" "}
											{new Date(template.lastUpdated).toLocaleDateString()}
										</span>
									</div>
									<div className="flex space-x-2">
										<Button
											type="button"
											size="sm"
											onClick={() => handleSendForm(template.id)}
										>
											Send to Patient
										</Button>
										<Button type="button" variant="outline" size="sm">
											<Edit className="h-4 w-4" />
										</Button>
										<Button type="button" variant="outline" size="sm">
											<Eye className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Digital Signatures Tab */}
				<TabsContent value="signatures" className="space-y-4">
					<div className="space-y-4">
						{pendingSignatures.map((signature) => (
							<Card key={signature.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
												<Signature className="h-5 w-5 text-purple-600" />
											</div>
											<div>
												<h4 className="font-medium">{signature.patient}</h4>
												<p className="text-gray-600 text-sm">
													{signature.document}
												</p>
												<p className="text-gray-500 text-xs">
													Sent:{" "}
													{new Date(signature.sentAt).toLocaleDateString()}
												</p>
												{signature.remindersSent > 0 && (
													<p className="text-orange-600 text-xs">
														{signature.remindersSent} reminder
														{signature.remindersSent > 1 ? "s" : ""} sent
													</p>
												)}
											</div>
										</div>
										<div className="text-right">
											<Badge className={getStatusColor(signature.status)}>
												{getStatusIcon(signature.status)}
												<span className="ml-1">{signature.status}</span>
											</Badge>
											<div className="mt-2 flex space-x-2">
												{signature.status === "pending" && (
													<Button size="sm">Send Reminder</Button>
												)}
												<Button variant="outline" size="sm">
													View Document
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Compliance Tab */}
				<TabsContent value="compliance" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">HIPAA Compliance</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="mb-4 flex items-center space-x-2">
									<CheckCircle className="h-5 w-5 text-green-600" />
									<span className="font-medium text-sm">Compliant</span>
								</div>
								<p className="mb-4 text-gray-600 text-sm">
									All documents are encrypted and access is logged.
								</p>
								<Button variant="outline" className="w-full">
									View Audit Log
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Document Retention</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="mb-4 flex items-center space-x-2">
									<Clock className="h-5 w-5 text-yellow-600" />
									<span className="font-medium text-sm">2 Expiring Soon</span>
								</div>
								<p className="mb-4 text-gray-600 text-sm">
									Documents expiring within 30 days require attention.
								</p>
								<Button variant="outline" className="w-full">
									View Expiring
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Backup Status</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="mb-4 flex items-center space-x-2">
									<CheckCircle className="h-5 w-5 text-green-600" />
									<span className="font-medium text-sm">Up to Date</span>
								</div>
								<p className="mb-4 text-gray-600 text-sm">
									Last backup: Today at 3:00 AM
								</p>
								<Button variant="outline" className="w-full">
									Backup Settings
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
