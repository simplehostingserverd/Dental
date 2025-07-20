import {
	QueryClient,
	defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 5 * 60 * 1000, // 5 minutes for production
				gcTime: 10 * 60 * 1000, // 10 minutes
				retry: 3,
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			},
			dehydrate: {
				serializeData: SuperJSON.serialize,
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize,
			},
		},
	});
