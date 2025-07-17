"use client";

import { PendingTreatments } from "@/components/dashboard/pending-treatments";
import { RecentPatients } from "@/components/dashboard/recent-patients";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TodaysSchedule } from "@/components/dashboard/todays-schedule";
import { useAppTranslations } from "@/lib/i18n/translation-context";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
	const { dashboard, common } = useAppTranslations();
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						{dashboard("title")}
					</h1>
					<p className="text-gray-600">{dashboard("subtitle")}</p>
				</div>
				<div className="flex space-x-3">
					<Link
						href="/dashboard/patients/new"
						className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						<Plus className="mr-2 h-4 w-4" />
						{common("add")} Patient
					</Link>
					<Link
						href="/dashboard/appointments/new"
						className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						<Calendar className="mr-2 h-4 w-4" />
						New Appointment
					</Link>
				</div>
			</div>

			{/* Stats Cards */}
			<StatsCards />

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Today's Schedule - Takes 2 columns */}
				<div className="lg:col-span-2">
					<TodaysSchedule />
				</div>

				{/* Side Panel */}
				<div className="space-y-6">
					<RecentPatients />
					<PendingTreatments />
				</div>
			</div>
		</div>
	);
}
