"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type {
  AppointmentUpdate,
  PatientUpdate,
  TaskUpdate,
  NotificationUpdate
} from './server';

interface UseRealtimeOptions {
  onAppointmentUpdate?: (data: AppointmentUpdate) => void;
  onPatientUpdate?: (data: PatientUpdate) => void;
  onTaskUpdate?: (data: TaskUpdate) => void;
  onNotification?: (data: NotificationUpdate) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  pollingInterval?: number; // milliseconds
}

interface RealtimeState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastUpdate: Date | null;
  method: 'polling' | 'sse' | 'none';
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
    method: 'none',
  });

  const pollingInterval = options.pollingInterval || 5000; // 5 seconds default

  // Polling-based real-time updates
  const startPolling = useCallback(async () => {
    if (!session?.user) return;

    setState(prev => ({ ...prev, connecting: true, error: null, method: 'polling' }));

    const poll = async () => {
      try {
        const params = new URLSearchParams({
          types: 'appointments,patients,tasks',
          ...(state.lastUpdate && { lastUpdate: state.lastUpdate.toISOString() })
        });

        const response = await fetch(`/api/socket/poll?${params}`);
        if (!response.ok) throw new Error('Polling failed');

        const data = await response.json();

        // Process updates
        data.updates.forEach((update: any) => {
          switch (update.type) {
            case 'appointment':
              options.onAppointmentUpdate?.(update.data);
              break;
            case 'patient':
              options.onPatientUpdate?.(update.data);
              break;
            case 'task':
              options.onTaskUpdate?.(update.data);
              break;
          }
        });

        setState(prev => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
          lastUpdate: new Date()
        }));

        if (!state.connected) {
          options.onConnect?.();
        }

      } catch (error) {
        console.error('Polling error:', error);
        setState(prev => ({
          ...prev,
          connected: false,
          connecting: false,
          error: error instanceof Error ? error.message : 'Polling failed'
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

    setState(prev => ({ ...prev, connecting: true, error: null, method: 'sse' }));

    const eventSource = new EventSource('/api/socket/events');

    eventSource.onopen = () => {
      console.log('SSE connected');
      setState(prev => ({
        ...prev,
        connected: true,
        connecting: false,
        error: null
      }));
      options.onConnect?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connection':
          case 'heartbeat':
            setState(prev => ({ ...prev, lastUpdate: new Date() }));
            break;
          case 'appointment':
            options.onAppointmentUpdate?.(data);
            break;
          case 'patient':
            options.onPatientUpdate?.(data);
            break;
          case 'task':
            options.onTaskUpdate?.(data);
            break;
          case 'notification':
            options.onNotification?.(data);
            break;
        }
      } catch (error) {
        console.error('SSE message parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setState(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        error: 'SSE connection failed'
      }));
      options.onError?.(error);
    };

    eventSourceRef.current = eventSource;
  }, [session, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false 
      }));
    }
  }, []);

  // Emit appointment update
  const emitAppointmentUpdate = useCallback((data: Omit<AppointmentUpdate, 'timestamp' | 'updatedBy' | 'practiceId'>) => {
    if (!socketRef.current?.connected || !session?.user) return;

    const updateData: AppointmentUpdate = {
      ...data,
      updatedBy: {
        id: session.user.id,
        name: `${session.user.firstName} ${session.user.lastName}`,
        role: session.user.role as 'receptionist' | 'doctor' | 'admin',
      },
      timestamp: new Date(),
      practiceId: session.user.practiceId,
    };

    socketRef.current.emit('appointment:update', updateData);
  }, [session]);

  // Emit patient update
  const emitPatientUpdate = useCallback((data: Omit<PatientUpdate, 'timestamp' | 'updatedBy' | 'practiceId'>) => {
    if (!socketRef.current?.connected || !session?.user) return;

    const updateData: PatientUpdate = {
      ...data,
      updatedBy: {
        id: session.user.id,
        name: `${session.user.firstName} ${session.user.lastName}`,
        role: session.user.role,
      },
      timestamp: new Date(),
      practiceId: session.user.practiceId,
    };

    socketRef.current.emit('patient:update', updateData);
  }, [session]);

  // Emit task update
  const emitTaskUpdate = useCallback((data: Omit<TaskUpdate, 'timestamp' | 'updatedBy' | 'practiceId'>) => {
    if (!socketRef.current?.connected || !session?.user) return;

    const updateData: TaskUpdate = {
      ...data,
      updatedBy: {
        id: session.user.id,
        name: `${session.user.firstName} ${session.user.lastName}`,
        role: session.user.role,
      },
      timestamp: new Date(),
      practiceId: session.user.practiceId,
    };

    socketRef.current.emit('task:update', updateData);
  }, [session]);

  // Send notification
  const sendNotification = useCallback((data: Omit<NotificationUpdate, 'timestamp' | 'practiceId'>) => {
    if (!socketRef.current?.connected || !session?.user) return;

    const notificationData: NotificationUpdate = {
      ...data,
      timestamp: new Date(),
      practiceId: session.user.practiceId,
    };

    socketRef.current.emit('notification:send', notificationData);
  }, [session]);

  // Ping server to check connection
  const ping = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping');
    }
  }, []);

  // Auto-connect when session is available
  useEffect(() => {
    if (session?.user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session, connect, disconnect]);

  // Ping server every 30 seconds to maintain connection
  useEffect(() => {
    if (!state.connected) return;

    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, [state.connected, ping]);

  return {
    ...state,
    connect,
    disconnect,
    emitAppointmentUpdate,
    emitPatientUpdate,
    emitTaskUpdate,
    sendNotification,
    ping,
  };
}

// Context for WebSocket connection
import { createContext, useContext, ReactNode } from 'react';

interface WebSocketContextType {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  emitAppointmentUpdate: (data: Omit<AppointmentUpdate, 'timestamp' | 'updatedBy' | 'practiceId'>) => void;
  emitPatientUpdate: (data: Omit<PatientUpdate, 'timestamp' | 'updatedBy' | 'practiceId'>) => void;
  emitTaskUpdate: (data: Omit<TaskUpdate, 'timestamp' | 'updatedBy' | 'practiceId'>) => void;
  sendNotification: (data: Omit<NotificationUpdate, 'timestamp' | 'practiceId'>) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ 
  children, 
  onAppointmentUpdate,
  onPatientUpdate,
  onTaskUpdate,
  onNotification,
}: { 
  children: ReactNode;
  onAppointmentUpdate?: (data: AppointmentUpdate) => void;
  onPatientUpdate?: (data: PatientUpdate) => void;
  onTaskUpdate?: (data: TaskUpdate) => void;
  onNotification?: (data: NotificationUpdate) => void;
}) {
  const webSocket = useWebSocket({
    onAppointmentUpdate,
    onPatientUpdate,
    onTaskUpdate,
    onNotification,
  });

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}
