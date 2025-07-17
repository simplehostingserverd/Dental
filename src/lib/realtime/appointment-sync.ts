"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/client';
import type { Appointment } from '@/components/calendar/DragDropCalendar';
import type { AppointmentUpdate, NotificationUpdate } from '@/lib/websocket/server';

interface AppointmentSyncOptions {
  initialAppointments?: Appointment[];
  onAppointmentChange?: (appointments: Appointment[]) => void;
  onNotification?: (notification: NotificationUpdate) => void;
}

export function useAppointmentSync(options: AppointmentSyncOptions = {}) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    options.initialAppointments || []
  );
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');

  // Handle real-time appointment updates
  const handleAppointmentUpdate = useCallback((update: AppointmentUpdate) => {
    console.log('Received appointment update:', update);
    
    setAppointments(prev => {
      let updated = [...prev];
      
      switch (update.action) {
        case 'create':
          // Add new appointment if it doesn't exist
          if (!updated.find(apt => apt.id === update.appointment.id)) {
            const newAppointment: Appointment = {
              id: update.appointment.id,
              title: `${update.appointment.patient.name} - ${update.appointment.treatment}`,
              patient: update.appointment.patient,
              provider: update.appointment.provider,
              treatment: update.appointment.treatment,
              room: update.appointment.room,
              status: update.appointment.status as Appointment['status'],
              start: new Date(update.appointment.start),
              end: new Date(update.appointment.end),
              notes: update.appointment.notes,
            };
            updated.push(newAppointment);
          }
          break;
          
        case 'update':
        case 'move':
          // Update existing appointment
          updated = updated.map(apt => {
            if (apt.id === update.appointment.id) {
              return {
                ...apt,
                start: new Date(update.appointment.start),
                end: new Date(update.appointment.end),
                status: update.appointment.status as Appointment['status'],
                provider: update.appointment.provider,
                treatment: update.appointment.treatment,
                room: update.appointment.room,
                notes: update.appointment.notes,
                title: `${update.appointment.patient.name} - ${update.appointment.treatment}`,
              };
            }
            return apt;
          });
          break;
          
        case 'delete':
          // Remove appointment
          updated = updated.filter(apt => apt.id !== update.appointment.id);
          break;
      }
      
      return updated;
    });
    
    setLastUpdate(new Date(update.timestamp));
    
    // Show notification for appointment changes
    if (update.action === 'move') {
      const notification: NotificationUpdate = {
        id: `apt-move-${update.appointment.id}`,
        type: 'appointment',
        title: 'Appointment Moved',
        message: `${update.appointment.patient.name}'s appointment has been moved by ${update.updatedBy.name}`,
        priority: 'medium',
        targetRoles: ['doctor', 'admin'],
        practiceId: update.practiceId,
        timestamp: new Date(),
      };
      options.onNotification?.(notification);
    }
  }, [options]);

  // Handle notifications
  const handleNotification = useCallback((notification: NotificationUpdate) => {
    console.log('Received notification:', notification);
    options.onNotification?.(notification);
  }, [options]);

  // Initialize WebSocket connection
  const webSocket = useWebSocket({
    onAppointmentUpdate: handleAppointmentUpdate,
    onNotification: handleNotification,
    onConnect: () => {
      setSyncStatus('connected');
      console.log('Appointment sync connected');
    },
    onDisconnect: () => {
      setSyncStatus('disconnected');
      console.log('Appointment sync disconnected');
    },
    onError: (error) => {
      console.error('Appointment sync error:', error);
      setSyncStatus('disconnected');
    },
  });

  // Sync appointment move
  const syncAppointmentMove = useCallback((
    appointmentId: string,
    newStart: Date,
    newEnd: Date,
    appointment: Appointment
  ) => {
    setSyncStatus('syncing');
    
    webSocket.emitAppointmentUpdate({
      id: `move-${appointmentId}-${Date.now()}`,
      action: 'move',
      appointment: {
        id: appointmentId,
        start: newStart,
        end: newEnd,
        status: appointment.status,
        patient: appointment.patient,
        provider: appointment.provider,
        treatment: appointment.treatment,
        room: appointment.room,
        notes: appointment.notes,
      },
    });
    
    setTimeout(() => setSyncStatus('connected'), 500);
  }, [webSocket]);

  // Sync appointment creation
  const syncAppointmentCreate = useCallback((appointment: Appointment) => {
    setSyncStatus('syncing');
    
    webSocket.emitAppointmentUpdate({
      id: `create-${appointment.id}-${Date.now()}`,
      action: 'create',
      appointment: {
        id: appointment.id,
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        patient: appointment.patient,
        provider: appointment.provider,
        treatment: appointment.treatment,
        room: appointment.room,
        notes: appointment.notes,
      },
    });
    
    setTimeout(() => setSyncStatus('connected'), 500);
  }, [webSocket]);

  // Sync appointment update
  const syncAppointmentUpdate = useCallback((appointment: Appointment) => {
    setSyncStatus('syncing');
    
    webSocket.emitAppointmentUpdate({
      id: `update-${appointment.id}-${Date.now()}`,
      action: 'update',
      appointment: {
        id: appointment.id,
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        patient: appointment.patient,
        provider: appointment.provider,
        treatment: appointment.treatment,
        room: appointment.room,
        notes: appointment.notes,
      },
    });
    
    setTimeout(() => setSyncStatus('connected'), 500);
  }, [webSocket]);

  // Sync appointment deletion
  const syncAppointmentDelete = useCallback((appointmentId: string, appointment: Appointment) => {
    setSyncStatus('syncing');
    
    webSocket.emitAppointmentUpdate({
      id: `delete-${appointmentId}-${Date.now()}`,
      action: 'delete',
      appointment: {
        id: appointmentId,
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        patient: appointment.patient,
        provider: appointment.provider,
        treatment: appointment.treatment,
        room: appointment.room,
        notes: appointment.notes,
      },
    });
    
    setTimeout(() => setSyncStatus('connected'), 500);
  }, [webSocket]);

  // Send notification to specific roles
  const sendNotification = useCallback((
    title: string,
    message: string,
    targetRoles: string[],
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ) => {
    webSocket.sendNotification({
      id: `notification-${Date.now()}`,
      type: 'appointment',
      title,
      message,
      priority,
      targetRoles,
    });
  }, [webSocket]);

  // Update appointments when options change
  useEffect(() => {
    if (options.initialAppointments) {
      setAppointments(options.initialAppointments);
    }
  }, [options.initialAppointments]);

  // Notify parent component of appointment changes
  useEffect(() => {
    options.onAppointmentChange?.(appointments);
  }, [appointments, options]);

  return {
    appointments,
    lastUpdate,
    syncStatus,
    connected: webSocket.connected,
    syncAppointmentMove,
    syncAppointmentCreate,
    syncAppointmentUpdate,
    syncAppointmentDelete,
    sendNotification,
    setAppointments,
  };
}
