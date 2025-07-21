import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import PatientDashboardClient from "./client";

export default async function PatientDashboard() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/signin");
	}

	if (user.type !== "patient") {
		redirect("/auth/signin");
	}

	return <PatientDashboardClient user={user} />;
}
