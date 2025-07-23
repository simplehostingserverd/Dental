import { decrypt, encrypt } from "@/lib/crypto/encryption";
import { db } from "@/server/db";

export interface IntegrationConfig {
	[key: string]: string | number | boolean;
}

export interface IntegrationProvider {
	id: string;
	name: string;
	service: "voip" | "sms" | "email" | "translation";
	description: string;
	configFields: {
		key: string;
		label: string;
		type: "text" | "password" | "number" | "boolean" | "select";
		required: boolean;
		placeholder?: string;
		options?: { value: string; label: string }[];
	}[];
	testConnection?: (config: IntegrationConfig) => Promise<boolean>;
}

// Available integration providers
export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
	// VoIP Providers
	{
		id: "twilio",
		name: "Twilio Voice",
		service: "voip",
		description: "Professional VoIP calling with recording and analytics",
		configFields: [
			{
				key: "accountSid",
				label: "Account SID",
				type: "text",
				required: true,
				placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			},
			{
				key: "authToken",
				label: "Auth Token",
				type: "password",
				required: true,
				placeholder: "Your Twilio Auth Token",
			},
			{
				key: "phoneNumber",
				label: "Phone Number",
				type: "text",
				required: true,
				placeholder: "+1234567890",
			},
		],
	},
	{
		id: "ringcentral",
		name: "RingCentral",
		service: "voip",
		description: "Enterprise-grade business communications",
		configFields: [
			{
				key: "clientId",
				label: "Client ID",
				type: "text",
				required: true,
			},
			{
				key: "clientSecret",
				label: "Client Secret",
				type: "password",
				required: true,
			},
			{
				key: "server",
				label: "Server",
				type: "select",
				required: true,
				options: [
					{ value: "https://platform.ringcentral.com", label: "Production" },
					{
						value: "https://platform.devtest.ringcentral.com",
						label: "Sandbox",
					},
				],
			},
		],
	},
	{
		id: "zoom_phone",
		name: "Zoom Phone",
		service: "voip",
		description: "Cloud-based phone system integrated with Zoom",
		configFields: [
			{
				key: "apiKey",
				label: "API Key",
				type: "text",
				required: true,
			},
			{
				key: "apiSecret",
				label: "API Secret",
				type: "password",
				required: true,
			},
		],
	},

	// SMS Providers
	{
		id: "twilio_sms",
		name: "Twilio SMS",
		service: "sms",
		description: "Reliable SMS messaging with delivery tracking",
		configFields: [
			{
				key: "accountSid",
				label: "Account SID",
				type: "text",
				required: true,
			},
			{
				key: "authToken",
				label: "Auth Token",
				type: "password",
				required: true,
			},
			{
				key: "phoneNumber",
				label: "SMS Phone Number",
				type: "text",
				required: true,
			},
		],
	},
	{
		id: "aws_sns",
		name: "AWS SNS",
		service: "sms",
		description: "Amazon Simple Notification Service for SMS",
		configFields: [
			{
				key: "accessKeyId",
				label: "Access Key ID",
				type: "text",
				required: true,
			},
			{
				key: "secretAccessKey",
				label: "Secret Access Key",
				type: "password",
				required: true,
			},
			{
				key: "region",
				label: "AWS Region",
				type: "select",
				required: true,
				options: [
					{ value: "us-east-1", label: "US East (N. Virginia)" },
					{ value: "us-west-2", label: "US West (Oregon)" },
					{ value: "eu-west-1", label: "Europe (Ireland)" },
				],
			},
		],
	},

	// Email Providers
	{
		id: "sendgrid",
		name: "SendGrid",
		service: "email",
		description: "Reliable email delivery with analytics",
		configFields: [
			{
				key: "apiKey",
				label: "API Key",
				type: "password",
				required: true,
			},
			{
				key: "fromEmail",
				label: "From Email",
				type: "text",
				required: true,
				placeholder: "noreply@yourpractice.com",
			},
			{
				key: "fromName",
				label: "From Name",
				type: "text",
				required: true,
				placeholder: "Your Practice Name",
			},
		],
	},

	// Translation Providers
	{
		id: "google_translate",
		name: "Google Translate",
		service: "translation",
		description: "Automatic translation to Spanish and other languages",
		configFields: [
			{
				key: "apiKey",
				label: "API Key",
				type: "password",
				required: true,
			},
			{
				key: "projectId",
				label: "Project ID",
				type: "text",
				required: true,
			},
		],
	},
	{
		id: "azure_translator",
		name: "Azure Translator",
		service: "translation",
		description: "Microsoft Azure Cognitive Services Translator",
		configFields: [
			{
				key: "subscriptionKey",
				label: "Subscription Key",
				type: "password",
				required: true,
			},
			{
				key: "region",
				label: "Region",
				type: "text",
				required: true,
				placeholder: "eastus",
			},
		],
	},
];

