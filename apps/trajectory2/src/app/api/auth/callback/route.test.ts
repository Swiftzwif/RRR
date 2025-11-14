import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { createMockRequest } from '@/test/utils';

// Mock dependencies
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn(),
  sendEmailVerification: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  getSupabaseServiceRole: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { createClient } from '@/utils/supabase/server';
import { sendWelcomeEmail, sendEmailVerification } from '@/lib/email';
import { getSupabaseServiceRole } from '@/lib/supabase';

describe('GET /api/auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to error page if no code is provided', async () => {
    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
    });

    const response = await GET(request as any);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get('location')).toContain('/raffle?auth=error');
  });

  it('should redirect to login with error if code exchange fails', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          error: { message: 'Invalid code' },
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'invalid-code' },
    });

    const response = await GET(request as any);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login?error=');
    expect(response.headers.get('location')).toContain('Authentication%20failed');
  });

  it('should redirect to login if user cannot be retrieved', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'User not found' },
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code' },
    });

    const response = await GET(request as any);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login?error=');
  });

  it('should send welcome email for new users', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'newuser@example.com',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        name: 'New User',
        welcome_email_sent: false,
      },
    };

    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    const mockServiceSupabase = {
      auth: {
        admin: {
          updateUserById: vi.fn().mockResolvedValue({ error: null }),
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockServiceSupabase as any);
    vi.mocked(sendWelcomeEmail).mockResolvedValue({ success: true });

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code' },
    });

    const response = await GET(request as any);

    expect(sendWelcomeEmail).toHaveBeenCalledWith({
      to: 'newuser@example.com',
      userName: 'New User',
      verificationUrl: undefined,
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('should not send welcome email if already sent', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'returning@example.com',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        name: 'Returning User',
        welcome_email_sent: true,
      },
    };

    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code' },
    });

    const response = await GET(request as any);

    expect(sendWelcomeEmail).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
  });

  it('should send verification email for unverified new users', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'unverified@example.com',
      email_confirmed_at: null,
      user_metadata: {
        name: 'Unverified User',
        welcome_email_sent: false,
      },
    };

    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    const mockServiceSupabase = {
      auth: {
        admin: {
          generateLink: vi.fn().mockResolvedValue({
            data: {
              properties: {
                hashed_token: 'verification-token',
              },
            },
            error: null,
          }),
          updateUserById: vi.fn().mockResolvedValue({ error: null }),
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    vi.mocked(getSupabaseServiceRole).mockReturnValue(mockServiceSupabase as any);
    vi.mocked(sendWelcomeEmail).mockResolvedValue({ success: true });
    vi.mocked(sendEmailVerification).mockResolvedValue({ success: true });

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code' },
    });

    const response = await GET(request as any);

    expect(sendEmailVerification).toHaveBeenCalledWith({
      to: 'unverified@example.com',
      userName: 'Unverified User',
      verificationUrl: expect.stringContaining('verification-token'),
    });
  });

  it('should redirect to payment page with action=payment param', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        welcome_email_sent: true,
      },
    };

    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code', action: 'payment' },
    });

    const response = await GET(request as any);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/raffle?auth=success');
    expect(response.headers.get('location')).toContain(`user=${mockUser.id}`);
  });

  it('should handle custom redirect parameter', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        welcome_email_sent: true,
      },
    };

    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code', redirect: '/dashboard' },
    });

    const response = await GET(request as any);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('should continue authentication even if email sending fails', async () => {
    const mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        welcome_email_sent: false,
      },
    };

    const mockSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    vi.mocked(getSupabaseServiceRole).mockReturnValue({
      auth: {
        admin: {
          updateUserById: vi.fn().mockResolvedValue({ error: null }),
        },
      },
    } as any);
    vi.mocked(sendWelcomeEmail).mockRejectedValue(new Error('Email service down'));

    const request = createMockRequest('/api/auth/callback', {
      method: 'GET',
      searchParams: { code: 'valid-code' },
    });

    const response = await GET(request as any);

    // Should still redirect successfully despite email failure
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });
});
