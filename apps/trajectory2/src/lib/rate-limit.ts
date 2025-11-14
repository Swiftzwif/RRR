import { NextRequest } from 'next/server';
import type { VercelKV } from '@vercel/kv';

// Lazy import kv to avoid errors when KV is not configured
let kv: VercelKV | null = null;

async function getKV() {
  if (kv) return kv;
  
  try {
    // Check if KV environment variables are set
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv: kvModule } = await import('@vercel/kv');
      kv = kvModule;
      return kv;
    }
    return null;
  } catch (error) {
    console.warn('Vercel KV not available, rate limiting disabled:', error);
    return null;
  }
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Note: No need for cleanup interval with Redis - TTL handles expiration automatically

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
 * Rate limiting middleware for Next.js API routes using Redis
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
    try {
      // Get KV instance (or null if not available)
      const kvInstance = await getKV();
      
      // If KV is not configured, allow all requests
      if (!kvInstance) {
        return {
          isAllowed: true,
          limit: finalConfig.maxRequests,
          remaining: finalConfig.maxRequests,
          reset: Date.now() + finalConfig.windowMs,
        };
      }

      // Generate key based on IP address by default
      const key = finalConfig.keyGenerator
        ? finalConfig.keyGenerator(req)
        : getClientIp(req);

      // Create a prefixed key for rate limiting
      const rateLimitKey = `rate_limit:${key}`;

      const now = Date.now();
      const resetTime = now + finalConfig.windowMs;
      const windowSeconds = Math.ceil(finalConfig.windowMs / 1000);

      // Try to get existing entry from Redis
      const existingEntry = (await kvInstance.get(rateLimitKey)) as RateLimitEntry | null;

      let entry: RateLimitEntry;

      if (!existingEntry || existingEntry.resetTime < now) {
        // Create new entry
        entry = {
          count: 1,
          resetTime: resetTime,
        };
        // Set with TTL (time-to-live) in seconds
        await kvInstance.set(rateLimitKey, entry, { ex: windowSeconds });
      } else {
        // Increment existing entry
        entry = {
          count: existingEntry.count + 1,
          resetTime: existingEntry.resetTime,
        };
        // Calculate remaining TTL
        const remainingMs = entry.resetTime - now;
        const remainingSeconds = Math.ceil(remainingMs / 1000);

        if (remainingSeconds > 0) {
          await kvInstance.set(rateLimitKey, entry, { ex: remainingSeconds });
        }
      }

      // Check if limit exceeded
      const isAllowed = entry.count <= finalConfig.maxRequests;
      const remaining = Math.max(0, finalConfig.maxRequests - entry.count);

      return {
        isAllowed,
        limit: finalConfig.maxRequests,
        remaining,
        reset: entry.resetTime,
      };
    } catch (error) {
      // If Redis is unavailable, fail open (allow request) but log the error
      console.error('Rate limiting error:', error);

      // In production, you might want to fail closed (deny request) instead
      // For now, we'll fail open to avoid blocking legitimate users if Redis is down
      return {
        isAllowed: true,
        limit: finalConfig.maxRequests,
        remaining: finalConfig.maxRequests,
        reset: Date.now() + finalConfig.windowMs,
      };
    }
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