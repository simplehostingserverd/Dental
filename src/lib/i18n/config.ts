import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames = {
	en: "English",
	es: "Español",
} as const;

export const localeFlags = {
	en: "🇺🇸",
	es: "🇪🇸",
} as const;

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale as any)) notFound();

	return {
		locale: locale as Locale,
		messages: (await import(`../../../locales/${locale}.json`)).default,
	};
});

export function isValidLocale(locale: string): locale is Locale {
	return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
	const segments = pathname.split("/");
	const potentialLocale = segments[1];

	if (potentialLocale && isValidLocale(potentialLocale)) {
		return potentialLocale;
	}

	return null;
}

export function removeLocaleFromPathname(pathname: string): string {
	const locale = getLocaleFromPathname(pathname);
	if (locale) {
		return pathname.replace(`/${locale}`, "") || "/";
	}
	return pathname;
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
	const cleanPathname = removeLocaleFromPathname(pathname);
	return `/${locale}${cleanPathname}`;
}
