import "@/styles/globals.css";

// Temporarily disable Stack Auth to debug the error
// import { StackProvider, StackTheme } from "@stackframe/stack";
// import { stackClientApp } from "@/lib/stack-client";
import type { Metadata } from "next";
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
				{/* Temporarily disable Stack Auth to debug the error */}
				{/* <StackProvider app={stackClientApp}>
					<StackTheme> */}
						<TranslationProvider>
							<TRPCReactProvider>{children}</TRPCReactProvider>
						</TranslationProvider>
					{/* </StackTheme>
				</StackProvider> */}
			</body>
		</html>
	);
}
