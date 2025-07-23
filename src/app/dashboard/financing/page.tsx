"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
	CreditCard, 
	Plus, 
	Edit, 
	Eye, 
	Search, 
	Filter,
	DollarSign,
	Calendar,
	User,
	Building2,
	CheckCircle,
	Clock,
	AlertTriangle,
	TrendingUp,
	FileText,
	Calculator,
	Percent
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FinancingOption {
	id: string;
	name: string;
	provider: "carecredit" | "lending_club" | "alphaeon" | "internal";
	type: "promotional" | "standard" | "payment_plan";
	minAmount: number;
	maxAmount: number;
	interestRate: number;
	promotionalPeriod?: number; // months
	promotionalRate?: number;
	isActive: boolean;
	description: string;
}

interface PatientFinancing {
	id: string;
	patientId: string;
	patientName: string;
	financingOptionId: string;
	applicationId?: string;
	amount: number;
	approvedAmount?: number;
	status: "pending" | "approved" | "declined" | "active" | "completed" | "defaulted";
	applicationDate: string;
	approvalDate?: string;
	startDate?: string;
	endDate?: string;
	monthlyPayment?: number;
	remainingBalance?: number;
	nextPaymentDate?: string;
	interestRate: number;
	totalInterest?: number;
	payments: FinancingPayment[];
}

interface FinancingPayment {
	id: string;
	paymentDate: string;
	amount: number;
	principal: number;
	interest: number;
	remainingBalance: number;
	status: "scheduled" | "paid" | "late" | "missed";
	paymentMethod?: string;
	transactionId?: string;
}

interface PaymentPlan {
	id: string;
	patientId: string;
	patientName: string;
	totalAmount: number;
	downPayment: number;
	remainingAmount: number;
	monthlyPayment: number;
	numberOfPayments: number;
	interestRate: number;
	startDate: string;
	endDate: string;
	status: "active" | "completed" | "defaulted" | "cancelled";
	payments: PaymentPlanPayment[];
	autoPayEnabled: boolean;
}

interface PaymentPlanPayment {
	id: string;
	dueDate: string;
	amount: number;
	paidDate?: string;
	paidAmount?: number;
	status: "scheduled" | "paid" | "late" | "missed";
	lateFee?: number;
}

