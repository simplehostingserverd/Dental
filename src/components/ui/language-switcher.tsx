"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n/translation-context";
import type { Locale } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";

const languages = [
	{ code: "en" as Locale, name: "English", flag: "🇺🇸" },
	{ code: "es" as Locale, name: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
	const { locale, setLocale, t } = useTranslation();

	const switchLanguage = (newLocale: Locale) => {
		setLocale(newLocale);
	};

	const getCurrentLanguage = () => {
		return languages.find(lang => lang.code === locale) || languages[0];
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-9 w-9 p-0"
					title={t("language.switch_language")}
				>
					<Globe className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => switchLanguage(language.code)}
						className="flex cursor-pointer items-center space-x-2"
					>
						<span className="text-lg">{language.flag}</span>
						<span>{language.name}</span>
						{locale === language.code && (
							<span className="ml-auto text-blue-600">✓</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
