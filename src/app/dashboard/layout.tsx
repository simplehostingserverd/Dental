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

	if (!user || user.type !== "practice") {
		redirect("/auth/signin");
	}

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header user={user} />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
