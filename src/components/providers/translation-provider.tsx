"use client";

import { googleTranslate } from "@/lib/translation/google-translate";
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

interface TranslationContextType {
	currentLanguage: string;
	setLanguage: (language: string) => void;
	translate: (text: string) => Promise<string>;
	isTranslating: boolean;
	supportedLanguages: Array<{ code: string; name: string }>;
	isEnabled: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
	undefined,
);

interface TranslationProviderProps {
	children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
	const [currentLanguage, setCurrentLanguage] = useState("en");
	const [isTranslating, setIsTranslating] = useState(false);
	const [supportedLanguages, setSupportedLanguages] = useState([
		{ code: "en", name: "English" },
		{ code: "es", name: "Español" },
	]);

	// Check if translation is enabled
	const isEnabled = googleTranslate.isAvailable();

	useEffect(() => {
		// Load supported languages
		if (isEnabled) {
			googleTranslate.getSupportedLanguages().then(setSupportedLanguages);
		}

		// Load saved language preference
		const savedLanguage = localStorage.getItem("preferred-language");
		if (savedLanguage) {
			setCurrentLanguage(savedLanguage);
		}
	}, [isEnabled]);

	const setLanguage = (language: string) => {
		setCurrentLanguage(language);
		localStorage.setItem("preferred-language", language);
	};

	const translate = async (text: string): Promise<string> => {
		if (!isEnabled || currentLanguage === "en") {
			return text;
		}

		setIsTranslating(true);
		try {
			const translated = await googleTranslate.translate(text, currentLanguage);
			return translated;
		} catch (error) {
			console.error("Translation error:", error);
			return text;
		} finally {
			setIsTranslating(false);
		}
	};

	const value: TranslationContextType = {
		currentLanguage,
		setLanguage,
		translate,
		isTranslating,
		supportedLanguages,
		isEnabled,
	};

	return (
		<TranslationContext.Provider value={value}>
			{children}
		</TranslationContext.Provider>
	);
}

export function useTranslation() {
	const context = useContext(TranslationContext);
	if (context === undefined) {
		throw new Error("useTranslation must be used within a TranslationProvider");
	}
	return context;
}

// Translation component for easy text translation
interface TranslateProps {
	children: string;
	className?: string;
}

export function Translate({ children, className }: TranslateProps) {
	const { translate, currentLanguage } = useTranslation();
	const [translatedText, setTranslatedText] = useState(children);

	useEffect(() => {
		if (currentLanguage !== "en") {
			translate(children).then(setTranslatedText);
		} else {
			setTranslatedText(children);
		}
	}, [children, currentLanguage, translate]);

	return <span className={className}>{translatedText}</span>;
}

// Language switcher component
export function LanguageSwitcher() {
	const { currentLanguage, setLanguage, supportedLanguages, isEnabled } =
		useTranslation();

	if (!isEnabled) {
		return null;
	}

	return (
		<div className="relative">
			<select
				value={currentLanguage}
				onChange={(e) => setLanguage(e.target.value)}
				className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{supportedLanguages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.name}
					</option>
				))}
			</select>
		</div>
	);
}
