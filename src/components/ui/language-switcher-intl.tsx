"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "es", name: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcherIntl() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [currentLocale, setCurrentLocale] = useState("en");

	const handleLanguageChange = (locale: string) => {
		startTransition(() => {
			// Set locale in localStorage for persistence
			localStorage.setItem("preferred-locale", locale);
			setCurrentLocale(locale);

			// Force page reload to apply new locale
			window.location.reload();
		});
	};

	const currentLanguage =
		languages.find((lang) => lang.code === currentLocale) || languages[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 px-0"
					disabled={isPending}
				>
					<Globe className="h-4 w-4" />
					<span className="sr-only">Switch language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
						className="flex items-center gap-2"
					>
						<span>{language.flag}</span>
						<span>{language.name}</span>
						{currentLocale === language.code && (
							<span className="ml-auto text-muted-foreground text-xs">✓</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
