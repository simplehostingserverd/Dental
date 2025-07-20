"use client";

import ReportGenerator from "@/components/reports/ReportGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingReportGenerator } from "@/lib/reports/billing-reports";
import {
	AlertTriangle,
	Calendar,
	CreditCard,
	FileText,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";

// Mock data for demonstration
const mockPayments = [
	{
		id: "1",
		patient: "Sarah Johnson",
		amount: 250.0,
		method: "Credit Card",
		status: "completed",
		time: "09:30 AM",
		transactionId: "TXN-001",
		invoice: "INV-001",
	},
	{
		id: "2",
		patient: "Michael Chen",
		amount: 180.0,
		method: "Insurance",
		status: "completed",
		time: "10:15 AM",
		transactionId: "TXN-002",
		invoice: "INV-002",
	},
	{
		id: "3",
		patient: "Emily Davis",
		amount: 320.0,
		method: "Cash",
		status: "completed",
		time: "11:00 AM",
		transactionId: "TXN-003",
		invoice: "INV-003",
	},
	{
		id: "4",
		patient: "Robert Wilson",
		amount: 150.0,
		method: "Debit Card",
		status: "pending",
		time: "02:30 PM",
		transactionId: "TXN-004",
		invoice: "INV-004",
	},
];

const mockClaims = [
	{
		id: "1",
		patient: "Sarah Johnson",
		amount: 450.0,
		status: "approved",
		submittedDate: "2025-07-15",
		provider: "Blue Cross Blue Shield",
		claimNumber: "CLM-001",
	},
	{
		id: "2",
		patient: "Michael Chen",
		amount: 280.0,
		status: "pending",
		submittedDate: "2025-07-16",
		provider: "Aetna",
		claimNumber: "CLM-002",
	},
	{
		id: "3",
		patient: "Emily Davis",
		amount: 320.0,
		status: "denied",
		submittedDate: "2025-07-14",
		provider: "Cigna",
		claimNumber: "CLM-003",
	},
];

const mockBalances = [
	{
		id: "1",
		patient: "John Smith",
		balance: 450.0,
		lastPayment: "2025-06-15",
		daysPastDue: 32,
		phone: "(555) 123-4567",
		email: "john.smith@email.com",
	},
	{
		id: "2",
		patient: "Lisa Brown",
		balance: 280.0,
		lastPayment: "2025-05-20",
		daysPastDue: 58,
		phone: "(555) 234-5678",
		email: "lisa.brown@email.com",
	},
	{
		id: "3",
		patient: "David Wilson",
		balance: 750.0,
		lastPayment: "2025-04-10",
		daysPastDue: 98,
		phone: "(555) 345-6789",
		email: "david.wilson@email.com",
	},
];

const reportTypes = [
	{
		id: "daily-revenue",
		name: "Daily Revenue Report",
		description:
			"Detailed breakdown of daily revenue by payment method and provider",
		requiredData: ["payments"],
		supportedFormats: ["pdf"],
		estimatedSize: "2-5 MB",
	},
	{
		id: "insurance-claims",
		name: "Insurance Claims Report",
		description: "Summary of pending, approved, and denied insurance claims",
		requiredData: ["claims"],
		supportedFormats: ["pdf"],
		estimatedSize: "1-3 MB",
	},
	{
		id: "collections",
		name: "Collections Report",
		description: "Analysis of collection rates and outstanding balances by age",
		requiredData: ["balances"],
		supportedFormats: ["pdf"],
		estimatedSize: "1-4 MB",
	},
	{
		id: "patient-summary",
		name: "Patient Summary Report",
		description: "Comprehensive patient information and treatment history",
		requiredData: ["patients", "appointments", "treatments"],
		supportedFormats: ["pdf"],
		estimatedSize: "3-8 MB",
	},
	{
		id: "appointment-analytics",
		name: "Appointment Analytics Report",
		description:
			"Analysis of appointment patterns, no-shows, and scheduling efficiency",
		requiredData: ["appointments"],
		supportedFormats: ["pdf"],
		estimatedSize: "2-4 MB",
	},
];

export default function ReportsPage() {
	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerateReport = async (reportType: string, options: unknown) => {
		setIsGenerating(true);

		try {
			const generator = new BillingReportGenerator();
			const generatedBy = "Reception Staff";

			switch (reportType) {
				case "daily-revenue":
					generator.generateDailyRevenueReport(mockPayments, generatedBy, {
						start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
						end: new Date(),
					});
					break;

				case "insurance-claims":
					generator.generateInsuranceClaimsReport(mockClaims, generatedBy);
					break;

				case "collections":
					generator.generateCollectionsReport(mockBalances, generatedBy);
					break;

				default:
					throw new Error("Unsupported report type");
			}
		} catch (error) {
			console.error("Error generating report:", error);
			alert("Failed to generate report. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleQuickReport = (reportType: string) => {
		handleGenerateReport(reportType, {
			format: "pdf",
			includeCharts: true,
			includeDetails: true,
			dateRange: {
				start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				end: new Date(),
			},
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">Reports</h1>
					<p className="text-gray-600">
						Generate comprehensive reports for your dental practice
					</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card className="cursor-pointer transition-shadow hover:shadow-md">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<TrendingUp className="h-8 w-8 text-green-600" />
							<span className="text-gray-500 text-xs">PDF</span>
						</div>
						<CardTitle className="text-lg">Daily Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-gray-600 text-sm">
							Today's revenue breakdown with payment methods and trends
						</p>
						<Button
							type="button"
							className="w-full"
							size="sm"
							onClick={() => handleQuickReport("daily-revenue")}
							disabled={isGenerating}
						>
							<FileText className="mr-2 h-4 w-4" />
							Generate Now
						</Button>
					</CardContent>
				</Card>

				<Card className="cursor-pointer transition-shadow hover:shadow-md">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CreditCard className="h-8 w-8 text-blue-600" />
							<span className="text-gray-500 text-xs">PDF</span>
						</div>
						<CardTitle className="text-lg">Insurance Claims</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-gray-600 text-sm">
							Current status of all insurance claims and approval rates
						</p>
						<Button
							type="button"
							className="w-full"
							size="sm"
							onClick={() => handleQuickReport("insurance-claims")}
							disabled={isGenerating}
						>
							<FileText className="mr-2 h-4 w-4" />
							Generate Now
						</Button>
					</CardContent>
				</Card>

				<Card className="cursor-pointer transition-shadow hover:shadow-md">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<AlertTriangle className="h-8 w-8 text-red-600" />
							<span className="text-gray-500 text-xs">PDF</span>
						</div>
						<CardTitle className="text-lg">Collections</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-gray-600 text-sm">
							Outstanding balances and collection analysis by age
						</p>
						<Button
							type="button"
							className="w-full"
							size="sm"
							onClick={() => handleQuickReport("collections")}
							disabled={isGenerating}
						>
							<FileText className="mr-2 h-4 w-4" />
							Generate Now
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Report Generator Component */}
			<ReportGenerator
				reportTypes={reportTypes}
				onGenerateReport={handleGenerateReport}
			/>

			{/* Recent Reports */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Reports</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center space-x-3">
								<FileText className="h-5 w-5 text-blue-600" />
								<div>
									<p className="font-medium">Daily Revenue Report</p>
									<p className="text-gray-600 text-sm">
										Generated today at 2:30 PM
									</p>
								</div>
							</div>
							<Button type="button" variant="outline" size="sm">
								Download
							</Button>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center space-x-3">
								<FileText className="h-5 w-5 text-green-600" />
								<div>
									<p className="font-medium">Insurance Claims Report</p>
									<p className="text-gray-600 text-sm">
										Generated yesterday at 4:15 PM
									</p>
								</div>
							</div>
							<Button type="button" variant="outline" size="sm">
								Download
							</Button>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center space-x-3">
								<FileText className="h-5 w-5 text-red-600" />
								<div>
									<p className="font-medium">Collections Report</p>
									<p className="text-gray-600 text-sm">
										Generated 2 days ago at 10:00 AM
									</p>
								</div>
							</div>
							<Button type="button" variant="outline" size="sm">
								Download
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
