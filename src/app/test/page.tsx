"use client";

export default function TestPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="mx-auto max-w-2xl p-8">
				<h1 className="mb-8 font-bold text-3xl text-gray-900">
					DentalCloud Authentication Test
				</h1>

				<div className="space-y-6">
					<div className="rounded-lg border bg-white p-6 shadow-sm">
						<h2 className="mb-4 font-semibold text-xl">Environment Check</h2>
						<p className="mb-4 text-gray-600">
							Check if all environment variables are properly configured:
						</p>
						<button
							type="button"
							onClick={() =>
								fetch("/api/check-env")
									.then((r) => r.json())
									.then(console.log)
							}
							className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							Check Environment
						</button>
					</div>

					<div className="rounded-lg border bg-white p-6 shadow-sm">
						<h2 className="mb-4 font-semibold text-xl">Create Sample Users</h2>
						<p className="mb-4 text-gray-600">
							Create sample practice and patient users for testing:
						</p>
						<button
							type="button"
							onClick={() =>
								fetch("/api/create-sample-users", { method: "POST" })
									.then((r) => r.json())
									.then(console.log)
							}
							className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>
							Create Sample Users
						</button>
					</div>

					<div className="rounded-lg border bg-white p-6 shadow-sm">
						<h2 className="mb-4 font-semibold text-xl">Login Pages</h2>
						<div className="space-y-2">
							<div>
								<a
									href="/auth/signin"
									className="text-blue-600 underline hover:text-blue-800"
								>
									Practice Staff Login →
								</a>
								<p className="text-gray-500 text-sm">
									For dentists, hygienists, staff, and administrators
								</p>
							</div>
							<div>
								<a
									href="/patient/auth/signin"
									className="text-blue-600 underline hover:text-blue-800"
								>
									Patient Portal Login →
								</a>
								<p className="text-gray-500 text-sm">
									For patients to access their health records
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-lg border bg-white p-6 shadow-sm">
						<h2 className="mb-4 font-semibold text-xl">
							Sample Login Credentials
						</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h3 className="mb-2 font-semibold text-gray-900">
									Practice Staff
								</h3>
								<div className="space-y-1 text-sm">
									<div>
										<strong>Admin:</strong> admin@dentalcloud.com / Admin123!
									</div>
									<div>
										<strong>Doctor:</strong> doctor@dentalcloud.com / Doctor123!
									</div>
									<div>
										<strong>Hygienist:</strong> hygienist@dentalcloud.com /
										Hygienist123!
									</div>
									<div>
										<strong>Staff:</strong> staff@dentalcloud.com / Staff123!
									</div>
									<div>
										<strong>Receptionist:</strong> receptionist@dentalcloud.com
										/ Reception123!
									</div>
								</div>
							</div>
							<div>
								<h3 className="mb-2 font-semibold text-gray-900">Patients</h3>
								<div className="space-y-1 text-sm">
									<div>
										<strong>Patient 1:</strong> patient1@example.com /
										Patient123!
									</div>
									<div>
										<strong>Patient 2:</strong> patient2@example.com /
										Patient123!
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
