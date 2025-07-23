"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import {
	AlertTriangle,
	Banknote,
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	Download,
	Edit,
	Eye,
	FileText,
	Filter,
	PieChart,
	Plus,
	Receipt,
	RefreshCw,
	Search,
	Settings,
	TrendingUp,
	Upload,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LedgerEntry {
	id: string;
	patientId: string;
	patientName: string;
	transactionDate: string;
	type:
		| "charge"
		| "payment"
		| "adjustment"
		| "refund"
		| "insurance_payment"
		| "writeoff";
	description: string;
	procedureCode?: string;
	amount: number;
	balance: number;
	paymentMethod?: string;
	checkNumber?: string;
	insurancePayer?: string;
	claimId?: string;
	status: "pending" | "posted" | "reversed";
	createdBy: string;
	notes?: string;
}

interface AccountsReceivable {
	id: string;
	patientId: string;
	patientName: string;
	totalBalance: number;
	insuranceBalance: number;
	patientBalance: number;
	lastPaymentDate?: string;
	lastPaymentAmount?: number;
	agingBuckets: {
		current: number;
		days30: number;
		days60: number;
		days90: number;
		days120Plus: number;
	};
	lastStatementDate?: string;
	paymentPlan?: boolean;
	collectionStatus?: "current" | "past_due" | "collections" | "bad_debt";
}

interface Invoice {
	id: string;
	invoiceNumber: string;
	patientId: string;
	patientName: string;
	serviceDate: string;
	invoiceDate: string;
	dueDate: string;
	totalAmount: number;
	paidAmount: number;
	remainingBalance: number;
	status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
	procedures: InvoiceProcedure[];
	paymentLink?: string;
	lastSentDate?: string;
	paymentHistory: InvoicePayment[];
}

interface InvoiceProcedure {
	procedureCode: string;
	description: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	insuranceCovered: number;
	patientResponsibility: number;
}

interface InvoicePayment {
	id: string;
	paymentDate: string;
	amount: number;
	paymentMethod: string;
	transactionId?: string;
	processorFee?: number;
}

