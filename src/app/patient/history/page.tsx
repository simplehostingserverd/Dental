import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import {
	ArrowLeft,
	Calendar,
	DollarSign,
	Download,
	FileText,
	User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TreatmentHistoryPage() {
	const user = await getCurrentUser();

	if (!user || user.type !== "patient") {
		redirect("/patient/auth/signin");
	}

	// Find the patient record
	const patient = await db.patient.findUnique({
		where: { patientUserId: user.id },
		include: {
			treatments: {
				orderBy: { date: "desc" },
			},
			appointments: {
				where: {
					status: "COMPLETED",
				},
				include: {
					practiceUser: {
						select: {
							firstName: true,
							lastName: true,
						},
					},
				},
				orderBy: { start: "desc" },
			},
		},
	});

	if (!patient) {
		redirect("/patient/auth/signin");
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link
								href="/patient/dashboard"
								className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
							>
								<ArrowLeft className="h-5 w-5" />
							</Link>
							<h1 className="font-bold text-gray-900 text-xl">
								Treatment History
							</h1>
						</div>
						<button
							type="button"
							className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
						>
							<Download className="mr-2 h-4 w-4" />
							Export History
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Summary Cards */}
				<div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
								<Calendar className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm">
									Total Visits
								</p>
								<p className="font-bold text-2xl text-gray-900">
									{patient.appointments.length}
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
								<FileText className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm">Treatments</p>
								<p className="font-bold text-2xl text-gray-900">
									{patient.treatments.length}
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="flex items-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
								<DollarSign className="h-6 w-6 text-purple-600" />
							</div>
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm">Total Spent</p>
								<p className="font-bold text-2xl text-gray-900">
									{formatCurrency(
										patient.treatments.reduce(
											(sum, treatment) => sum + treatment.cost,
											0,
										),
									)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Treatment History */}
				<div className="rounded-lg bg-white shadow-sm">
					<div className="border-gray-200 border-b px-6 py-4">
						<h2 className="font-semibold text-gray-900 text-lg">
							Treatment Records
						</h2>
						<p className="mt-1 text-gray-600 text-sm">
							Complete history of your dental treatments and procedures
						</p>
					</div>

					<div className="divide-y divide-gray-200">
						{patient.treatments.length > 0 ? (
							patient.treatments.map((treatment) => (
								<div key={treatment.id} className="px-6 py-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{treatment.title}
											</h3>
											<p className="mt-1 text-gray-600 text-sm">
												{treatment.description}
											</p>
											<div className="mt-2 flex items-center space-x-4 text-gray-500 text-sm">
												<div className="flex items-center">
													<Calendar className="mr-1 h-4 w-4" />
													{formatDate(treatment.date)}
												</div>
											</div>
										</div>
										<div className="ml-4 text-right">
											<p className="font-medium text-gray-900">
												{formatCurrency(treatment.cost)}
											</p>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="px-6 py-12 text-center">
								<FileText className="mx-auto h-12 w-12 text-gray-600" />
								<h3 className="mt-2 font-medium text-gray-900 text-sm">
									No treatment history
								</h3>
								<p className="mt-1 text-gray-500 text-sm">
									Your treatment records will appear here after your first
									visit.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Appointment History */}
				<div className="mt-8 rounded-lg bg-white shadow-sm">
					<div className="border-gray-200 border-b px-6 py-4">
						<h2 className="font-semibold text-gray-900 text-lg">
							Appointment History
						</h2>
						<p className="mt-1 text-gray-600 text-sm">
							Record of your completed dental appointments
						</p>
					</div>

					<div className="divide-y divide-gray-200">
						{patient.appointments.length > 0 ? (
							patient.appointments.map((appointment) => (
								<div key={appointment.id} className="px-6 py-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{appointment.appointmentType || "General Appointment"}
											</h3>
											{appointment.notes && (
												<p className="mt-1 text-gray-600 text-sm">
													{appointment.notes}
												</p>
											)}
											<div className="mt-2 flex items-center space-x-4 text-gray-500 text-sm">
												<div className="flex items-center">
													<Calendar className="mr-1 h-4 w-4" />
													{appointment.start ? formatDate(appointment.start) : "Date TBD"}
												</div>
												<div className="flex items-center">
													<User className="mr-1 h-4 w-4" />
													{appointment.practiceUser
														? `${appointment.practiceUser.firstName} ${appointment.practiceUser.lastName}`
														: "Staff Member"}
												</div>
											</div>
										</div>
										<div className="ml-4">
											<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-800 text-xs">
												Completed
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="px-6 py-12 text-center">
								<Calendar className="mx-auto h-12 w-12 text-gray-600" />
								<h3 className="mt-2 font-medium text-gray-900 text-sm">
									No appointment history
								</h3>
								<p className="mt-1 text-gray-500 text-sm">
									Your completed appointments will appear here.
								</p>
								<Link href="/patient/appointments/book">
									<button
										type="button"
										className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-gray-900 hover:bg-blue-700"
									>
										Book Your First Appointment
									</button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
