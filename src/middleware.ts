import { stackServerApp } from "@/stack";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
		return NextResponse.next();
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

				return response;
			}

			// Fallback to Stack Auth
			const user = await stackServerApp.getUser({ request });

			if (!user) {
				return NextResponse.redirect(new URL("/test-login", request.url));
			}

			// Add user info to headers for use in components
			const response = NextResponse.next();
			response.headers.set("x-user-id", user.id);
			response.headers.set("x-user-email", user.primaryEmail || "");

			// For now, we'll need to get practice info from the database
			// This will be handled in the TRPC context

			return response;
		} catch (error) {
			// Invalid token, redirect to test login
			return NextResponse.redirect(new URL("/test-login", request.url));
		}
	}

	// For patient portal, we'll handle authentication in the page components for now
	// Stack Auth will manage the authentication state

	return NextResponse.next();
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
