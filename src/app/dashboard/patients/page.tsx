import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
	Calendar, 
	Mail, 
	Phone, 
	Plus, 
	Search, 
	Filter,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2
} from "lucide-react";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - in real app this would come from database
const patients = [
	{
		id: "1",
		firstName: "John",
		lastName: "Smith",
		email: "john.smith@email.com",
		phone: "(555) 123-4567",
		dateOfBirth: "1985-03-15",
		lastVisit: "2024-01-10",
		nextAppointment: "2024-01-25",
		status: "Active",
		insurance: "Delta Dental",
		balance: 150.00,
	},
	{
		id: "2",
		firstName: "Sarah",
		lastName: "Johnson",
		email: "sarah.j@email.com",
		phone: "(555) 987-6543",
		dateOfBirth: "1992-07-22",
		lastVisit: "2024-01-08",
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
		nextAppointment: "2024-01-30",
		status: "Inactive",
		insurance: "Aetna",
		balance: 75.50,
	},
];

export default function PatientsPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
					<p className="text-gray-600">Manage your patient records and information</p>
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
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search patients..."
						className="pl-10"
					/>
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
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Patient
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Contact
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Last Visit
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Next Appointment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Balance
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{patients.map((patient) => (
								<tr key={patient.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{patient.firstName} {patient.lastName}
											</div>
											<div className="text-sm text-gray-500">
												DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="space-y-1">
											<div className="flex items-center text-sm text-gray-900">
												<Mail className="mr-2 h-4 w-4 text-gray-400" />
												{patient.email}
											</div>
											<div className="flex items-center text-sm text-gray-500">
												<Phone className="mr-2 h-4 w-4 text-gray-400" />
												{patient.phone}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{new Date(patient.lastVisit).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{patient.nextAppointment ? (
											<div className="flex items-center text-sm text-gray-900">
												<Calendar className="mr-2 h-4 w-4 text-gray-400" />
												{new Date(patient.nextAppointment).toLocaleDateString()}
											</div>
										) : (
											<span className="text-sm text-gray-500">None scheduled</span>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<Badge 
											variant={patient.status === "Active" ? "default" : "secondary"}
										>
											{patient.status}
										</Badge>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										${patient.balance.toFixed(2)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
				<p className="text-sm text-gray-700">
					Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{" "}
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
