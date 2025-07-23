"use client";

import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "./translations";
import { defaultLocale, getTranslation } from "./translations";

interface TranslationContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
	undefined,
);

export function TranslationProvider({
	children,
}: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>(defaultLocale);

	useEffect(() => {
		// Load locale from localStorage or cookie
		const savedLocale = localStorage.getItem("locale") as Locale;
		if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
			setLocaleState(savedLocale);
		}
	}, []);

	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		localStorage.setItem("locale", newLocale);
		// Also set cookie for server-side access if needed
		document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
	};

	const t = (key: string) => getTranslation(locale, key);

	return (
		<TranslationContext.Provider value={{ locale, setLocale, t }}>
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

// Convenience hooks for specific sections
export function useAppTranslations() {
	const { t } = useTranslation();

	return {
		common: (key: string) => t(`common.${key}`),
		navigation: (key: string) => t(`navigation.${key}`),
		dashboard: (key: string) => t(`dashboard.${key}`),
		patients: (key: string) => t(`patients.${key}`),
		appointments: (key: string) => t(`appointments.${key}`),
		charting: (key: string) => t(`charting.${key}`),
		billing: (key: string) => t(`billing.${key}`),
		imaging: (key: string) => t(`imaging.${key}`),
		treatmentPlans: (key: string) => t(`treatment_plans.${key}`),
		language: (key: string) => t(`language.${key}`),
		t,
	};
}