export class IntegrationManager {
	/**
	 * Get all available providers for a service
	 */
	static getProviders(service?: string): IntegrationProvider[] {
		if (service) {
			return INTEGRATION_PROVIDERS.filter((p) => p.service === service);
		}
		return INTEGRATION_PROVIDERS;
	}

	/**
	 * Get a specific provider by ID
	 */
	static getProvider(providerId: string): IntegrationProvider | undefined {
		return INTEGRATION_PROVIDERS.find((p) => p.id === providerId);
	}

	/**
	 * Save integration settings for a practice
	 */
	static async saveIntegration(
		practiceId: string,
		providerId: string,
		service: string,
		config: IntegrationConfig,
		isActive = true,
	) {
		const provider = IntegrationManager.getProvider(providerId);
		if (!provider) {
			throw new Error(`Provider ${providerId} not found`);
		}

		// Encrypt sensitive configuration data
		const encryptedConfig = encrypt(JSON.stringify(config));

		return await db.integrationSettings.upsert({
			where: {
				practiceId_provider_service: {
					practiceId,
					provider: providerId,
					service,
				},
			},
			update: {
				config: encryptedConfig,
				isActive,
				updatedAt: new Date(),
			},
			create: {
				practiceId,
				provider: providerId,
				service,
				config: encryptedConfig,
				isActive,
			},
		});
	}

	/**
	 * Get integration settings for a practice
	 */
	static async getIntegration(
		practiceId: string,
		providerId: string,
		service: string,
	): Promise<{ config: IntegrationConfig; isActive: boolean } | null> {
		const integration = await db.integrationSettings.findUnique({
			where: {
				practiceId_provider_service: {
					practiceId,
					provider: providerId,
					service,
				},
			},
		});

		if (!integration) {
			return null;
		}

		// Decrypt configuration data
		const config = JSON.parse(decrypt(integration.config as string));

		return {
			config,
			isActive: integration.isActive,
		};
	}

	/**
	 * Get all integrations for a practice
	 */
	static async getPracticeIntegrations(practiceId: string) {
		const integrations = await db.integrationSettings.findMany({
			where: { practiceId },
		});

		return integrations.map((integration) => ({
			...integration,
			config: JSON.parse(decrypt(integration.config as string)),
		}));
	}

	/**
	 * Test an integration connection
	 */
	static async testIntegration(
		providerId: string,
		config: IntegrationConfig,
	): Promise<boolean> {
		const provider = IntegrationManager.getProvider(providerId);
		if (!provider || !provider.testConnection) {
			return false;
		}

		try {
			return await provider.testConnection(config);
		} catch (error) {
			console.error(`Integration test failed for ${providerId}:`, error);
			return false;
		}
	}

	/**
	 * Delete an integration
	 */
	static async deleteIntegration(
		practiceId: string,
		providerId: string,
		service: string,
	) {
		return await db.integrationSettings.delete({
			where: {
				practiceId_provider_service: {
					practiceId,
					provider: providerId,
					service,
				},
			},
		});
	}
}
