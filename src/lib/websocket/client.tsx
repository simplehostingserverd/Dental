"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	AppointmentUpdate,
	NotificationUpdate,
	PatientUpdate,
	TaskUpdate,
} from "./server";

interface UseRealtimeOptions {
	onAppointmentUpdate?: (data: AppointmentUpdate) => void;
	onPatientUpdate?: (data: PatientUpdate) => void;
	onTaskUpdate?: (data: TaskUpdate) => void;
	onNotification?: (data: NotificationUpdate) => void;
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: Error) => void;
	pollingInterval?: number; // milliseconds
}

interface RealtimeState {
	connected: boolean;
	connecting: boolean;
	error: string | null;
	lastUpdate: Date | null;
	method: "polling" | "sse" | "none";
}

export function useRealtime(options: UseRealtimeOptions = {}) {
	const { data: session } = useSession();
	const pollingRef = useRef<NodeJS.Timeout | null>(null);
	const eventSourceRef = useRef<EventSource | null>(null);
	const [state, setState] = useState<RealtimeState>({
		connected: false,
		connecting: false,
		error: null,
		lastUpdate: null,
		method: "none",
	});

	const pollingInterval = options.pollingInterval || 5000; // 5 seconds default

	// Polling-based real-time updates
	const startPolling = useCallback(async () => {
		if (!session?.user) return;

		setState((prev) => ({
			...prev,
			connecting: true,
			error: null,
			method: "polling",
		}));

		const poll = async () => {
			try {
				const params = new URLSearchParams({
					types: "appointments,patients,tasks",
					...(state.lastUpdate && {
						lastUpdate: state.lastUpdate.toISOString(),
					}),
				});

				const response = await fetch(`/api/socket/poll?${params}`);
				if (!response.ok) throw new Error("Polling failed");

				const data = await response.json();

				// Process updates
				data.updates.forEach((update: any) => {
					switch (update.type) {
						case "appointment":
							options.onAppointmentUpdate?.(update.data);
							break;
						case "patient":
							options.onPatientUpdate?.(update.data);
							break;
						case "task":
							options.onTaskUpdate?.(update.data);
							break;
					}
				});

				setState((prev) => ({
					...prev,
					connected: true,
					connecting: false,
					error: null,
					lastUpdate: new Date(),
				}));

				if (!state.connected) {
					options.onConnect?.();
				}
			} catch (error) {
				console.error("Polling error:", error);
				setState((prev) => ({
					...prev,
					connected: false,
					connecting: false,
					error: error instanceof Error ? error.message : "Polling failed",
				}));
				options.onError?.(error);
			}
		};

		// Initial poll
		await poll();

		// Set up interval
		pollingRef.current = setInterval(poll, pollingInterval);
	}, [session, options, pollingInterval, state.lastUpdate, state.connected]);

	// Server-Sent Events fallback
	const startSSE = useCallback(() => {
		if (!session?.user) return;

		setState((prev) => ({
			...prev,
			connecting: true,
			error: null,
			method: "sse",
		}));

		const eventSource = new EventSource("/api/socket/events");

		eventSource.onopen = () => {
			console.log("SSE connected");
			setState((prev) => ({
				...prev,
				connected: true,
				connecting: false,
				error: null,
			}));
			options.onConnect?.();
		};

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				switch (data.type) {
					case "connection":
					case "heartbeat":
						setState((prev) => ({ ...prev, lastUpdate: new Date() }));
						break;
					case "appointment":
						options.onAppointmentUpdate?.(data);
						break;
					case "patient":
						options.onPatientUpdate?.(data);
						break;
					case "task":
						options.onTaskUpdate?.(data);
						break;
					case "notification":
						options.onNotification?.(data);
						break;
				}
			} catch (error) {
				console.error("SSE message parse error:", error);
			}
		};

		eventSource.onerror = (error) => {
			console.error("SSE error:", error);
			setState((prev) => ({
				...prev,
				connected: false,
				connecting: false,
				error: "SSE connection failed",
			}));
			options.onError?.(error);
		};

		eventSourceRef.current = eventSource;
	}, [session, options]);

	const disconnect = useCallback(() => {
		if (pollingRef.current) {
			clearInterval(pollingRef.current);
			pollingRef.current = null;
		}

		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}

		setState((prev) => ({
			...prev,
			connected: false,
			connecting: false,
			method: "none",
		}));

		options.onDisconnect?.();
	}, [options]);

	// Connect using preferred method (try SSE first, fallback to polling)
	const connect = useCallback(async () => {
		if (!session?.user || state.connected) return;

		// Try SSE first
		try {
			startSSE();
			// If SSE fails, it will trigger onerror and we can fallback to polling
			setTimeout(() => {
				if (!state.connected && state.method === "sse") {
					console.log("SSE failed, falling back to polling");
					disconnect();
					startPolling();
				}
			}, 3000);
		} catch (error) {
			console.log("SSE not available, using polling");
			startPolling();
		}
	}, [
		session,
		state.connected,
		state.method,
		startSSE,
		startPolling,
		disconnect,
	]);

	// Emit updates via HTTP POST (since we don't have WebSocket)
	const emitUpdate = useCallback(
		async (event: string, data: any) => {
			if (!session?.user) return;

			try {
				const response = await fetch("/api/socket", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ event, data }),
				});

				if (!response.ok) {
					throw new Error("Failed to emit update");
				}
			} catch (error) {
				console.error("Failed to emit update:", error);
				options.onError?.(error);
			}
		},
		[session, options],
	);

	// Emit appointment update
	const emitAppointmentUpdate = useCallback(
		(
			data: Omit<AppointmentUpdate, "timestamp" | "updatedBy" | "practiceId">,
		) => {
			if (!session?.user) return;

			const updateData: AppointmentUpdate = {
				...data,
				updatedBy: {
					id: session.user.id,
					name: session.user.name || "Unknown User",
					role: "admin" as "receptionist" | "doctor" | "admin",
				},
				timestamp: new Date(),
				practiceId: "default-practice",
			};

			emitUpdate("appointment:update", updateData);
		},
		[session, emitUpdate],
	);

	// Emit patient update
	const emitPatientUpdate = useCallback(
		(data: Omit<PatientUpdate, "timestamp" | "updatedBy" | "practiceId">) => {
			if (!session?.user) return;

			const updateData: PatientUpdate = {
				...data,
				updatedBy: {
					id: session.user.id,
					name: session.user.name || "Unknown User",
					role: "admin",
				},
				timestamp: new Date(),
				practiceId: "default-practice",
			};

			emitUpdate("patient:update", updateData);
		},
		[session, emitUpdate],
	);

	// Emit task update
	const emitTaskUpdate = useCallback(
		(data: Omit<TaskUpdate, "timestamp" | "updatedBy" | "practiceId">) => {
			if (!session?.user) return;

			const updateData: TaskUpdate = {
				...data,
				updatedBy: {
					id: session.user.id,
					name: session.user.name || "Unknown User",
					role: "admin",
				},
				timestamp: new Date(),
				practiceId: "default-practice",
			};

			emitUpdate("task:update", updateData);
		},
		[session, emitUpdate],
	);

	// Send notification
	const sendNotification = useCallback(
		(data: Omit<NotificationUpdate, "timestamp" | "practiceId">) => {
			if (!session?.user) return;

			const notificationData: NotificationUpdate = {
				...data,
				timestamp: new Date(),
				practiceId: "default-practice",
			};

			emitUpdate("notification:send", notificationData);
		},
		[session, emitUpdate],
	);

	// Auto-connect when session is available
	useEffect(() => {
		if (session?.user) {
			connect();
		}

		return () => {
			disconnect();
		};
	}, [session, connect, disconnect]);

	return {
		...state,
		connect,
		disconnect,
		emitAppointmentUpdate,
		emitPatientUpdate,
		emitTaskUpdate,
		sendNotification,
	};
}

