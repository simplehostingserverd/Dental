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
import {
	AlertCircle,
	AlertTriangle,
	Building,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	Download,
	Eye,
	FileText,
	Plus,
	RefreshCw,
	Search,
	Send,
	Shield,
	TrendingUp,
	User,
} from "lucide-react";
import { useState } from "react";

interface Invoice {
	id: string;
	patientId: string;
	patientName: string;
	date: string;
	dueDate: string;
	amount: number;
	paid: number;
	status: "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";
	treatments: Treatment[];
	insurance: InsuranceInfo;
	paymentMethod?: string;
	notes?: string;
}

interface Treatment {
	id: string;
	code: string; // CDT code
	description: string;
	toothNumber?: number;
	surface?: string;
	fee: number;
	insuranceCovered: boolean;
	coverageAmount: number;
	patientPortion: number;
}

interface InsuranceInfo {
	provider: string;
	policyNumber: string;
	groupNumber?: string;
	subscriberId: string;
	relationship: "self" | "spouse" | "child" | "other";
	coverageType: "primary" | "secondary";
	eligibilityVerified: boolean;
	claimStatus?: "pending" | "submitted" | "paid" | "denied" | "appealed";
	claimNumber?: string;
	medicaidProvider?: boolean;
}

interface Claim {
	id: string;
	invoiceId: string;
	patientName: string;
	submissionDate: string;
	status: "draft" | "submitted" | "pending" | "paid" | "denied" | "appealed";
	claimAmount: number;
	paidAmount: number;
	denialReason?: string;
	insuranceProvider: string;
	medicaidClaim: boolean;
}

