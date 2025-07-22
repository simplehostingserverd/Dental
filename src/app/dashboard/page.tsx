import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/signin");
	}

	// Redirect to role-specific dashboard
	switch (user.role?.toLowerCase()) {
		case "dentist":
			redirect("/dashboard/dentist");
		case "receptionist":
			redirect("/receptionist");
		case "patient":
			redirect("/patient/dashboard");
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
					<p className="text-gray-600">
						Manage your dental practice
					</p>
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-lg font-medium mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<a
						href="/dashboard/dentist"
						className="p-4 border rounded-lg hover:bg-gray-50"
					>
						<h3 className="font-medium">Dentist View</h3>
						<p className="text-sm text-gray-600">Access dentist dashboard</p>
					</a>
					<a
						href="/receptionist"
						className="p-4 border rounded-lg hover:bg-gray-50"
					>
						<h3 className="font-medium">Receptionist View</h3>
						<p className="text-sm text-gray-600">Access receptionist dashboard</p>
					</a>
					<a
						href="/dashboard/settings"
						className="p-4 border rounded-lg hover:bg-gray-50"
					>
						<h3 className="font-medium">Settings</h3>
						<p className="text-sm text-gray-600">Manage practice settings</p>
					</a>
				</div>
			</div>
		</div>
	);
}
