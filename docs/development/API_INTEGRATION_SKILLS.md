# API Integration Skills - Trajectory Project

> **The Veteran's Guide to Working with External Services**

## Core Principle

> "APIs are contracts. Understand the contract, handle failures gracefully, never trust external services."

---

## Trajectory's API Integrations

### Current Integrations

1. **Supabase** - Database, Auth, Storage
2. **Resend** - Email delivery
3. **Square** - Payment processing
4. **OpenAI** (future) - AI-powered coaching

### Integration Architecture

```
User Browser
    ↓
Next.js App (trajectorygroup.org)
    ↓
API Routes (/api/*)
    ↓
External APIs (Supabase, Resend, Square)
```

**Key Point:** Never call external APIs directly from client. Always use API routes.

---

## Skill 1: Understanding API Basics

### What is an API?

An API (Application Programming Interface) is how your app talks to external services.

**Example: Sending an email via Resend**

```typescript
// Your app says: "Hey Resend, send this email"
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'noreply@trajectorygroup.org',
    to: 'user@example.com',
    subject: 'Welcome to Trajectory',
    html: '<h1>Welcome!</h1>'
  })
});

// Resend responds: "Got it, email sent" (or "Failed")
const data = await response.json();
```

### HTTP Methods (Verbs)

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | Get user profile |
| POST | Create data | Submit assessment |
| PUT | Update entire resource | Update user profile |
| PATCH | Update part of resource | Update user email only |
| DELETE | Delete data | Delete account |

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check your data |
| 401 | Unauthorized | Check auth token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Check URL |
| 500 | Server Error | External service broken |

---

## Skill 2: Supabase API Patterns

### Authentication

```typescript
import { createClient } from '@/utils/supabase/server';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      name: 'John Doe'
    }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

### Database Queries

```typescript
// SELECT (Read)
const { data, error } = await supabase
  .from('courses')
  .select('*');

// SELECT with filter
const { data, error } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });

// INSERT (Create)
const { data, error } = await supabase
  .from('assessment_results')
  .insert({
    user_id: userId,
    score: 85,
    answers: { q1: 'a', q2: 'b' }
  })
  .select()
  .single();

// UPDATE
const { error } = await supabase
  .from('user_progress')
  .update({ current_lesson: 5 })
  .eq('user_id', userId);

// DELETE
const { error } = await supabase
  .from('assessment_results')
  .delete()
  .eq('id', resultId);
```

### Error Handling

```typescript
const { data, error } = await supabase
  .from('courses')
  .select('*');

if (error) {
  console.error('Supabase error:', error);
  
  // Common errors:
  if (error.code === 'PGRST116') {
    // No rows found (not really an error)
    return { data: [] };
  }
  
  if (error.message.includes('RLS')) {
    // Row Level Security blocking access
    return { error: 'Unauthorized' };
  }
  
  // Generic error
  return { error: 'Database error' };
}

return { data };
```

---

## Skill 3: Resend Email API

### Sending Emails

```typescript
// src/app/api/email/send/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { to, subject, html } = await request.json();
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Trajectory <noreply@trajectorygroup.org>',
      to: to,
      subject: subject,
      html: html
    });
    
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Using React Email Templates

```typescript
// src/emails/assessment-complete.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

export default function AssessmentCompleteEmail({ name, score }: { name: string; score: number }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text>Hi {name},</Text>
          <Text>Your assessment is complete! Your score: {score}</Text>
          <Button href="https://trajectorygroup.org/results">View Results</Button>
        </Container>
      </Body>
    </Html>
  );
}

// Sending the template
import { render } from '@react-email/render';
import AssessmentCompleteEmail from '@/emails/assessment-complete';

const html = render(AssessmentCompleteEmail({ name: 'John', score: 85 }));

await resend.emails.send({
  from: 'Trajectory <noreply@trajectorygroup.org>',
  to: 'user@example.com',
  subject: 'Assessment Complete',
  html: html
});
```

### Common Issues

**Issue: Emails not sending**
```typescript
// Check 1: API key is set
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY not set');
}

// Check 2: Domain is verified
// Go to Resend dashboard → Domains
// Verify trajectorygroup.org is verified

// Check 3: From address matches verified domain
from: 'noreply@trajectorygroup.org'  // ✅ Correct
from: 'noreply@gmail.com'  // ❌ Wrong - not your domain
```

**Issue: Emails going to spam**
```typescript
// Solution: Add SPF, DKIM, DMARC records
// Resend dashboard → Domains → DNS Settings
// Copy the DNS records
// Add to your domain registrar (e.g., Namecheap, GoDaddy)
```

---

## Skill 4: Square Payment API

### Creating a Payment

