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
	Archive,
	Calendar,
	Camera,
	CheckCircle,
	Clock,
	Download,
	Eye,
	FileImage,
	Filter,
	Folder,
	Monitor,
	Plus,
	RefreshCw,
	Search,
	Share,
	Shield,
	Upload,
	User,
	Zap,
} from "lucide-react";
import { useState } from "react";

interface ImagingStudy {
	id: string;
	patientId: string;
	patientName: string;
	studyType:
		| "bitewing"
		| "panoramic"
		| "periapical"
		| "cephalometric"
		| "cbct"
		| "intraoral-photo"
		| "extraoral-photo";
	studyDate: string;
	description: string;
	toothNumbers?: number[];
	images: ImageFile[];
	status: "pending" | "completed" | "reviewed" | "archived";
	technician: string;
	reviewedBy?: string;
	reviewDate?: string;
	notes?: string;
	dicomCompliant: boolean;
	fileSize: number;
	quality: "excellent" | "good" | "fair" | "poor";
}

interface ImageFile {
	id: string;
	filename: string;
	fileType: "DICOM" | "JPEG" | "PNG" | "TIFF";
	fileSize: number;
	uploadDate: string;
	thumbnailUrl?: string;
	fullImageUrl: string;
	annotations?: Annotation[];
}

interface Annotation {
	id: string;
	type: "measurement" | "note" | "arrow" | "circle" | "rectangle";
	coordinates: { x: number; y: number; width?: number; height?: number };
	text?: string;
	color: string;
	createdBy: string;
	createdDate: string;
}

