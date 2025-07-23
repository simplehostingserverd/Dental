/**
 * Security headers middleware for the application
 * Implements security best practices for HTTP headers
 */

import { isProduction } from "@/env";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Add security headers to the response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
	// Content Security Policy
	const cspDirectives = [
		// Default fallback
		"default-src 'self'",
		// Scripts - 'unsafe-eval' is required for Next.js in production
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
		// Styles
		"style-src 'self' 'unsafe-inline'",
		// Images - allow external images for better compatibility
		"img-src 'self' data: blob: https:",
		// Fonts - allow external fonts
		"font-src 'self' data:",
		// Connect (for API calls, websockets)
		"connect-src 'self'",
		// Forms
		"form-action 'self'",
		// Frame
		"frame-ancestors 'self'",
		// Media
		"media-src 'self'",
		// Object
		"object-src 'none'",
	];

	// Apply CSP in production, report-only in development
	if (isProduction) {
		response.headers.set("Content-Security-Policy", cspDirectives.join("; "));
	} else {
		// In development, use Content-Security-Policy-Report-Only for debugging
		// This allows the app to work while reporting violations
		response.headers.set(
			"Content-Security-Policy-Report-Only",
			cspDirectives.join("; "),
		);
	}

	// XSS Protection
	response.headers.set("X-XSS-Protection", "1; mode=block");

	// Content Type Options
	response.headers.set("X-Content-Type-Options", "nosniff");

	// Frame Options
	response.headers.set("X-Frame-Options", "SAMEORIGIN");

	// Referrer Policy
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// Permissions Policy
	response.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=(self), interest-cohort=()",
	);

	// HSTS (only in production)
	if (isProduction) {
		response.headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains; preload",
		);
	}

	return response;
}

/**
 * Apply security middlewares to a request
 */
export function applySecurityMiddleware(
	request: NextRequest,
	response: NextResponse,
): NextResponse {
	// Add security headers
	return addSecurityHeaders(response);
}
