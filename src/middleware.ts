import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface PracticeJWTPayload {
	userId: string;
	email: string;
	role: string;
	practiceId: string;
	type: "practice";
}

interface PatientJWTPayload {
	userId: string;
	email: string;
	patientId: string;
	practiceId: string;
	type: "patient";
}

type JWTPayload = PracticeJWTPayload | PatientJWTPayload;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip middleware for public routes (but allow /api/auth/me)
	if (
		(pathname.startsWith("/api/auth") && pathname !== "/api/auth/me") ||
		pathname.startsWith("/auth") ||
		pathname.startsWith("/patient/auth") ||
		pathname === "/" ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon") ||
		pathname.startsWith("/public") ||
		pathname.startsWith("/api/trpc") ||
		pathname.startsWith("/api/upload") ||
		pathname.startsWith("/api/test") ||
		pathname.startsWith("/api/check-env") ||
		pathname.startsWith("/api/create-sample-users")
	) {
		return NextResponse.next();
	}

	// Check for dashboard routes (practice users)
	if (pathname.startsWith("/dashboard")) {
		const token = request.cookies.get("practice-auth-token")?.value;

		if (!token) {
			return NextResponse.redirect(new URL("/auth/signin", request.url));
		}

		try {
			const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
			const secret = new TextEncoder().encode(JWT_SECRET);
			const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };

			if (payload.type !== "practice") {
				return NextResponse.redirect(new URL("/auth/signin", request.url));
			}

			// Add user info to headers for use in components
			const response = NextResponse.next();
			response.headers.set("x-user-id", payload.userId);
			response.headers.set("x-user-email", payload.email);
			response.headers.set("x-practice-id", payload.practiceId);
			if (payload.type === "practice") {
				response.headers.set("x-user-role", payload.role);
			}

			return response;
		} catch (error) {
			// Invalid token, redirect to login
			const response = NextResponse.redirect(new URL("/auth/signin", request.url));
			response.cookies.delete("practice-auth-token");
			return response;
		}
	}

	// Check for patient portal routes (excluding auth routes)
	if (pathname.startsWith("/patient") && !pathname.startsWith("/patient/auth")) {
		const token = request.cookies.get("patient-auth-token")?.value;

		if (!token) {
			return NextResponse.redirect(new URL("/patient/auth/signin", request.url));
		}

		try {
			const PATIENT_JWT_SECRET = process.env.PATIENT_JWT_SECRET || "patient-secret-key";
			const secret = new TextEncoder().encode(PATIENT_JWT_SECRET);
			const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };

			if (payload.type !== "patient") {
				return NextResponse.redirect(new URL("/patient/auth/signin", request.url));
			}

			// Add user info to headers for use in components
			const response = NextResponse.next();
			response.headers.set("x-user-id", payload.userId);
			response.headers.set("x-user-email", payload.email);
			response.headers.set("x-practice-id", payload.practiceId);
			if (payload.type === "patient") {
				response.headers.set("x-patient-id", payload.patientId);
			}

			return response;
		} catch (error) {
			// Invalid token, redirect to login
			const response = NextResponse.redirect(new URL("/patient/auth/signin", request.url));
			response.cookies.delete("patient-auth-token");
			return response;
		}
	}

	// Check for patient API routes and auth/me
	if (pathname.startsWith("/api/patient") || pathname === "/api/auth/me") {
		const token = request.cookies.get("patient-auth-token")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		try {
			const PATIENT_JWT_SECRET = process.env.PATIENT_JWT_SECRET || "patient-secret-key";
			const secret = new TextEncoder().encode(PATIENT_JWT_SECRET);
			const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };

			if (payload.type !== "patient") {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				);
			}

			// Add user info to headers for use in API routes
			const response = NextResponse.next();
			response.headers.set("x-user-id", payload.userId);
			response.headers.set("x-user-email", payload.email);
			response.headers.set("x-practice-id", payload.practiceId);
			if (payload.type === "patient") {
				response.headers.set("x-patient-id", payload.patientId);
			}

			return response;
		} catch (error) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * But include /api/patient routes for authentication
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
