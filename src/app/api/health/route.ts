/**
 * Health check endpoint for the application
 * Provides system status information for monitoring
 */

import { env, isProduction } from "@/env";
import { logger } from "@/lib/logger";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

interface HealthStatus {
	status: "ok" | "degraded" | "error";
	version: string;
	timestamp: string;
	environment: string;
	services: {
		database: {
			status: "ok" | "error";
			latency?: number;
		};
		api: {
			status: "ok";
		};
	};
	uptime: number;
}

export async function GET(): Promise<NextResponse> {
	const startTime = performance.now();
	let dbStatus: "ok" | "error" = "error";
	let dbLatency: number | undefined;

	try {
		// Check database connection
		const dbStartTime = performance.now();
		await db.$queryRaw`SELECT 1`;
		dbLatency = Math.round(performance.now() - dbStartTime);
		dbStatus = "ok";
	} catch (error) {
		logger.error("Health check - Database connection failed", {}, error);
	}

	// Determine overall status
	const overallStatus: "ok" | "degraded" | "error" =
		dbStatus === "ok" ? "ok" : "error";

	// Build response
	const health: HealthStatus = {
		status: overallStatus,
		version: process.env.npm_package_version || "0.1.0",
		timestamp: new Date().toISOString(),
		environment: env.NODE_ENV,
		services: {
			database: {
				status: dbStatus,
				latency: dbLatency,
			},
			api: {
				status: "ok",
			},
		},
		uptime: Math.floor(process.uptime()),
	};

	// In production, don't expose detailed error info
	if (isProduction && overallStatus !== "ok") {
		return NextResponse.json(
			{ status: overallStatus },
			{ status: overallStatus === "error" ? 500 : 200 },
		);
	}

	const responseTime = Math.round(performance.now() - startTime);

	// Add response time header
	const response = NextResponse.json(health, {
		status: overallStatus === "error" ? 500 : 200,
	});

	response.headers.set("X-Response-Time", `${responseTime}ms`);

	return response;
}
