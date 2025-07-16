import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const pendingTreatments = [
  {
    id: 1,
    patient: {
      name: "James Wilson",
      avatar: "/placeholder-avatar.jpg",
      initials: "JW",
    },
    treatment: "Root Canal",
    scheduledFor: "July 20",
    status: "Pending",
  },
  {
    id: 2,
    patient: {
      name: "Jennifer Taylor",
      avatar: "/placeholder-avatar.jpg",
      initials: "JT",
    },
    treatment: "Crown Placement",
    scheduledFor: "July 22",
    status: "Pending",
  },
  {
    id: 3,
    patient: {
      name: "Robert Davis",
      avatar: "/placeholder-avatar.jpg",
      initials: "RD",
    },
    treatment: "Wisdom Tooth Extraction",
    scheduledFor: "July 25",
    status: "Pending",
  },
  {
    id: 4,
    patient: {
      name: "Lisa Anderson",
      avatar: "/placeholder-avatar.jpg",
      initials: "LA",
    },
    treatment: "Dental Implant",
    scheduledFor: "July 28",
    status: "Pending",
  },
]

export function PendingTreatments() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Pending Treatments</h2>
          <Link
            href="/dashboard/treatments"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {pendingTreatments.map((treatment) => (
            <div key={treatment.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={treatment.patient.avatar} />
                <AvatarFallback className="text-xs">
                  {treatment.patient.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {treatment.patient.name}
                </p>
                <p className="text-sm text-gray-600">{treatment.treatment}</p>
                <p className="text-xs text-gray-500">
                  Scheduled for {treatment.scheduledFor}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {treatment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
