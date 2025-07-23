import { getCurrentUser } from "@/lib/auth/session";
import { type NextRequest, NextResponse } from "next/server";

// Mock data aggregation - in production, this would query the database
const getDashboardData = (practiceId: string) => {
	const today = new Date();
	const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
	const endOfWeek = new Date(
		today.setDate(today.getDate() - today.getDay() + 6),
	);
	const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
	const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	return {
		overview: {
			todayAppointments: 8,
			weeklyAppointments: 45,
			monthlyAppointments: 180,
			totalPatients: 1247,
			activePatients: 1180,
			newPatientsThisMonth: 23,
			revenue: {
				today: 2850,
				week: 18500,
				month: 75200,
				year: 890000,
			},
			occupancyRate: 78.5,
			averageWaitTime: 12, // minutes
			patientSatisfaction: 4.7, // out of 5
		},
		appointments: {
			today: [
				{
					id: "apt-1",
					time: "09:00",
					patient: "John Smith",
					type: "Cleaning",
					status: "confirmed",
					dentist: "Dr. Johnson",
				},
				{
					id: "apt-2",
					time: "10:30",
					patient: "Maria Garcia",
					type: "Filling",
					status: "in-progress",
					dentist: "Dr. Johnson",
				},
				{
					id: "apt-3",
					time: "14:00",
					patient: "Robert Wilson",
					type: "Consultation",
					status: "scheduled",
					dentist: "Dr. Smith",
				},
			],
			upcoming: [
				{
					id: "apt-4",
					date: "2025-07-24",
					time: "09:00",
					patient: "Sarah Davis",
					type: "Crown",
					dentist: "Dr. Johnson",
				},
				{
					id: "apt-5",
					date: "2025-07-24",
					time: "11:00",
					patient: "Michael Brown",
					type: "Extraction",
					dentist: "Dr. Smith",
				},
			],
			statusBreakdown: {
				scheduled: 25,
				confirmed: 18,
				"in-progress": 2,
				completed: 156,
				cancelled: 8,
				"no-show": 3,
			},
		},
		patients: {
			recentRegistrations: [
				{
					id: "patient-new-1",
					name: "Emily Johnson",
					registeredAt: "2025-07-22T14:30:00Z",
					nextAppointment: "2025-07-25T10:00:00Z",
				},
				{
					id: "patient-new-2",
					name: "David Lee",
					registeredAt: "2025-07-21T16:45:00Z",
					nextAppointment: "2025-07-26T14:00:00Z",
				},
			],
			birthdaysThisWeek: [
				{
					id: "patient-bday-1",
					name: "Jennifer Martinez",
					birthday: "2025-07-24",
					age: 35,
				},
				{
					id: "patient-bday-2",
					name: "Thomas Anderson",
					birthday: "2025-07-26",
					age: 42,
				},
			],
			followUpNeeded: [
				{
					id: "patient-followup-1",
					name: "Lisa Thompson",
					lastVisit: "2025-07-15T09:00:00Z",
					reason: "Post-surgery check",
					priority: "high",
				},
				{
					id: "patient-followup-2",
					name: "Mark Wilson",
					lastVisit: "2025-07-10T14:00:00Z",
					reason: "Treatment plan discussion",
					priority: "medium",
				},
			],
		},
		marketing: {
			socialMedia: {
				totalFollowers: 5885,
				weeklyGrowth: 45,
				engagementRate: 7.8,
				postsThisWeek: 5,
				topPerformingPost: {
					platform: "TikTok",
					content: "Quick dental tip: Brush for 2 minutes! ⏰🦷",
					engagement: 245,
				},
			},
			campaigns: {
				active: 3,
				scheduled: 2,
				thisMonthReach: 12500,
				conversionRate: 3.2,
			},
		},
		financial: {
			dailyRevenue: [
				{ date: "2025-07-16", amount: 3200 },
				{ date: "2025-07-17", amount: 2800 },
				{ date: "2025-07-18", amount: 3500 },
				{ date: "2025-07-19", amount: 2950 },
				{ date: "2025-07-20", amount: 3100 },
				{ date: "2025-07-21", amount: 2750 },
				{ date: "2025-07-22", amount: 2850 },
			],
			pendingPayments: 15,
			insuranceClaims: {
				pending: 8,
				approved: 45,
				denied: 2,
			},
			topServices: [
				{ service: "Cleaning", revenue: 18500, count: 85 },
				{ service: "Filling", revenue: 12300, count: 42 },
				{ service: "Crown", revenue: 15600, count: 18 },
				{ service: "Whitening", revenue: 8900, count: 35 },
			],
		},
		alerts: [
			{
				id: "alert-1",
				type: "appointment",
				priority: "high",
				message: "Patient John Smith is 15 minutes late for appointment",
				timestamp: new Date().toISOString(),
			},
			{
				id: "alert-2",
				type: "equipment",
				priority: "medium",
				message: "X-ray machine maintenance due in 3 days",
				timestamp: new Date(Date.now() - 3600000).toISOString(),
			},
			{
				id: "alert-3",
				type: "insurance",
				priority: "low",
				message: "5 insurance claims require review",
				timestamp: new Date(Date.now() - 7200000).toISOString(),
			},
		],
		performance: {
			appointmentMetrics: {
				onTimeRate: 85.2,
				cancellationRate: 4.1,
				noShowRate: 1.8,
				rescheduleRate: 8.3,
			},
			staffProductivity: [
				{
					name: "Dr. Sarah Johnson",
					role: "Dentist",
					appointmentsToday: 6,
					efficiency: 92.5,
					patientSatisfaction: 4.8,
				},
				{
					name: "Dr. Michael Smith",
					role: "Dentist",
					appointmentsToday: 5,
					efficiency: 88.3,
					patientSatisfaction: 4.6,
				},
				{
					name: "Jennifer Adams",
					role: "Hygienist",
					appointmentsToday: 8,
					efficiency: 95.1,
					patientSatisfaction: 4.9,
				},
			],
		},
	};
};

