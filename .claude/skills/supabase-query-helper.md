# Supabase Query Helper Skill

This skill provides quick reference for Supabase queries in the Trajectory project.

## When to Use This Skill

Use this when you need to query or modify data in Supabase.

## Database Tables

From the schema in `/database/schemas/`:

**assessments**:
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `answers` (jsonb)
- `domain_scores` (jsonb)
- `avatar` (text: 'Drifter' | 'Balancer' | 'Architect')
- `score` (numeric)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**purchases**:
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `email` (text)
- `product` (text: 'course' | 'coaching')
- `amount_cents` (integer)
- `square_payment_id` (text)
- `status` (text)
- `created_at` (timestamp)

**user_progress**:
- `id` (uuid, primary key)
- `user_id` (uuid)
- `module_id` (text)
- `completed` (boolean)
- `progress_percentage` (integer)
- `last_accessed` (timestamp)

## Client Initialization

**Browser Client** (for client components):
```typescript
import { createClient } from '@/utils/supabase/client';

const supabase = createClient(); // Singleton
```

**Server Client** (for server components/API routes):
```typescript
import { createClient } from '@/utils/supabase/server';

const supabase = await createClient(); // Async!
```

## Common Query Patterns

**Insert Assessment**:
```typescript
const { data, error } = await supabase
  .from('assessments')
  .insert({
    user_id: user?.id || null,
    answers: { q1: 5, q2: 3, ... },
    domain_scores: { identity: 4.2, health: 3.8, ... },
    avatar: 'Architect',
    score: 4.1
  })
  .select()
  .single();
```

**Get User's Latest Assessment**:
```typescript
const { data, error } = await supabase
  .from('assessments')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();
```

**Check Purchase Exists**:
```typescript
const { data, error } = await supabase
  .from('purchases')
  .select('*')
  .eq('user_id', user.id)
  .eq('product', 'course')
  .eq('status', 'completed')
  .maybeSingle(); // Returns null instead of error if not found
```

**Update User Progress**:
```typescript
const { data, error } = await supabase
  .from('user_progress')
  .upsert({
    user_id: user.id,
    module_id: 'module-1',
    completed: true,
    progress_percentage: 100,
    last_accessed: new Date().toISOString()
  }, {
    onConflict: 'user_id,module_id'
  });
```

**Grant Premium Access** (Service Role Required):
```typescript
// Only use in API routes with service role
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
  userId,
  {
    user_metadata: {
      has_course_access: true,
      course_purchase_date: new Date().toISOString(),
      course_payment_id: paymentId
    }
  }
);
```

## Authentication Patterns

**Get Current User** (client):
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

**Get Current User** (server):
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

**Sign Up**:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
  }
});
```

**Sign In**:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
});
```

**Sign Out**:
```typescript
await supabase.auth.signOut();
```

## Error Handling

```typescript
const { data, error } = await supabase
  .from('assessments')
  .select('*');

if (error) {
  console.error('Supabase error:', error);
  // Handle error appropriately
  throw new Error(`Failed to fetch assessments: ${error.message}`);
}

// Use data safely
```

## Row Level Security (RLS)

The database has RLS enabled. Policies ensure:
- Users can only see their own assessments
- Users can only see their own purchases
- User progress is private

When using service role (admin client), RLS is bypassed. Use with caution!

## Checklist

- [ ] Using correct client (browser vs server)
- [ ] Handling errors properly
- [ ] Using TypeScript types from `@/lib/supabase-types`
- [ ] Respecting RLS policies
- [ ] Not exposing service role key to client
- [ ] Using `.single()` when expecting one result
- [ ] Using `.maybeSingle()` when result might not exist
