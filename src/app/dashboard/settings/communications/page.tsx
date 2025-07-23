"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
	MessageSquare,
	Save,
	Send,
	Shield,
	TestTube,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";

interface CommunicationSettings {
	whatsapp: {
		accessToken: string;
		phoneNumberId: string;
		webhookVerifyToken: string;
		webhookSecret: string;
		enabled: boolean;
	};
	telegram: {
		botToken: string;
		webhookSecret: string;
		enabled: boolean;
	};
	signal: {
		phoneNumber: string;
		apiUrl: string;
		enabled: boolean;
	};
}

export default function CommunicationsSettingsPage() {
	const [settings, setSettings] = useState<CommunicationSettings>({
		whatsapp: {
			accessToken: "",
			phoneNumberId: "",
			webhookVerifyToken: "",
			webhookSecret: "",
			enabled: false,
		},
		telegram: {
			botToken: "",
			webhookSecret: "",
			enabled: false,
		},
		signal: {
			phoneNumber: "",
			apiUrl: "http://localhost:8080",
			enabled: false,
		},
	});

	const [showSecrets, setShowSecrets] = useState({
		whatsappToken: false,
		whatsappSecret: false,
		telegramToken: false,
		telegramSecret: false,
	});

	const [testResults, setTestResults] = useState({
		whatsapp: null as boolean | null,
		telegram: null as boolean | null,
		signal: null as boolean | null,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [isTesting, setIsTesting] = useState({
		whatsapp: false,
		telegram: false,
		signal: false,
	});

	// Load settings on component mount
	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const response = await fetch("/api/dashboard/settings/communications");
			if (response.ok) {
				const data = await response.json();
				setSettings(data.settings || settings);
			}
		} catch (error) {
			console.error("Error loading settings:", error);
		}
	};

	const saveSettings = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/dashboard/settings/communications", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(settings),
			});

			if (response.ok) {
				toast.success("Communication settings saved successfully!");
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to save settings");
			}
		} catch (error) {
			console.error("Error saving settings:", error);
			toast.error("Failed to save settings");
		} finally {
			setIsLoading(false);
		}
	};

	const testConnection = async (
		platform: "whatsapp" | "telegram" | "signal",
	) => {
		setIsTesting((prev) => ({ ...prev, [platform]: true }));
		try {
			const response = await fetch(`/api/communications/${platform}`, {
				method: "GET",
			});

			const data = await response.json();
			const isAvailable = data.available || false;

			setTestResults((prev) => ({ ...prev, [platform]: isAvailable }));

			if (isAvailable) {
				toast.success(
					`${platform.charAt(0).toUpperCase() + platform.slice(1)} connection successful!`,
				);
			} else {
				toast.error(
					`${platform.charAt(0).toUpperCase() + platform.slice(1)} connection failed`,
				);
			}
		} catch (error) {
			console.error(`Error testing ${platform}:`, error);
			setTestResults((prev) => ({ ...prev, [platform]: false }));
			toast.error(`Failed to test ${platform} connection`);
		} finally {
			setIsTesting((prev) => ({ ...prev, [platform]: false }));
		}
	};

	const updateSettings = (
		platform: keyof CommunicationSettings,
		field: string,
		value: string | boolean,
	) => {
		setSettings((prev) => ({
			...prev,
			[platform]: {
				...prev[platform],
				[field]: value,
			},
		}));
	};

	const toggleSecretVisibility = (field: keyof typeof showSecrets) => {
		setShowSecrets((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const getStatusBadge = (enabled: boolean, testResult: boolean | null) => {
		if (!enabled) {
			return <Badge variant="secondary">Disabled</Badge>;
		}
		if (testResult === null) {
			return <Badge variant="outline">Not Tested</Badge>;
		}
		if (testResult) {
			return (
				<Badge className="bg-green-500 hover:bg-green-600">
					<CheckCircle className="mr-1 h-3 w-3" />
					Connected
				</Badge>
			);
		}
		return (
			<Badge variant="destructive">
				<XCircle className="mr-1 h-3 w-3" />
				Failed
			</Badge>
		);
	};

	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">Communication Settings</h1>
				<p className="text-gray-600">
					Configure API keys and settings for patient communication platforms
				</p>
			</div>

			<Tabs defaultValue="whatsapp" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="whatsapp" className="flex items-center gap-2">
						<MessageSquare className="h-4 w-4" />
						WhatsApp
					</TabsTrigger>
					<TabsTrigger value="telegram" className="flex items-center gap-2">
						<Send className="h-4 w-4" />
						Telegram
					</TabsTrigger>
					<TabsTrigger value="signal" className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						Signal
					</TabsTrigger>
				</TabsList>

				{/* WhatsApp Settings */}
				<TabsContent value="whatsapp">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<MessageSquare className="h-5 w-5" />
										WhatsApp Business API
									</CardTitle>
									<p className="text-gray-600 text-sm">
										Configure WhatsApp Business API for patient messaging
									</p>
								</div>
								{getStatusBadge(
									settings.whatsapp.enabled,
									testResults.whatsapp,
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="whatsapp-enabled"
									checked={settings.whatsapp.enabled}
									onChange={(e) =>
										updateSettings("whatsapp", "enabled", e.target.checked)
									}
									className="rounded"
								/>
								<Label htmlFor="whatsapp-enabled">
									Enable WhatsApp Integration
								</Label>
							</div>

							{settings.whatsapp.enabled && (
								<>
									<div className="space-y-2">
										<Label htmlFor="whatsapp-token">Access Token</Label>
										<div className="relative">
											<Input
												id="whatsapp-token"
												type={showSecrets.whatsappToken ? "text" : "password"}
												value={settings.whatsapp.accessToken}
												onChange={(e) =>
													updateSettings(
														"whatsapp",
														"accessToken",
														e.target.value,
													)
												}
												placeholder="Enter WhatsApp Business API access token"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3"
												onClick={() => toggleSecretVisibility("whatsappToken")}
											>
												{showSecrets.whatsappToken ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="whatsapp-phone">Phone Number ID</Label>
										<Input
											id="whatsapp-phone"
											value={settings.whatsapp.phoneNumberId}
											onChange={(e) =>
												updateSettings(
													"whatsapp",
													"phoneNumberId",
													e.target.value,
												)
											}
											placeholder="Enter WhatsApp Business phone number ID"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="whatsapp-verify">
											Webhook Verify Token
										</Label>
										<Input
											id="whatsapp-verify"
											value={settings.whatsapp.webhookVerifyToken}
											onChange={(e) =>
												updateSettings(
													"whatsapp",
													"webhookVerifyToken",
													e.target.value,
												)
											}
											placeholder="Enter webhook verify token"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="whatsapp-secret">Webhook Secret</Label>
										<div className="relative">
											<Input
												id="whatsapp-secret"
												type={showSecrets.whatsappSecret ? "text" : "password"}
												value={settings.whatsapp.webhookSecret}
												onChange={(e) =>
													updateSettings(
														"whatsapp",
														"webhookSecret",
														e.target.value,
													)
												}
												placeholder="Enter webhook secret"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3"
												onClick={() => toggleSecretVisibility("whatsappSecret")}
											>
												{showSecrets.whatsappSecret ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="flex gap-2 pt-4">
										<Button
											onClick={() => testConnection("whatsapp")}
											disabled={isTesting.whatsapp}
											variant="outline"
										>
											<TestTube className="mr-2 h-4 w-4" />
											{isTesting.whatsapp ? "Testing..." : "Test Connection"}
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Telegram Settings */}
				<TabsContent value="telegram">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<Send className="h-5 w-5" />
										Telegram Bot API
									</CardTitle>
									<p className="text-gray-600 text-sm">
										Configure Telegram Bot for patient messaging
									</p>
								</div>
								{getStatusBadge(
									settings.telegram.enabled,
									testResults.telegram,
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="telegram-enabled"
									checked={settings.telegram.enabled}
									onChange={(e) =>
										updateSettings("telegram", "enabled", e.target.checked)
									}
									className="rounded"
								/>
								<Label htmlFor="telegram-enabled">
									Enable Telegram Integration
								</Label>
							</div>

							{settings.telegram.enabled && (
								<>
									<div className="space-y-2">
										<Label htmlFor="telegram-token">Bot Token</Label>
										<div className="relative">
											<Input
												id="telegram-token"
												type={showSecrets.telegramToken ? "text" : "password"}
												value={settings.telegram.botToken}
												onChange={(e) =>
													updateSettings("telegram", "botToken", e.target.value)
												}
												placeholder="Enter Telegram bot token"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3"
												onClick={() => toggleSecretVisibility("telegramToken")}
											>
												{showSecrets.telegramToken ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="telegram-secret">Webhook Secret</Label>
										<div className="relative">
											<Input
												id="telegram-secret"
												type={showSecrets.telegramSecret ? "text" : "password"}
												value={settings.telegram.webhookSecret}
												onChange={(e) =>
													updateSettings(
														"telegram",
														"webhookSecret",
														e.target.value,
													)
												}
												placeholder="Enter webhook secret (optional)"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3"
												onClick={() => toggleSecretVisibility("telegramSecret")}
											>
												{showSecrets.telegramSecret ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="flex gap-2 pt-4">
										<Button
											onClick={() => testConnection("telegram")}
											disabled={isTesting.telegram}
											variant="outline"
										>
											<TestTube className="mr-2 h-4 w-4" />
											{isTesting.telegram ? "Testing..." : "Test Connection"}
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Signal Settings */}
				<TabsContent value="signal">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<Shield className="h-5 w-5" />
										Signal Messaging
									</CardTitle>
									<p className="text-gray-600 text-sm">
										Configure Signal CLI for secure patient messaging
									</p>
								</div>
								{getStatusBadge(settings.signal.enabled, testResults.signal)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="signal-enabled"
									checked={settings.signal.enabled}
									onChange={(e) =>
										updateSettings("signal", "enabled", e.target.checked)
									}
									className="rounded"
								/>
								<Label htmlFor="signal-enabled">
									Enable Signal Integration
								</Label>
							</div>

							{settings.signal.enabled && (
								<>
									<div className="space-y-2">
										<Label htmlFor="signal-phone">Phone Number</Label>
										<Input
											id="signal-phone"
											value={settings.signal.phoneNumber}
											onChange={(e) =>
												updateSettings("signal", "phoneNumber", e.target.value)
											}
											placeholder="Enter Signal phone number (e.g., +525512345678)"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="signal-api">Signal CLI API URL</Label>
										<Input
											id="signal-api"
											value={settings.signal.apiUrl}
											onChange={(e) =>
												updateSettings("signal", "apiUrl", e.target.value)
											}
											placeholder="Enter Signal CLI REST API URL"
										/>
									</div>

									<div className="rounded-lg bg-blue-50 p-4">
										<div className="flex">
											<AlertCircle className="h-5 w-5 text-blue-400" />
											<div className="ml-3">
												<h3 className="font-medium text-blue-800 text-sm">
													Signal CLI Setup Required
												</h3>
												<div className="mt-2 text-blue-700 text-sm">
													<p>
														Signal requires Signal CLI to be installed and
														running. Please ensure:
													</p>
													<ul className="mt-1 list-inside list-disc">
														<li>Signal CLI is installed and configured</li>
														<li>The REST API server is running</li>
														<li>Your phone number is registered with Signal</li>
													</ul>
												</div>
											</div>
										</div>
									</div>

									<div className="flex gap-2 pt-4">
										<Button
											onClick={() => testConnection("signal")}
											disabled={isTesting.signal}
											variant="outline"
										>
											<TestTube className="mr-2 h-4 w-4" />
											{isTesting.signal ? "Testing..." : "Test Connection"}
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Save Button */}
			<div className="mt-8 flex justify-end">
				<Button onClick={saveSettings} disabled={isLoading}>
					<Save className="mr-2 h-4 w-4" />
					{isLoading ? "Saving..." : "Save Settings"}
				</Button>
			</div>
			<Toaster />
		</div>
	);
}
