import "@/styles/globals.css";

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist } from "next/font/google";

import { TranslationProvider } from "@/lib/i18n/translation-context";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	title: "DentalCloud - Practice Management",
	description: "Dental practice management made simple",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
			<body>
				<TranslationProvider>
					<SessionProvider>
						<TRPCReactProvider>{children}</TRPCReactProvider>
					</SessionProvider>
				</TranslationProvider>
			</body>
		</html>
	);
}
