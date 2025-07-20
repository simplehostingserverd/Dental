"use client";

import { StackClientApp } from "@stackframe/stack";

// Add error handling for missing environment variables
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

if (!projectId || !publishableClientKey) {
  console.warn("Stack Auth environment variables are missing. Authentication may not work properly.");
}

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  baseUrl: process.env.NEXT_PUBLIC_STACK_URL || "http://localhost:3000",
  projectId: projectId || "demo-project-id",
  publishableClientKey: publishableClientKey || "demo-publishable-key",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    afterSignOut: "/",
  },
});
