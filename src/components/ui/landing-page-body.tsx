"use client";

import { useEffect } from "react";

export function LandingPageBody({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		// Add landing-page class to body
		document.body.classList.add("landing-page");

		// Cleanup function to remove the class when component unmounts
		return () => {
			document.body.classList.remove("landing-page");
		};
	}, []);

	return <>{children}</>;
}
