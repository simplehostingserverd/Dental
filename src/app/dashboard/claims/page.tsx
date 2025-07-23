"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	FileText, 
	Plus, 
	Edit, 
	Eye, 
	Search, 
	Filter,
	Download,
	Upload,
	RefreshCw,
	Clock,
	CheckCircle,
	XCircle,
	AlertTriangle,
	DollarSign,
	Calendar,
	User,
	Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderLogo } from "@/components/ui/tooth-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface Claim {
	id: string;
	claimNumber: string;
	patientName: string;
	patientId: string;
	insurancePayer: string;
	payerId: string;
	serviceDate: string;
	submissionDate: string;
	totalAmount: number;
	paidAmount: number;
	patientResponsibility: number;
	status: "draft" | "submitted" | "accepted" | "rejected" | "paid" | "partial" | "appealed";
	procedures: ClaimProcedure[];
	eobReceived: boolean;
	eobDate?: string;
	remittanceAdvice?: string;
	denialReason?: string;
	appealDeadline?: string;
	lastUpdated: string;
}

interface ClaimProcedure {
	id: string;
	procedureCode: string;
	description: string;
	tooth?: string;
	surface?: string;
	quantity: number;
	chargedAmount: number;
	allowedAmount: number;
	paidAmount: number;
	deductible: number;
	copay: number;
	coinsurance: number;
	status: "pending" | "approved" | "denied" | "reduced";
}

interface EOB {
	id: string;
	claimId: string;
	eobNumber: string;
	receivedDate: string;
	checkNumber?: string;
	checkAmount: number;
	procedures: EOBProcedure[];
	adjustments: EOBAdjustment[];
	patientResponsibility: number;
}

interface EOBProcedure {
	procedureCode: string;
	chargedAmount: number;
	allowedAmount: number;
	paidAmount: number;
	adjustmentCodes: string[];
	remarkCodes: string[];
}

interface EOBAdjustment {
	code: string;
	description: string;
	amount: number;
}

