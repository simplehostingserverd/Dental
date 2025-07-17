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
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	Download,
	FileText,
	Filter,
	Mail,
	MoreHorizontal,
	Phone,
	Plus,
	Printer,
	Search,
	Send,
	TrendingDown,
	TrendingUp,
	User,
	XCircle,
} from "lucide-react";
import { useState } from "react";

// Mock data
const todayPayments = [
	{
		id: "1",
		patient: "Sarah Johnson",
		amount: 150.0,
		method: "Credit Card",
		status: "completed",
		time: "10:30 AM",
		transactionId: "TXN123456",
		invoice: "INV-001",
	},
	{
		id: "2",
		patient: "Michael Chen",
		amount: 75.5,
		method: "Cash",
		status: "completed",
		time: "2:15 PM",
		transactionId: "TXN123457",
		invoice: "INV-002",
	},
	{
		id: "3",
		patient: "Emily Davis",
		amount: 200.0,
		method: "Insurance",
		status: "pending",
		time: "3:45 PM",
		transactionId: "TXN123458",
		invoice: "INV-003",
	},
];

const pendingClaims = [
	{
		id: "1",
		claimNumber: "CLM-2025-001",
		patient: "Sarah Johnson",
		amount: 450.0,
		status: "submitted",
		submittedDate: "2025-07-15",
		provider: "Blue Cross",
		procedure: "Root Canal",
	},
	{
		id: "2",
		claimNumber: "CLM-2025-002",
		patient: "David Wilson",
		amount: 125.0,
		status: "processing",
		submittedDate: "2025-07-10",
		provider: "Aetna",
		procedure: "Cleaning",
	},
	{
		id: "3",
		claimNumber: "CLM-2025-003",
		patient: "Lisa Brown",
		amount: 300.0,
		status: "denied",
		submittedDate: "2025-07-08",
		provider: "Cigna",
		procedure: "Filling",
	},
];

const outstandingBalances = [
	{
		id: "1",
		patient: "John Smith",
		phone: "(555) 111-2222",
		balance: 250.0,
		lastPayment: "2025-06-15",
		daysPastDue: 32,
		status: "overdue",
	},
	{
		id: "2",
		patient: "Maria Garcia",
		phone: "(555) 333-4444",
		balance: 85.0,
		lastPayment: "2025-07-01",
		daysPastDue: 16,
		status: "due",
	},
	{
		id: "3",
		patient: "Robert Taylor",
		phone: "(555) 555-6666",
		balance: 175.5,
		lastPayment: "2025-05-20",
		daysPastDue: 58,
		status: "overdue",
	},
];

