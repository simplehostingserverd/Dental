import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	AlertCircle,
	CreditCard,
	DollarSign,
	Download,
	Eye,
	FileText,
	Filter,
	MoreHorizontal,
	Plus,
	Search,
	Send,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from database
const invoices = [
	{
		id: "INV-001",
		patient: "John Smith",
		date: "2024-01-15",
		dueDate: "2024-02-15",
		amount: 450.0,
		paid: 300.0,
		status: "partial",
		treatments: ["Cleaning", "X-Ray"],
		insurance: "Delta Dental",
	},
	{
		id: "INV-002",
		patient: "Sarah Johnson",
		date: "2024-01-10",
		dueDate: "2024-02-10",
		amount: 1200.0,
		paid: 1200.0,
		status: "paid",
		treatments: ["Root Canal", "Crown"],
		insurance: "Cigna",
	},
	{
		id: "INV-003",
		patient: "Michael Brown",
		date: "2024-01-08",
		dueDate: "2024-02-08",
		amount: 200.0,
		paid: 0,
		status: "overdue",
		treatments: ["Consultation"],
		insurance: "Aetna",
	},
];

const stats = [
	{
		name: "Total Revenue",
		value: "$12,450",
		change: "+12% from last month",
		icon: DollarSign,
		color: "text-green-600",
		bgColor: "bg-green-50",
	},
	{
		name: "Outstanding",
		value: "$3,200",
		change: "8 invoices pending",
		icon: AlertCircle,
		color: "text-yellow-600",
		bgColor: "bg-yellow-50",
	},
	{
		name: "Collected Today",
		value: "$850",
		change: "5 payments received",
		icon: TrendingUp,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	{
		name: "Insurance Claims",
		value: "12",
		change: "3 pending approval",
		icon: FileText,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
	},
];

export default function BillingPage() {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800";
			case "partial":
				return "bg-yellow-100 text-yellow-800";
			case "overdue":
				return "bg-red-100 text-red-800";
			case "pending":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">Billing</h1>
					<p className="text-gray-600">
						Manage invoices, payments, and insurance claims
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
					<Link href="/dashboard/billing/new">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							New Invoice
						</Button>
					</Link>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.name}
						className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
					>
						<div className="flex items-center">
							<div className={`rounded-lg p-2 ${stat.bgColor}`}>
								<stat.icon className={`h-6 w-6 ${stat.color}`} />
							</div>
							<div className="ml-4 flex-1">
								<p className="font-medium text-gray-600 text-sm">{stat.name}</p>
								<p className="font-semibold text-2xl text-gray-900">
									{stat.value}
								</p>
							</div>
						</div>
						<div className="mt-4">
							<p className="text-gray-500 text-sm">{stat.change}</p>
						</div>
					</div>
				))}
			</div>

			{/* Search and Filters */}
			<div className="flex items-center space-x-4">
				<div className="relative max-w-md flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
					<Input placeholder="Search invoices..." className="pl-10" />
				</div>
				<Button variant="outline">
					<Filter className="mr-2 h-4 w-4" />
					Filter
				</Button>
			</div>

			{/* Invoices Table */}
			<div className="rounded-lg border bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Invoice
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Patient
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Date
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Amount
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{invoices.map((invoice) => (
								<tr key={invoice.id} className="hover:bg-gray-50">
									<td className="whitespace-nowrap px-6 py-4">
										<div>
											<div className="font-medium text-gray-900 text-sm">
												{invoice.id}
											</div>
											<div className="text-gray-500 text-sm">
												Due: {new Date(invoice.dueDate).toLocaleDateString()}
											</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										<div>
											<div className="font-medium text-gray-900 text-sm">
												{invoice.patient}
											</div>
											<div className="text-gray-500 text-sm">
												{invoice.insurance}
											</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
										{new Date(invoice.date).toLocaleDateString()}
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										<div>
											<div className="font-medium text-gray-900 text-sm">
												${invoice.amount.toFixed(2)}
											</div>
											{invoice.paid > 0 && (
												<div className="text-gray-500 text-sm">
													Paid: ${invoice.paid.toFixed(2)}
												</div>
											)}
										</div>
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										<Badge className={getStatusColor(invoice.status)}>
											{invoice.status}
										</Badge>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>
													<Eye className="mr-2 h-4 w-4" />
													View Invoice
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Send className="mr-2 h-4 w-4" />
													Send to Patient
												</DropdownMenuItem>
												<DropdownMenuItem>
													<CreditCard className="mr-2 h-4 w-4" />
													Record Payment
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Download className="mr-2 h-4 w-4" />
													Download PDF
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-white p-6">
					<h3 className="mb-2 font-medium text-gray-900">Quick Payment</h3>
					<p className="mb-4 text-gray-600 text-sm">
						Record a payment for an existing invoice
					</p>
					<Button className="w-full">
						<CreditCard className="mr-2 h-4 w-4" />
						Record Payment
					</Button>
				</div>

				<div className="rounded-lg border bg-white p-6">
					<h3 className="mb-2 font-medium text-gray-900">Insurance Claims</h3>
					<p className="mb-4 text-gray-600 text-sm">
						Submit and track insurance claims
					</p>
					<Button variant="outline" className="w-full">
						<FileText className="mr-2 h-4 w-4" />
						Manage Claims
					</Button>
				</div>

				<div className="rounded-lg border bg-white p-6">
					<h3 className="mb-2 font-medium text-gray-900">Reports</h3>
					<p className="mb-4 text-gray-600 text-sm">
						Generate financial reports and analytics
					</p>
					<Button variant="outline" className="w-full">
						<TrendingUp className="mr-2 h-4 w-4" />
						View Reports
					</Button>
				</div>
			</div>
		</div>
	);
}
