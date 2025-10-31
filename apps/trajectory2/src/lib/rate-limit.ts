import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

/**
 * Rate limiting middleware for Next.js API routes
 * @param config Rate limit configuration
 * @returns Object with isAllowed boolean and reset time
 */
export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return async function checkRateLimit(req: NextRequest): Promise<{
    isAllowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    // Generate key based on IP address by default
    const key = finalConfig.keyGenerator
      ? finalConfig.keyGenerator(req)
      : getClientIp(req);

    const now = Date.now();
    const resetTime = now + finalConfig.windowMs;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
      // Create new entry
      entry = {
        count: 0,
        resetTime: resetTime,
      };
      rateLimitStore.set(key, entry);
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    const isAllowed = entry.count <= finalConfig.maxRequests;
    const remaining = Math.max(0, finalConfig.maxRequests - entry.count);

    return {
      isAllowed,
      limit: finalConfig.maxRequests,
      remaining,
      reset: entry.resetTime,
    };
  };
}

/**
 * Get client IP from request
 */
function getClientIp(req: NextRequest): string {
  // Check various headers for IP
  const forwarded = req.headers.get('x-forwarded-for');
  const real = req.headers.get('x-real-ip');
  const cloudflare = req.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (real) {
    return real;
  }

  if (cloudflare) {
    return cloudflare;
  }

  // Fallback to a default
  return 'unknown';
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Strict limit for auth endpoints
  auth: {
    maxRequests: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },

  // Password reset - very strict
  passwordReset: {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Email verification
  emailVerification: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },

  // Payment webhooks - reasonable limit
  webhook: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },

  // Admin endpoints - moderate limit
  admin: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },

  // General API - relaxed limit
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
};

/**
 * Helper to create rate limit response
 */
export function createRateLimitResponse(reset: number) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Please slow down and try again later',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '0',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}