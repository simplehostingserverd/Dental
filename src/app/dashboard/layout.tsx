import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/signin");
	}

	// Redirect patients to their own dashboard
	if (user.type === "patient") {
		redirect("/dashboard/patient");
	}

	// Only practice users (dentists, receptionists) can access this dashboard
	if (user.type !== "practice") {
		redirect("/auth/signin");
	}

	return (
		<div className="dashboard-layout flex h-screen">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header user={user} />
				<main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
