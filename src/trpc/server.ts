import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { type AppRouter, createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
	const heads = new Headers(await headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
	});
});

export const createServerApi = async () => {
	const context = await createContext();
	return createCaller(context);
};

// For compatibility, export a function that creates the API
export const api = {
	async getCaller() {
		return createServerApi();
	},
};