```typescript
// src/app/api/payment/create/route.ts
import { Client, Environment } from 'square';
import { NextRequest, NextResponse } from 'next/server';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox
});

export async function POST(request: NextRequest) {
  const { amount, currency, sourceId } = await request.json();
  
  try {
    const { result } = await client.paymentsApi.createPayment({
      sourceId: sourceId,  // Payment method from Square Web SDK
      amountMoney: {
        amount: amount,  // Amount in cents (e.g., 9900 = $99.00)
        currency: currency  // e.g., 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      idempotencyKey: crypto.randomUUID()  // Prevent duplicate charges
    });
    
    return NextResponse.json({ 
      success: true, 
      paymentId: result.payment?.id 
    });
  } catch (error) {
    console.error('Square payment error:', error);
    return NextResponse.json({ 
      error: 'Payment failed' 
    }, { status: 500 });
  }
}
```

### Handling Webhooks

```typescript
// src/app/api/webhook/square/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-square-signature');
  
  // Verify webhook signature (security)
  const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const hash = crypto
    .createHmac('sha256', webhookSignatureKey)
    .update(body)
    .digest('base64');
  
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Parse webhook event
  const event = JSON.parse(body);
  
  // Handle different event types
  switch (event.type) {
    case 'payment.created':
      // Payment successful
      await handlePaymentSuccess(event.data.object.payment);
      break;
      
    case 'payment.failed':
      // Payment failed
      await handlePaymentFailure(event.data.object.payment);
      break;
      
    default:
      console.log('Unhandled webhook event:', event.type);
  }
  
  return NextResponse.json({ success: true });
}

async function handlePaymentSuccess(payment: any) {
  // Grant user access to premium content
  const { error } = await supabase
    .from('users')
    .update({ is_premium: true })
    .eq('id', payment.buyer_email_address);
  
  // Send confirmation email
  await sendPaymentConfirmationEmail(payment);
}
```

### Testing Payments

```typescript
// Use Square sandbox for testing
// .env.local
SQUARE_ENVIRONMENT=sandbox
SQUARE_ACCESS_TOKEN=sandbox-token

// Test card numbers:
// Success: 4111 1111 1111 1111
// Decline: 4000 0000 0000 0002
// CVV: Any 3 digits
// Expiry: Any future date
// ZIP: Any 5 digits
```

---

## Skill 5: API Route Patterns

### Basic API Route

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Authenticated API Route

```typescript
// src/app/api/protected/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // User is authenticated, proceed
  return NextResponse.json({ message: 'Protected data', userId: user.id });
}
```

### Error Handling Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    // Validate input
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    // Process request
    const result = await someOperation(body);
    
    // Return success
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    // Log error (server-side only)
    console.error('API error:', error);
    
    // Return generic error (don't expose internals)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
```

### Rate Limiting Pattern

```typescript
// src/app/api/rate-limited/route.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const limit = 10;  // 10 requests
  const window = 60000;  // per minute
  
  const userLimit = rateLimitMap.get(ip);
  
  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= limit) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded' 
        }, { status: 429 });
      }
      userLimit.count++;
    } else {
      // Reset window
      rateLimitMap.set(ip, { count: 1, resetTime: now + window });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + window });
  }
  
  // Process request
  return NextResponse.json({ success: true });
}
```

---

## Skill 6: Testing API Integrations

### Using Postman/Insomnia

```bash
# Test your API routes locally

# GET request
GET http://localhost:3003/api/courses
Headers:
  Content-Type: application/json

# POST request
POST http://localhost:3003/api/assessment/submit
Headers:
  Content-Type: application/json
Body:
{
  "answers": { "q1": "a", "q2": "b" },
  "userId": "abc123"
}
```

### Using curl (Terminal)

```bash
# GET request
curl http://localhost:3003/api/courses

# POST request
curl -X POST http://localhost:3003/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":{"q1":"a","q2":"b"},"userId":"abc123"}'

# With authentication
curl http://localhost:3003/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using fetch (Browser Console)

```javascript
// Test from browser console
fetch('http://localhost:3003/api/courses')
  .then(r => r.json())
  .then(data => console.log(data));

// POST request
fetch('http://localhost:3003/api/assessment/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers: { q1: 'a', q2: 'b' } })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## Skill 7: Debugging API Issues

### Issue: API route returns 404

```bash
# Problem: Route file in wrong location or named incorrectly

# Check file structure
ls -la src/app/api/your-route/

# Should have:
src/app/api/your-route/route.ts  # NOT page.ts, NOT index.ts

