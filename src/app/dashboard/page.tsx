import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/signin");
	}

	// Redirect to role-specific dashboard
	switch (user.role?.toLowerCase()) {
		case "dentist":
			redirect("/dashboard/dentist");
			break;
		case "receptionist":
			redirect("/receptionist");
			break;
		case "patient":
			redirect("/patient/dashboard");
			break;
		case "admin":
			// Admin can stay on main dashboard
			break;
		default:
			// Default to dentist dashboard for practice users
			if (user.type === "practice") {
				redirect("/dashboard/dentist");
			} else {
				redirect("/patient/dashboard");
			}
	}

	// This will only be reached by admin users
	// You can create an admin dashboard component here
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">
						Admin Dashboard
					</h1>
					<p className="text-gray-600">Manage your dental practice</p>
				</div>
			</div>

			<div className="rounded-lg bg-white p-6 shadow">
				<h2 className="mb-4 font-medium text-lg">Quick Actions</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<a
						href="/dashboard/dentist"
						className="rounded-lg border p-4 hover:bg-gray-50"
					>
						<h3 className="font-medium">Dentist View</h3>
						<p className="text-gray-600 text-sm">Access dentist dashboard</p>
					</a>
					<a
						href="/receptionist"
						className="rounded-lg border p-4 hover:bg-gray-50"
					>
						<h3 className="font-medium">Receptionist View</h3>
						<p className="text-gray-600 text-sm">
							Access receptionist dashboard
						</p>
					</a>
					<a
						href="/dashboard/settings"
						className="rounded-lg border p-4 hover:bg-gray-50"
					>
						<h3 className="font-medium">Settings</h3>
						<p className="text-gray-600 text-sm">Manage practice settings</p>
					</a>
				</div>
			</div>
		</div>
	);
}