export default function BillingPage() {
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
	const [selectedPatient, setSelectedPatient] = useState("");
	const [paymentAmount, setPaymentAmount] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "processing":
				return "bg-blue-100 text-blue-800";
			case "submitted":
				return "bg-blue-100 text-blue-800";
			case "denied":
				return "bg-red-100 text-red-800";
			case "overdue":
				return "bg-red-100 text-red-800";
			case "due":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="h-4 w-4" />;
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "failed":
				return <XCircle className="h-4 w-4" />;
			case "processing":
				return <Clock className="h-4 w-4" />;
			case "submitted":
				return <Clock className="h-4 w-4" />;
			case "denied":
				return <XCircle className="h-4 w-4" />;
			case "overdue":
				return <AlertTriangle className="h-4 w-4" />;
			case "due":
				return <Clock className="h-4 w-4" />;
			default:
				return <Clock className="h-4 w-4" />;
		}
	};

	const handleProcessPayment = () => {
		// TODO: Implement payment processing
		console.log("Processing payment:", {
			selectedPatient,
			paymentAmount,
			paymentMethod,
		});
		setShowPaymentDialog(false);
		setSelectedPatient("");
		setPaymentAmount("");
		setPaymentMethod("");
	};

	const totalRevenue = todayPayments.reduce(
		(sum, payment) => sum + payment.amount,
		0,
	);
	const pendingAmount = pendingClaims.reduce(
		(sum, claim) => sum + claim.amount,
		0,
	);
	const outstandingAmount = outstandingBalances.reduce(
		(sum, balance) => sum + balance.balance,
		0,
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Billing & Payments
					</h1>
					<p className="text-gray-600">
						Manage payments, insurance claims, and patient balances
					</p>
				</div>
				<div className="flex space-x-3">
					<Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
						<DialogTrigger asChild>
							<Button type="button" variant="outline">
								<FileText className="mr-2 h-4 w-4" />
								Create Invoice
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Invoice</DialogTitle>
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
									<Label>Amount</Label>
									<Input placeholder="0.00" type="number" />
								</div>
								<div>
									<Label>Due Date</Label>
									<Input type="date" />
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowInvoiceDialog(false)}
									>
										Cancel
									</Button>
									<Button type="button">Create Invoice</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
						<DialogTrigger asChild>
							<Button type="button">
								<Plus className="mr-2 h-4 w-4" />
								Process Payment
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Process Payment</DialogTitle>
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
									<Label>Amount</Label>
									<Input
										placeholder="0.00"
										type="number"
										value={paymentAmount}
										onChange={(e) => setPaymentAmount(e.target.value)}
									/>
								</div>
								<div>
									<Label>Payment Method</Label>
									<Select
										value={paymentMethod}
										onValueChange={setPaymentMethod}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select method" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cash">Cash</SelectItem>
											<SelectItem value="credit">Credit Card</SelectItem>
											<SelectItem value="debit">Debit Card</SelectItem>
											<SelectItem value="check">Check</SelectItem>
											<SelectItem value="insurance">Insurance</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex justify-end space-x-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowPaymentDialog(false)}
									>
										Cancel
									</Button>
									<Button type="button" onClick={handleProcessPayment}>
										<CreditCard className="mr-2 h-4 w-4" />
										Process Payment
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
							Today's Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">${totalRevenue.toFixed(2)}</div>
						<p className="text-muted-foreground text-xs">
							<span className="flex items-center text-green-600">
								<TrendingUp className="mr-1 h-3 w-3" />
								+12%
							</span>
							from yesterday
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Pending Claims
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							${pendingAmount.toFixed(2)}
						</div>
						<p className="text-muted-foreground text-xs">
							{pendingClaims.length} claims pending
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Outstanding Balances
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							${outstandingAmount.toFixed(2)}
						</div>
						<p className="text-muted-foreground text-xs">
							{outstandingBalances.length} patients with balances
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Collection Rate
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">94%</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+2%</span> this month
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Billing Tabs */}
			<Tabs defaultValue="payments" className="space-y-4">
				<TabsList>
					<TabsTrigger value="payments">Today's Payments</TabsTrigger>
					<TabsTrigger value="claims">Insurance Claims</TabsTrigger>
					<TabsTrigger value="balances">Outstanding Balances</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
				</TabsList>

				{/* Today's Payments Tab */}
				<TabsContent value="payments" className="space-y-4">
					<div className="flex items-center space-x-4">
						<div className="relative max-w-md flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search payments..."
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
						{todayPayments.map((payment) => (
							<Card key={payment.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
												<DollarSign className="h-5 w-5 text-green-600" />
											</div>
											<div>
												<h4 className="font-medium">{payment.patient}</h4>
												<p className="text-gray-600 text-sm">
													{payment.method} • {payment.time}
												</p>
												<p className="text-gray-500 text-xs">
													Transaction: {payment.transactionId}
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="font-semibold text-green-600 text-lg">
												${payment.amount.toFixed(2)}
											</div>
											<Badge className={getStatusColor(payment.status)}>
												{getStatusIcon(payment.status)}
												<span className="ml-1">{payment.status}</span>
											</Badge>
											<div className="mt-2 flex space-x-2">
												<Button type="button" variant="outline" size="sm">
													<Printer className="h-4 w-4" />
												</Button>
												<Button type="button" variant="outline" size="sm">
													<Send className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Insurance Claims Tab */}
				<TabsContent value="claims" className="space-y-4">
					<div className="space-y-4">
						{pendingClaims.map((claim) => (
							<Card key={claim.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
												<FileText className="h-5 w-5 text-blue-600" />
											</div>
											<div>
												<h4 className="font-medium">{claim.patient}</h4>
												<p className="text-gray-600 text-sm">
													{claim.provider} • {claim.procedure}
												</p>
												<p className="text-gray-500 text-xs">
													Claim: {claim.claimNumber}
												</p>
												<p className="text-gray-500 text-xs">
													Submitted:{" "}
													{new Date(claim.submittedDate).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="font-semibold text-lg">
												${claim.amount.toFixed(2)}
											</div>
											<Badge className={getStatusColor(claim.status)}>
												{getStatusIcon(claim.status)}
												<span className="ml-1">{claim.status}</span>
											</Badge>
											<div className="mt-2 flex space-x-2">
												<Button type="button" variant="outline" size="sm">
													View Details
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button type="button" variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>Resubmit Claim</DropdownMenuItem>
														<DropdownMenuItem>Download Forms</DropdownMenuItem>
														<DropdownMenuItem>
															Contact Insurance
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

				{/* Outstanding Balances Tab */}
				<TabsContent value="balances" className="space-y-4">
					<div className="space-y-4">
						{outstandingBalances.map((balance) => (
							<Card key={balance.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
												<User className="h-5 w-5 text-orange-600" />
											</div>
											<div>
												<h4 className="font-medium">{balance.patient}</h4>
												<p className="text-gray-600 text-sm">
													<Phone className="mr-1 inline h-3 w-3" />
													{balance.phone}
												</p>
												<p className="text-gray-500 text-xs">
													Last payment:{" "}
													{new Date(balance.lastPayment).toLocaleDateString()}
												</p>
												<p className="text-gray-500 text-xs">
													{balance.daysPastDue} days past due
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="font-semibold text-lg text-red-600">
												${balance.balance.toFixed(2)}
											</div>
											<Badge className={getStatusColor(balance.status)}>
												{getStatusIcon(balance.status)}
												<span className="ml-1">{balance.status}</span>
											</Badge>
											<div className="mt-2 flex space-x-2">
												<Button type="button" size="sm">
													Collect Payment
												</Button>
												<Button type="button" variant="outline" size="sm">
													<Phone className="h-4 w-4" />
												</Button>
												<Button type="button" variant="outline" size="sm">
													<Mail className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Reports Tab */}
				<TabsContent value="reports" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Daily Revenue Report
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-gray-600 text-sm">
									Detailed breakdown of today's revenue by payment method and
									provider.
								</p>
								<Button type="button" variant="outline" className="w-full">
									<Download className="mr-2 h-4 w-4" />
									Generate Report
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									Insurance Claims Report
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-gray-600 text-sm">
									Summary of pending, approved, and denied insurance claims.
								</p>
								<Button type="button" variant="outline" className="w-full">
									<Download className="mr-2 h-4 w-4" />
									Generate Report
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Collections Report</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-gray-600 text-sm">
									Analysis of collection rates and outstanding balances by age.
								</p>
								<Button type="button" variant="outline" className="w-full">
									<Download className="mr-2 h-4 w-4" />
									Generate Report
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
