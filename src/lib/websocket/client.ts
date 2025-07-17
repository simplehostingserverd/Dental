"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import type { 
  AppointmentUpdate, 
  PatientUpdate, 
  TaskUpdate, 
  NotificationUpdate 
} from './server';

interface UseWebSocketOptions {
  onAppointmentUpdate?: (data: AppointmentUpdate) => void;
  onPatientUpdate?: (data: PatientUpdate) => void;
  onTaskUpdate?: (data: TaskUpdate) => void;
  onNotification?: (data: NotificationUpdate) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastPing: Date | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastPing: null,
  });

  const connect = useCallback(() => {
    if (!session?.user || socketRef.current?.connected) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    const socket = io({
      path: '/api/socket',
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setState(prev => ({ 
        ...prev, 
        connected: true, 
        connecting: false, 
        error: null 
      }));
      options.onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false 
      }));
      options.onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false, 
        error: error.message 
      }));
      options.onError?.(error);
    });

    // Authentication events
    socket.on('connected', (data) => {
      console.log('WebSocket authenticated:', data);
    });

    socket.on('auth_error', (error) => {
      console.error('WebSocket auth error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message 
      }));
    });

    // Data update events
    socket.on('appointment:updated', (data: AppointmentUpdate) => {
      console.log('Appointment updated:', data);
      options.onAppointmentUpdate?.(data);
    });

    socket.on('patient:updated', (data: PatientUpdate) => {
      console.log('Patient updated:', data);
      options.onPatientUpdate?.(data);
    });

    socket.on('task:updated', (data: TaskUpdate) => {
      console.log('Task updated:', data);
      options.onTaskUpdate?.(data);
    });

    socket.on('notification:received', (data: NotificationUpdate) => {
      console.log('Notification received:', data);
      options.onNotification?.(data);
    });

    // Doctor-specific events
    socket.on('doctor:appointment_update', (data: AppointmentUpdate) => {
      console.log('Doctor appointment update:', data);
      options.onAppointmentUpdate?.(data);
    });

    // Ping/pong for connection health
    socket.on('pong', () => {
      setState(prev => ({ ...prev, lastPing: new Date() }));
    });

    socketRef.current = socket;
    socket.connect();
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