export default function ImagingPage() {
	const [selectedStudy, setSelectedStudy] = useState<ImagingStudy | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");

	// Mock imaging studies data
	const [studies] = useState<ImagingStudy[]>([
		{
			id: "IMG-001",
			patientId: "p1",
			patientName: "Sarah Johnson",
			studyType: "panoramic",
			studyDate: "2025-01-15",
			description: "Routine panoramic radiograph for comprehensive exam",
			images: [
				{
					id: "img1",
					filename: "panoramic_001.dcm",
					fileType: "DICOM",
					fileSize: 2048000,
					uploadDate: "2025-01-15T10:30:00Z",
					fullImageUrl: "/images/panoramic_001.jpg",
					annotations: [],
				},
			],
			status: "reviewed",
			technician: "Dr. Smith",
			reviewedBy: "Dr. Johnson",
			reviewDate: "2025-01-15",
			notes: "Normal findings, no pathology detected",
			dicomCompliant: true,
			fileSize: 2048000,
			quality: "excellent",
		},
		{
			id: "IMG-002",
			patientId: "p2",
			patientName: "Michael Chen",
			studyType: "bitewing",
			studyDate: "2025-01-14",
			description: "Bitewing radiographs for caries detection",
			toothNumbers: [3, 4, 5, 12, 13, 14, 19, 20, 21, 28, 29, 30],
			images: [
				{
					id: "img2",
					filename: "bitewing_left.dcm",
					fileType: "DICOM",
					fileSize: 1024000,
					uploadDate: "2025-01-14T14:20:00Z",
					fullImageUrl: "/images/bitewing_left.jpg",
					annotations: [],
				},
				{
					id: "img3",
					filename: "bitewing_right.dcm",
					fileType: "DICOM",
					fileSize: 1024000,
					uploadDate: "2025-01-14T14:22:00Z",
					fullImageUrl: "/images/bitewing_right.jpg",
					annotations: [],
				},
			],
			status: "pending",
			technician: "Dr. Wilson",
			dicomCompliant: true,
			fileSize: 2048000,
			quality: "good",
		},
		{
			id: "IMG-003",
			patientId: "p3",
			patientName: "Emily Davis",
			studyType: "cbct",
			studyDate: "2025-01-12",
			description: "CBCT scan for implant planning",
			toothNumbers: [19],
			images: [
				{
					id: "img4",
					filename: "cbct_scan.dcm",
					fileType: "DICOM",
					fileSize: 15728640,
					uploadDate: "2025-01-12T09:15:00Z",
					fullImageUrl: "/images/cbct_scan.jpg",
					annotations: [],
				},
			],
			status: "completed",
			technician: "Dr. Brown",
			reviewedBy: "Dr. Johnson",
			reviewDate: "2025-01-13",
			notes: "Adequate bone volume for implant placement",
			dicomCompliant: true,
			fileSize: 15728640,
			quality: "excellent",
		},
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "reviewed":
				return "bg-blue-100 text-blue-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "archived":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getQualityColor = (quality: string) => {
		switch (quality) {
			case "excellent":
				return "bg-green-500 text-white";
			case "good":
				return "bg-blue-500 text-white";
			case "fair":
				return "bg-yellow-500 text-white";
			case "poor":
				return "bg-red-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	const getStudyTypeIcon = (type: string) => {
		switch (type) {
			case "panoramic":
				return Monitor;
			case "bitewing":
				return Camera;
			case "periapical":
				return Zap;
			case "cbct":
				return Archive;
			case "intraoral-photo":
				return FileImage;
			case "extraoral-photo":
				return FileImage;
			default:
				return Camera;
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const filteredStudies = studies.filter((study) => {
		const matchesSearch =
			study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			study.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			study.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = filterType === "all" || study.studyType === filterType;
		const matchesStatus =
			filterStatus === "all" || study.status === filterStatus;
		return matchesSearch && matchesType && matchesStatus;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
						Imaging Management
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						DICOM-compliant imaging with third-party integration
					</p>
				</div>
				<div className="flex space-x-3">
					<Button
						variant="outline"
						className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					>
						<Download className="mr-2 h-4 w-4" />
						Export Studies
					</Button>
					<Button
						variant="outline"
						className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					>
						<Upload className="mr-2 h-4 w-4" />
						Import DICOM
					</Button>
					<Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
						<Plus className="mr-2 h-4 w-4" />
						New Study
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<div className="flex items-center">
						<div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
							<FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="ml-4 flex-1">
							<p className="font-medium text-gray-600 text-sm dark:text-gray-300">
								Total Studies
							</p>
							<p className="font-semibold text-2xl text-gray-900 dark:text-white">
								156
							</p>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-gray-500 text-sm dark:text-gray-400">
							+12 this week
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<div className="flex items-center">
						<div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
							<Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div className="ml-4 flex-1">
							<p className="font-medium text-gray-600 text-sm dark:text-gray-300">
								DICOM Compliant
							</p>
							<p className="font-semibold text-2xl text-gray-900 dark:text-white">
								98%
							</p>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-gray-500 text-sm dark:text-gray-400">
							153 of 156 studies
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<div className="flex items-center">
						<div className="rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
							<Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
						</div>
						<div className="ml-4 flex-1">
							<p className="font-medium text-gray-600 text-sm dark:text-gray-300">
								Pending Review
							</p>
							<p className="font-semibold text-2xl text-gray-900 dark:text-white">
								8
							</p>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-gray-500 text-sm dark:text-gray-400">
							Requires attention
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<div className="flex items-center">
						<div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
							<Archive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div className="ml-4 flex-1">
							<p className="font-medium text-gray-600 text-sm dark:text-gray-300">
								Storage Used
							</p>
							<p className="font-semibold text-2xl text-gray-900 dark:text-white">
								2.4 GB
							</p>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-gray-500 text-sm dark:text-gray-400">
							of 10 GB limit
						</p>
					</div>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<Label htmlFor="search">Search Studies</Label>
						<div className="relative">
							<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
							<Input
								id="search"
								placeholder="Search by patient, ID, or description..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="type-filter">Study Type</Label>
						<Select value={filterType} onValueChange={setFilterType}>
							<SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="panoramic">Panoramic</SelectItem>
								<SelectItem value="bitewing">Bitewing</SelectItem>
								<SelectItem value="periapical">Periapical</SelectItem>
								<SelectItem value="cbct">CBCT</SelectItem>
								<SelectItem value="intraoral-photo">Intraoral Photo</SelectItem>
								<SelectItem value="extraoral-photo">Extraoral Photo</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="status-filter">Status</Label>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="reviewed">Reviewed</SelectItem>
								<SelectItem value="archived">Archived</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-end space-x-2">
						<Button
							variant="outline"
							className="flex-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Sync DICOM
						</Button>
					</div>
				</div>
			</div>

			{/* Imaging Studies List */}
			<div className="space-y-4">
				{filteredStudies.map((study) => {
					const StudyIcon = getStudyTypeIcon(study.studyType);
					return (
						<div
							key={study.id}
							className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center space-x-3">
										<StudyIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
										<h3 className="font-medium text-gray-900 text-lg dark:text-white">
											{study.id} -{" "}
											{study.studyType.replace("-", " ").toUpperCase()}
										</h3>
										<Badge className={getStatusColor(study.status)}>
											{study.status.toUpperCase()}
										</Badge>
										<Badge className={getQualityColor(study.quality)}>
											{study.quality.toUpperCase()}
										</Badge>
										{study.dicomCompliant && (
											<Badge
												variant="outline"
												className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
											>
												DICOM
											</Badge>
										)}
									</div>

									<div className="mt-2 flex items-center space-x-4 text-gray-600 text-sm dark:text-gray-300">
										<span className="flex items-center">
											<User className="mr-1 h-4 w-4" />
											{study.patientName}
										</span>
										<span className="flex items-center">
											<Calendar className="mr-1 h-4 w-4" />
											{study.studyDate}
										</span>
										<span className="flex items-center">
											<FileImage className="mr-1 h-4 w-4" />
											{study.images.length} image
											{study.images.length !== 1 ? "s" : ""}
										</span>
										<span className="flex items-center">
											<Archive className="mr-1 h-4 w-4" />
											{formatFileSize(study.fileSize)}
										</span>
									</div>

									<p className="mt-2 text-gray-600 dark:text-gray-300">
										{study.description}
									</p>

									{study.toothNumbers && (
										<div className="mt-2">
											<span className="text-gray-500 text-sm dark:text-gray-400">
												Teeth:{" "}
											</span>
											<span className="text-gray-700 text-sm dark:text-gray-300">
												{study.toothNumbers.join(", ")}
											</span>
										</div>
									)}

									{study.notes && (
										<div className="mt-2">
											<span className="text-gray-500 text-sm dark:text-gray-400">
												Notes:{" "}
											</span>
											<span className="text-gray-700 text-sm dark:text-gray-300">
												{study.notes}
											</span>
										</div>
									)}

									<div className="mt-4 flex items-center space-x-4 text-sm">
										<span className="text-gray-500 dark:text-gray-400">
											Technician:{" "}
											<span className="text-gray-700 dark:text-gray-300">
												{study.technician}
											</span>
										</span>
										{study.reviewedBy && (
											<span className="text-gray-500 dark:text-gray-400">
												Reviewed by:{" "}
												<span className="text-gray-700 dark:text-gray-300">
													{study.reviewedBy}
												</span>
											</span>
										)}
										{study.reviewDate && (
											<span className="text-gray-500 dark:text-gray-400">
												on {study.reviewDate}
											</span>
										)}
									</div>
								</div>

								<div className="ml-6 flex flex-col space-y-2">
									<Button
										size="sm"
										variant="outline"
										className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
									>
										<Eye className="mr-2 h-4 w-4" />
										View Images
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
									>
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
									>
										<Share className="mr-2 h-4 w-4" />
										Share
									</Button>
									{study.status === "pending" && (
										<Button
											size="sm"
											className="dark:bg-green-600 dark:hover:bg-green-700"
										>
											<CheckCircle className="mr-2 h-4 w-4" />
											Mark Reviewed
										</Button>
									)}
								</div>
							</div>

							{/* Image Thumbnails */}
							<div className="mt-4 border-gray-200 border-t pt-4 dark:border-gray-600">
								<h4 className="mb-3 font-medium text-gray-900 dark:text-white">
									Images ({study.images.length})
								</h4>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
									{study.images.map((image) => (
										<div key={image.id} className="group relative">
											<div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
												<div className="flex h-full items-center justify-center">
													<FileImage className="h-8 w-8 text-gray-400" />
												</div>
											</div>
											<div className="mt-2">
												<p className="text-gray-600 text-xs dark:text-gray-300">
													{image.filename}
												</p>
												<p className="text-gray-500 text-xs dark:text-gray-400">
													{image.fileType} • {formatFileSize(image.fileSize)}
												</p>
											</div>
											<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
												<Button
													size="sm"
													variant="secondary"
													className="opacity-0 transition-opacity group-hover:opacity-100"
												>
													<Eye className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Third-party Integration Panel */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<h2 className="mb-4 font-medium text-gray-900 text-lg dark:text-white">
					Third-party Integrations
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
						<div className="flex items-center space-x-3">
							<div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
								<Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h3 className="font-medium text-gray-900 dark:text-white">
									Dexis Imaging
								</h3>
								<p className="text-gray-600 text-sm dark:text-gray-300">
									Connected
								</p>
							</div>
						</div>
						<div className="mt-3 flex items-center space-x-2">
							<CheckCircle className="h-4 w-4 text-green-500" />
							<span className="text-green-600 text-sm dark:text-green-400">
								Active
							</span>
						</div>
					</div>

					<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
						<div className="flex items-center space-x-3">
							<div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
								<Archive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h3 className="font-medium text-gray-900 dark:text-white">
									Carestream
								</h3>
								<p className="text-gray-600 text-sm dark:text-gray-300">
									Available
								</p>
							</div>
						</div>
						<div className="mt-3">
							<Button
								size="sm"
								variant="outline"
								className="w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
							>
								Connect
							</Button>
						</div>
					</div>

					<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
						<div className="flex items-center space-x-3">
							<div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
								<Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<h3 className="font-medium text-gray-900 dark:text-white">
									DICOM Server
								</h3>
								<p className="text-gray-600 text-sm dark:text-gray-300">
									Configured
								</p>
							</div>
						</div>
						<div className="mt-3 flex items-center space-x-2">
							<CheckCircle className="h-4 w-4 text-green-500" />
							<span className="text-green-600 text-sm dark:text-green-400">
								Synced
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