// Context for Realtime connection
import React, { createContext, useContext, type ReactNode } from "react";

interface RealtimeContextType {
	connected: boolean;
	connecting: boolean;
	error: string | null;
	method: "polling" | "sse" | "none";
	emitAppointmentUpdate: (
		data: Omit<AppointmentUpdate, "timestamp" | "updatedBy" | "practiceId">,
	) => void;
	emitPatientUpdate: (
		data: Omit<PatientUpdate, "timestamp" | "updatedBy" | "practiceId">,
	) => void;
	emitTaskUpdate: (
		data: Omit<TaskUpdate, "timestamp" | "updatedBy" | "practiceId">,
	) => void;
	sendNotification: (
		data: Omit<NotificationUpdate, "timestamp" | "practiceId">,
	) => void;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export function RealtimeProvider({
	children,
	onAppointmentUpdate,
	onPatientUpdate,
	onTaskUpdate,
	onNotification,
	pollingInterval,
}: {
	children: ReactNode;
	onAppointmentUpdate?: (data: AppointmentUpdate) => void;
	onPatientUpdate?: (data: PatientUpdate) => void;
	onTaskUpdate?: (data: TaskUpdate) => void;
	onNotification?: (data: NotificationUpdate) => void;
	pollingInterval?: number;
}) {
	const realtime = useRealtime({
		onAppointmentUpdate,
		onPatientUpdate,
		onTaskUpdate,
		onNotification,
		pollingInterval,
	});

	return (
		<RealtimeContext.Provider
			value={{
				connected: realtime.connected,
				connecting: realtime.connecting,
				error: realtime.error,
				method: realtime.method,
				emitAppointmentUpdate: realtime.emitAppointmentUpdate,
				emitPatientUpdate: realtime.emitPatientUpdate,
				emitTaskUpdate: realtime.emitTaskUpdate,
				sendNotification: realtime.sendNotification,
			}}
		>
			{children}
		</RealtimeContext.Provider>
	);
}

export function useRealtimeContext() {
	const context = useContext(RealtimeContext);
	if (!context) {
		throw new Error(
			"useRealtimeContext must be used within a RealtimeProvider",
		);
	}
	return context;
}

// Legacy exports for backward compatibility
export const useWebSocket = useRealtime;
export const WebSocketProvider = RealtimeProvider;
export const useWebSocketContext = useRealtimeContext;