export default function BillingPaymentsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [dateFilter, setDateFilter] = useState("all");
	const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

	// Mock data for ledger entries
	const ledgerEntries: LedgerEntry[] = [
		{
			id: "1",
			patientId: "PAT-001",
			patientName: "John Smith",
			transactionDate: "2024-01-15",
			type: "charge",
			description: "Comprehensive oral evaluation",
			procedureCode: "D0150",
			amount: 150.0,
			balance: 150.0,
			status: "posted",
			createdBy: "Dr. Johnson",
		},
		{
			id: "2",
			patientId: "PAT-001",
			patientName: "John Smith",
			transactionDate: "2024-01-20",
			type: "insurance_payment",
			description: "Delta Dental payment",
			amount: -120.0,
			balance: 30.0,
			insurancePayer: "Delta Dental",
			claimId: "CLM-2024-001",
			status: "posted",
			createdBy: "System",
		},
		{
			id: "3",
			patientId: "PAT-001",
			patientName: "John Smith",
			transactionDate: "2024-01-22",
			type: "payment",
			description: "Patient payment - Credit Card",
			amount: -30.0,
			balance: 0.0,
			paymentMethod: "Credit Card",
			status: "posted",
			createdBy: "Reception",
		},
		{
			id: "4",
			patientId: "PAT-002",
			patientName: "Sarah Johnson",
			transactionDate: "2024-01-18",
			type: "charge",
			description: "Crown - porcelain fused to metal",
			procedureCode: "D2750",
			amount: 1200.0,
			balance: 1200.0,
			status: "posted",
			createdBy: "Dr. Smith",
		},
	];

	// Mock data for accounts receivable
	const accountsReceivable: AccountsReceivable[] = [
		{
			id: "1",
			patientId: "PAT-002",
			patientName: "Sarah Johnson",
			totalBalance: 1200.0,
			insuranceBalance: 800.0,
			patientBalance: 400.0,
			lastPaymentDate: "2024-01-10",
			lastPaymentAmount: 200.0,
			agingBuckets: {
				current: 1200.0,
				days30: 0,
				days60: 0,
				days90: 0,
				days120Plus: 0,
			},
			lastStatementDate: "2024-01-20",
			paymentPlan: false,
			collectionStatus: "current",
		},
		{
			id: "2",
			patientId: "PAT-003",
			patientName: "Michael Brown",
			totalBalance: 850.0,
			insuranceBalance: 0,
			patientBalance: 850.0,
			lastPaymentDate: "2023-12-15",
			lastPaymentAmount: 100.0,
			agingBuckets: {
				current: 0,
				days30: 0,
				days60: 850.0,
				days90: 0,
				days120Plus: 0,
			},
			lastStatementDate: "2024-01-15",
			paymentPlan: true,
			collectionStatus: "past_due",
		},
	];

	// Mock data for invoices
	const invoices: Invoice[] = [
		{
			id: "1",
			invoiceNumber: "INV-2024-001",
			patientId: "PAT-001",
			patientName: "John Smith",
			serviceDate: "2024-01-15",
			invoiceDate: "2024-01-16",
			dueDate: "2024-02-15",
			totalAmount: 150.0,
			paidAmount: 150.0,
			remainingBalance: 0.0,
			status: "paid",
			procedures: [
				{
					procedureCode: "D0150",
					description: "Comprehensive oral evaluation",
					quantity: 1,
					unitPrice: 150.0,
					totalPrice: 150.0,
					insuranceCovered: 120.0,
					patientResponsibility: 30.0,
				},
			],
			paymentLink: "https://pay.cognident.org/inv-2024-001",
			lastSentDate: "2024-01-16",
			paymentHistory: [
				{
					id: "1",
					paymentDate: "2024-01-22",
					amount: 30.0,
					paymentMethod: "Credit Card",
					transactionId: "TXN-001",
					processorFee: 1.2,
				},
			],
		},
		{
			id: "2",
			invoiceNumber: "INV-2024-002",
			patientId: "PAT-002",
			patientName: "Sarah Johnson",
			serviceDate: "2024-01-18",
			invoiceDate: "2024-01-19",
			dueDate: "2024-02-18",
			totalAmount: 1200.0,
			paidAmount: 0.0,
			remainingBalance: 1200.0,
			status: "sent",
			procedures: [
				{
					procedureCode: "D2750",
					description: "Crown - porcelain fused to metal",
					quantity: 1,
					unitPrice: 1200.0,
					totalPrice: 1200.0,
					insuranceCovered: 800.0,
					patientResponsibility: 400.0,
				},
			],
			paymentLink: "https://pay.cognident.org/inv-2024-002",
			lastSentDate: "2024-01-19",
			paymentHistory: [],
		},
	];

	const filteredEntries = ledgerEntries.filter((entry) => {
		const matchesSearch =
			entry.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.procedureCode?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesType = filterType === "all" || entry.type === filterType;

		let matchesDate = true;
		if (dateFilter !== "all") {
			const entryDate = new Date(entry.transactionDate);
			const now = new Date();
			const daysDiff = Math.floor(
				(now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24),
			);

			switch (dateFilter) {
				case "7days":
					matchesDate = daysDiff <= 7;
					break;
				case "30days":
					matchesDate = daysDiff <= 30;
					break;
				case "90days":
					matchesDate = daysDiff <= 90;
					break;
			}
		}

		return matchesSearch && matchesType && matchesDate;
	});

	const getTypeColor = (type: string) => {
		switch (type) {
			case "charge":
				return "bg-blue-100 text-blue-800";
			case "payment":
				return "bg-green-100 text-green-800";
			case "insurance_payment":
				return "bg-purple-100 text-purple-800";
			case "adjustment":
				return "bg-yellow-100 text-yellow-800";
			case "refund":
				return "bg-red-100 text-red-800";
			case "writeoff":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "posted":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "reversed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getInvoiceStatusColor = (status: string) => {
		switch (status) {
			case "draft":
				return "bg-gray-100 text-gray-800";
			case "sent":
				return "bg-blue-100 text-blue-800";
			case "viewed":
				return "bg-purple-100 text-purple-800";
			case "paid":
				return "bg-green-100 text-green-800";
			case "overdue":
				return "bg-red-100 text-red-800";
			case "cancelled":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleAutoPostEOB = async () => {
		try {
			const response = await fetch("/api/billing/auto-post-eob", {
				method: "POST",
			});
			if (response.ok) {
				alert("EOB auto-posting completed!");
			} else {
				alert("Failed to auto-post EOBs!");
			}
		} catch (error) {
			console.error("Auto-post EOB error:", error);
			alert("Error auto-posting EOBs!");
		}
	};

	const handleSendStatement = async (patientId: string) => {
		try {
			const response = await fetch(`/api/billing/statements/${patientId}`, {
				method: "POST",
			});
			if (response.ok) {
				alert("Statement sent successfully!");
			} else {
				alert("Failed to send statement!");
			}
		} catch (error) {
			console.error("Send statement error:", error);
			alert("Error sending statement!");
		}
	};

	const billingStats = {
		totalAR: accountsReceivable.reduce((sum, ar) => sum + ar.totalBalance, 0),
		insuranceAR: accountsReceivable.reduce(
			(sum, ar) => sum + ar.insuranceBalance,
			0,
		),
		patientAR: accountsReceivable.reduce(
			(sum, ar) => sum + ar.patientBalance,
			0,
		),
		currentAR: accountsReceivable.reduce(
			(sum, ar) => sum + ar.agingBuckets.current,
			0,
		),
		pastDueAR: accountsReceivable.reduce(
			(sum, ar) =>
				sum +
				ar.agingBuckets.days30 +
				ar.agingBuckets.days60 +
				ar.agingBuckets.days90 +
				ar.agingBuckets.days120Plus,
			0,
		),
		totalInvoices: invoices.length,
		paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
		overdueInvoices: invoices.filter((inv) => inv.status === "overdue").length,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation Header */}
			<nav className="border-gray-200 border-b bg-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link href="/" className="flex items-center">
								<HeaderLogo />
							</Link>
							<div className="ml-6 hidden md:block">
								<div className="flex items-baseline space-x-4">
									<Link
										href="/dashboard"
										className="rounded-md px-3 py-2 font-medium text-gray-500 text-sm hover:bg-gray-100 hover:text-gray-900"
									>
										Dashboard
									</Link>
									<span className="rounded-md bg-gray-900 px-3 py-2 font-medium text-sm text-white">
										Billing
									</span>
									<Link
										href="/dashboard/claims"
										className="rounded-md px-3 py-2 font-medium text-gray-500 text-sm hover:bg-gray-100 hover:text-gray-900"
									>
										Claims
									</Link>
									<Link
										href="/dashboard/financing"
										className="rounded-md px-3 py-2 font-medium text-gray-500 text-sm hover:bg-gray-100 hover:text-gray-900"
									>
										Financing
									</Link>
								</div>
							</div>
						</div>
						<div className="flex space-x-3">
							<Button variant="outline" onClick={handleAutoPostEOB}>
								<RefreshCw className="mr-2 h-4 w-4" />
								Auto-Post EOBs
							</Button>
							<Button onClick={() => setIsPaymentDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Record Payment
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-gray-900">
						Billing & Payments
					</h1>
					<p className="mt-2 text-gray-600">
						Manage ledger, accounts receivable, and payment processing
					</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-600 text-sm">Total A/R</p>
									<p className="font-bold text-2xl text-gray-900">
										${billingStats.totalAR.toLocaleString()}
									</p>
									<p className="text-red-600 text-sm">
										${billingStats.pastDueAR.toLocaleString()} past due
									</p>
								</div>
								<DollarSign className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-600 text-sm">
										Insurance A/R
									</p>
									<p className="font-bold text-2xl text-gray-900">
										${billingStats.insuranceAR.toLocaleString()}
									</p>
									<p className="text-blue-600 text-sm">
										{(
											(billingStats.insuranceAR / billingStats.totalAR) *
											100
										).toFixed(1)}
										% of total
									</p>
								</div>
								<Building2 className="h-8 w-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-600 text-sm">
										Patient A/R
									</p>
									<p className="font-bold text-2xl text-gray-900">
										${billingStats.patientAR.toLocaleString()}
									</p>
									<p className="text-green-600 text-sm">
										{(
											(billingStats.patientAR / billingStats.totalAR) *
											100
										).toFixed(1)}
										% of total
									</p>
								</div>
								<User className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-600 text-sm">
										Collection Rate
									</p>
									<p className="font-bold text-2xl text-gray-900">
										{billingStats.totalInvoices > 0
											? (
													(billingStats.paidInvoices /
														billingStats.totalInvoices) *
													100
												).toFixed(1)
											: 0}
										%
									</p>
									<p className="text-orange-600 text-sm">
										{billingStats.overdueInvoices} overdue
									</p>
								</div>
								<TrendingUp className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="ledger" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="ledger">Ledger</TabsTrigger>
						<TabsTrigger value="ar">Accounts Receivable</TabsTrigger>
						<TabsTrigger value="invoices">Patient Invoices</TabsTrigger>
						<TabsTrigger value="payments">Payment Portal</TabsTrigger>
					</TabsList>

					<TabsContent value="ledger">
						{/* Filters */}
						<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
							<div className="flex space-x-4">
								<div className="relative">
									<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search transactions..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-64 pl-10"
									/>
								</div>
								<Select value={filterType} onValueChange={setFilterType}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Types</SelectItem>
										<SelectItem value="charge">Charges</SelectItem>
										<SelectItem value="payment">Payments</SelectItem>
										<SelectItem value="insurance_payment">Insurance</SelectItem>
										<SelectItem value="adjustment">Adjustments</SelectItem>
										<SelectItem value="refund">Refunds</SelectItem>
									</SelectContent>
								</Select>
								<Select value={dateFilter} onValueChange={setDateFilter}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Date Range" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Dates</SelectItem>
										<SelectItem value="7days">Last 7 days</SelectItem>
										<SelectItem value="30days">Last 30 days</SelectItem>
										<SelectItem value="90days">Last 90 days</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button variant="outline">
								<Download className="mr-2 h-4 w-4" />
								Export
							</Button>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>General Ledger ({filteredEntries.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{filteredEntries.map((entry) => (
										<div
											key={entry.id}
											className="rounded-lg border border-gray-200 bg-white p-4"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<span className="font-medium text-gray-900">
															{entry.patientName}
														</span>
														<Badge className={getTypeColor(entry.type)}>
															{entry.type.replace("_", " ")}
														</Badge>
														<Badge className={getStatusColor(entry.status)}>
															{entry.status}
														</Badge>
													</div>
													<div className="mt-2 grid grid-cols-3 gap-4 text-gray-600 text-sm">
														<div>
															<span className="font-medium">Date:</span>{" "}
															{entry.transactionDate}
														</div>
														<div>
															<span className="font-medium">Description:</span>{" "}
															{entry.description}
														</div>
														<div>
															<span className="font-medium">Procedure:</span>{" "}
															{entry.procedureCode || "N/A"}
														</div>
														<div>
															<span className="font-medium">Amount:</span>
															<span
																className={
																	entry.amount >= 0
																		? "text-red-600"
																		: "text-green-600"
																}
															>
																${Math.abs(entry.amount).toFixed(2)}
															</span>
														</div>
														<div>
															<span className="font-medium">Balance:</span> $
															{entry.balance.toFixed(2)}
														</div>
														<div>
															<span className="font-medium">Created By:</span>{" "}
															{entry.createdBy}
														</div>
													</div>
													{entry.notes && (
														<div className="mt-2 rounded bg-gray-50 p-2">
															<p className="text-gray-700 text-sm">
																{entry.notes}
															</p>
														</div>
													)}
												</div>
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => setSelectedEntry(entry)}
													>
														<Eye className="h-4 w-4" />
													</Button>
													{entry.status === "pending" && (
														<Button variant="outline" size="sm">
															<Edit className="h-4 w-4" />
														</Button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="ar">
						<Card>
							<CardHeader>
								<CardTitle>Accounts Receivable Aging</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{accountsReceivable.map((ar) => (
										<div
											key={ar.id}
											className="rounded-lg border border-gray-200 bg-white p-4"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-medium text-gray-900">
															{ar.patientName}
														</h3>
														<Badge
															className={
																ar.collectionStatus === "current"
																	? "bg-green-100 text-green-800"
																	: ar.collectionStatus === "past_due"
																		? "bg-yellow-100 text-yellow-800"
																		: "bg-red-100 text-red-800"
															}
														>
															{ar.collectionStatus?.replace("_", " ")}
														</Badge>
														{ar.paymentPlan && (
															<Badge variant="outline">Payment Plan</Badge>
														)}
													</div>
													<div className="mt-2 grid grid-cols-3 gap-4 text-gray-600 text-sm">
														<div>
															<span className="font-medium">
																Total Balance:
															</span>{" "}
															${ar.totalBalance.toFixed(2)}
														</div>
														<div>
															<span className="font-medium">Insurance:</span> $
															{ar.insuranceBalance.toFixed(2)}
														</div>
														<div>
															<span className="font-medium">Patient:</span> $
															{ar.patientBalance.toFixed(2)}
														</div>
													</div>
													<div className="mt-3">
														<h4 className="font-medium text-gray-900 text-sm">
															Aging Buckets:
														</h4>
														<div className="mt-1 grid grid-cols-5 gap-4 text-gray-600 text-sm">
															<div>
																Current: ${ar.agingBuckets.current.toFixed(2)}
															</div>
															<div>
																30 days: ${ar.agingBuckets.days30.toFixed(2)}
															</div>
															<div>
																60 days: ${ar.agingBuckets.days60.toFixed(2)}
															</div>
															<div>
																90 days: ${ar.agingBuckets.days90.toFixed(2)}
															</div>
															<div>
																120+ days: $
																{ar.agingBuckets.days120Plus.toFixed(2)}
															</div>
														</div>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleSendStatement(ar.patientId)}
													>
														<Receipt className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														className="bg-green-600 hover:bg-green-700"
													>
														<CreditCard className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="invoices">
						<Card>
							<CardHeader>
								<CardTitle>Patient Invoices ({invoices.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{invoices.map((invoice) => (
										<div
											key={invoice.id}
											className="rounded-lg border border-gray-200 bg-white p-4"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-medium text-gray-900">
															{invoice.invoiceNumber}
														</h3>
														<Badge
															className={getInvoiceStatusColor(invoice.status)}
														>
															{invoice.status}
														</Badge>
													</div>
													<div className="mt-2 grid grid-cols-3 gap-4 text-gray-600 text-sm">
														<div>
															<span className="font-medium">Patient:</span>{" "}
															{invoice.patientName}
														</div>
														<div>
															<span className="font-medium">Service Date:</span>{" "}
															{invoice.serviceDate}
														</div>
														<div>
															<span className="font-medium">Due Date:</span>{" "}
															{invoice.dueDate}
														</div>
														<div>
															<span className="font-medium">Total Amount:</span>{" "}
															${invoice.totalAmount.toFixed(2)}
														</div>
														<div>
															<span className="font-medium">Paid Amount:</span>{" "}
															${invoice.paidAmount.toFixed(2)}
														</div>
														<div>
															<span className="font-medium">Remaining:</span> $
															{invoice.remainingBalance.toFixed(2)}
														</div>
													</div>
													{invoice.paymentLink && (
														<div className="mt-2 rounded bg-blue-50 p-2">
															<p className="text-blue-800 text-sm">
																<strong>Payment Link:</strong>
																<a
																	href={invoice.paymentLink}
																	className="ml-1 underline"
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{invoice.paymentLink}
																</a>
															</p>
														</div>
													)}
												</div>
												<div className="flex space-x-2">
													<Button variant="outline" size="sm">
														<Eye className="h-4 w-4" />
													</Button>
													{invoice.status !== "paid" && (
														<Button
															size="sm"
															className="bg-blue-600 hover:bg-blue-700"
														>
															Send
														</Button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="payments">
						<Card>
							<CardHeader>
								<CardTitle>Online Payment Portal</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="py-8 text-center">
									<CreditCard className="mx-auto h-12 w-12 text-gray-400" />
									<h3 className="mt-4 font-medium text-gray-900">
										Payment Portal Management
									</h3>
									<p className="mt-2 text-gray-600">
										Configure and manage online payment portals for patients
									</p>
									<div className="mt-6 flex justify-center space-x-4">
										<Button>
											<Plus className="mr-2 h-4 w-4" />
											Create Portal
										</Button>
										<Button variant="outline">
											<Settings className="mr-2 h-4 w-4" />
											Configure Stripe
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
