"use client";

import { logger } from "@/lib/logger";
import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to our centralized logger
		logger.error(
			"Client-side error occurred",
			{
				name: error.name,
				message: error.message,
				stack: error.stack,
				digest: error.digest,
			},
			error,
		);
	}, [error]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<div className="text-center">
					<h2 className="mb-4 font-bold text-2xl text-gray-900">
						Something went wrong!
					</h2>
					<p className="mb-6 text-gray-600">
						An unexpected error occurred. Please try again.
					</p>
					{error.digest && (
						<p className="mb-4 text-gray-500 text-sm">
							Error ID: {error.digest}
						</p>
					)}
					<button
						type="button"
						onClick={() => reset()}
						className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Try again
					</button>
				</div>
			</div>
		</div>
	);
}
