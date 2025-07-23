"use client";

import {
	ArrowLeft,
	Bell,
	Mail,
	MapPin,
	Phone,
	Save,
	Shield,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PatientProfile {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	emergencyContact: string;
	emergencyPhone: string;
	insurance: string;
	insuranceProvider: string;
	insurancePolicyNumber: string;
}

export default function ProfilePage() {
	const [profile, setProfile] = useState<PatientProfile>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		gender: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		emergencyContact: "",
		emergencyPhone: "",
		insurance: "",
		insuranceProvider: "",
		insurancePolicyNumber: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("personal");

	useEffect(() => {
		void fetchProfile();
	}, []);

	const fetchProfile = async (): Promise<void> => {
		try {
			const response = await fetch("/api/patient/profile");
			if (response.ok) {
				const data = await response.json();
				setProfile(data.profile);
			}
		} catch (error) {
			// Use a proper logger instead of console.error
			// console.error("Error fetching profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setProfile((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setIsSaving(true);

		try {
			const response = await fetch("/api/patient/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(profile),
			});

			if (response.ok) {
				alert("Profile updated successfully!");
			} else {
				alert("Failed to update profile");
			}
		} catch (error) {
			alert("Error updating profile");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-gray-500">Loading profile...</div>
			</div>
		);
	}

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
								Profile Settings
							</h1>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Tab Navigation */}
				<div className="mb-8">
					<nav className="flex space-x-8">
						{[
							{ id: "personal", name: "Personal Info", icon: User },
							{ id: "contact", name: "Contact Details", icon: Phone },
							{ id: "insurance", name: "Insurance", icon: Shield },
							{ id: "preferences", name: "Preferences", icon: Bell },
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									type="button"
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center rounded-md px-3 py-2 font-medium text-sm ${
										activeTab === tab.id
											? "bg-blue-100 text-blue-700"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<Icon className="mr-2 h-4 w-4" />
									{tab.name}
								</button>
							);
						})}
					</nav>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="rounded-lg bg-white shadow-sm">
						{/* Personal Information Tab */}
						{activeTab === "personal" && (
							<div className="p-6">
								<h2 className="mb-6 font-semibold text-gray-900 text-lg">
									Personal Information
								</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label
											htmlFor="firstName"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											First Name
										</label>
										<input
											id="firstName"
											type="text"
											name="firstName"
											value={profile.firstName}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="lastName"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Last Name
										</label>
										<input
											id="lastName"
											type="text"
											name="lastName"
											value={profile.lastName}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="dateOfBirth"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Date of Birth
										</label>
										<input
											id="dateOfBirth"
											type="date"
											name="dateOfBirth"
											value={profile.dateOfBirth}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="gender"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Gender
										</label>
										<select
											id="gender"
											name="gender"
											value={profile.gender}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
											<option value="Prefer not to say">
												Prefer not to say
											</option>
										</select>
									</div>
								</div>
							</div>
						)}

						{/* Contact Details Tab */}
						{activeTab === "contact" && (
							<div className="p-6">
								<h2 className="mb-6 font-semibold text-gray-900 text-lg">
									Contact Details
								</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div className="sm:col-span-2">
										<label
											htmlFor="email"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Email Address
										</label>
										<input
											id="email"
											type="email"
											name="email"
											value={profile.email}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="phone"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Phone Number
										</label>
										<input
											id="phone"
											type="tel"
											name="phone"
											value={profile.phone}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div className="sm:col-span-2">
										<label
											htmlFor="address"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Address
										</label>
										<input
											id="address"
											type="text"
											name="address"
											value={profile.address}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="city"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											City
										</label>
										<input
											id="city"
											type="text"
											name="city"
											value={profile.city}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="state"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											State
										</label>
										<input
											id="state"
											type="text"
											name="state"
											value={profile.state}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="zipCode"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											ZIP Code
										</label>
										<input
											id="zipCode"
											type="text"
											name="zipCode"
											value={profile.zipCode || ""}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="emergencyContact"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Emergency Contact
										</label>
										<input
											id="emergencyContact"
											type="text"
											name="emergencyContact"
											value={profile.emergencyContact}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="emergencyPhone"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Emergency Phone
										</label>
										<input
											id="emergencyPhone"
											type="tel"
											name="emergencyPhone"
											value={profile.emergencyPhone}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Insurance Tab */}
						{activeTab === "insurance" && (
							<div className="p-6">
								<h2 className="mb-6 font-semibold text-gray-900 text-lg">
									Insurance Information
								</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label
											htmlFor="insuranceProvider"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Insurance Provider
										</label>
										<input
											id="insuranceProvider"
											type="text"
											name="insuranceProvider"
											value={profile.insuranceProvider}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											htmlFor="insurancePolicyNumber"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Policy Number
										</label>
										<input
											id="insurancePolicyNumber"
											type="text"
											name="insurancePolicyNumber"
											value={profile.insurancePolicyNumber}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div className="sm:col-span-2">
										<label
											htmlFor="insuranceNotes"
											className="mb-2 block font-medium text-gray-700 text-sm"
										>
											Additional Insurance Notes
										</label>
										<input
											id="insuranceNotes"
											type="text"
											name="insurance"
											value={profile.insurance}
											onChange={handleInputChange}
											placeholder="Any additional insurance information"
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Preferences Tab */}
						{activeTab === "preferences" && (
							<div className="p-6">
								<h2 className="mb-6 font-semibold text-gray-900 text-lg">
									Communication Preferences
								</h2>
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium text-gray-900 text-sm">
												Email Notifications
											</h3>
											<p className="text-gray-500 text-sm">
												Receive appointment reminders and updates via email
											</p>
										</div>
										<input
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											defaultChecked
										/>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium text-gray-900 text-sm">
												SMS Notifications
											</h3>
											<p className="text-gray-500 text-sm">
												Receive appointment reminders via text message
											</p>
										</div>
										<input
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium text-gray-900 text-sm">
												Marketing Communications
											</h3>
											<p className="text-gray-500 text-sm">
												Receive promotional offers and dental health tips
											</p>
										</div>
										<input
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Save Button */}
						<div className="border-gray-200 border-t px-6 py-4">
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isSaving}
									className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-gray-900 text-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isSaving ? (
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<Save className="mr-2 h-4 w-4" />
									)}
									{isSaving ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</div>
					</div>
				</form>
			</main>
		</div>
	);
}
