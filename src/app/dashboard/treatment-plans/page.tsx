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
	CreditCard,
	DollarSign,
	Download,
	FileText,
	Plus,
	Save,
	Search,
	Send,
	Shield,
	User,
} from "lucide-react";
import { useState } from "react";

interface TreatmentPlan {
	id: string;
	patientId: string;
	patientName: string;
	title: string;
	description: string;
	totalCost: number;
	insuranceCoverage: number;
	patientResponsibility: number;
	status:
		| "draft"
		| "pending-approval"
		| "approved"
		| "in-progress"
		| "completed"
		| "rejected";
	priority: "low" | "medium" | "high" | "urgent";
	createdDate: string;
	estimatedDuration: string;
	treatments: Treatment[];
	insuranceProvider: string;
	preAuthRequired: boolean;
	preAuthStatus?: "pending" | "approved" | "denied";
}

interface Treatment {
	id: string;
	toothNumber?: number;
	procedure: string;
	description: string;
	cost: number;
	insuranceCovered: boolean;
	coveragePercentage: number;
	estimatedTime: string;
	prerequisites?: string[];
	completed: boolean;
}

export default function TreatmentPlansPage() {
	const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	// Mock treatment plans data
	const [treatmentPlans] = useState<TreatmentPlan[]>([
		{
			id: "1",
			patientId: "p1",
			patientName: "Sarah Johnson",
			title: "Comprehensive Restorative Treatment",
			description:
				"Full mouth rehabilitation including crowns, fillings, and root canal therapy",
			totalCost: 8500,
			insuranceCoverage: 4250,
			patientResponsibility: 4250,
			status: "pending-approval",
			priority: "high",
			createdDate: "2025-01-15",
			estimatedDuration: "6 months",
			insuranceProvider: "Delta Dental",
			preAuthRequired: true,
			preAuthStatus: "pending",
			treatments: [
				{
					id: "t1",
					toothNumber: 3,
					procedure: "Root Canal Therapy",
					description: "Endodontic treatment for infected tooth",
					cost: 1200,
					insuranceCovered: true,
					coveragePercentage: 80,
					estimatedTime: "90 minutes",
					prerequisites: [],
					completed: false,
				},
				{
					id: "t2",
					toothNumber: 3,
					procedure: "Porcelain Crown",
					description: "Full coverage crown following root canal",
					cost: 1500,
					insuranceCovered: true,
					coveragePercentage: 50,
					estimatedTime: "60 minutes",
					prerequisites: ["t1"],
					completed: false,
				},
				{
					id: "t3",
					toothNumber: 14,
					procedure: "Composite Filling",
					description: "Posterior composite restoration",
					cost: 185,
					insuranceCovered: true,
					coveragePercentage: 80,
					estimatedTime: "45 minutes",
					prerequisites: [],
					completed: false,
				},
			],
		},
		{
			id: "2",
			patientId: "p2",
			patientName: "Michael Chen",
			title: "Preventive Care Plan",
			description: "Routine cleanings and preventive treatments",
			totalCost: 450,
			insuranceCoverage: 450,
			patientResponsibility: 0,
			status: "approved",
			priority: "low",
			createdDate: "2025-01-10",
			estimatedDuration: "3 months",
			insuranceProvider: "Medicaid",
			preAuthRequired: false,
			treatments: [
				{
					id: "t4",
					procedure: "Prophylaxis",
					description: "Routine dental cleaning",
					cost: 150,
					insuranceCovered: true,
					coveragePercentage: 100,
					estimatedTime: "60 minutes",
					prerequisites: [],
					completed: true,
				},
				{
					id: "t5",
					procedure: "Fluoride Treatment",
					description: "Professional fluoride application",
					cost: 50,
					insuranceCovered: true,
					coveragePercentage: 100,
					estimatedTime: "15 minutes",
					prerequisites: [],
					completed: false,
				},
			],
		},
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800";
			case "in-progress":
				return "bg-blue-100 text-blue-800";
			case "pending-approval":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-purple-100 text-purple-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			case "draft":
				return "bg-gray-100 text-gray-800";
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

	const filteredPlans = treatmentPlans.filter((plan) => {
		const matchesSearch =
			plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			plan.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || plan.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
						Treatment Plans
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Comprehensive treatment planning with insurance integration
					</p>
				</div>
				<div className="flex space-x-3">
					<Button
						variant="outline"
						className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					>
						<Download className="mr-2 h-4 w-4" />
						Export Plans
					</Button>
					<Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
						<Plus className="mr-2 h-4 w-4" />
						New Treatment Plan
					</Button>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<Label htmlFor="search">Search Plans</Label>
						<div className="relative">
							<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
							<Input
								id="search"
								placeholder="Search by patient or plan name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="status-filter">Filter by Status</Label>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="pending-approval">
									Pending Approval
								</SelectItem>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="in-progress">In Progress</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-end">
						<Button
							variant="outline"
							className="w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						>
							<Shield className="mr-2 h-4 w-4" />
							Check Insurance Eligibility
						</Button>
					</div>
				</div>
			</div>

			{/* Treatment Plans List */}
			<div className="space-y-4">
				{filteredPlans.map((plan) => (
					<div
						key={plan.id}
						className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center space-x-3">
									<h3 className="font-medium text-gray-900 text-lg dark:text-white">
										{plan.title}
									</h3>
									<Badge className={getStatusColor(plan.status)}>
										{plan.status.replace("-", " ").toUpperCase()}
									</Badge>
									<Badge className={getPriorityColor(plan.priority)}>
										{plan.priority.toUpperCase()}
									</Badge>
									{plan.preAuthRequired && (
										<Badge
											variant="outline"
											className="border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-400"
										>
											Pre-Auth Required
										</Badge>
									)}
								</div>

								<div className="mt-2 flex items-center space-x-4 text-gray-600 text-sm dark:text-gray-300">
									<span className="flex items-center">
										<User className="mr-1 h-4 w-4" />
										{plan.patientName}
									</span>
									<span className="flex items-center">
										<Calendar className="mr-1 h-4 w-4" />
										Created: {plan.createdDate}
									</span>
									<span className="flex items-center">
										<Clock className="mr-1 h-4 w-4" />
										Duration: {plan.estimatedDuration}
									</span>
								</div>

								<p className="mt-2 text-gray-600 dark:text-gray-300">
									{plan.description}
								</p>

								{/* Cost Breakdown */}
								<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
									<div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
										<div className="flex items-center justify-between">
											<span className="text-gray-600 text-sm dark:text-gray-300">
												Total Cost
											</span>
											<span className="font-medium text-gray-900 dark:text-white">
												${plan.totalCost.toLocaleString()}
											</span>
										</div>
									</div>
									<div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
										<div className="flex items-center justify-between">
											<span className="text-green-600 text-sm dark:text-green-300">
												Insurance Coverage
											</span>
											<span className="font-medium text-green-700 dark:text-green-200">
												${plan.insuranceCoverage.toLocaleString()}
											</span>
										</div>
									</div>
									<div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
										<div className="flex items-center justify-between">
											<span className="text-blue-600 text-sm dark:text-blue-300">
												Patient Responsibility
											</span>
											<span className="font-medium text-blue-700 dark:text-blue-200">
												${plan.patientResponsibility.toLocaleString()}
											</span>
										</div>
									</div>
								</div>

								{/* Insurance Information */}
								<div className="mt-4 flex items-center space-x-4 text-sm">
									<span className="flex items-center text-gray-600 dark:text-gray-300">
										<CreditCard className="mr-1 h-4 w-4" />
										{plan.insuranceProvider}
									</span>
									{plan.preAuthStatus && (
										<span
											className={`flex items-center ${
												plan.preAuthStatus === "approved"
													? "text-green-600 dark:text-green-400"
													: plan.preAuthStatus === "denied"
														? "text-red-600 dark:text-red-400"
														: "text-yellow-600 dark:text-yellow-400"
											}`}
										>
											{plan.preAuthStatus === "approved" ? (
												<CheckCircle className="mr-1 h-4 w-4" />
											) : plan.preAuthStatus === "denied" ? (
												<AlertTriangle className="mr-1 h-4 w-4" />
											) : (
												<Clock className="mr-1 h-4 w-4" />
											)}
											Pre-Auth: {plan.preAuthStatus}
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
									<FileText className="mr-2 h-4 w-4" />
									View Details
								</Button>
								{plan.status === "draft" && (
									<Button
										size="sm"
										className="dark:bg-blue-600 dark:hover:bg-blue-700"
									>
										<Send className="mr-2 h-4 w-4" />
										Submit for Approval
									</Button>
								)}
								{plan.status === "approved" && (
									<Button
										size="sm"
										className="dark:bg-green-600 dark:hover:bg-green-700"
									>
										<Calendar className="mr-2 h-4 w-4" />
										Schedule Treatments
									</Button>
								)}
								{plan.preAuthRequired && plan.preAuthStatus === "pending" && (
									<Button
										size="sm"
										variant="outline"
										className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20"
									>
										<Shield className="mr-2 h-4 w-4" />
										Check Pre-Auth
									</Button>
								)}
							</div>
						</div>

						{/* Treatment List Preview */}
						<div className="mt-4 border-gray-200 border-t pt-4 dark:border-gray-600">
							<h4 className="mb-2 font-medium text-gray-900 dark:text-white">
								Treatments ({plan.treatments.length})
							</h4>
							<div className="space-y-2">
								{plan.treatments.slice(0, 3).map((treatment) => (
									<div
										key={treatment.id}
										className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700"
									>
										<div className="flex items-center space-x-3">
											{treatment.completed ? (
												<CheckCircle className="h-4 w-4 text-green-500" />
											) : (
												<Clock className="h-4 w-4 text-gray-400" />
											)}
											<span className="text-gray-900 text-sm dark:text-white">
												{treatment.toothNumber &&
													`Tooth #${treatment.toothNumber} - `}
												{treatment.procedure}
											</span>
										</div>
										<span className="font-medium text-gray-600 text-sm dark:text-gray-300">
											${treatment.cost}
										</span>
									</div>
								))}
								{plan.treatments.length > 3 && (
									<div className="text-center">
										<Button
											variant="ghost"
											size="sm"
											className="text-blue-600 dark:text-blue-400"
										>
											View all {plan.treatments.length} treatments
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
