"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
	Building, 
	User, 
	Bell, 
	Shield, 
	CreditCard,
	Users,
	Settings as SettingsIcon,
	Save,
	Eye,
	EyeOff
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [notifications, setNotifications] = useState({
		email: true,
		sms: false,
		appointments: true,
		billing: true,
		marketing: false,
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
				<p className="text-gray-600">Manage your practice settings and preferences</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Settings Navigation */}
				<div className="lg:col-span-1">
					<nav className="space-y-1">
						{[
							{ name: "Practice Info", icon: Building, active: true },
							{ name: "User Profile", icon: User, active: false },
							{ name: "Team Members", icon: Users, active: false },
							{ name: "Notifications", icon: Bell, active: false },
							{ name: "Security", icon: Shield, active: false },
							{ name: "Billing", icon: CreditCard, active: false },
						].map((item) => (
							<a
								key={item.name}
								href="#"
								className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
									item.active
										? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
										: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
								}`}
							>
								<item.icon className="mr-3 h-5 w-5" />
								{item.name}
							</a>
						))}
					</nav>
				</div>

				{/* Settings Content */}
				<div className="lg:col-span-3 space-y-6">
					{/* Practice Information */}
					<div className="rounded-lg border bg-white p-6">
						<div className="flex items-center mb-6">
							<Building className="h-5 w-5 text-gray-400 mr-2" />
							<h2 className="text-lg font-medium text-gray-900">Practice Information</h2>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label htmlFor="practiceName">Practice Name</Label>
								<Input
									id="practiceName"
									defaultValue="Creative Smile Dentistry"
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="practicePhone">Phone Number</Label>
								<Input
									id="practicePhone"
									defaultValue="(956) 357-5588"
									className="mt-1"
								/>
							</div>
							
							<div className="md:col-span-2">
								<Label htmlFor="practiceAddress">Address</Label>
								<Textarea
									id="practiceAddress"
									defaultValue="123 Main Street, Suite 100&#10;Anytown, ST 12345"
									className="mt-1"
									rows={3}
								/>
							</div>
							
							<div>
								<Label htmlFor="practiceEmail">Email</Label>
								<Input
									id="practiceEmail"
									type="email"
									defaultValue="info@creativesmile.com"
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="practiceWebsite">Website</Label>
								<Input
									id="practiceWebsite"
									defaultValue="www.creativesmile.com"
									className="mt-1"
								/>
							</div>
						</div>
						
						<div className="mt-6">
							<Button>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</div>
					</div>

					{/* User Profile */}
					<div className="rounded-lg border bg-white p-6">
						<div className="flex items-center mb-6">
							<User className="h-5 w-5 text-gray-400 mr-2" />
							<h2 className="text-lg font-medium text-gray-900">User Profile</h2>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									defaultValue="Juan"
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									defaultValue="Tovar"
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									defaultValue="simplehostingservices@proton.me"
									className="mt-1"
								/>
							</div>
							
							<div>
								<Label htmlFor="role">Role</Label>
								<Input
									id="role"
									defaultValue="Administrator"
									disabled
									className="mt-1"
								/>
							</div>
							
							<div className="md:col-span-2">
								<Label htmlFor="currentPassword">Current Password</Label>
								<div className="relative mt-1">
									<Input
										id="currentPassword"
										type={showPassword ? "text" : "password"}
										placeholder="Enter current password"
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400" />
										) : (
											<Eye className="h-4 w-4 text-gray-400" />
										)}
									</button>
								</div>
							</div>
						</div>
						
						<div className="mt-6">
							<Button>
								<Save className="mr-2 h-4 w-4" />
								Update Profile
							</Button>
						</div>
					</div>

					{/* Notifications */}
					<div className="rounded-lg border bg-white p-6">
						<div className="flex items-center mb-6">
							<Bell className="h-5 w-5 text-gray-400 mr-2" />
							<h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
						</div>
						
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="email-notifications">Email Notifications</Label>
									<p className="text-sm text-gray-500">Receive notifications via email</p>
								</div>
								<Switch
									id="email-notifications"
									checked={notifications.email}
									onCheckedChange={(checked) => 
										setNotifications(prev => ({ ...prev, email: checked }))
									}
								/>
							</div>
							
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="sms-notifications">SMS Notifications</Label>
									<p className="text-sm text-gray-500">Receive notifications via text message</p>
								</div>
								<Switch
									id="sms-notifications"
									checked={notifications.sms}
									onCheckedChange={(checked) => 
										setNotifications(prev => ({ ...prev, sms: checked }))
									}
								/>
							</div>
							
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="appointment-notifications">Appointment Reminders</Label>
									<p className="text-sm text-gray-500">Get notified about upcoming appointments</p>
								</div>
								<Switch
									id="appointment-notifications"
									checked={notifications.appointments}
									onCheckedChange={(checked) => 
										setNotifications(prev => ({ ...prev, appointments: checked }))
									}
								/>
							</div>
							
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="billing-notifications">Billing Updates</Label>
									<p className="text-sm text-gray-500">Receive notifications about payments and invoices</p>
								</div>
								<Switch
									id="billing-notifications"
									checked={notifications.billing}
									onCheckedChange={(checked) => 
										setNotifications(prev => ({ ...prev, billing: checked }))
									}
								/>
							</div>
							
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="marketing-notifications">Marketing Communications</Label>
									<p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
								</div>
								<Switch
									id="marketing-notifications"
									checked={notifications.marketing}
									onCheckedChange={(checked) => 
										setNotifications(prev => ({ ...prev, marketing: checked }))
									}
								/>
							</div>
						</div>
						
						<div className="mt-6">
							<Button>
								<Save className="mr-2 h-4 w-4" />
								Save Preferences
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