// GET /api/receptionist/dashboard - Get dashboard data
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const section = searchParams.get("section"); // overview, appointments, patients, marketing, financial
		const timeRange = searchParams.get("timeRange") || "today"; // today, week, month, year

		const dashboardData = getDashboardData(user.id);

		// Return specific section if requested
		if (section) {
			const sectionData = dashboardData[section as keyof typeof dashboardData];
			if (!sectionData) {
				return NextResponse.json({ error: "Invalid section" }, { status: 400 });
			}

			return NextResponse.json({
				success: true,
				data: {
					section,
					timeRange,
					...sectionData,
				},
				generatedAt: new Date().toISOString(),
			});
		}

		// Return full dashboard
		return NextResponse.json({
			success: true,
			data: {
				...dashboardData,
				timeRange,
				generatedAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch dashboard data" },
			{ status: 500 },
		);
	}
}

// POST /api/receptionist/dashboard - Refresh dashboard data
export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { sections, forceRefresh } = body;

		// Simulate data refresh
		console.log(
			`Refreshing dashboard sections: ${sections?.join(", ") || "all"}`,
		);

		// In production, this would:
		// 1. Invalidate cache for specified sections
		// 2. Fetch fresh data from database
		// 3. Update real-time metrics
		// 4. Trigger any necessary notifications

		const dashboardData = getDashboardData(user.id);

		return NextResponse.json({
			success: true,
			data: dashboardData,
			message: "Dashboard data refreshed successfully",
			refreshedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error refreshing dashboard:", error);
		return NextResponse.json(
			{ error: "Failed to refresh dashboard" },
			{ status: 500 },
		);
	}
}

// PUT /api/receptionist/dashboard - Update dashboard preferences
export async function PUT(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		if (!user || user.type !== "practice") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			layout,
			widgets,
			refreshInterval,
			notifications,
			defaultTimeRange,
		} = body;

		// In production, this would update user preferences in the database
		const preferences = {
			layout: layout || "default",
			widgets: widgets || [
				"overview",
				"appointments",
				"patients",
				"marketing",
				"financial",
				"alerts",
				"performance",
			],
			refreshInterval: refreshInterval || 300, // seconds
			notifications: notifications || {
				appointments: true,
				payments: true,
				marketing: false,
				system: true,
			},
			defaultTimeRange: defaultTimeRange || "today",
			updatedAt: new Date().toISOString(),
		};

		return NextResponse.json({
			success: true,
			data: preferences,
			message: "Dashboard preferences updated successfully",
		});
	} catch (error) {
		console.error("Error updating dashboard preferences:", error);
		return NextResponse.json(
			{ error: "Failed to update dashboard preferences" },
			{ status: 500 },
		);
	}
}
