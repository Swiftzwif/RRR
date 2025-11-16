import { vi } from 'vitest';

export function createMockResend() {
  return {
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
    },
  };
}
