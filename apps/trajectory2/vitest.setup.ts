import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  createClient: vi.fn(),
  supabaseAdmin: {
    from: vi.fn(),
    auth: vi.fn(),
  },
  getSupabaseServiceRole: vi.fn(),
}));

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
    },
  })),
}));

// Mock environment variables
process.env.RESEND_API_KEY = 'test-key';
process.env.RESEND_FROM_EMAIL = 'test@trajectory.com';
process.env.NEXT_PUBLIC_APP_URL = 'https://test.trajectory.com';
