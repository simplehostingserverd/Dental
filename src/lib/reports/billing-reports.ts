import {
	PDFReportGenerator,
	type ReportData,
	type TableData,
} from "../pdf-generator";

export interface PaymentData {
	id: string;
	patient: string;
	amount: number;
	method: string;
	status: string;
	time: string;
	transactionId: string;
	invoice: string;
}

export interface InsuranceClaimData {
	id: string;
	patient: string;
	amount: number;
	status: string;
	submittedDate: string;
	provider: string;
	claimNumber: string;
}

export interface OutstandingBalanceData {
	id: string;
	patient: string;
	balance: number;
	lastPayment: string;
	daysPastDue: number;
	phone: string;
	email: string;
}

export class BillingReportGenerator {
	private practiceInfo = {
		name: "DentalCloud Practice",
		address: "123 Main Street, Suite 100, Anytown, ST 12345",
		phone: "(555) 123-4567",
		email: "info@dentalcloud.com",
	};

	generateDailyRevenueReport(
		payments: PaymentData[],
		generatedBy: string,
		dateRange: { start: Date; end: Date },
	): void {
		const blob = this.generateDailyRevenueReportBlob(
			payments,
			generatedBy,
			dateRange,
		);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `daily-revenue-report-${dateRange.start.toISOString().split("T")[0]}.pdf`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	generateDailyRevenueReportBlob(
		payments: PaymentData[],
		generatedBy: string,
		dateRange: { start: Date; end: Date },
	): Blob {
		const generator = new PDFReportGenerator();

		const reportData: ReportData = {
			title: "Daily Revenue Report",
			subtitle: `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`,
			generatedBy,
			generatedAt: new Date(),
			practiceInfo: this.practiceInfo,
		};

		generator.addHeader(reportData);

		// Summary Statistics
		const totalRevenue = payments.reduce(
			(sum, payment) => sum + payment.amount,
			0,
		);
		const completedPayments = payments.filter((p) => p.status === "completed");
		const pendingPayments = payments.filter((p) => p.status === "pending");
		const averagePayment =
			completedPayments.length > 0
				? totalRevenue / completedPayments.length
				: 0;

		const paymentMethodBreakdown = payments.reduce(
			(acc, payment) => {
				acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
				return acc;
			},
			{} as Record<string, number>,
		);

		generator.addSummaryStats([
			{
				label: "Total Revenue",
				value: `$${totalRevenue.toFixed(2)}`,
				highlight: true,
			},
			{ label: "Total Transactions", value: payments.length },
			{ label: "Completed Payments", value: completedPayments.length },
			{ label: "Pending Payments", value: pendingPayments.length },
			{ label: "Average Payment", value: `$${averagePayment.toFixed(2)}` },
		]);

		// Payment Method Breakdown Chart
		const chartData = {
			title: "Revenue by Payment Method",
			data: Object.entries(paymentMethodBreakdown).map(([method, amount]) => ({
				label: method,
				value: amount,
				color: this.getPaymentMethodColor(method),
			})),
		};
		generator.addSimpleChart(chartData);

		// Detailed Payments Table
		generator.addSectionTitle("Payment Details");
		const tableData: TableData = {
			columns: [
				{ header: "Time", dataKey: "time" },
				{ header: "Patient", dataKey: "patient" },
				{ header: "Amount", dataKey: "formattedAmount" },
				{ header: "Method", dataKey: "method" },
				{ header: "Status", dataKey: "status" },
				{ header: "Transaction ID", dataKey: "transactionId" },
			],
			rows: payments.map((payment) => ({
				...payment,
				formattedAmount: `$${payment.amount.toFixed(2)}`,
			})),
		};
		generator.addTable(tableData);

		// Analysis and Recommendations
		generator.addSectionTitle("Analysis & Recommendations");
		const analysis = this.generateRevenueAnalysis(
			payments,
			paymentMethodBreakdown,
		);
		generator.addParagraph(analysis);

		return generator.getBlob();
	}

	generateInsuranceClaimsReport(
		claims: InsuranceClaimData[],
		generatedBy: string,
	): void {
		const blob = this.generateInsuranceClaimsReportBlob(claims, generatedBy);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `insurance-claims-report-${new Date().toISOString().split("T")[0]}.pdf`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	generateInsuranceClaimsReportBlob(
		claims: InsuranceClaimData[],
		generatedBy: string,
	): Blob {
		const generator = new PDFReportGenerator();

		const reportData: ReportData = {
			title: "Insurance Claims Report",
			subtitle: "Current Status of All Insurance Claims",
			generatedBy,
			generatedAt: new Date(),
			practiceInfo: this.practiceInfo,
		};

		generator.addHeader(reportData);

		// Claims Summary
		const totalClaims = claims.length;
		const totalAmount = claims.reduce((sum, claim) => sum + claim.amount, 0);
		const pendingClaims = claims.filter((c) => c.status === "pending").length;
		const approvedClaims = claims.filter((c) => c.status === "approved").length;
		const deniedClaims = claims.filter((c) => c.status === "denied").length;
		const approvalRate =
			totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

		generator.addSummaryStats([
			{ label: "Total Claims", value: totalClaims },
			{
				label: "Total Claim Amount",
				value: `$${totalAmount.toFixed(2)}`,
				highlight: true,
			},
			{ label: "Pending Claims", value: pendingClaims },
			{ label: "Approved Claims", value: approvedClaims },
			{ label: "Denied Claims", value: deniedClaims },
			{
				label: "Approval Rate",
				value: `${approvalRate.toFixed(1)}%`,
				highlight: true,
			},
		]);

		// Claims Status Chart
		const statusChart = {
			title: "Claims by Status",
			data: [
				{ label: "Pending", value: pendingClaims, color: "#f39c12" },
				{ label: "Approved", value: approvedClaims, color: "#27ae60" },
				{ label: "Denied", value: deniedClaims, color: "#e74c3c" },
			],
		};
		generator.addSimpleChart(statusChart);

		// Provider Breakdown
		const providerBreakdown = claims.reduce(
			(acc, claim) => {
				acc[claim.provider] = (acc[claim.provider] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const providerChart = {
			title: "Claims by Insurance Provider",
			data: Object.entries(providerBreakdown).map(([provider, count]) => ({
				label: provider,
				value: count,
			})),
		};
		generator.addSimpleChart(providerChart);

		// Detailed Claims Table
		generator.addSectionTitle("Claims Details");
		const tableData: TableData = {
			columns: [
				{ header: "Claim #", dataKey: "claimNumber" },
				{ header: "Patient", dataKey: "patient" },
				{ header: "Provider", dataKey: "provider" },
				{ header: "Amount", dataKey: "formattedAmount" },
				{ header: "Status", dataKey: "status" },
				{ header: "Submitted", dataKey: "submittedDate" },
			],
			rows: claims.map((claim) => ({
				...claim,
				formattedAmount: `$${claim.amount.toFixed(2)}`,
			})),
		};
		generator.addTable(tableData);

		return generator.getBlob();
	}

	generateCollectionsReport(
		balances: OutstandingBalanceData[],
		generatedBy: string,
	): void {
		const blob = this.generateCollectionsReportBlob(balances, generatedBy);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `collections-report-${new Date().toISOString().split("T")[0]}.pdf`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	generateCollectionsReportBlob(
		balances: OutstandingBalanceData[],
		generatedBy: string,
	): Blob {
		const generator = new PDFReportGenerator();

		const reportData: ReportData = {
			title: "Collections Report",
			subtitle: "Outstanding Balances and Collection Analysis",
			generatedBy,
			generatedAt: new Date(),
			practiceInfo: this.practiceInfo,
		};

		generator.addHeader(reportData);

		// Collections Summary
		const totalOutstanding = balances.reduce(
			(sum, balance) => sum + balance.balance,
			0,
		);
		const averageBalance =
			balances.length > 0 ? totalOutstanding / balances.length : 0;
		const over30Days = balances.filter((b) => b.daysPastDue > 30).length;
		const over60Days = balances.filter((b) => b.daysPastDue > 60).length;
		const over90Days = balances.filter((b) => b.daysPastDue > 90).length;

		generator.addSummaryStats([
			{
				label: "Total Outstanding",
				value: `$${totalOutstanding.toFixed(2)}`,
				highlight: true,
			},
			{ label: "Number of Accounts", value: balances.length },
			{ label: "Average Balance", value: `$${averageBalance.toFixed(2)}` },
			{ label: "Over 30 Days", value: over30Days },
			{ label: "Over 60 Days", value: over60Days },
			{ label: "Over 90 Days", value: over90Days, highlight: true },
		]);

		// Aging Analysis Chart
		const agingChart = {
			title: "Accounts by Age",
			data: [
				{
					label: "0-30 Days",
					value: balances.filter((b) => b.daysPastDue <= 30).length,
					color: "#27ae60",
				},
				{
					label: "31-60 Days",
					value: balances.filter(
						(b) => b.daysPastDue > 30 && b.daysPastDue <= 60,
					).length,
					color: "#f39c12",
				},
				{
					label: "61-90 Days",
					value: balances.filter(
						(b) => b.daysPastDue > 60 && b.daysPastDue <= 90,
					).length,
					color: "#e67e22",
				},
				{ label: "90+ Days", value: over90Days, color: "#e74c3c" },
			],
		};
		generator.addSimpleChart(agingChart);

		// Outstanding Balances Table
		generator.addSectionTitle("Outstanding Balances");
		const tableData: TableData = {
			columns: [
				{ header: "Patient", dataKey: "patient" },
				{ header: "Balance", dataKey: "formattedBalance" },
				{ header: "Days Past Due", dataKey: "daysPastDue" },
				{ header: "Last Payment", dataKey: "lastPayment" },
				{ header: "Phone", dataKey: "phone" },
				{ header: "Email", dataKey: "email" },
			],
			rows: balances
				.sort((a, b) => b.balance - a.balance) // Sort by balance descending
				.map((balance) => ({
					...balance,
					formattedBalance: `$${balance.balance.toFixed(2)}`,
				})),
		};
		generator.addTable(tableData);

		// Collection Recommendations
		generator.addSectionTitle("Collection Recommendations");
		const recommendations = this.generateCollectionRecommendations(balances);
		generator.addParagraph(recommendations);

		return generator.getBlob();
	}

	private getPaymentMethodColor(method: string): string {
		const colors: Record<string, string> = {
			"Credit Card": "#3498db",
			Cash: "#27ae60",
			Insurance: "#9b59b6",
			Check: "#f39c12",
			"Debit Card": "#34495e",
		};
		return colors[method] || "#95a5a6";
	}

	private generateRevenueAnalysis(
		payments: PaymentData[],
		methodBreakdown: Record<string, number>,
	): string {
		const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
		const topMethod = Object.entries(methodBreakdown).reduce((a, b) =>
			a[1] > b[1] ? a : b,
		);
		const completionRate =
			(payments.filter((p) => p.status === "completed").length /
				payments.length) *
			100;

		return `Revenue Analysis: Today's total revenue of $${totalRevenue.toFixed(2)} shows ${topMethod[0]} as the primary payment method, accounting for $${topMethod[1].toFixed(2)} (${((topMethod[1] / totalRevenue) * 100).toFixed(1)}%). The payment completion rate is ${completionRate.toFixed(1)}%. ${completionRate < 95 ? "Consider following up on pending payments to improve cash flow." : "Excellent payment completion rate."} ${methodBreakdown.Insurance ? "Insurance payments may require additional processing time." : ""}`;
	}

	private generateCollectionRecommendations(
		balances: OutstandingBalanceData[],
	): string {
		const over90Days = balances.filter((b) => b.daysPastDue > 90);
		const highBalances = balances.filter((b) => b.balance > 500);
		const totalOutstanding = balances.reduce((sum, b) => sum + b.balance, 0);

		let recommendations = "Collection Strategy Recommendations: ";

		if (over90Days.length > 0) {
			recommendations += `${over90Days.length} accounts are over 90 days past due and require immediate attention. `;
		}

		if (highBalances.length > 0) {
			recommendations += `${highBalances.length} accounts have balances over $500 and should be prioritized for collection efforts. `;
		}

		recommendations += `Total outstanding amount of $${totalOutstanding.toFixed(2)} represents potential cash flow impact. `;
		recommendations +=
			"Consider implementing automated payment reminders for accounts 30+ days past due and personal outreach for accounts 60+ days past due.";

		return recommendations;
	}
}
