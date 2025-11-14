import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { createMockRequest } from '@/test/utils';

// Mock dependencies
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

import { createClient } from '@/utils/supabase/server';

describe('POST /api/payments/raffle-entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for invalid email', async () => {
    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'invalid-email',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('transformation');
    expect(data.details).toBeDefined();
  });

  it('should return 404 if no active raffle exists', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'No rows found' },
        }),
      })),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'test@example.com',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain('No active raffle');
  });

  it('should return 410 if raffle has ended', async () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'raffle-id',
            status: 'active',
            end_date: pastDate,
            entry_price: 9700,
            regular_price: 14900,
            savings_amount: 5200,
          },
          error: null,
        }),
      })),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'test@example.com',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(410);
    expect(data.error).toContain('raffle has ended');
  });

  it('should return 409 for duplicate entry', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // 1 day from now

    let callCount = 0;
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++;
        if (table === 'raffle_config' || callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'raffle-id',
                status: 'active',
                end_date: futureDate,
                entry_price: 9700,
              },
              error: null,
            }),
          };
        } else {
          // raffle_entries table
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: 'existing-entry-id' },
              error: null,
            }),
          };
        }
      }),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'test@example.com',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toContain('already begun');
    expect(data.existingEntry).toBe(true);
  });

  it('should create Square payment link successfully', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    let callCount = 0;
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++;
        if (table === 'raffle_config' || callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'raffle-id',
                status: 'active',
                end_date: futureDate,
                entry_price: 9700,
                regular_price: 14900,
                savings_amount: 5200,
              },
              error: null,
            }),
          };
        } else {
          // raffle_entries - no existing entry
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          };
        }
      }),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    // Mock Square API response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        payment_link: {
          url: 'https://checkout.square.site/test-link',
          id: 'payment-link-id',
        },
      }),
    } as Response);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        fullName: 'Test User',
        commitment: 'I am ready to transform',
        transformationGoal: 'Become financially free',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.paymentUrl).toBe('https://checkout.square.site/test-link');
    expect(data.raffleDetails).toBeDefined();
    expect(data.raffleDetails.discount).toBe(35);
  });

  it('should handle Square API errors gracefully', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    let callCount = 0;
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'raffle-id',
                status: 'active',
                end_date: futureDate,
                entry_price: 9700,
              },
              error: null,
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          };
        }
      }),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    // Mock Square API error
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: [{ code: 'INVALID_EMAIL_ADDRESS' }],
      }),
    } as Response);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'test@example.com',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Real email');
  });

  it('should include user ID for authenticated users', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    let callCount = 0;
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'raffle-id',
                status: 'active',
                end_date: futureDate,
                entry_price: 9700,
                regular_price: 14900,
                savings_amount: 5200,
              },
              error: null,
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          };
        }
      }),
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        payment_link: {
          url: 'https://checkout.square.site/test-link',
          id: 'payment-link-id',
        },
      }),
    } as Response);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        guestCheckout: false,
      },
    });

    await POST(request as any);

    // Verify fetch was called with metadata including user_id
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('user_id'),
      })
    );
  });
});

describe('GET /api/payments/raffle-entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return raffle status when active', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === 'raffle_config') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'raffle-id',
                name: 'Grand Opening',
                tagline: 'Transform your life',
                status: 'active',
                end_date: futureDate,
                entry_price: 9700,
                regular_price: 14900,
                savings_amount: 5200,
                prizes: ['Prize 1', 'Prize 2'],
              },
              error: null,
            }),
          };
        } else {
          // raffle_entries
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
          };
        }
      }),
    };

    // Mock count separately - type assertion to avoid complex typing
    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'raffle_entries') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              count: 42,
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'raffle-id',
            name: 'Grand Opening',
            tagline: 'Transform your life',
            status: 'active',
            end_date: futureDate,
            entry_price: 9700,
            regular_price: 14900,
            savings_amount: 5200,
            prizes: ['Prize 1', 'Prize 2'],
          },
          error: null,
        }),
      };
    }) as any;

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'GET',
    });

    const response = await GET(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.active).toBe(true);
    expect(data.raffle.name).toBe('Grand Opening');
    expect(data.raffle.entryPrice).toBe(97);
    expect(data.raffle.discountPercentage).toBe(35);
  });

  it('should return inactive status when no raffle exists', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      })),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const request = createMockRequest('/api/payments/raffle-entry', {
      method: 'GET',
    });

    const response = await GET(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.active).toBe(false);
    expect(data.message).toContain('No active raffle');
  });
});
