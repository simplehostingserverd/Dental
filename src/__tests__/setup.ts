/**
 * Test setup file for Jest
 * Configures the test environment before running tests
 */

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/test_db';
process.env.JWT_SECRET = 'test-jwt-secret-key-must-be-at-least-32-chars';
process.env.PATIENT_JWT_SECRET = 'test-patient-jwt-secret-key-32-chars';
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000/api/auth';
process.env.SKIP_ENV_VALIDATION = 'true';

// Mock database
jest.mock('@/server/db', () => {
  const mockDb = {
    $queryRaw: jest.fn().mockResolvedValue([{ count: 1 }]),
    $transaction: jest.fn(async (callback) => {
      return callback(mockDb);
    }),
    patientUser: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    patient: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    practice: {
      findFirst: jest.fn(),
    },
  };
  
  return { db: mockDb };
});

// Mock logger to prevent console output during tests
jest.mock('@/lib/logger', () => {
  return {
    logger: {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    },
    LogLevel: {
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'info',
      DEBUG: 'debug',
    },
  };
});

// Global test setup
beforeAll(() => {
  // Add any global setup needed for all tests
});

// Global test teardown
afterAll(() => {
  // Clean up after all tests
});