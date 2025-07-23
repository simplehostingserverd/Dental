"use client";

import { useEffect, useRef, useState } from "react";

// Optimized cursor component - disabled for better performance
export function PremiumCursor() {
	// Disabled for performance - return null
	return null;
}

// Parallax container component
export function ParallaxContainer({
	children,
	intensity = 0.5,
}: { children: React.ReactNode; intensity?: number }) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left - rect.width / 2) * intensity;
			const y = (e.clientY - rect.top - rect.height / 2) * intensity;

			container.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${y * 0.1}deg) rotateY(${x * 0.1}deg)`;
		};

		const handleMouseLeave = () => {
			container.style.transform = "translate3d(0, 0, 0) rotateX(0) rotateY(0)";
		};

		container.addEventListener("mousemove", handleMouseMove);
		container.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			container.removeEventListener("mousemove", handleMouseMove);
			container.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [intensity]);

	return (
		<div ref={containerRef} className="parallax-element">
			{children}
		</div>
	);
}

// Magnetic button component
export function MagneticButton({ children, className = "", ...props }: any) {
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const button = buttonRef.current;
		if (!button) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
		};

		const handleMouseLeave = () => {
			button.style.transform = "translate(0, 0)";
		};

		button.addEventListener("mousemove", handleMouseMove);
		button.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			button.removeEventListener("mousemove", handleMouseMove);
			button.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<button
			ref={buttonRef}
			className={`magnetic transition-transform duration-300 ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}

// Floating elements component
export function FloatingElements() {
	return (
		<div className="pointer-events-none fixed inset-0 z-0">
			{[...Array(20)].map((_, i) => (
				<div
					key={i}
					className="absolute h-2 w-2 animate-pulse rounded-full bg-white/10"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 5}s`,
						animationDuration: `${3 + Math.random() * 4}s`,
					}}
				/>
			))}
		</div>
	);
}

// Text reveal animation component
export function TextReveal({
	children,
	delay = 0,
}: { children: React.ReactNode; delay?: number }) {
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry?.isIntersecting) {
					setTimeout(() => setIsVisible(true), delay);
				}
			},
			{ threshold: 0.1 },
		);

		if (elementRef.current) {
			observer.observe(elementRef.current);
		}

		return () => observer.disconnect();
	}, [delay]);

	return (
		<div
			ref={elementRef}
			className={`${isVisible ? "text-reveal" : "opacity-0"}`}
		>
			{children}
		</div>
	);
}

// Premium loading animation
export function PremiumLoader() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
			<div className="relative">
				<div className="h-20 w-20 animate-spin rounded-full border-4 border-white/20 border-t-purple-500" />
				<div
					className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-r-blue-500"
					style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
				/>
				<div
					className="absolute inset-2 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-b-pink-500"
					style={{ animationDuration: "2s" }}
				/>
			</div>
		</div>
	);
}

// Scroll progress indicator
export function ScrollProgress() {
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const totalHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = (window.scrollY / totalHeight) * 100;
			setScrollProgress(progress);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="fixed top-0 left-0 z-50 h-1 w-full bg-black/20">
			<div
				className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300"
				style={{ width: `${scrollProgress}%` }}
			/>
		</div>
	);
}

// Premium card with 3D effect
export function Premium3DCard({
	children,
	className = "",
}: { children: React.ReactNode; className?: string }) {
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const card = cardRef.current;
		if (!card) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
			const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

			card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
		};

		const handleMouseLeave = () => {
			card.style.transform =
				"perspective(1000px) rotateY(0) rotateX(0) translateZ(0)";
		};

		card.addEventListener("mousemove", handleMouseMove);
		card.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			card.removeEventListener("mousemove", handleMouseMove);
			card.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<div ref={cardRef} className={`card-3d ${className}`}>
			{children}
		</div>
	);
}

// Ripple effect component
export function RippleEffect({
	children,
	className = "",
}: { children: React.ReactNode; className?: string }) {
	const rippleRef = useRef<HTMLDivElement>(null);

	const createRipple = (e: React.MouseEvent) => {
		const button = rippleRef.current;
		if (!button) return;

		const rect = button.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;

		const ripple = document.createElement("span");
		ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

		button.appendChild(ripple);
		setTimeout(() => ripple.remove(), 600);
	};

	return (
		<div
			ref={rippleRef}
			className={`relative overflow-hidden ${className}`}
			onMouseDown={createRipple}
		>
			{children}
			<style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
		</div>
	);
}
