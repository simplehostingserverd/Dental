import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

const recentPatients = [
  {
    id: 1,
    name: "Michael Johnson",
    lastVisit: "July 12, 2025",
    avatar: "/placeholder-avatar.jpg",
    initials: "MJ",
  },
  {
    id: 2,
    name: "Emily Williams",
    lastVisit: "July 10, 2025",
    avatar: "/placeholder-avatar.jpg",
    initials: "EW",
  },
  {
    id: 3,
    name: "David Brown",
    lastVisit: "July 8, 2025",
    avatar: "/placeholder-avatar.jpg",
    initials: "DB",
  },
  {
    id: 4,
    name: "Sarah Miller",
    lastVisit: "July 5, 2025",
    avatar: "/placeholder-avatar.jpg",
    initials: "SM",
  },
]

export function RecentPatients() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
          <Link
            href="/dashboard/patients"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div key={patient.id} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={patient.avatar} />
                <AvatarFallback>{patient.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {patient.name}
                </p>
                <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
