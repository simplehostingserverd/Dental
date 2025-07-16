import { Users, FileText, DollarSign, UserPlus } from "lucide-react"

const stats = [
  {
    name: "Today's Patients",
    value: "12",
    change: "+2 from yesterday",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Pending Treatments",
    value: "8",
    change: "3 require follow-up",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    name: "Unpaid Invoices",
    value: "$4,320",
    change: "5 invoices pending",
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    name: "New Patient Requests",
    value: "3",
    change: "Needs approval",
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{stat.change}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
