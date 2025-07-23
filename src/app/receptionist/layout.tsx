import { ReceptionistHeader } from "@/components/receptionist/layout/header";
import { ReceptionistSidebar } from "@/components/receptionist/layout/sidebar";
import { ToastProvider } from "@/components/ui/toast";

export default function ReceptionistLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ToastProvider>
			<div className="dashboard-layout flex h-screen">
				<ReceptionistSidebar />
				<div className="flex flex-1 flex-col overflow-hidden">
					<ReceptionistHeader />
					<main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 p-6">
						{children}
					</main>
				</div>
			</div>
		</ToastProvider>
	);
}
