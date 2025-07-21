"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Bell,
	Calendar,
	Clock,
	CreditCard,
	Download,
	Eye,
	EyeOff,
	FileText,
	Mail,
	MessageSquare,
	Moon,
	Palette,
	RotateCcw,
	Save,
	Settings,
	Shield,
	Sun,
	Upload,
	User,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
	const [notifications, setNotifications] = useState({
		appointmentReminders: true,
		paymentAlerts: true,
		taskDeadlines: true,
		systemUpdates: false,
		marketingEmails: false,
		smsNotifications: true,
		emailNotifications: true,
		desktopNotifications: true,
	});

	const [preferences, setPreferences] = useState({
		theme: "light",
		language: "en",
		timezone: "America/New_York",
		dateFormat: "MM/DD/YYYY",
		timeFormat: "12h",
		currency: "USD",
		soundEnabled: true,
		autoSave: true,
		compactView: false,
	});

	const [security, setSecurity] = useState({
		twoFactorEnabled: false,
		sessionTimeout: "30",
		passwordExpiry: "90",
		loginAlerts: true,
	});

	const [profile, setProfile] = useState({
		firstName: "Reception",
		lastName: "Staff",
		email: "receptionist@dentalcloud.com",
		phone: "(555) 123-4567",
		department: "Front Desk",
		role: "Receptionist",
	});

	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleNotificationChange = (key: string, value: boolean) => {
		setNotifications((prev) => ({ ...prev, [key]: value }));
	};

	const handlePreferenceChange = (key: string, value: string | boolean) => {
		setPreferences((prev) => ({ ...prev, [key]: value }));
	};

	const handleSecurityChange = (key: string, value: string | boolean) => {
		setSecurity((prev) => ({ ...prev, [key]: value }));
	};

	const handleProfileChange = (key: string, value: string) => {
		setProfile((prev) => ({ ...prev, [key]: value }));
	};

	const handleSaveSettings = () => {
		// TODO: Implement settings save
		console.log("Saving settings:", {
			notifications,
			preferences,
			security,
			profile,
		});
	};

	const handlePasswordChange = () => {
		if (newPassword !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		// TODO: Implement password change
		console.log("Changing password");
		setShowPasswordDialog(false);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	const handleExportData = () => {
		// TODO: Implement data export
		console.log("Exporting user data");
	};

	const handleResetSettings = () => {
		if (confirm("Are you sure you want to reset all settings to default?")) {
			// TODO: Implement settings reset
			console.log("Resetting settings");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-gray-900">Settings</h1>
					<p className="text-gray-600">
						Manage your account, preferences, and system settings
					</p>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline" onClick={handleResetSettings}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Reset to Default
					</Button>
					<Button onClick={handleSaveSettings}>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</div>
			</div>

			{/* Settings Tabs */}
			<Tabs defaultValue="profile" className="space-y-4">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="preferences">Preferences</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="integrations">Integrations</TabsTrigger>
				</TabsList>

				{/* Profile Tab */}
				<TabsContent value="profile" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<User className="mr-2 h-5 w-5" />
								Personal Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>First Name</Label>
									<Input
										value={profile.firstName}
										onChange={(e) =>
											handleProfileChange("firstName", e.target.value)
										}
									/>
								</div>
								<div>
									<Label>Last Name</Label>
									<Input
										value={profile.lastName}
										onChange={(e) =>
											handleProfileChange("lastName", e.target.value)
										}
									/>
								</div>
							</div>
							<div>
								<Label>Email Address</Label>
								<Input
									type="email"
									value={profile.email}
									onChange={(e) => handleProfileChange("email", e.target.value)}
								/>
							</div>
							<div>
								<Label>Phone Number</Label>
								<Input
									value={profile.phone}
									onChange={(e) => handleProfileChange("phone", e.target.value)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Department</Label>
									<Input
										value={profile.department}
										onChange={(e) =>
											handleProfileChange("department", e.target.value)
										}
									/>
								</div>
								<div>
									<Label>Role</Label>
									<Input
										value={profile.role}
										onChange={(e) =>
											handleProfileChange("role", e.target.value)
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Shield className="mr-2 h-5 w-5" />
								Account Security
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Password</h4>
									<p className="text-gray-600 text-sm">
										Last changed 30 days ago
									</p>
								</div>
								<Dialog
									open={showPasswordDialog}
									onOpenChange={setShowPasswordDialog}
								>
									<DialogTrigger asChild>
										<Button variant="outline">Change Password</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Change Password</DialogTitle>
										</DialogHeader>
										<div className="space-y-4">
											<div>
												<Label>Current Password</Label>
												<Input
													type="password"
													value={currentPassword}
													onChange={(e) => setCurrentPassword(e.target.value)}
												/>
											</div>
											<div>
												<Label>New Password</Label>
												<Input
													type="password"
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
												/>
											</div>
											<div>
												<Label>Confirm New Password</Label>
												<Input
													type="password"
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
												/>
											</div>
											<div className="flex justify-end space-x-3">
												<Button
													variant="outline"
													onClick={() => setShowPasswordDialog(false)}
												>
													Cancel
												</Button>
												<Button onClick={handlePasswordChange}>
													Change Password
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Two-Factor Authentication</h4>
									<p className="text-gray-600 text-sm">
										Add an extra layer of security
									</p>
								</div>
								<Switch
									checked={security.twoFactorEnabled}
									onCheckedChange={(checked) =>
										handleSecurityChange("twoFactorEnabled", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notifications Tab */}
				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Bell className="mr-2 h-5 w-5" />
								Notification Preferences
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Appointment Reminders</h4>
										<p className="text-gray-600 text-sm">
											Get notified about upcoming appointments
										</p>
									</div>
									<Switch
										checked={notifications.appointmentReminders}
										onCheckedChange={(checked) =>
											handleNotificationChange("appointmentReminders", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Payment Alerts</h4>
										<p className="text-gray-600 text-sm">
											Notifications for payment processing
										</p>
									</div>
									<Switch
										checked={notifications.paymentAlerts}
										onCheckedChange={(checked) =>
											handleNotificationChange("paymentAlerts", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Task Deadlines</h4>
										<p className="text-gray-600 text-sm">
											Reminders for upcoming task deadlines
										</p>
									</div>
									<Switch
										checked={notifications.taskDeadlines}
										onCheckedChange={(checked) =>
											handleNotificationChange("taskDeadlines", checked)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">System Updates</h4>
										<p className="text-gray-600 text-sm">
											Notifications about system maintenance
										</p>
									</div>
									<Switch
										checked={notifications.systemUpdates}
										onCheckedChange={(checked) =>
											handleNotificationChange("systemUpdates", checked)
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Delivery Methods</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<MessageSquare className="h-5 w-5 text-gray-600" />
									<div>
										<h4 className="font-medium">SMS Notifications</h4>
										<p className="text-gray-600 text-sm">
											Receive notifications via text message
										</p>
									</div>
								</div>
								<Switch
									checked={notifications.smsNotifications}
									onCheckedChange={(checked) =>
										handleNotificationChange("smsNotifications", checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<Mail className="h-5 w-5 text-gray-600" />
									<div>
										<h4 className="font-medium">Email Notifications</h4>
										<p className="text-gray-600 text-sm">
											Receive notifications via email
										</p>
									</div>
								</div>
								<Switch
									checked={notifications.emailNotifications}
									onCheckedChange={(checked) =>
										handleNotificationChange("emailNotifications", checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<Bell className="h-5 w-5 text-gray-600" />
									<div>
										<h4 className="font-medium">Desktop Notifications</h4>
										<p className="text-gray-600 text-sm">
											Show notifications in browser
										</p>
									</div>
								</div>
								<Switch
									checked={notifications.desktopNotifications}
									onCheckedChange={(checked) =>
										handleNotificationChange("desktopNotifications", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Preferences Tab */}
				<TabsContent value="preferences" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Palette className="mr-2 h-5 w-5" />
								Appearance
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Theme</Label>
								<Select
									value={preferences.theme}
									onValueChange={(value) =>
										handlePreferenceChange("theme", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="light">
											<div className="flex items-center">
												<Sun className="mr-2 h-4 w-4" />
												Light
											</div>
										</SelectItem>
										<SelectItem value="dark">
											<div className="flex items-center">
												<Moon className="mr-2 h-4 w-4" />
												Dark
											</div>
										</SelectItem>
										<SelectItem value="system">System</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Compact View</h4>
									<p className="text-gray-600 text-sm">
										Use a more compact interface layout
									</p>
								</div>
								<Switch
									checked={preferences.compactView}
									onCheckedChange={(checked) =>
										handlePreferenceChange("compactView", checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Sound Effects</h4>
									<p className="text-gray-600 text-sm">
										Play sounds for notifications and actions
									</p>
								</div>
								<Switch
									checked={preferences.soundEnabled}
									onCheckedChange={(checked) =>
										handlePreferenceChange("soundEnabled", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Clock className="mr-2 h-5 w-5" />
								Regional Settings
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Language</Label>
								<Select
									value={preferences.language}
									onValueChange={(value) =>
										handlePreferenceChange("language", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="es">Spanish</SelectItem>
										<SelectItem value="fr">French</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Timezone</Label>
								<Select
									value={preferences.timezone}
									onValueChange={(value) =>
										handlePreferenceChange("timezone", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="America/New_York">
											Eastern Time
										</SelectItem>
										<SelectItem value="America/Chicago">
											Central Time
										</SelectItem>
										<SelectItem value="America/Denver">
											Mountain Time
										</SelectItem>
										<SelectItem value="America/Los_Angeles">
											Pacific Time
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Date Format</Label>
									<Select
										value={preferences.dateFormat}
										onValueChange={(value) =>
											handlePreferenceChange("dateFormat", value)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
											<SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
											<SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Time Format</Label>
									<Select
										value={preferences.timeFormat}
										onValueChange={(value) =>
											handlePreferenceChange("timeFormat", value)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="12h">12 Hour</SelectItem>
											<SelectItem value="24h">24 Hour</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Security Tab */}
				<TabsContent value="security" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Shield className="mr-2 h-5 w-5" />
								Security Settings
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Session Timeout (minutes)</Label>
								<Select
									value={security.sessionTimeout}
									onValueChange={(value) =>
										handleSecurityChange("sessionTimeout", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="15">15 minutes</SelectItem>
										<SelectItem value="30">30 minutes</SelectItem>
										<SelectItem value="60">1 hour</SelectItem>
										<SelectItem value="120">2 hours</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Password Expiry (days)</Label>
								<Select
									value={security.passwordExpiry}
									onValueChange={(value) =>
										handleSecurityChange("passwordExpiry", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="30">30 days</SelectItem>
										<SelectItem value="60">60 days</SelectItem>
										<SelectItem value="90">90 days</SelectItem>
										<SelectItem value="never">Never</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Login Alerts</h4>
									<p className="text-gray-600 text-sm">
										Get notified of new login attempts
									</p>
								</div>
								<Switch
									checked={security.loginAlerts}
									onCheckedChange={(checked) =>
										handleSecurityChange("loginAlerts", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Data & Privacy</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Export My Data</h4>
									<p className="text-gray-600 text-sm">
										Download a copy of your data
									</p>
								</div>
								<Button variant="outline" onClick={handleExportData}>
									<Download className="mr-2 h-4 w-4" />
									Export
								</Button>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Auto-Save</h4>
									<p className="text-gray-600 text-sm">
										Automatically save changes
									</p>
								</div>
								<Switch
									checked={preferences.autoSave}
									onCheckedChange={(checked) =>
										handlePreferenceChange("autoSave", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Integrations Tab */}
				<TabsContent value="integrations" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Zap className="mr-2 h-5 w-5" />
								Connected Services
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-center space-x-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
										<Calendar className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<h4 className="font-medium">Google Calendar</h4>
										<p className="text-gray-600 text-sm">
											Sync appointments with Google Calendar
										</p>
									</div>
								</div>
								<Badge className="bg-green-100 text-green-800">Connected</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-center space-x-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
										<MessageSquare className="h-5 w-5 text-purple-600" />
									</div>
									<div>
										<h4 className="font-medium">Twilio SMS</h4>
										<p className="text-gray-600 text-sm">
											Send SMS notifications to patients
										</p>
									</div>
								</div>
								<Button variant="outline">Connect</Button>
							</div>
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-center space-x-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
										<CreditCard className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<h4 className="font-medium">Stripe Payments</h4>
										<p className="text-gray-600 text-sm">
											Process credit card payments
										</p>
									</div>
								</div>
								<Button variant="outline">Connect</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
