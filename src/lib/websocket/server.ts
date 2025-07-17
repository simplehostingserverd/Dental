import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface AppointmentUpdate {
  id: string;
  action: 'create' | 'update' | 'delete' | 'move';
  appointment: {
    id: string;
    start: Date;
    end: Date;
    status: string;
    patient: {
      id: string;
      name: string;
      phone: string;
    };
    provider: string;
    treatment: string;
    room: string;
    notes?: string;
  };
  updatedBy: {
    id: string;
    name: string;
    role: 'receptionist' | 'doctor' | 'admin';
  };
  timestamp: Date;
  practiceId: string;
}

export interface PatientUpdate {
  id: string;
  action: 'checkin' | 'checkout' | 'status_change';
  patient: {
    id: string;
    name: string;
    status: string;
  };
  updatedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: Date;
  practiceId: string;
}

export interface TaskUpdate {
  id: string;
  action: 'create' | 'update' | 'complete' | 'delete';
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignedTo?: string;
    dueDate?: Date;
  };
  updatedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: Date;
  practiceId: string;
}

export interface NotificationUpdate {
  id: string;
  type: 'appointment' | 'patient' | 'task' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetRoles: string[];
  practiceId: string;
  timestamp: Date;
}

class WebSocketManager {
  private io: SocketIOServer | null = null;
  private connectedUsers = new Map<string, { socket: Socket; userId: string; practiceId: string; role: string }>();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: '/api/socket',
    });

    this.io.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket server initialized');
  }

  private async handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);

    // Authenticate the socket connection
    const session = await this.authenticateSocket(socket);
    if (!session) {
      socket.emit('auth_error', { message: 'Authentication required' });
      socket.disconnect();
      return;
    }

    // Store user connection info
    this.connectedUsers.set(socket.id, {
      socket,
      userId: session.user.id,
      practiceId: session.user.practiceId,
      role: session.user.role,
    });

    // Join practice-specific room
    socket.join(`practice:${session.user.practiceId}`);
    
    // Join role-specific room
    socket.join(`role:${session.user.role}`);

    // Send connection confirmation
    socket.emit('connected', {
      userId: session.user.id,
      practiceId: session.user.practiceId,
      role: session.user.role,
    });

    // Handle appointment updates
    socket.on('appointment:update', (data: AppointmentUpdate) => {
      this.broadcastAppointmentUpdate(data);
    });

    // Handle patient updates
    socket.on('patient:update', (data: PatientUpdate) => {
      this.broadcastPatientUpdate(data);
    });

    // Handle task updates
    socket.on('task:update', (data: TaskUpdate) => {
      this.broadcastTaskUpdate(data);
    });

    // Handle real-time notifications
    socket.on('notification:send', (data: NotificationUpdate) => {
      this.broadcastNotification(data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      this.connectedUsers.delete(socket.id);
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });
  }

  private async authenticateSocket(socket: Socket): Promise<any> {
    try {
      // Extract session from socket handshake
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return null;

      // This is a simplified authentication - in production, you'd want more robust auth
      // For now, we'll assume the session is valid if cookies are present
      return {
        user: {
          id: 'user-id', // This would come from actual session
          practiceId: 'practice-id',
          role: 'receptionist', // or 'doctor', 'admin'
        }
      };
    } catch (error) {
      console.error('Socket authentication error:', error);
      return null;
    }
  }

  // Broadcast appointment updates to all users in the practice
  broadcastAppointmentUpdate(data: AppointmentUpdate) {
    if (!this.io) return;

    this.io.to(`practice:${data.practiceId}`).emit('appointment:updated', {
      ...data,
      timestamp: new Date(),
    });

    // Send specific notifications to doctors about their appointments
    if (data.appointment.provider) {
      this.io.to(`practice:${data.practiceId}`).emit('doctor:appointment_update', {
        ...data,
        timestamp: new Date(),
      });
    }

    console.log(`Broadcasted appointment update: ${data.action} for appointment ${data.appointment.id}`);
  }

  // Broadcast patient status updates
  broadcastPatientUpdate(data: PatientUpdate) {
    if (!this.io) return;

    this.io.to(`practice:${data.practiceId}`).emit('patient:updated', {
      ...data,
      timestamp: new Date(),
    });

    console.log(`Broadcasted patient update: ${data.action} for patient ${data.patient.id}`);
  }

  // Broadcast task updates
  broadcastTaskUpdate(data: TaskUpdate) {
    if (!this.io) return;

    this.io.to(`practice:${data.practiceId}`).emit('task:updated', {
      ...data,
      timestamp: new Date(),
    });

    console.log(`Broadcasted task update: ${data.action} for task ${data.task.id}`);
  }

  // Broadcast notifications to specific roles
  broadcastNotification(data: NotificationUpdate) {
    if (!this.io) return;

    // Send to all target roles
    data.targetRoles.forEach(role => {
      this.io!.to(`role:${role}`).emit('notification:received', {
        ...data,
        timestamp: new Date(),
      });
    });

    console.log(`Broadcasted notification to roles: ${data.targetRoles.join(', ')}`);
  }

  // Send direct message to specific user
  sendToUser(userId: string, event: string, data: any) {
    if (!this.io) return;

    const userConnection = Array.from(this.connectedUsers.values())
      .find(conn => conn.userId === userId);

    if (userConnection) {
      userConnection.socket.emit(event, data);
      console.log(`Sent ${event} to user ${userId}`);
    }
  }

  // Get connected users count for a practice
  getConnectedUsersCount(practiceId: string): number {
    return Array.from(this.connectedUsers.values())
      .filter(conn => conn.practiceId === practiceId).length;
  }

  // Get connected users by role
  getConnectedUsersByRole(practiceId: string, role: string): string[] {
    return Array.from(this.connectedUsers.values())
      .filter(conn => conn.practiceId === practiceId && conn.role === role)
      .map(conn => conn.userId);
  }
}

// Singleton instance
export const webSocketManager = new WebSocketManager();

// Helper functions for easy broadcasting
export const broadcastAppointmentUpdate = (data: AppointmentUpdate) => {
  webSocketManager.broadcastAppointmentUpdate(data);
};

export const broadcastPatientUpdate = (data: PatientUpdate) => {
  webSocketManager.broadcastPatientUpdate(data);
};

export const broadcastTaskUpdate = (data: TaskUpdate) => {
  webSocketManager.broadcastTaskUpdate(data);
};

export const broadcastNotification = (data: NotificationUpdate) => {
  webSocketManager.broadcastNotification(data);
};

export const sendToUser = (userId: string, event: string, data: any) => {
  webSocketManager.sendToUser(userId, event, data);
};