export default function PatientFinancingPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [providerFilter, setProviderFilter] = useState("all");
	const [selectedFinancing, setSelectedFinancing] = useState<PatientFinancing | null>(null);
	const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

	// Mock data for financing options
	const financingOptions: FinancingOption[] = [
		{
			id: "1",
			name: "CareCredit 6 Months No Interest",
			provider: "carecredit",
			type: "promotional",
			minAmount: 200,
			maxAmount: 25000,
			interestRate: 26.99,
			promotionalPeriod: 6,
			promotionalRate: 0,
			isActive: true,
			description: "No interest if paid in full within 6 months"
		},
		{
			id: "2",
			name: "CareCredit 12 Months No Interest",
			provider: "carecredit",
			type: "promotional",
			minAmount: 1000,
			maxAmount: 25000,
			interestRate: 26.99,
			promotionalPeriod: 12,
			promotionalRate: 0,
			isActive: true,
			description: "No interest if paid in full within 12 months"
		},
		{
			id: "3",
			name: "CareCredit 24 Months Fixed Payment",
			provider: "carecredit",
			type: "standard",
			minAmount: 2500,
			maxAmount: 25000,
			interestRate: 14.90,
			isActive: true,
			description: "Fixed monthly payments for 24 months"
		},
		{
			id: "4",
			name: "Internal Payment Plan",
			provider: "internal",
			type: "payment_plan",
			minAmount: 500,
			maxAmount: 10000,
			interestRate: 0,
			isActive: true,
			description: "Interest-free payment plan managed internally"
		}
	];

	// Mock data for patient financing
	const patientFinancing: PatientFinancing[] = [
		{
			id: "1",
			patientId: "PAT-001",
			patientName: "John Smith",
			financingOptionId: "1",
			applicationId: "CC-APP-001",
			amount: 3500,
			approvedAmount: 3500,
			status: "active",
			applicationDate: "2024-01-10",
			approvalDate: "2024-01-10",
			startDate: "2024-01-15",
			endDate: "2024-07-15",
			monthlyPayment: 583.33,
			remainingBalance: 2333.33,
			nextPaymentDate: "2024-02-15",
			interestRate: 0,
			totalInterest: 0,
			payments: [
				{
					id: "1",
					paymentDate: "2024-01-15",
					amount: 583.33,
					principal: 583.33,
					interest: 0,
					remainingBalance: 2916.67,
					status: "paid",
					paymentMethod: "Credit Card",
					transactionId: "TXN-001"
				},
				{
					id: "2",
					paymentDate: "2024-02-15",
					amount: 583.33,
					principal: 583.33,
					interest: 0,
					remainingBalance: 2333.33,
					status: "paid",
					paymentMethod: "Credit Card",
					transactionId: "TXN-002"
				}
			]
		},
		{
			id: "2",
			patientId: "PAT-002",
			patientName: "Sarah Johnson",
			financingOptionId: "3",
			applicationId: "CC-APP-002",
			amount: 8000,
			approvedAmount: 6000,
			status: "active",
			applicationDate: "2024-01-05",
			approvalDate: "2024-01-06",
			startDate: "2024-01-10",
			endDate: "2026-01-10",
			monthlyPayment: 283.45,
			remainingBalance: 5433.10,
			nextPaymentDate: "2024-02-10",
			interestRate: 14.90,
			totalInterest: 801.80,
			payments: [
				{
					id: "3",
					paymentDate: "2024-01-10",
					amount: 283.45,
					principal: 208.95,
					interest: 74.50,
					remainingBalance: 5716.55,
					status: "paid",
					paymentMethod: "Bank Transfer",
					transactionId: "TXN-003"
				}
			]
		},
		{
			id: "3",
			patientId: "PAT-003",
			patientName: "Michael Brown",
			financingOptionId: "1",
			applicationId: "CC-APP-003",
			amount: 1200,
			status: "declined",
			applicationDate: "2024-01-12",
			interestRate: 0,
			payments: []
		}
	];

	// Mock data for payment plans
	const paymentPlans: PaymentPlan[] = [
		{
			id: "1",
			patientId: "PAT-004",
			patientName: "Emily Davis",
			totalAmount: 2400,
			downPayment: 400,
			remainingAmount: 2000,
			monthlyPayment: 200,
			numberOfPayments: 10,
			interestRate: 0,
			startDate: "2024-01-01",
			endDate: "2024-10-01",
			status: "active",
			autoPayEnabled: true,
			payments: [
				{
					id: "1",
					dueDate: "2024-01-01",
					amount: 200,
					paidDate: "2024-01-01",
					paidAmount: 200,
					status: "paid"
				},
				{
					id: "2",
					dueDate: "2024-02-01",
					amount: 200,
					status: "scheduled"
				}
			]
		}
	];

	const filteredFinancing = patientFinancing.filter(financing => {
		const matchesSearch = financing.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			financing.applicationId?.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesStatus = statusFilter === "all" || financing.status === statusFilter;
		
		const option = financingOptions.find(opt => opt.id === financing.financingOptionId);
		const matchesProvider = providerFilter === "all" || option?.provider === providerFilter;
		
		return matchesSearch && matchesStatus && matchesProvider;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending": return "bg-yellow-100 text-yellow-800";
			case "approved": return "bg-green-100 text-green-800";
			case "declined": return "bg-red-100 text-red-800";
			case "active": return "bg-blue-100 text-blue-800";
			case "completed": return "bg-gray-100 text-gray-800";
			case "defaulted": return "bg-red-100 text-red-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending": return <Clock className="h-3 w-3" />;
			case "approved": 
			case "completed": return <CheckCircle className="h-3 w-3" />;
			case "declined": 
			case "defaulted": return <AlertTriangle className="h-3 w-3" />;
			case "active": return <TrendingUp className="h-3 w-3" />;
			default: return <FileText className="h-3 w-3" />;
		}
	};

	const handleCareCreditApplication = async (patientId: string, amount: number, optionId: string) => {
		try {
			const response = await fetch("/api/financing/carecredit/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId,
					amount,
					financingOptionId: optionId
				}),
			});

			if (response.ok) {
				const data = await response.json();
				alert(`CareCredit application submitted! Application ID: ${data.applicationId}`);
			} else {
				alert("Failed to submit CareCredit application!");
			}
		} catch (error) {
			console.error("CareCredit application error:", error);
			alert("Error submitting CareCredit application!");
		}
	};

	const handlePaymentPlanCreation = async (patientId: string, totalAmount: number, terms: any) => {
		try {
			const response = await fetch("/api/financing/payment-plans", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					patientId,
					totalAmount,
					...terms
				}),
			});

			if (response.ok) {
				alert("Payment plan created successfully!");
			} else {
				alert("Failed to create payment plan!");
			}
		} catch (error) {
			console.error("Payment plan creation error:", error);
			alert("Error creating payment plan!");
		}
	};

	const financingStats = {
		totalApplications: patientFinancing.length,
		approvedApplications: patientFinancing.filter(f => f.status === "approved" || f.status === "active").length,
		activeFinancing: patientFinancing.filter(f => f.status === "active").length,
		totalFinanced: patientFinancing.reduce((sum, f) => sum + (f.approvedAmount || 0), 0),
		totalOutstanding: patientFinancing.filter(f => f.status === "active").reduce((sum, f) => sum + (f.remainingBalance || 0), 0),
		averageAmount: patientFinancing.length > 0 ? patientFinancing.reduce((sum, f) => sum + f.amount, 0) / patientFinancing.length : 0
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
									<span className="rounded-md bg-gray-900 px-3 py-2 text-white text-sm font-medium">
										Financing
									</span>
								</div>
							</div>
						</div>
						<div className="flex space-x-3">
							<Button variant="outline">
								<Calculator className="mr-2 h-4 w-4" />
								Payment Calculator
							</Button>
							<Button onClick={() => setIsApplicationDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								New Application
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-gray-900">Patient Financing</h1>
					<p className="mt-2 text-gray-600">Manage CareCredit applications and payment plans</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Total Applications</p>
									<p className="font-bold text-2xl text-gray-900">{financingStats.totalApplications}</p>
									<p className="text-green-600 text-sm">{financingStats.approvedApplications} approved</p>
								</div>
								<FileText className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Total Financed</p>
									<p className="font-bold text-2xl text-gray-900">
										${financingStats.totalFinanced.toLocaleString()}
									</p>
									<p className="text-blue-600 text-sm">
										${financingStats.averageAmount.toLocaleString()} avg
									</p>
								</div>
								<DollarSign className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Outstanding Balance</p>
									<p className="font-bold text-2xl text-gray-900">
										${financingStats.totalOutstanding.toLocaleString()}
									</p>
									<p className="text-orange-600 text-sm">{financingStats.activeFinancing} active</p>
								</div>
								<CreditCard className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-medium">Approval Rate</p>
									<p className="font-bold text-2xl text-gray-900">
										{financingStats.totalApplications > 0 ? 
											((financingStats.approvedApplications / financingStats.totalApplications) * 100).toFixed(1) : 0}%
									</p>
									<p className="text-green-600 text-sm">Above industry avg</p>
								</div>
								<Percent className="h-8 w-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="applications" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="applications">Financing Applications</TabsTrigger>
						<TabsTrigger value="payment-plans">Payment Plans</TabsTrigger>
						<TabsTrigger value="options">Financing Options</TabsTrigger>
					</TabsList>

					<TabsContent value="applications">
						{/* Filters */}
						<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
							<div className="flex space-x-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder="Search applications..."
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
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="approved">Approved</SelectItem>
										<SelectItem value="declined">Declined</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
									</SelectContent>
								</Select>
								<Select value={providerFilter} onValueChange={setProviderFilter}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Provider" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Providers</SelectItem>
										<SelectItem value="carecredit">CareCredit</SelectItem>
										<SelectItem value="lending_club">Lending Club</SelectItem>
										<SelectItem value="alphaeon">Alphaeon</SelectItem>
										<SelectItem value="internal">Internal</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Financing Applications ({filteredFinancing.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{filteredFinancing.map((financing) => {
										const option = financingOptions.find(opt => opt.id === financing.financingOptionId);
										return (
											<div key={financing.id} className="rounded-lg border border-gray-200 bg-white p-4">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center space-x-3">
															<h3 className="font-medium text-gray-900">{financing.patientName}</h3>
															<Badge className={getStatusColor(financing.status)}>
																{getStatusIcon(financing.status)}
																<span className="ml-1">{financing.status}</span>
															</Badge>
															{option && (
																<Badge variant="outline">
																	{option.provider}
																</Badge>
															)}
														</div>
														<div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
															<div>
																<span className="font-medium">Application ID:</span> {financing.applicationId || "N/A"}
															</div>
															<div>
																<span className="font-medium">Requested Amount:</span> ${financing.amount.toLocaleString()}
															</div>
															<div>
																<span className="font-medium">Approved Amount:</span> ${(financing.approvedAmount || 0).toLocaleString()}
															</div>
															<div>
																<span className="font-medium">Application Date:</span> {financing.applicationDate}
															</div>
															<div>
																<span className="font-medium">Monthly Payment:</span> ${(financing.monthlyPayment || 0).toFixed(2)}
															</div>
															<div>
																<span className="font-medium">Remaining Balance:</span> ${(financing.remainingBalance || 0).toLocaleString()}
															</div>
														</div>
														{financing.nextPaymentDate && (
															<div className="mt-2 rounded bg-blue-50 p-2">
																<p className="text-blue-800 text-sm">
																	<strong>Next Payment:</strong> {financing.nextPaymentDate} - ${(financing.monthlyPayment || 0).toFixed(2)}
																</p>
															</div>
														)}
													</div>
													<div className="flex space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => setSelectedFinancing(financing)}
														>
															<Eye className="h-4 w-4" />
														</Button>
														{financing.status === "active" && (
															<Button
																size="sm"
																className="bg-green-600 hover:bg-green-700"
															>
																Record Payment
															</Button>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="payment-plans">
						<Card>
							<CardHeader>
								<CardTitle>Internal Payment Plans ({paymentPlans.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{paymentPlans.map((plan) => (
										<div key={plan.id} className="rounded-lg border border-gray-200 bg-white p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-medium text-gray-900">{plan.patientName}</h3>
														<Badge className={getStatusColor(plan.status)}>
															{getStatusIcon(plan.status)}
															<span className="ml-1">{plan.status}</span>
														</Badge>
														{plan.autoPayEnabled && (
															<Badge className="bg-green-100 text-green-800">
																Auto Pay
															</Badge>
														)}
													</div>
													<div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
														<div>
															<span className="font-medium">Total Amount:</span> ${plan.totalAmount.toLocaleString()}
														</div>
														<div>
															<span className="font-medium">Down Payment:</span> ${plan.downPayment.toLocaleString()}
														</div>
														<div>
															<span className="font-medium">Monthly Payment:</span> ${plan.monthlyPayment.toFixed(2)}
														</div>
														<div>
															<span className="font-medium">Remaining Amount:</span> ${plan.remainingAmount.toLocaleString()}
														</div>
														<div>
															<span className="font-medium">Payments Left:</span> {plan.numberOfPayments - plan.payments.filter(p => p.status === "paid").length}
														</div>
														<div>
															<span className="font-medium">End Date:</span> {plan.endDate}
														</div>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														className="bg-blue-600 hover:bg-blue-700"
													>
														Record Payment
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="options">
						<Card>
							<CardHeader>
								<CardTitle>Available Financing Options</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-2">
									{financingOptions.map((option) => (
										<div key={option.id} className="rounded-lg border border-gray-200 bg-white p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-medium text-gray-900">{option.name}</h3>
														<Badge className={option.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
															{option.isActive ? "Active" : "Inactive"}
														</Badge>
													</div>
													<p className="mt-1 text-gray-600 text-sm">{option.description}</p>
													<div className="mt-3 space-y-1 text-sm text-gray-600">
														<div>
															<span className="font-medium">Provider:</span> {option.provider}
														</div>
														<div>
															<span className="font-medium">Amount Range:</span> ${option.minAmount.toLocaleString()} - ${option.maxAmount.toLocaleString()}
														</div>
														<div>
															<span className="font-medium">Interest Rate:</span> {option.interestRate}%
														</div>
														{option.promotionalPeriod && (
															<div>
																<span className="font-medium">Promotional Period:</span> {option.promotionalPeriod} months at {option.promotionalRate}%
															</div>
														)}
													</div>
												</div>
												<Button
													variant="outline"
													size="sm"
												>
													<Edit className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
