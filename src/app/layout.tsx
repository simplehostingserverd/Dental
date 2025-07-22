import "@/styles/globals.css";
import "@/styles/dark-theme.css";

// Temporarily disable Stack Auth to debug the error
// import { StackProvider, StackTheme } from "@stackframe/stack";
// import { stackClientApp } from "@/lib/stack-client";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { TranslationProvider } from "@/components/providers/translation-provider";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	title: "Cognident - Practice Management",
	description: "Dental practice management made simple",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode,
	params: { locale?: string }
}>) {
	// Get the locale from the URL or use the default locale
	const locale = params.locale || 'en';

	// Get the messages for the current locale
	const messages = await getMessages({ locale });

	return (
		<html lang={locale} className={`${geist.variable} dark`} suppressHydrationWarning>
			<body>
				{/* Temporarily disable Stack Auth to debug the error */}
				{/* <StackProvider app={stackClientApp}>
					<StackTheme> */}
				<NextIntlClientProvider locale={locale} messages={messages}>
					<TranslationProvider>
						<TRPCReactProvider>{children}</TRPCReactProvider>
					</TranslationProvider>
				</NextIntlClientProvider>
				{/* </StackTheme>
				</StackProvider> */}
			</body>
		</html>
	);
}