export default function BillingPage() {
	const [activeTab, setActiveTab] = useState<
		"invoices" | "claims" | "payments"
	>("invoices");
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	// Mock data - in real app this would come from database
	const [invoices] = useState<Invoice[]>([
		{
			id: "INV-001",
			patientId: "p1",
			patientName: "John Smith",
			date: "2025-01-15",
			dueDate: "2025-02-15",
			amount: 450.0,
			paid: 300.0,
			status: "partial",
			treatments: [
				{
					id: "t1",
					code: "D1110",
					description: "Prophylaxis - Adult",
					fee: 150,
					insuranceCovered: true,
					coverageAmount: 150,
					patientPortion: 0,
				},
				{
					id: "t2",
					code: "D0210",
					description: "Intraoral - Complete Series",
					fee: 300,
					insuranceCovered: true,
					coverageAmount: 150,
					patientPortion: 150,
				},
			],
			insurance: {
				provider: "Delta Dental",
				policyNumber: "DD123456",
				subscriberId: "JS001",
				relationship: "self",
				coverageType: "primary",
				eligibilityVerified: true,
				claimStatus: "submitted",
				claimNumber: "CLM-001",
				medicaidProvider: false,
			},
		},
		{
			id: "INV-002",
			patientId: "p2",
			patientName: "Sarah Johnson",
			date: "2025-01-10",
			dueDate: "2025-02-10",
			amount: 1200.0,
			paid: 1200.0,
			status: "paid",
			treatments: [
				{
					id: "t3",
					code: "D3310",
					description: "Endodontic Therapy - Anterior",
					fee: 800,
					insuranceCovered: true,
					coverageAmount: 640,
					patientPortion: 160,
				},
				{
					id: "t4",
					code: "D2740",
					description: "Crown - Porcelain/Ceramic",
					fee: 400,
					insuranceCovered: true,
					coverageAmount: 200,
					patientPortion: 200,
				},
			],
			insurance: {
				provider: "Medicaid",
				policyNumber: "MCD789012",
				subscriberId: "SJ002",
				relationship: "self",
				coverageType: "primary",
				eligibilityVerified: true,
				claimStatus: "paid",
				claimNumber: "CLM-002",
				medicaidProvider: true,
			},
		},
	]);

	const [claims] = useState<Claim[]>([
		{
			id: "CLM-001",
			invoiceId: "INV-001",
			patientName: "John Smith",
			submissionDate: "2025-01-16",
			status: "submitted",
			claimAmount: 300,
			paidAmount: 0,
			insuranceProvider: "Delta Dental",
			medicaidClaim: false,
		},
		{
			id: "CLM-002",
			invoiceId: "INV-002",
			patientName: "Sarah Johnson",
			submissionDate: "2025-01-11",
			status: "paid",
			claimAmount: 840,
			paidAmount: 840,
			insuranceProvider: "Medicaid",
			medicaidClaim: true,
		},
	]);

	const stats = [
		{
			name: "Total Revenue",
			value: "$12,450",
			change: "+12% from last month",
			icon: DollarSign,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			name: "Outstanding",
			value: "$3,200",
			change: "8 invoices pending",
			icon: AlertCircle,
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
		},
		{
			name: "Collected Today",
			value: "$850",
			change: "5 payments received",
			icon: TrendingUp,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			name: "Insurance Claims",
			value: "12",
			change: "3 pending approval",
			icon: FileText,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "partial":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "overdue":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			case "sent":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "draft":
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
		}
	};

	const getClaimStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "submitted":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "denied":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			case "appealed":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
		}
	};

	const filteredInvoices = invoices.filter((invoice) => {
		const matchesSearch =
			invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || invoice.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
						Billing & Claims
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Comprehensive billing with insurance claims and Medicaid support
					</p>
				</div>
				<div className="flex space-x-3">
					<Button
						variant="outline"
						className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
					>
						<Download className="mr-2 h-4 w-4" />
						Export Reports
					</Button>
					<Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
						<Plus className="mr-2 h-4 w-4" />
						New Invoice
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.name}
						className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="flex items-center">
							<div
								className={`rounded-lg p-2 ${stat.bgColor} dark:bg-opacity-20`}
							>
								<stat.icon
									className={`h-6 w-6 ${stat.color} dark:text-opacity-80`}
								/>
							</div>
							<div className="ml-4 flex-1">
								<p className="font-medium text-gray-600 text-sm dark:text-gray-300">
									{stat.name}
								</p>
								<p className="font-semibold text-2xl text-gray-900 dark:text-white">
									{stat.value}
								</p>
							</div>
						</div>
						<div className="mt-4">
							<p className="text-gray-500 text-sm dark:text-gray-400">
								{stat.change}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Tab Navigation */}
			<div className="border-gray-200 border-b dark:border-gray-700">
				<nav className="-mb-px flex space-x-8">
					{["invoices", "claims", "payments"].map((tab) => (
						<button
							type="button"
							key={tab}
							onClick={() =>
								setActiveTab(tab as "invoices" | "claims" | "payments")
							}
							className={`border-b-2 px-1 py-4 font-medium text-sm capitalize ${
								activeTab === tab
									? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
							}`}
						>
							{tab}
						</button>
					))}
				</nav>
			</div>

			{/* Search and Filters */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<Label htmlFor="search">Search</Label>
						<div className="relative">
							<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
							<Input
								id="search"
								placeholder="Search invoices or patients..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="status-filter">Status</Label>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="sent">Sent</SelectItem>
								<SelectItem value="partial">Partial Payment</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
								<SelectItem value="overdue">Overdue</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="insurance-filter">Insurance Type</Label>
						<Select>
							<SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-white">
								<SelectValue placeholder="All Insurance" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Insurance</SelectItem>
								<SelectItem value="medicaid">Medicaid</SelectItem>
								<SelectItem value="private">Private Insurance</SelectItem>
								<SelectItem value="self-pay">Self Pay</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-end space-x-2">
						<Button
							variant="outline"
							className="flex-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						>
							<Shield className="mr-2 h-4 w-4" />
							Verify Eligibility
						</Button>
					</div>
				</div>
			</div>

			{/* Content based on active tab */}
			{activeTab === "invoices" && (
				<div className="space-y-4">
					{filteredInvoices.map((invoice) => (
						<div
							key={invoice.id}
							className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center space-x-3">
										<h3 className="font-medium text-gray-900 text-lg dark:text-white">
											{invoice.id}
										</h3>
										<Badge className={getStatusColor(invoice.status)}>
											{invoice.status.replace("-", " ").toUpperCase()}
										</Badge>
										{invoice.insurance.medicaidProvider && (
											<Badge
												variant="outline"
												className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
											>
												Medicaid
											</Badge>
										)}
									</div>

									<div className="mt-2 flex items-center space-x-4 text-gray-600 text-sm dark:text-gray-300">
										<span className="flex items-center">
											<User className="mr-1 h-4 w-4" />
											{invoice.patientName}
										</span>
										<span className="flex items-center">
											<Calendar className="mr-1 h-4 w-4" />
											Due: {invoice.dueDate}
										</span>
										<span className="flex items-center">
											<Building className="mr-1 h-4 w-4" />
											{invoice.insurance.provider}
										</span>
									</div>

									{/* Cost Breakdown */}
									<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
										<div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
											<div className="flex items-center justify-between">
												<span className="text-gray-600 text-sm dark:text-gray-300">
													Total Amount
												</span>
												<span className="font-medium text-gray-900 dark:text-white">
													${invoice.amount.toFixed(2)}
												</span>
											</div>
										</div>
										<div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
											<div className="flex items-center justify-between">
												<span className="text-green-600 text-sm dark:text-green-300">
													Paid
												</span>
												<span className="font-medium text-green-700 dark:text-green-200">
													${invoice.paid.toFixed(2)}
												</span>
											</div>
										</div>
										<div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
											<div className="flex items-center justify-between">
												<span className="text-blue-600 text-sm dark:text-blue-300">
													Balance
												</span>
												<span className="font-medium text-blue-700 dark:text-blue-200">
													${(invoice.amount - invoice.paid).toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="ml-6 flex flex-col space-y-2">
									<Button
										size="sm"
										variant="outline"
										className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
									>
										<Eye className="mr-2 h-4 w-4" />
										View Details
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
									>
										<Send className="mr-2 h-4 w-4" />
										Send Invoice
									</Button>
									{invoice.status === "partial" && (
										<Button
											size="sm"
											className="dark:bg-green-600 dark:hover:bg-green-700"
										>
											<DollarSign className="mr-2 h-4 w-4" />
											Record Payment
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Claims Tab */}
			{activeTab === "claims" && (
				<div className="space-y-4">
					{claims.map((claim) => (
						<div
							key={claim.id}
							className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center space-x-3">
										<h3 className="font-medium text-gray-900 text-lg dark:text-white">
											{claim.id}
										</h3>
										<Badge className={getClaimStatusColor(claim.status)}>
											{claim.status.replace("-", " ").toUpperCase()}
										</Badge>
										{claim.medicaidClaim && (
											<Badge
												variant="outline"
												className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
											>
												Medicaid
											</Badge>
										)}
									</div>

									<div className="mt-2 flex items-center space-x-4 text-gray-600 text-sm dark:text-gray-300">
										<span className="flex items-center">
											<User className="mr-1 h-4 w-4" />
											{claim.patientName}
										</span>
										<span className="flex items-center">
											<Calendar className="mr-1 h-4 w-4" />
											Submitted: {claim.submissionDate}
										</span>
										<span className="flex items-center">
											<Building className="mr-1 h-4 w-4" />
											{claim.insuranceProvider}
										</span>
									</div>

									{/* Claim Amounts */}
									<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
											<div className="flex items-center justify-between">
												<span className="text-gray-600 text-sm dark:text-gray-300">
													Claim Amount
												</span>
												<span className="font-medium text-gray-900 dark:text-white">
													${claim.claimAmount.toFixed(2)}
												</span>
											</div>
										</div>
										<div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
											<div className="flex items-center justify-between">
												<span className="text-green-600 text-sm dark:text-green-300">
													Paid Amount
												</span>
												<span className="font-medium text-green-700 dark:text-green-200">
													${claim.paidAmount.toFixed(2)}
												</span>
											</div>
										</div>
									</div>

									{claim.denialReason && (
										<div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
											<div className="flex items-center">
												<AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
												<span className="text-red-700 text-sm dark:text-red-300">
													Denial Reason: {claim.denialReason}
												</span>
											</div>
										</div>
									)}
								</div>

								<div className="ml-6 flex flex-col space-y-2">
									<Button
										size="sm"
										variant="outline"
										className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
									>
										<Eye className="mr-2 h-4 w-4" />
										View Claim
									</Button>
									{claim.status === "denied" && (
										<Button
											size="sm"
											className="dark:bg-blue-600 dark:hover:bg-blue-700"
										>
											<RefreshCw className="mr-2 h-4 w-4" />
											Appeal
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Payments Tab */}
			{activeTab === "payments" && (
				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
					<div className="py-12 text-center">
						<DollarSign className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-4 font-medium text-gray-900 text-lg dark:text-white">
							Payment Processing
						</h3>
						<p className="mt-2 text-gray-600 dark:text-gray-300">
							Payment processing integration coming soon
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
