import { stackServerApp } from "@/stack";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { applySecurityMiddleware } from "@/lib/security/security-headers";
import { logger, LogLevel } from "@/lib/logger";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip middleware for public routes and Stack Auth routes
	if (
		pathname.startsWith("/api/v1/auth") ||
		pathname.startsWith("/handler") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon") ||
		pathname.startsWith("/public") ||
		pathname.startsWith("/api/trpc") ||
		pathname.startsWith("/api/upload") ||
		pathname.startsWith("/api/test") ||
		pathname.startsWith("/api/check-env") ||
		pathname.startsWith("/api/create-sample-users") ||
		pathname.startsWith("/test-login") ||
		pathname === "/"
	) {
		// Apply security headers even for public routes
		const response = NextResponse.next();
		return applySecurityMiddleware(request, response);
	}

	// Check for patient routes
	if (pathname.startsWith("/patient/")) {
		// Skip auth for public patient pages
		if (
			pathname.startsWith("/patient/auth/") ||
			pathname.startsWith("/patient/appointments/book")
		) {
			const response = NextResponse.next();
			return applySecurityMiddleware(request, response);
		}

		// Check for patient authentication
		const patientAuthToken = request.cookies.get("patient-auth-token");

		if (!patientAuthToken) {
			return NextResponse.redirect(new URL("/patient/auth/signin", request.url));
		}

		try {
			// Verify patient token and set headers using jose library
			const { jwtVerify } = await import("jose");
			const secret = new TextEncoder().encode(process.env.PATIENT_JWT_SECRET || "patient-secret-key");
			const { payload } = await jwtVerify(patientAuthToken.value, secret);

			const response = NextResponse.next();
			response.headers.set("x-user-id", payload.userId as string);
			response.headers.set("x-user-email", payload.email as string);
			response.headers.set("x-patient-id", payload.patientId as string);
			response.headers.set("x-practice-id", payload.practiceId as string);

			return applySecurityMiddleware(request, response);
		} catch (error) {
			// Invalid token, redirect to login
			return NextResponse.redirect(new URL("/patient/auth/signin", request.url));
		}
	}

	// Check for protected routes
	if (
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/receptionist")
	) {
		try {
			// First check for test authentication
			const testAuthToken = request.cookies.get("test-auth-token");
			const testUserRole = request.cookies.get("test-user-role");

			if (testAuthToken && testUserRole) {
				// Get user details from cookies
				const testUserId = request.cookies.get("test-user-id");
				const testUserEmail = request.cookies.get("test-user-email");
				const testUserFirstName = request.cookies.get("test-user-first-name");
				const testUserLastName = request.cookies.get("test-user-last-name");

				const response = NextResponse.next();
				response.headers.set("x-test-auth", "true");
				response.headers.set("x-test-user-role", testUserRole.value);

				// Pass user details if available
				if (testUserId)
					response.headers.set("x-test-user-id", testUserId.value);
				if (testUserEmail)
					response.headers.set("x-test-user-email", testUserEmail.value);
				if (testUserFirstName)
					response.headers.set(
						"x-test-user-first-name",
						testUserFirstName.value,
					);
				if (testUserLastName)
					response.headers.set("x-test-user-last-name", testUserLastName.value);

				// Apply security headers
				return applySecurityMiddleware(request, response);
			}

			// Fallback to Stack Auth
			const user = await stackServerApp.getUser();

			if (!user) {
				logger.warn("Authentication failed - redirecting to login", {
					pathname,
					ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
				});
				return NextResponse.redirect(new URL("/test-login", request.url));
			}

			// Add user info to headers for use in components
			const response = NextResponse.next();
			response.headers.set("x-user-id", user.id);
			response.headers.set("x-user-email", user.primaryEmail || "");

			// For now, we'll need to get practice info from the database
			// This will be handled in the TRPC context

			// Apply security headers
			return applySecurityMiddleware(request, response);
		} catch (error) {
			// Log the error
			logger.error("Authentication error in middleware", 
				{ pathname, ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown" },
				error
			);
			
			// Invalid token, redirect to test login
			return NextResponse.redirect(new URL("/test-login", request.url));
		}
	}

	// Apply security headers for all other routes
	const response = NextResponse.next();
	return applySecurityMiddleware(request, response);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - api/v1/auth (Stack Auth routes)
		 */
		"/((?!_next/static|_next/image|favicon.ico|api/v1/auth).*)",
	],
};
