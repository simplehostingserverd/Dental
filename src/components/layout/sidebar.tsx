"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Camera,
  Pill,
  MessageSquare,
  Settings,
  Bot,
  Tooth
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Charting", href: "/dashboard/charting", icon: Tooth },
  { name: "Treatment Plans", href: "/dashboard/treatments", icon: FileText },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Imaging", href: "/dashboard/imaging", icon: Camera },
  { name: "Prescriptions", href: "/dashboard/prescriptions", icon: Pill },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Tooth className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">DentalCloud</span>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* AI Assistant */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <Link
          href="/dashboard/ai-assistant"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Bot className="mr-3 h-5 w-5" />
          AI Assistant
        </Link>
        <p className="mt-2 text-xs text-gray-500 px-3">
          Need help with diagnosis or treatment planning?
        </p>
        <button className="mt-2 w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
          Ask AI Assistant
        </button>
      </div>
    </div>
  )
}
