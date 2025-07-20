import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

// Polling endpoint for real-time updates
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lastUpdate = searchParams.get('lastUpdate');
    const types = searchParams.get('types')?.split(',') || ['appointments', 'patients', 'tasks'];

    const updates: any[] = [];
    const since = lastUpdate ? new Date(lastUpdate) : new Date(Date.now() - 60000); // Last minute

    // Get recent appointment updates
    if (types.includes('appointments')) {
      const appointments = await db.appointment.findMany({
        where: {
          practiceId: session.user.practiceId,
          updatedAt: { gte: since }
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      });

      updates.push(...appointments.map(apt => ({
        type: 'appointment',
        action: 'update',
        data: apt,
        timestamp: apt.updatedAt
      })));
    }

    // Get recent patient updates
    if (types.includes('patients')) {
      const patients = await db.patient.findMany({
        where: {
          practiceId: session.user.practiceId,
          updatedAt: { gte: since }
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          status: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      });

      updates.push(...patients.map(patient => ({
        type: 'patient',
        action: 'update',
        data: patient,
        timestamp: patient.updatedAt
      })));
    }

    // Get recent task updates (if you have a tasks table)
    if (types.includes('tasks')) {
      // This would require a tasks table in your schema
      // For now, we'll return empty array
      // const tasks = await db.task.findMany({ ... });
    }

    return NextResponse.json({
      updates: updates.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      timestamp: new Date().toISOString(),
      hasMore: updates.length === 10
    });

  } catch (error) {
    console.error('Polling endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}