export default function ClaimsManagementPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("all");
	const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
	const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

	// Mock data for claims
	const claims: Claim[] = [
		{
			id: "1",
			claimNumber: "CLM-2024-001",
			patientName: "John Smith",
			patientId: "PAT-001",
			insurancePayer: "Delta Dental",
			payerId: "DELTA001",
			serviceDate: "2024-01-10",
			submissionDate: "2024-01-12",
			totalAmount: 850.00,
			paidAmount: 680.00,
			patientResponsibility: 170.00,
			status: "paid",
			procedures: [
				{
					id: "1",
					procedureCode: "D0150",
					description: "Comprehensive oral evaluation",
					quantity: 1,
					chargedAmount: 150.00,
					allowedAmount: 120.00,
					paidAmount: 120.00,
					deductible: 0,
					copay: 0,
					coinsurance: 0,
					status: "approved"
				},
				{
					id: "2",
					procedureCode: "D1110",
					description: "Prophylaxis - adult",
					quantity: 1,
					chargedAmount: 200.00,
					allowedAmount: 160.00,
					paidAmount: 160.00,
					deductible: 0,
					copay: 0,
					coinsurance: 0,
					status: "approved"
				},
				{
					id: "3",
					procedureCode: "D2750",
					description: "Crown - porcelain fused to metal",
					tooth: "14",
					quantity: 1,
					chargedAmount: 500.00,
					allowedAmount: 400.00,
					paidAmount: 400.00,
					deductible: 50.00,
					copay: 0,
					coinsurance: 120.00,
					status: "approved"
				}
			],
			eobReceived: true,
			eobDate: "2024-01-20",
			lastUpdated: "2024-01-20"
		},
		{
			id: "2",
			claimNumber: "CLM-2024-002",
			patientName: "Sarah Johnson",
			patientId: "PAT-002",
			insurancePayer: "MetLife Dental",
			payerId: "METLIFE001",
			serviceDate: "2024-01-15",
			submissionDate: "2024-01-16",
			totalAmount: 1200.00,
			paidAmount: 0,
			patientResponsibility: 0,
			status: "submitted",
			procedures: [
				{
					id: "4",
					procedureCode: "D3330",
					description: "Molar endodontic therapy",
					tooth: "19",
					quantity: 1,
					chargedAmount: 800.00,
					allowedAmount: 0,
					paidAmount: 0,
					deductible: 0,
					copay: 0,
					coinsurance: 0,
					status: "pending"
				},
				{
					id: "5",
					procedureCode: "D2750",
					description: "Crown - porcelain fused to metal",
					tooth: "19",
					quantity: 1,
					chargedAmount: 400.00,
					allowedAmount: 0,
					paidAmount: 0,
					deductible: 0,
					copay: 0,
					coinsurance: 0,
					status: "pending"
				}
			],
			eobReceived: false,
			lastUpdated: "2024-01-16"
		},
		{
			id: "3",
			claimNumber: "CLM-2024-003",
			patientName: "Michael Brown",
			patientId: "PAT-003",
			insurancePayer: "Cigna Dental",
			payerId: "CIGNA001",
			serviceDate: "2024-01-08",
			submissionDate: "2024-01-10",
			totalAmount: 300.00,
			paidAmount: 0,
			patientResponsibility: 300.00,
			status: "rejected",
			procedures: [
				{
					id: "6",
					procedureCode: "D2140",
					description: "Amalgam - one surface, primary or permanent",
					tooth: "12",
					quantity: 1,
					chargedAmount: 300.00,
					allowedAmount: 0,
					paidAmount: 0,
					deductible: 0,
					copay: 0,
					coinsurance: 0,
					status: "denied"
				}
			],
			eobReceived: true,
			eobDate: "2024-01-18",
			denialReason: "Procedure not covered under current plan",
			appealDeadline: "2024-02-18",
			lastUpdated: "2024-01-18"
		}
	];

	const filteredClaims = claims.filter(claim => {
		const matchesSearch = claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			claim.insurancePayer.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
		
		let matchesDate = true;
		if (dateFilter !== "all") {
			const claimDate = new Date(claim.serviceDate);
			const now = new Date();
			const daysDiff = Math.floor((now.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24));
			
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
		
		return matchesSearch && matchesStatus && matchesDate;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "draft": return "bg-gray-100 text-gray-800";
			case "submitted": return "bg-blue-100 text-blue-800";
			case "accepted": return "bg-green-100 text-green-800";
			case "rejected": return "bg-red-100 text-red-800";
			case "paid": return "bg-green-100 text-green-800";
			case "partial": return "bg-yellow-100 text-yellow-800";
			case "appealed": return "bg-purple-100 text-purple-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "submitted": return <Clock className="h-3 w-3" />;
			case "accepted": 
			case "paid": return <CheckCircle className="h-3 w-3" />;
			case "rejected": return <XCircle className="h-3 w-3" />;
			case "partial": return <AlertTriangle className="h-3 w-3" />;
			default: return <FileText className="h-3 w-3" />;
		}
	};

	const handleSubmitClaim = async (claimId: string) => {
		try {
			const response = await fetch(`/api/claims/${claimId}/submit`, {
				method: "POST"
			});
			if (response.ok) {
				alert("Claim submitted successfully!");
			} else {
				alert("Failed to submit claim!");
			}
		} catch (error) {
			console.error("Submit claim error:", error);
			alert("Error submitting claim!");
		}
	};

	const handleCheckStatus = async (claimId: string) => {
		try {
			const response = await fetch(`/api/claims/${claimId}/status`);
			if (response.ok) {
				const data = await response.json();
				alert(`Claim status: ${data.status}`);
			} else {
				alert("Failed to check claim status!");
			}
		} catch (error) {
			console.error("Check status error:", error);
			alert("Error checking claim status!");
		}
	};

	const claimStats = {
		total: claims.length,
		submitted: claims.filter(c => c.status === "submitted").length,
		paid: claims.filter(c => c.status === "paid").length,
		rejected: claims.filter(c => c.status === "rejected").length,
		totalBilled: claims.reduce((sum, c) => sum + c.totalAmount, 0),
		totalPaid: claims.reduce((sum, c) => sum + c.paidAmount, 0),
		pendingAmount: claims.filter(c => c.status === "submitted").reduce((sum, c) => sum + c.totalAmount, 0)
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
										className="rounded-md px-3 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 hover:text-gray-900"
									>
										Dashboard
									</Link>
									<Link
										href="/dashboard/billing"
										className="rounded-md px-3 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 hover:text-gray-900"
									>
										Billing
									</Link>
									<Link
										href="/dashboard/insurance"
										className="rounded-md px-3 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 hover:text-gray-900"
									>
										Insurance
									</Link>
									<span className="rounded-md bg-gray-900 px-3 py-2 text-white text-sm font-medium">
										Claims
									</span>
								</div>
							</div>
						</div>
						<div className="flex space-x-3">
							<Button variant="outline">
								<Upload className="mr-2 h-4 w-4" />
								Import EOB
							</Button>
							<Button onClick={() => setIsClaimDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								New Claim
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-gray-900">Claims Management</h1>
					<p className="mt-2 text-gray-600">Create, track, and manage insurance claims and EOBs</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Total Claims</p>
									<p className="font-bold text-2xl text-gray-900">{claimStats.total}</p>
									<p className="text-green-600 text-sm">+{claimStats.submitted} pending</p>
								</div>
								<FileText className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Total Billed</p>
									<p className="font-bold text-2xl text-gray-900">
										${claimStats.totalBilled.toLocaleString()}
									</p>
									<p className="text-blue-600 text-sm">${claimStats.pendingAmount.toLocaleString()} pending</p>
								</div>
								<DollarSign className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Total Paid</p>
									<p className="font-bold text-2xl text-gray-900">
										${claimStats.totalPaid.toLocaleString()}
									</p>
									<p className="text-green-600 text-sm">
										{((claimStats.totalPaid / claimStats.totalBilled) * 100).toFixed(1)}% collection rate
									</p>
								</div>
								<CheckCircle className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Rejected Claims</p>
									<p className="font-bold text-2xl text-gray-900">{claimStats.rejected}</p>
									<p className="text-red-600 text-sm">
										{((claimStats.rejected / claimStats.total) * 100).toFixed(1)}% rejection rate
									</p>
								</div>
								<XCircle className="h-8 w-8 text-red-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<div className="flex space-x-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input
								placeholder="Search claims..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-64"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="submitted">Submitted</SelectItem>
								<SelectItem value="accepted">Accepted</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
								<SelectItem value="partial">Partial</SelectItem>
								<SelectItem value="appealed">Appealed</SelectItem>
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
					<div className="flex space-x-2">
						<Button variant="outline" size="sm">
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
						<Button variant="outline" size="sm">
							<RefreshCw className="mr-2 h-4 w-4" />
							Refresh
						</Button>
					</div>
				</div>

				{/* Claims List */}
				<Card>
					<CardHeader>
						<CardTitle>Claims ({filteredClaims.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{filteredClaims.map((claim) => (
								<div key={claim.id} className="rounded-lg border border-gray-200 bg-white p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center space-x-3">
												<h3 className="font-medium text-gray-900">{claim.claimNumber}</h3>
												<Badge className={getStatusColor(claim.status)}>
													{getStatusIcon(claim.status)}
													<span className="ml-1">{claim.status}</span>
												</Badge>
												{claim.eobReceived && (
													<Badge variant="outline" className="text-green-600">
														EOB Received
													</Badge>
												)}
											</div>
											<div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
												<div>
													<span className="font-medium">Patient:</span> {claim.patientName}
												</div>
												<div>
													<span className="font-medium">Insurance:</span> {claim.insurancePayer}
												</div>
												<div>
													<span className="font-medium">Service Date:</span> {claim.serviceDate}
												</div>
												<div>
													<span className="font-medium">Total Amount:</span> ${claim.totalAmount.toFixed(2)}
												</div>
												<div>
													<span className="font-medium">Paid Amount:</span> ${claim.paidAmount.toFixed(2)}
												</div>
												<div>
													<span className="font-medium">Patient Responsibility:</span> ${claim.patientResponsibility.toFixed(2)}
												</div>
											</div>
											{claim.denialReason && (
												<div className="mt-2 rounded bg-red-50 p-2">
													<p className="text-red-800 text-sm">
														<strong>Denial Reason:</strong> {claim.denialReason}
													</p>
													{claim.appealDeadline && (
														<p className="text-red-600 text-sm">
															<strong>Appeal Deadline:</strong> {claim.appealDeadline}
														</p>
													)}
												</div>
											)}
										</div>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setSelectedClaim(claim)}
											>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleCheckStatus(claim.id)}
											>
												<RefreshCw className="h-4 w-4" />
											</Button>
											{claim.status === "draft" && (
												<Button
													size="sm"
													onClick={() => handleSubmitClaim(claim.id)}
												>
													Submit
												</Button>
											)}
											{claim.status === "rejected" && claim.appealDeadline && (
												<Button
													size="sm"
													className="bg-purple-600 hover:bg-purple-700"
												>
													Appeal
												</Button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
