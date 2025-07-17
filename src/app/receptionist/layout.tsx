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
			<div className="flex h-screen bg-gray-50">
				<ReceptionistSidebar />
				<div className="flex flex-1 flex-col overflow-hidden">
					<ReceptionistHeader />
					<main className="flex-1 overflow-y-auto p-6">{children}</main>
				</div>
			</div>
		</ToastProvider>
	);
}
