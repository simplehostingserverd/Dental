import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Add error handling for missing environment variables
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const publishableClientKey =
	process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
const secretServerKey = process.env.STACK_SECRET_SERVER_KEY;

if (!projectId || !publishableClientKey || !secretServerKey) {
	console.warn(
		"Stack Auth server environment variables are missing. Authentication may not work properly.",
	);
}

export const stackServerApp = new StackServerApp({
	tokenStore: "nextjs-cookie",
	projectId: projectId || "demo-project-id",
	publishableClientKey: publishableClientKey || "demo-publishable-key",
	secretServerKey: secretServerKey || "demo-secret-key",
	baseUrl: process.env.NEXT_PUBLIC_STACK_URL || "http://localhost:3000",
	urls: {
		signIn: "/auth/signin",
		signUp: "/auth/signup",
		afterSignIn: "/dashboard",
		afterSignUp: "/dashboard",
		afterSignOut: "/",
	},
});
