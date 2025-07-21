/**
 * Tests for the health check API endpoint
 */

import { GET } from '@/app/api/health/route';
import { db } from '@/server/db';

// Mock the NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((body, init) => ({
        body,
        status: init?.status || 200,
        headers: new Map(),
      })),
    },
  };
});

describe('Health Check API', () => {
  it('should return 200 when database is healthy', async () => {
    // Setup mock for database query
    (db.$queryRaw as jest.Mock).mockResolvedValueOnce([{ '1': 1 }]);
    
    // Call the health check endpoint
    const response = await GET();
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.services.database.status).toBe('ok');
    expect(response.body.services.api.status).toBe('ok');
    expect(typeof response.body.services.database.latency).toBe('number');
    expect(response.body.environment).toBe('test');
  });

  it('should return 500 when database connection fails', async () => {
    // Setup mock for database query failure
    (db.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));
    
    // Call the health check endpoint
    const response = await GET();
    
    // Assertions
    expect(response.status).toBe(500);
    expect(response.body.status).toBe('error');
    expect(response.body.services.database.status).toBe('error');
    expect(response.body.services.api.status).toBe('ok');
  });
});