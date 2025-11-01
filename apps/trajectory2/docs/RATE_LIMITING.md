# Rate Limiting Configuration

## Overview
The application uses Redis-based rate limiting via Vercel KV to protect API endpoints from abuse. This replaces the previous in-memory implementation which was incompatible with serverless environments.

## Setup Requirements

### 1. Vercel KV Setup
The application requires Vercel KV (Redis) for rate limiting. To set this up:

1. Go to your Vercel Dashboard
2. Navigate to the "Storage" tab
3. Create a new KV database
4. Connect it to your project
5. Vercel will automatically add the required environment variables:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 2. Local Development
For local development, you have two options:

#### Option A: Use Vercel KV (Recommended)
```bash
# Pull environment variables from Vercel
vercel env pull .env.local
```

#### Option B: Use Local Redis
If you prefer local Redis:
1. Install Redis locally
2. Update `.env.local`:
```env
KV_REST_API_URL=http://localhost:8079
KV_REST_API_TOKEN=local_token
```

## Rate Limiting Configurations

Different endpoints have different rate limits:

| Endpoint Type | Max Requests | Window |
|--------------|--------------|---------|
| Auth | 5 | 5 minutes |
| Password Reset | 3 | 15 minutes |
| Email Verification | 5 | 10 minutes |
| Webhooks | 100 | 1 minute |
| Admin | 30 | 1 minute |
| General API | 60 | 1 minute |

## Implementation Details

The rate limiting is implemented in `/src/lib/rate-limit.ts` and uses:
- Redis for distributed state management
- TTL (Time-To-Live) for automatic cleanup
- IP-based tracking (supports various proxy headers)
- Graceful degradation if Redis is unavailable

## Usage Example

```typescript
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

// In your API route
const limiter = rateLimit(rateLimitConfigs.auth);
const { isAllowed, remaining, reset } = await limiter(request);

if (!isAllowed) {
  return createRateLimitResponse(reset);
}
```

## Monitoring

Monitor rate limiting effectiveness through:
- Vercel KV dashboard for Redis metrics
- Application logs for rate limit violations
- Response headers (`X-RateLimit-*`) for debugging

## Troubleshooting

### "Rate limiting error" in logs
This indicates Redis connection issues. Check:
1. Vercel KV environment variables are set
2. KV database is active
3. Network connectivity to Redis

### Rate limits not working
1. Verify Redis is connected: Check Vercel dashboard
2. Check environment variables are loaded
3. Review application logs for errors

## Security Considerations

- Rate limiting fails open (allows requests) if Redis is down to avoid blocking legitimate users
- Consider failing closed for highly sensitive endpoints
- IP-based tracking may be bypassed by distributed attacks
- Consider additional protections like CAPTCHA for critical endpoints