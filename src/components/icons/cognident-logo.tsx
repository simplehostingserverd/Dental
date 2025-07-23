import Image from "next/image";
import React from "react";

interface CognidentLogoProps {
	className?: string;
	width?: number;
	height?: number;
}

export function CognidentLogo({
	className = "",
	width = 32,
	height = 32,
}: CognidentLogoProps) {
	return (
		<Image
			src="/Logos/CognidentOrgLogo.png"
			alt="Cognident Logo"
			width={width}
			height={height}
			className={className}
			priority
		/>
	);
}

// Logo with text for headers and navigation
export function CognidentTextLogo({
	className = "",
	logoSize = 32,
}: { className?: string; logoSize?: number }) {
	return (
		<div className={`flex items-center space-x-2 ${className}`}>
			<CognidentLogo width={logoSize} height={logoSize} />
			<span className="font-bold text-xl">Cognident</span>
		</div>
	);
}

// Large logo for login/registration pages
export function CognidentLargeLogo({ className = "" }: { className?: string }) {
	return (
		<div className={`flex flex-col items-center space-y-2 ${className}`}>
			<CognidentLogo width={64} height={64} />
			<span className="font-bold text-2xl">Cognident</span>
		</div>
	);
}
