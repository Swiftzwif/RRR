import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, PUT } from './route';
import { createMockRequest } from '@/test/utils';
import type { AuthErrorResponse, AuthSuccessResponse, PasswordResetSuccessResponse } from '@/types/auth';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  getSupabaseServiceRole: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => vi.fn().mockResolvedValue({ isAllowed: true, reset: 0 })),
  rateLimitConfigs: { passwordReset: {} },
  createRateLimitResponse: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { getSupabaseServiceRole } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for invalid email', async () => {
    const request = createMockRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: 'invalid-email' },
    });

    const response = await POST(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid email');
  });

  it('should return 400 for missing email', async () => {
    const request = createMockRequest('/api/auth/reset-password', {
      method: 'POST',
      body: {},
    });

    const response = await POST(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it('should return 500 if Supabase service is not configured', async () => {
    vi.mocked(getSupabaseServiceRole).mockReturnValue(null);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: 'test@example.com' },
    });

    const response = await POST(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(500);
    expect(data.error).toBe('Auth service not configured');
  });

  it('should return success even if user does not exist (anti-enumeration)', async () => {
    const mockSupabase = {
      auth: {
        admin: {
          generateLink: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'User not found' },
          }),
        },
      },
    };

    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: 'nonexistent@example.com' },
    });

    const response = await POST(request as any);
    const data = await response.json() as AuthSuccessResponse;

    expect(response.status).toBe(200);
    expect(data.message).toContain('If an account exists');
  });

  it('should send password reset email successfully', async () => {
    const mockSupabase = {
      auth: {
        admin: {
          generateLink: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                email: 'test@example.com',
              },
              properties: {
                hashed_token: 'test-reset-token',
              },
            },
            error: null,
          }),
        },
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    };

    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockSupabase as any);
    vi.mocked(sendPasswordResetEmail).mockResolvedValue({ success: true, data: { id: 'email-id' } } as any);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: 'test@example.com' },
    });

    const response = await POST(request as any);
    const data = await response.json() as AuthSuccessResponse;

    expect(response.status).toBe(200);
    expect(data.message).toContain('If an account exists');
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      userName: 'test',
      resetUrl: expect.stringContaining('test-reset-token'),
    });
  });

  it('should still return success even if email send fails (anti-enumeration)', async () => {
    const mockSupabase = {
      auth: {
        admin: {
          generateLink: vi.fn().mockResolvedValue({
            data: {
              user: { id: 'test-id', email: 'test@example.com' },
              properties: { hashed_token: 'token' },
            },
            error: null,
          }),
        },
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    };

    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockSupabase as any);
    vi.mocked(sendPasswordResetEmail).mockResolvedValue({
      success: false,
      error: 'Email service down',
    });

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: 'test@example.com' },
    });

    const response = await POST(request as any);
    const data = await response.json() as AuthSuccessResponse;

    expect(response.status).toBe(200);
    expect(data.message).toContain('If an account exists');
  });
});

describe('PUT /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for invalid password', async () => {
    const request = createMockRequest('/api/auth/reset-password', {
      method: 'PUT',
      body: { token: 'valid-token', password: 'weak' },
    });

    const response = await PUT(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(400);
    expect(data.error).toContain('at least 8 characters');
  });

  it('should return 400 for missing token', async () => {
    const request = createMockRequest('/api/auth/reset-password', {
      method: 'PUT',
      body: { password: 'ValidPass123' },
    });

    const response = await PUT(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid input');
  });

  it('should return 500 if Supabase service is not configured', async () => {
    vi.mocked(getSupabaseServiceRole).mockReturnValue(null);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'PUT',
      body: { token: 'valid-token', password: 'ValidPass123' },
    });

    const response = await PUT(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(500);
    expect(data.error).toBe('Auth service not configured');
  });

  it('should return 400 for invalid token', async () => {
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' },
        }),
      },
    };

    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'PUT',
      body: { token: 'invalid-token', password: 'ValidPass123' },
    });

    const response = await PUT(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid or expired');
  });

  it('should reset password successfully', async () => {
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
        admin: {
          updateUserById: vi.fn().mockResolvedValue({ error: null }),
        },
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    };

    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'PUT',
      body: { token: 'valid-token', password: 'NewValidPass123' },
    });

    const response = await PUT(request as any);
    const data = await response.json() as PasswordResetSuccessResponse;

    expect(response.status).toBe(200);
    expect(data.message).toBe('Password successfully reset');
    expect(data.user.email).toBe('test@example.com');
    expect(mockSupabase.auth.admin.updateUserById).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000',
      { password: 'NewValidPass123' }
    );
  });

  it('should return 500 if password update fails', async () => {
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
        admin: {
          updateUserById: vi.fn().mockResolvedValue({
            error: { message: 'Update failed' },
          }),
        },
      },
    };

    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/reset-password', {
      method: 'PUT',
      body: { token: 'valid-token', password: 'NewValidPass123' },
    });

    const response = await PUT(request as any);
    const data = await response.json() as AuthErrorResponse;

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update password');
  });
});
