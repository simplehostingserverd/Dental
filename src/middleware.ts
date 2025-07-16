import { NextRequest, NextResponse } from "next/server"
import { PracticeAuthService } from "@/lib/auth/practice-auth"
import { PatientAuthService } from "@/lib/auth/patient-auth"

// Define protected routes
const PRACTICE_PROTECTED_ROUTES = ["/dashboard"]
const PATIENT_PROTECTED_ROUTES = ["/patient"]
const AUTH_ROUTES = ["/auth/signin", "/auth/signup", "/patient/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle practice routes
  if (PRACTICE_PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return handlePracticeAuth(request)
  }
  
  // Handle patient routes
  if (PATIENT_PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return handlePatientAuth(request)
  }
  
  // Handle auth routes - redirect if already authenticated
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    return handleAuthRedirect(request)
  }
  
  return NextResponse.next()
}

function handlePracticeAuth(request: NextRequest) {
  const token = request.cookies.get("practice-auth-token")?.value
  
  if (!token) {
    return redirectToLogin(request, "/auth/signin")
  }
  
  try {
    const payload = PracticeAuthService.verifyToken(token)
    if (!payload || payload.type !== "practice") {
      return redirectToLogin(request, "/auth/signin")
    }
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.userId)
    requestHeaders.set("x-user-role", payload.role)
    requestHeaders.set("x-practice-id", payload.practiceId)
    requestHeaders.set("x-user-type", "practice")
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return redirectToLogin(request, "/auth/signin")
  }
}

function handlePatientAuth(request: NextRequest) {
  const token = request.cookies.get("patient-auth-token")?.value
  
  if (!token) {
    return redirectToLogin(request, "/patient/auth/signin")
  }
  
  try {
    const payload = PatientAuthService.verifyToken(token)
    if (!payload || payload.type !== "patient") {
      return redirectToLogin(request, "/patient/auth/signin")
    }
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.userId)
    requestHeaders.set("x-patient-id", payload.patientId)
    requestHeaders.set("x-practice-id", payload.practiceId)
    requestHeaders.set("x-user-type", "patient")
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return redirectToLogin(request, "/patient/auth/signin")
  }
}

function handleAuthRedirect(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check for practice auth
  if (pathname.startsWith("/auth")) {
    const practiceToken = request.cookies.get("practice-auth-token")?.value
    if (practiceToken) {
      try {
        const payload = PracticeAuthService.verifyToken(practiceToken)
        if (payload && payload.type === "practice") {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch (error) {
        // Token invalid, continue to auth page
      }
    }
  }
  
  // Check for patient auth
  if (pathname.startsWith("/patient/auth")) {
    const patientToken = request.cookies.get("patient-auth-token")?.value
    if (patientToken) {
      try {
        const payload = PatientAuthService.verifyToken(patientToken)
        if (payload && payload.type === "patient") {
          return NextResponse.redirect(new URL("/patient/dashboard", request.url))
        }
      } catch (error) {
        // Token invalid, continue to auth page
      }
    }
  }
  
  return NextResponse.next()
}

function redirectToLogin(request: NextRequest, loginPath: string) {
  const url = new URL(loginPath, request.url)
  url.searchParams.set("callbackUrl", request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
