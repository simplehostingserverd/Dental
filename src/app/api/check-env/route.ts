import { NextRequest, NextResponse } from "next/server"
import { checkEnvironment, generateMissingEnvVars } from "@/scripts/check-env"

export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Environment check only available in development" },
        { status: 403 }
      )
    }

    console.log("🔍 Running environment check...")
    const result = await checkEnvironment()
    
    // Generate missing env vars
    generateMissingEnvVars()

    return NextResponse.json({
      success: true,
      hasErrors: result.hasErrors,
      envChecks: result.envChecks,
      message: result.hasErrors 
        ? "Environment configuration has errors - check console for details"
        : "Environment configuration is valid",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json(
      { 
        error: "Environment check failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
