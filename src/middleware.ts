import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

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
		pathname === "/"
	) {
		return NextResponse.next();
	}

	// Check for protected routes
	if (pathname.startsWith("/dashboard") || pathname.startsWith("/receptionist")) {
		try {
			const user = await stackServerApp.getUser({ request });

			if (!user) {
				return NextResponse.redirect(new URL("/auth/signin", request.url));
			}

			// Add user info to headers for use in components
			const response = NextResponse.next();
			response.headers.set("x-user-id", user.id);
			response.headers.set("x-user-email", user.primaryEmail || "");

			// For now, we'll need to get practice info from the database
			// This will be handled in the TRPC context

			return response;
		} catch (error) {
			// Invalid token, redirect to login
			return NextResponse.redirect(new URL("/auth/signin", request.url));
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