# Restart dev server
# Ctrl+C, then npm run dev
```

### Issue: API returns 500 error

```typescript
// Add detailed logging
export async function POST(request: NextRequest) {
  try {
    console.log('1. Request received');
    
    const body = await request.json();
    console.log('2. Body parsed:', body);
    
    const result = await someOperation(body);
    console.log('3. Operation complete:', result);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ERROR:', error);  // Check terminal for this
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Check terminal output to see where it fails
```

### Issue: CORS error

```typescript
// Add CORS headers to API route
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

// Handle OPTIONS preflight request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
```

### Issue: External API call failing

```typescript
// Add timeout and retry logic
async function callExternalAPI(url: string, options: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);  // 5s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));  // Wait 1s before retry
    }
  }
}
```

---

## Skill 8: API Security Best Practices

### Never Expose API Keys in Client

```typescript
// ❌ BAD: API key in client code
'use client';
const apiKey = 'sk_live_abc123';  // NEVER DO THIS

// ✅ GOOD: API key in server-only code
// src/app/api/route.ts
const apiKey = process.env.SECRET_API_KEY;  // Server-only
```

### Validate All Inputs

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate required fields
  if (!body.email || !body.password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  
  // Validate password strength
  if (body.password.length < 8) {
    return NextResponse.json({ error: 'Password too short' }, { status: 400 });
  }
  
  // Proceed with validated data
}
```

### Use Environment-Specific Keys

```bash
# .env.local (development)
SQUARE_ACCESS_TOKEN=sandbox-token
SQUARE_ENVIRONMENT=sandbox

# Vercel (production)
SQUARE_ACCESS_TOKEN=production-token
SQUARE_ENVIRONMENT=production
```

### Sanitize User Input

```typescript
import DOMPurify from 'isomorphic-dompurify';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Sanitize HTML input (prevent XSS)
  const cleanHTML = DOMPurify.sanitize(body.content);
  
  // Escape SQL-like patterns (though Supabase handles this)
  const cleanText = body.text.replace(/['"]/g, '');
  
  // Proceed with sanitized data
}
```

---

## Common API Integration Patterns

### Pattern 1: Assessment Submission

```typescript
// Client submits assessment
// src/app/assessment/page.tsx
'use client';

async function submitAssessment(answers: any) {
  const response = await fetch('/api/assessment/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });
  
  if (!response.ok) {
    throw new Error('Submission failed');
  }
  
  return response.json();
}

// API route processes and saves
// src/app/api/assessment/submit/route.ts
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { answers } = await request.json();
  const score = calculateScore(answers);
  
  const { data, error } = await supabase
    .from('assessment_results')
    .insert({
      user_id: user.id,
      answers,
      score,
      completed_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
  
  // Send email notification
  await sendAssessmentCompleteEmail(user.email, score);
  
  return NextResponse.json({ success: true, data });
}
```

### Pattern 2: Payment Flow

```typescript
// 1. Client initiates payment
// src/app/checkout/page.tsx
'use client';

async function handlePayment(paymentMethod: any) {
  // Create payment on server
  const response = await fetch('/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 9900,  // $99.00
      currency: 'USD',
      sourceId: paymentMethod.token
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Redirect to success page
    window.location.href = '/checkout/success';
  } else {
    // Show error
    alert('Payment failed');
  }
}

// 2. Server processes payment
// src/app/api/payment/create/route.ts
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { amount, currency, sourceId } = await request.json();
  
  // Process payment with Square
  const payment = await squareClient.paymentsApi.createPayment({
    sourceId,
    amountMoney: { amount, currency },
    locationId: process.env.SQUARE_LOCATION_ID,
    idempotencyKey: crypto.randomUUID()
  });
  
  // Save payment record
  await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      amount,
      currency,
      payment_id: payment.result.payment?.id,
      status: 'completed'
    });
  
  // Grant premium access
  await supabase
    .from('users')
    .update({ is_premium: true })
    .eq('id', user.id);
  
  // Send confirmation email
  await sendPaymentConfirmationEmail(user.email, amount);
  
  return NextResponse.json({ success: true });
}
```

---

## API Integration Checklist

### Before Integrating New API

- [ ] Read API documentation thoroughly
- [ ] Understand authentication method (API key, OAuth, etc.)
- [ ] Check rate limits (requests per minute/hour)
- [ ] Test in sandbox/development mode first
- [ ] Understand error responses
- [ ] Know webhook requirements (if applicable)
- [ ] Check pricing (free tier, paid plans)
- [ ] Verify SLA/uptime guarantees

### After Integration

- [ ] Test all success scenarios
- [ ] Test all error scenarios
- [ ] Add proper error handling
- [ ] Add logging for debugging
- [ ] Add retry logic for transient failures
- [ ] Add timeout handling
- [ ] Document integration in codebase
- [ ] Add monitoring/alerts

---

## Remember

> "APIs fail. Networks fail. External services fail. Your code should handle failure gracefully."

Every API integration is a potential point of failure. Always have fallbacks, always log errors, always handle edge cases.

**Integrate carefully. Test thoroughly. Handle failures gracefully.**

🔌 **Happy Integrating!**

