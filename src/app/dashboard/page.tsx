import { StatsCards } from "@/components/dashboard/stats-cards"
import { TodaysSchedule } from "@/components/dashboard/todays-schedule"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { PendingTreatments } from "@/components/dashboard/pending-treatments"
import { Plus, Calendar } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dr. Chen. You have 12 appointments today.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/patients/new"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Link>
          <Link
            href="/dashboard/appointments/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="h-4 w-4 mr-2" />
            New Appointment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
  )
}
