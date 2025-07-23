"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import {
	INTEGRATION_PROVIDERS,
	type IntegrationConfig,
	IntegrationManager,
} from "@/lib/integrations/integration-manager";
import {
	AlertCircle,
	Check,
	Eye,
	EyeOff,
	Globe,
	Loader2,
	Mail,
	MessageSquare,
	Phone,
	Settings,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SERVICE_ICONS = {
	voip: Phone,
	sms: MessageSquare,
	email: Mail,
	translation: Globe,
};

const SERVICE_LABELS = {
	voip: "VoIP Calling",
	sms: "SMS Messaging",
	email: "Email Services",
	translation: "Translation Services",
};

interface IntegrationFormProps {
	providerId: string;
	practiceId: string;
	onSave: () => void;
}

function IntegrationForm({
	providerId,
	practiceId,
	onSave,
}: IntegrationFormProps) {
	const [config, setConfig] = useState<IntegrationConfig>({});
	const [isActive, setIsActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isTesting, setIsTesting] = useState(false);
	const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
		{},
	);

	const provider = IntegrationManager.getProvider(providerId);

	useEffect(() => {
		loadExistingConfig();
	}, [providerId, practiceId]);

	const loadExistingConfig = async () => {
		if (!provider) return;

		try {
			const existing = await IntegrationManager.getIntegration(
				practiceId,
				providerId,
				provider.service,
			);

			if (existing) {
				setConfig(existing.config);
				setIsActive(existing.isActive);
			}
		} catch (error) {
			console.error("Failed to load integration config:", error);
		}
	};

	const handleConfigChange = (
		key: string,
		value: string | boolean | number,
	) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
	};

	const togglePasswordVisibility = (fieldKey: string) => {
		setShowPasswords((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
	};

	const testConnection = async () => {
		if (!provider) return;

		setIsTesting(true);
		try {
			const success = await IntegrationManager.testIntegration(
				providerId,
				config,
			);
			if (success) {
				toast.success("Connection test successful!");
			} else {
				toast.error("Connection test failed. Please check your configuration.");
			}
		} catch (error) {
			toast.error("Connection test failed.");
		} finally {
			setIsTesting(false);
		}
	};

	const saveIntegration = async () => {
		if (!provider) return;

		// Validate required fields
		const missingFields = provider.configFields
			.filter((field) => field.required && !config[field.key])
			.map((field) => field.label);

		if (missingFields.length > 0) {
			toast.error(
				`Please fill in required fields: ${missingFields.join(", ")}`,
			);
			return;
		}

		setIsLoading(true);
		try {
			await IntegrationManager.saveIntegration(
				practiceId,
				providerId,
				provider.service,
				config,
				isActive,
			);

			toast.success("Integration settings saved successfully!");
			onSave();
		} catch (error) {
			toast.error("Failed to save integration settings.");
		} finally {
			setIsLoading(false);
		}
	};

	if (!provider) {
		return <div>Provider not found</div>;
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							{SERVICE_ICONS[provider.service] &&
								(() => {
									const IconComponent = SERVICE_ICONS[provider.service];
									return <IconComponent className="h-5 w-5" />;
								})()}
							{provider.name}
						</CardTitle>
						<CardDescription>{provider.description}</CardDescription>
					</div>
					<Switch checked={isActive} onCheckedChange={setIsActive} />
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{provider.configFields.map((field) => (
					<div key={field.key} className="space-y-2">
						<Label htmlFor={field.key}>
							{field.label}
							{field.required && <span className="ml-1 text-red-500">*</span>}
						</Label>

						{field.type === "select" ? (
							<Select
								value={(config[field.key] as string) || ""}
								onValueChange={(value) => handleConfigChange(field.key, value)}
							>
								<SelectTrigger>
									<SelectValue placeholder={field.placeholder} />
								</SelectTrigger>
								<SelectContent>
									{field.options?.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : field.type === "password" ? (
							<div className="relative">
								<Input
									id={field.key}
									type={showPasswords[field.key] ? "text" : "password"}
									value={(config[field.key] as string) || ""}
									onChange={(e) =>
										handleConfigChange(field.key, e.target.value)
									}
									placeholder={field.placeholder}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => togglePasswordVisibility(field.key)}
								>
									{showPasswords[field.key] ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						) : field.type === "boolean" ? (
							<Switch
								checked={(config[field.key] as boolean) || false}
								onCheckedChange={(checked) =>
									handleConfigChange(field.key, checked)
								}
							/>
						) : (
							<Input
								id={field.key}
								type={field.type}
								value={(config[field.key] as string) || ""}
								onChange={(e) =>
									handleConfigChange(
										field.key,
										field.type === "number"
											? Number(e.target.value)
											: e.target.value,
									)
								}
								placeholder={field.placeholder}
							/>
						)}
					</div>
				))}

				<div className="flex gap-2 pt-4">
					<Button
						onClick={saveIntegration}
						disabled={isLoading}
						className="flex-1"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Configuration
					</Button>

					{provider.testConnection && (
						<Button
							variant="outline"
							onClick={testConnection}
							disabled={isTesting}
						>
							{isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Test Connection
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

interface IntegrationSettingsProps {
	practiceId: string;
}

export function IntegrationSettings({ practiceId }: IntegrationSettingsProps) {
	const [activeTab, setActiveTab] = useState<string>("voip");
	const [refreshKey, setRefreshKey] = useState(0);

	const handleSave = () => {
		setRefreshKey((prev) => prev + 1);
	};

	const serviceProviders = Object.entries(SERVICE_LABELS).map(
		([service, label]) => ({
			service,
			label,
			providers: IntegrationManager.getProviders(service),
			icon: SERVICE_ICONS[service as keyof typeof SERVICE_ICONS],
		}),
	);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-bold text-2xl">3rd Party Integrations</h2>
				<p className="text-gray-600">
					Configure external services for VoIP calling, SMS messaging, email,
					and translation.
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-4">
					{serviceProviders.map(({ service, label, icon: Icon }) => (
						<TabsTrigger
							key={service}
							value={service}
							className="flex items-center gap-2"
						>
							<Icon className="h-4 w-4" />
							{label}
						</TabsTrigger>
					))}
				</TabsList>

				{serviceProviders.map(({ service, providers }) => (
					<TabsContent key={service} value={service} className="space-y-4">
						{providers.length === 0 ? (
							<Card>
								<CardContent className="flex items-center justify-center py-8">
									<div className="text-center">
										<AlertCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
										<p className="text-gray-500">
											No providers available for this service
										</p>
									</div>
								</CardContent>
							</Card>
						) : (
							providers.map((provider) => (
								<IntegrationForm
									key={`${provider.id}-${refreshKey}`}
									providerId={provider.id}
									practiceId={practiceId}
									onSave={handleSave}
								/>
							))
						)}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
