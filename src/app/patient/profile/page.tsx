"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Shield, Bell } from "lucide-react";
import Link from "next/link";

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
		insurancePolicyNumber: ""
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("personal");

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		try {
			const response = await fetch("/api/patient/profile");
			if (response.ok) {
				const data = await response.json();
				setProfile(data.profile);
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setProfile(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
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
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
							<h1 className="font-bold text-xl text-gray-900">Profile Settings</h1>
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
							{ id: "preferences", name: "Preferences", icon: Bell }
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
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
								<h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											First Name
										</label>
										<input
											type="text"
											name="firstName"
											value={profile.firstName}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Last Name
										</label>
										<input
											type="text"
											name="lastName"
											value={profile.lastName}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Date of Birth
										</label>
										<input
											type="date"
											name="dateOfBirth"
											value={profile.dateOfBirth}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Gender
										</label>
										<select
											name="gender"
											value={profile.gender}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
											<option value="Prefer not to say">Prefer not to say</option>
										</select>
									</div>
								</div>
							</div>
						)}

						{/* Contact Details Tab */}
						{activeTab === "contact" && (
							<div className="p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Details</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div className="sm:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Email Address
										</label>
										<input
											type="email"
											name="email"
											value={profile.email}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Phone Number
										</label>
										<input
											type="tel"
											name="phone"
											value={profile.phone}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div className="sm:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Address
										</label>
										<input
											type="text"
											name="address"
											value={profile.address}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											City
										</label>
										<input
											type="text"
											name="city"
											value={profile.city}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											State
										</label>
										<input
											type="text"
											name="state"
											value={profile.state}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											ZIP Code
										</label>
										<input
											type="text"
											name="zipCode"
											value={profile.zipCode || ""}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Emergency Contact
										</label>
										<input
											type="text"
											name="emergencyContact"
											value={profile.emergencyContact}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Emergency Phone
										</label>
										<input
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
								<h2 className="text-lg font-semibold text-gray-900 mb-6">Insurance Information</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Insurance Provider
										</label>
										<input
											type="text"
											name="insuranceProvider"
											value={profile.insuranceProvider}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Policy Number
										</label>
										<input
											type="text"
											name="insurancePolicyNumber"
											value={profile.insurancePolicyNumber}
											onChange={handleInputChange}
											className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										/>
									</div>
									<div className="sm:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Additional Insurance Notes
										</label>
										<input
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
								<h2 className="text-lg font-semibold text-gray-900 mb-6">Communication Preferences</h2>
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
											<p className="text-sm text-gray-500">Receive appointment reminders and updates via email</p>
										</div>
										<input
											type="checkbox"
											className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
											defaultChecked
										/>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
											<p className="text-sm text-gray-500">Receive appointment reminders via text message</p>
										</div>
										<input
											type="checkbox"
											className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
										/>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
											<p className="text-sm text-gray-500">Receive promotional offers and dental health tips</p>
										</div>
										<input
											type="checkbox"
											className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Save Button */}
						<div className="border-t border-gray-200 px-6 py-4">
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isSaving}
									className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
