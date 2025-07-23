/**
 * Google Cloud Translation API Integration
 * Provides automatic Spanish translations for the entire application
 */

interface GoogleTranslateResponse {
	data: {
		translations: Array<{
			translatedText: string;
			detectedSourceLanguage?: string;
		}>;
	};
}

interface TranslationRequest {
	text: string | string[];
	targetLanguage: string;
	sourceLanguage?: string;
}

interface TranslationResult {
	translatedText: string;
	detectedSourceLanguage?: string;
}

export class GoogleTranslateService {
	private apiKey: string;
	private baseUrl = "https://translation.googleapis.com/language/translate/v2";
	private cache = new Map<string, string>();

	constructor() {
		this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || "";
		if (!this.apiKey) {
			console.warn(
				"Google Translate API key not found. Translation features will be disabled.",
			);
		}
	}

	/**
	 * Check if Google Translate is available
	 */
	isAvailable(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Translate text to Spanish
	 */
	async translateToSpanish(text: string): Promise<string> {
		return this.translate(text, "es");
	}

	/**
	 * Translate text to specified language
	 */
	async translate(
		text: string,
		targetLanguage: string,
		sourceLanguage?: string,
	): Promise<string> {
		if (!this.isAvailable()) {
			console.warn("Google Translate not available, returning original text");
			return text;
		}

		// Check cache first
		const cacheKey = `${text}-${targetLanguage}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!;
		}

		try {
			const response = await this.makeTranslationRequest({
				text,
				targetLanguage,
				sourceLanguage,
			});

			const translatedText =
				response.data.translations[0]?.translatedText || text;

			// Cache the result
			this.cache.set(cacheKey, translatedText);

			return translatedText;
		} catch (error) {
			console.error("Translation error:", error);
			return text; // Return original text on error
		}
	}

	/**
	 * Translate multiple texts at once
	 */
	async translateBatch(
		texts: string[],
		targetLanguage: string,
		sourceLanguage?: string,
	): Promise<string[]> {
		if (!this.isAvailable()) {
			return texts;
		}

		try {
			const response = await this.makeTranslationRequest({
				text: texts,
				targetLanguage,
				sourceLanguage,
			});

			return response.data.translations.map((t) => t.translatedText);
		} catch (error) {
			console.error("Batch translation error:", error);
			return texts;
		}
	}

	/**
	 * Detect language of text
	 */
	async detectLanguage(text: string): Promise<string> {
		if (!this.isAvailable()) {
			return "en"; // Default to English
		}

		try {
			const response = await fetch(
				`${this.baseUrl}/detect?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						q: text,
					}),
				},
			);

			const data = await response.json();
			return data.data.detections[0]?.[0]?.language || "en";
		} catch (error) {
			console.error("Language detection error:", error);
			return "en";
		}
	}

	/**
	 * Get supported languages
	 */
	async getSupportedLanguages(): Promise<
		Array<{ code: string; name: string }>
	> {
		if (!this.isAvailable()) {
			return [
				{ code: "en", name: "English" },
				{ code: "es", name: "Spanish" },
			];
		}

		try {
			const response = await fetch(
				`${this.baseUrl}/languages?key=${this.apiKey}&target=en`,
			);
			const data = await response.json();

			return data.data.languages.map((lang: any) => ({
				code: lang.language,
				name: lang.name,
			}));
		} catch (error) {
			console.error("Error fetching supported languages:", error);
			return [
				{ code: "en", name: "English" },
				{ code: "es", name: "Spanish" },
			];
		}
	}

	/**
	 * Clear translation cache
	 */
	clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Make translation request to Google API
	 */
	private async makeTranslationRequest(
		request: TranslationRequest,
	): Promise<GoogleTranslateResponse> {
		const body: any = {
			q: request.text,
			target: request.targetLanguage,
			format: "text",
		};

		if (request.sourceLanguage) {
			body.source = request.sourceLanguage;
		}

		const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error(
				`Translation API error: ${response.status} ${response.statusText}`,
			);
		}

		return response.json();
	}
}

// Singleton instance
export const googleTranslate = new GoogleTranslateService();

// React hook for easy usage
export function useGoogleTranslate() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const translate = async (
		text: string,
		targetLanguage = "es",
	): Promise<string> => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await googleTranslate.translate(text, targetLanguage);
			return result;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Translation failed";
			setError(errorMessage);
			return text; // Return original text on error
		} finally {
			setIsLoading(false);
		}
	};

	const translateBatch = async (
		texts: string[],
		targetLanguage = "es",
	): Promise<string[]> => {
		setIsLoading(true);
		setError(null);

		try {
			const results = await googleTranslate.translateBatch(
				texts,
				targetLanguage,
			);
			return results;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Batch translation failed";
			setError(errorMessage);
			return texts;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		translate,
		translateBatch,
		isLoading,
		error,
		isAvailable: googleTranslate.isAvailable(),
	};
}

// Import useState for the hook
import { useState } from "react";
