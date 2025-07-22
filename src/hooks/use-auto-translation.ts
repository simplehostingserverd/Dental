"use client";

import { useState, useEffect, useCallback } from 'react';
import { AutoTranslator, type TranslationResult } from '@/lib/translation/auto-translator';

interface UseAutoTranslationOptions {
	practiceId: string;
	targetLanguage?: string;
	enabled?: boolean;
	fallbackToOriginal?: boolean;
}

interface TranslationCache {
	[key: string]: TranslationResult;
}

export function useAutoTranslation(options: UseAutoTranslationOptions) {
	const {
		practiceId,
		targetLanguage = 'es',
		enabled = true,
		fallbackToOriginal = true
	} = options;

	const [cache, setCache] = useState<TranslationCache>({});
	const [isTranslating, setIsTranslating] = useState(false);
	const [translator] = useState(() => AutoTranslator.getInstance(practiceId));

	/**
	 * Translate a single text
	 */
	const translate = useCallback(async (text: string): Promise<string> => {
		if (!enabled || !text.trim()) {
			return text;
		}

		// Check cache first
		const cacheKey = `${text}-${targetLanguage}`;
		if (cache[cacheKey]) {
			return cache[cacheKey].translatedText;
		}

		try {
			setIsTranslating(true);
			const result = await translator.translate(text, targetLanguage);
			
			// Update cache
			setCache(prev => ({
				...prev,
				[cacheKey]: result
			}));

			return result.translatedText;
		} catch (error) {
			console.error('Translation error:', error);
			return fallbackToOriginal ? text : '';
		} finally {
			setIsTranslating(false);
		}
	}, [enabled, targetLanguage, cache, translator, fallbackToOriginal]);

	/**
	 * Translate multiple texts
	 */
	const batchTranslate = useCallback(async (texts: string[]): Promise<string[]> => {
		if (!enabled || texts.length === 0) {
			return texts;
		}

		try {
			setIsTranslating(true);
			const results = await translator.batchTranslate(texts, targetLanguage);
			
			// Update cache
			const newCache: TranslationCache = {};
			texts.forEach((text, index) => {
				const cacheKey = `${text}-${targetLanguage}`;
				newCache[cacheKey] = results[index];
			});
			
			setCache(prev => ({ ...prev, ...newCache }));

			return results.map(result => result.translatedText);
		} catch (error) {
			console.error('Batch translation error:', error);
			return fallbackToOriginal ? texts : texts.map(() => '');
		} finally {
			setIsTranslating(false);
		}
	}, [enabled, targetLanguage, translator, fallbackToOriginal]);

	/**
	 * Get cached translation or return original text
	 */
	const getCachedTranslation = useCallback((text: string): string => {
		if (!enabled || !text.trim()) {
			return text;
		}

		const cacheKey = `${text}-${targetLanguage}`;
		return cache[cacheKey]?.translatedText || text;
	}, [enabled, targetLanguage, cache]);

	/**
	 * Clear translation cache
	 */
	const clearCache = useCallback(() => {
		setCache({});
	}, []);

	/**
	 * Preload translations for common texts
	 */
	const preloadTranslations = useCallback(async (texts: string[]) => {
		if (!enabled) return;

		const uncachedTexts = texts.filter(text => {
			const cacheKey = `${text}-${targetLanguage}`;
			return !cache[cacheKey];
		});

		if (uncachedTexts.length > 0) {
			await batchTranslate(uncachedTexts);
		}
	}, [enabled, targetLanguage, cache, batchTranslate]);

	return {
		translate,
		batchTranslate,
		getCachedTranslation,
		clearCache,
		preloadTranslations,
		isTranslating,
		cacheSize: Object.keys(cache).length
	};
}

/**
 * Hook for translating component text automatically
 */
export function useTranslatedText(text: string, options: UseAutoTranslationOptions) {
	const [translatedText, setTranslatedText] = useState(text);
	const { translate, getCachedTranslation } = useAutoTranslation(options);

	useEffect(() => {
		// Try to get cached translation first
		const cached = getCachedTranslation(text);
		if (cached !== text) {
			setTranslatedText(cached);
			return;
		}

		// If not cached, translate asynchronously
		if (options.enabled !== false) {
			translate(text).then(setTranslatedText);
		}
	}, [text, translate, getCachedTranslation, options.enabled]);

	return translatedText;
}

/**
 * Hook for managing language preference
 */
export function useLanguagePreference() {
	const [language, setLanguage] = useState<string>('en');
	const [autoTranslate, setAutoTranslate] = useState<boolean>(false);

	useEffect(() => {
		// Load from localStorage
		const savedLanguage = localStorage.getItem('preferred-language');
		const savedAutoTranslate = localStorage.getItem('auto-translate') === 'true';

		if (savedLanguage) {
			setLanguage(savedLanguage);
		}
		setAutoTranslate(savedAutoTranslate);
	}, []);

	const updateLanguage = useCallback((newLanguage: string) => {
		setLanguage(newLanguage);
		localStorage.setItem('preferred-language', newLanguage);
	}, []);

	const toggleAutoTranslate = useCallback(() => {
		const newValue = !autoTranslate;
		setAutoTranslate(newValue);
		localStorage.setItem('auto-translate', newValue.toString());
	}, [autoTranslate]);

	return {
		language,
		autoTranslate,
		updateLanguage,
		toggleAutoTranslate,
		isSpanish: language === 'es'
	};
}
