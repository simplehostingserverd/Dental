import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BillingReportGenerator } from "@/lib/reports/billing-reports";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { reportType, dateRange, data } = body;

		if (!reportType) {
			return NextResponse.json(
				{ error: "Report type is required" },
				{ status: 400 }
			);
		}

		const generator = new BillingReportGenerator();
		const generatedBy = `${session.user.firstName} ${session.user.lastName}`;

		let reportBlob: Blob;
		let filename: string;

		switch (reportType) {
			case "daily-revenue":
				if (!data?.payments) {
					return NextResponse.json(
						{ error: "Payment data is required for daily revenue report" },
						{ status: 400 }
					);
				}

				reportBlob = generator.generateDailyRevenueReportBlob(
					data.payments,
					generatedBy,
					{
						start: dateRange?.start ? new Date(dateRange.start) : new Date(),
						end: dateRange?.end ? new Date(dateRange.end) : new Date()
					}
				);
				filename = `daily-revenue-report-${new Date().toISOString().split('T')[0]}.pdf`;
				break;

			case "insurance-claims":
				if (!data?.claims) {
					return NextResponse.json(
						{ error: "Claims data is required for insurance claims report" },
						{ status: 400 }
					);
				}

				reportBlob = generator.generateInsuranceClaimsReportBlob(
					data.claims,
					generatedBy
				);
				filename = `insurance-claims-report-${new Date().toISOString().split('T')[0]}.pdf`;
				break;

			case "collections":
				if (!data?.balances) {
					return NextResponse.json(
						{ error: "Balance data is required for collections report" },
						{ status: 400 }
					);
				}

				reportBlob = generator.generateCollectionsReportBlob(
					data.balances,
					generatedBy
				);
				filename = `collections-report-${new Date().toISOString().split('T')[0]}.pdf`;
				break;

			default:
				return NextResponse.json(
					{ error: "Invalid report type" },
					{ status: 400 }
				);
		}

		// Convert blob to base64 for response
		const arrayBuffer = await reportBlob.arrayBuffer();
		const base64 = Buffer.from(arrayBuffer).toString('base64');

		return NextResponse.json({
			success: true,
			filename,
			data: `data:application/pdf;base64,${base64}`,
			size: reportBlob.size
		});

	} catch (error) {
		console.error("Error generating report:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.practiceId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const reportType = searchParams.get("type");

		// Return available report types and their configurations
		const reportTypes = [
			{
				id: "daily-revenue",
				name: "Daily Revenue Report",
				description: "Detailed breakdown of daily revenue by payment method and provider",
				requiredData: ["payments"],
				supportedFormats: ["pdf"],
				estimatedSize: "2-5 MB"
			},
			{
				id: "insurance-claims",
				name: "Insurance Claims Report",
				description: "Summary of pending, approved, and denied insurance claims",
				requiredData: ["claims"],
				supportedFormats: ["pdf"],
				estimatedSize: "1-3 MB"
			},
			{
				id: "collections",
				name: "Collections Report",
				description: "Analysis of collection rates and outstanding balances by age",
				requiredData: ["balances"],
				supportedFormats: ["pdf"],
				estimatedSize: "1-4 MB"
			},
			{
				id: "patient-summary",
				name: "Patient Summary Report",
				description: "Comprehensive patient information and treatment history",
				requiredData: ["patients", "appointments", "treatments"],
				supportedFormats: ["pdf"],
				estimatedSize: "3-8 MB"
			},
			{
				id: "appointment-analytics",
				name: "Appointment Analytics Report",
				description: "Analysis of appointment patterns, no-shows, and scheduling efficiency",
				requiredData: ["appointments"],
				supportedFormats: ["pdf"],
				estimatedSize: "2-4 MB"
			}
		];

		if (reportType) {
			const report = reportTypes.find(r => r.id === reportType);
			if (!report) {
				return NextResponse.json(
					{ error: "Report type not found" },
					{ status: 404 }
				);
			}
			return NextResponse.json(report);
		}

		return NextResponse.json(reportTypes);

	} catch (error) {
		console.error("Error fetching report types:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
