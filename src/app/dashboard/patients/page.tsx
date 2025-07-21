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
	Calendar,
	Edit,
	Eye,
	Filter,
	Mail,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from database
const patients = [
	{
		id: "1",
		firstName: "John",
		lastName: "Smith",
		email: "john.smith@email.com",
		phone: "(555) 123-4567",
		dateOfBirth: "1985-03-15",
		lastVisit: "2025-01-10",
		nextAppointment: "2025-01-25",
		status: "Active",
		insurance: "Delta Dental",
		balance: 150.0,
	},
	{
		id: "2",
		firstName: "Sarah",
		lastName: "Johnson",
		email: "sarah.j@email.com",
		phone: "(555) 987-6543",
		dateOfBirth: "1992-07-22",
		lastVisit: "2025-01-08",
		nextAppointment: null,
		status: "Active",
		insurance: "Cigna",
		balance: 0,
	},
	{
		id: "3",
		firstName: "Michael",
		lastName: "Brown",
		email: "m.brown@email.com",
		phone: "(555) 456-7890",
		dateOfBirth: "1978-11-03",
		lastVisit: "2023-12-15",
		nextAppointment: "2025-01-30",
		status: "Inactive",
		insurance: "Aetna",
		balance: 75.5,
	},
];

export default function PatientsPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">Patients</h1>
					<p className="text-gray-600">
						Manage your patient records and information
					</p>
				</div>
				<Link href="/dashboard/patients/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Patient
					</Button>
				</Link>
			</div>

			{/* Search and Filters */}
			<div className="flex items-center space-x-4">
				<div className="relative max-w-md flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
					<Input placeholder="Search patients..." className="pl-10" />
				</div>
				<Button variant="outline">
					<Filter className="mr-2 h-4 w-4" />
					Filter
				</Button>
			</div>

			{/* Patients Table */}
			<div className="rounded-lg border bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Patient
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Contact
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Last Visit
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Next Appointment
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Balance
								</th>
								<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{patients.map((patient) => (
								<tr key={patient.id} className="hover:bg-gray-50">
									<td className="whitespace-nowrap px-6 py-4">
										<div>
											<div className="font-medium text-gray-900 text-sm">
												{patient.firstName} {patient.lastName}
											</div>
											<div className="text-gray-500 text-sm">
												DOB:{" "}
												{new Date(patient.dateOfBirth).toLocaleDateString()}
											</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										<div className="space-y-1">
											<div className="flex items-center text-gray-900 text-sm">
												<Mail className="mr-2 h-4 w-4 text-gray-400" />
												{patient.email}
											</div>
											<div className="flex items-center text-gray-500 text-sm">
												<Phone className="mr-2 h-4 w-4 text-gray-400" />
												{patient.phone}
											</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
										{new Date(patient.lastVisit).toLocaleDateString()}
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										{patient.nextAppointment ? (
											<div className="flex items-center text-gray-900 text-sm">
												<Calendar className="mr-2 h-4 w-4 text-gray-400" />
												{new Date(patient.nextAppointment).toLocaleDateString()}
											</div>
										) : (
											<span className="text-gray-500 text-sm">
												None scheduled
											</span>
										)}
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										<Badge
											variant={
												patient.status === "Active" ? "default" : "secondary"
											}
										>
											{patient.status}
										</Badge>
									</td>
									<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
										${patient.balance.toFixed(2)}
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
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Edit className="mr-2 h-4 w-4" />
													Edit Patient
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Calendar className="mr-2 h-4 w-4" />
													Schedule Appointment
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">
													<Trash2 className="mr-2 h-4 w-4" />
													Delete Patient
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

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<p className="text-gray-700 text-sm">
					Showing <span className="font-medium">1</span> to{" "}
					<span className="font-medium">3</span> of{" "}
					<span className="font-medium">3</span> results
				</p>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm" disabled>
						Previous
					</Button>
					<Button variant="outline" size="sm" disabled>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
