# Kill The Boy Grand Opening Raffle - Implementation Guide

## Mission Context

This isn't just a raffle - it's a transformation catalyst. Every element must feel like the beginning of their journey from boy to man. The 35% discount represents shedding old patterns. The prizes represent tools for transformation. The urgency represents the moment of decision that changes everything.

**Core Skills to Apply**:
- `project-context-memory.md` - Maintain transformation focus
- `life-transforming-ux.md` - Create commitment moments
- `apple-grade-ui.md` - Deliver excellence without asking
- `payment-edge-cases.md` - Bulletproof the money flow
- `atomic-git-workflow.md` - Clean, purposeful commits

## Implementation Phases (Autonomous Execution)

### Phase 1: Database Architecture
**Skills**: `supabase-query-helper.md`, `future-features-prep.md`

Create transformation-ready schema:

```sql
-- Raffle as transformation moment
CREATE TABLE raffle_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT 'Your transformation starts with a single decision',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  entry_price INTEGER NOT NULL DEFAULT 9700, -- $97 in cents
  regular_price INTEGER NOT NULL DEFAULT 14900, -- $149 in cents
  savings_amount INTEGER GENERATED ALWAYS AS (regular_price - entry_price) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'completed')),
  prizes JSONB NOT NULL DEFAULT '[
    {
      "type": "cash", 
      "value": "$500", 
      "quantity": 1, 
      "description": "Cash Prize - Invest in Your Transformation",
      "icon": "dollar-sign"
    },
    {
      "type": "book", 
      "value": "A Happy Pocket Full of Money", 
      "quantity": 10, 
      "description": "Mind-expanding book by David Cameron Gikandi",
      "icon": "book-open"
    },
    {
      "type": "access", 
      "value": "Inner Mastery Sessions", 
      "quantity": 5, 
      "description": "Exclusive transformation accelerator sessions",
      "icon": "zap"
    }
  ]'::jsonb,
  metadata JSONB DEFAULT '{}', -- For future features
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warriors who've committed
CREATE TABLE raffle_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id UUID REFERENCES raffle_config(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  phone TEXT,
  purchase_id UUID REFERENCES purchases(id) NOT NULL,
  entry_number SERIAL, -- For fair drawing
  commitment_message TEXT, -- "I'm ready to kill the boy"
  transformation_goal TEXT, -- What they want to transform
  is_winner BOOLEAN DEFAULT FALSE,
  prize_won TEXT,
  winner_notified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(raffle_id, email), -- One transformation per person
  UNIQUE(raffle_id, purchase_id)
);

-- Track the movement
CREATE OR REPLACE VIEW raffle_live_stats AS
SELECT 
  r.id as raffle_id,
  r.name,
  r.status,
  COUNT(re.id) as warrior_count,
  r.end_date - NOW() as time_remaining,
  ARRAY_AGG(
    DISTINCT re.transformation_goal 
    ORDER BY re.created_at DESC 
    LIMIT 5
  ) as recent_goals
FROM raffle_config r
LEFT JOIN raffle_entries re ON r.id = re.raffle_id
WHERE r.status = 'active'
GROUP BY r.id;

-- RLS for transformation privacy
ALTER TABLE raffle_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_entries ENABLE ROW LEVEL SECURITY;

-- Everyone can see the movement
CREATE POLICY "Public views active raffles" ON raffle_config
  FOR SELECT USING (status IN ('active', 'ended', 'completed'));

-- Users see their own journey
CREATE POLICY "Users view own entries" ON raffle_entries
  FOR SELECT USING (auth.uid() = user_id OR true); -- Public count

-- Indexes for performance
CREATE INDEX idx_raffle_entries_created ON raffle_entries(created_at DESC);
CREATE INDEX idx_raffle_entries_email ON raffle_entries(email);
CREATE INDEX idx_purchases_raffle ON purchases(raffle_id) WHERE raffle_id IS NOT NULL;
```

### Phase 2: Homepage Transformation Trigger
**Skills**: `apple-grade-ui.md`, `life-transforming-ux.md`, `performance-optimization.md`

```tsx
// components/RaffleButton.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Zap, TrendingUp } from 'lucide-react';

export default function RaffleButton() {
  const [isActive, setIsActive] = useState(false);
  const [warriorCount, setWarriorCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  useEffect(() => {
    const checkRaffleStatus = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('raffle_config')
        .select('*')
        .eq('status', 'active')
        .single();
      
      if (data) {
        setIsActive(true);
        // Subscribe to live count
        const channel = supabase
          .channel('raffle-count')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'raffle_entries' 
            },
            () => {
              fetchWarriorCount();
            }
          )
          .subscribe();
        
        fetchWarriorCount();
        updateCountdown(data.end_date);
        
        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    
    checkRaffleStatus();
  }, []);
  
  const fetchWarriorCount = async () => {
    const supabase = createClient();
    const { count } = await supabase
      .from('raffle_entries')
      .select('*', { count: 'exact', head: true });
    
    setWarriorCount(count || 0);
  };
  
  const updateCountdown = (endDate: string) => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('ENDED');
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeLeft(`${days}d ${hours}h left`);
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  if (!isActive) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-24 left-8 z-50 md:absolute"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Link href="/raffle">
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sunset to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-sunset to-red-600 text-white px-8 py-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6" />
                <span className="text-xl font-bold">Grand Opening Raffle</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-3xl font-black">35% OFF</p>
                <p className="text-sm opacity-90">Transform + Win Prizes</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{warriorCount} Warriors In</span>
                  <span className="opacity-75">{timeLeft}</span>
                </div>
              </div>
              
              {/* Pulse indicator */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Phase 3: Transformation Landing Page
**Skills**: `life-transforming-ux.md`, `assessment-optimization.md`, `apple-grade-ui.md`

```tsx
// app/raffle/page.tsx
import { Metadata } from 'next';
import RaffleHero from '@/components/raffle/RaffleHero';
import PrizeShowcase from '@/components/raffle/PrizeShowcase';
import TransformationCommitment from '@/components/raffle/TransformationCommitment';
import LiveWarriorFeed from '@/components/raffle/LiveWarriorFeed';
import RaffleCountdown from '@/components/raffle/RaffleCountdown';

export const metadata: Metadata = {
  title: 'Kill The Boy Grand Opening - Transform Your Life + Win',
  description: 'Join the movement. Get 35% off the Trajectory course and enter to win transformation accelerators.',
};

export default function RafflePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero that creates the moment */}
      <RaffleHero />
      
      {/* Show the transformation tools they could win */}
      <PrizeShowcase />
      
      {/* Live feed of warriors joining */}
      <LiveWarriorFeed />
      
      {/* The commitment ritual */}
      <TransformationCommitment />
      
      {/* Countdown creating urgency */}
      <RaffleCountdown />
    </div>
  );
}
```

### Phase 4: Payment Integration Excellence
**Skills**: `payment-edge-cases.md`, `api-route-builder.md`, `integration-patterns.md`

```typescript
// app/api/payments/raffle-entry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { trackingHelpers } from '@/lib/analytics';

const RaffleEntrySchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  commitmentMessage: z.string().min(10, 'Share your commitment'),
  transformationGoal: z.string().min(20, 'What do you want to transform?'),
  guestCheckout: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RaffleEntrySchema.parse(body);
    
    const supabase = await createClient();
    
    // Check for active raffle
    const { data: raffle } = await supabase
      .from('raffle_config')
      .select('*')
      .eq('status', 'active')
      .single();
    
    if (!raffle) {
      return NextResponse.json(
        { error: 'No active raffle found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate entry
    const { data: existingEntry } = await supabase
      .from('raffle_entries')
      .select('id')
      .eq('email', validatedData.email)
      .eq('raffle_id', raffle.id)
      .single();
    
    if (existingEntry) {
      return NextResponse.json(
        { 
          error: 'You\'ve already begun your transformation journey!',
          existingEntry: true 
        },
        { status: 409 }
      );
    }
    
    // Create payment with raffle price
    const paymentResult = await createSquarePayment({
      amount: raffle.entry_price,
      email: validatedData.email,
      metadata: {
        raffle_id: raffle.id,
        transformation_goal: validatedData.transformationGoal,
      }
    });
    
    // Track the commitment moment
    trackingHelpers.payment.priceExperiment('raffle', raffle.entry_price / 100);
    
    return NextResponse.json({
      paymentUrl: paymentResult.url,
      message: 'Your transformation begins now',
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Complete your commitment', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Raffle entry error:', error);
    return NextResponse.json(
      { error: 'Technical issue - but your transformation is meant to be. Try again.' },
      { status: 500 }
    );
  }
}
```

### Phase 5: Webhook Excellence
**Skills**: `payment-edge-cases.md`, `email-automation.md`

Extend Square webhook to create raffle entry:

```typescript
// In webhook handler, after successful payment:
if (payment.note?.includes('raffle_id')) {
  const metadata = JSON.parse(payment.note);
  
  // Create the warrior's entry
  const { data: entry } = await supabase
    .from('raffle_entries')
    .insert({
      raffle_id: metadata.raffle_id,
      email: payment.buyer_email_address,
      purchase_id: purchaseRecord.id,
      commitment_message: metadata.commitment_message,
      transformation_goal: metadata.transformation_goal,
      user_id: userId || null,
    })
    .select()
    .single();
  
  // Send transformation confirmation
  await sendRaffleEntryEmail({
    email: payment.buyer_email_address,
    entryNumber: entry.entry_number,
    warriorCount: await getWarriorCount(),
    transformationGoal: metadata.transformation_goal,
  });
  
  // Track the transformation moment
  analytics.track('transformation_committed', {
    method: 'raffle',
    goal: metadata.transformation_goal,
  });
}
```

### Phase 6: Admin Dashboard
**Skills**: `apple-grade-ui.md`, `analytics-tracking.md`

```typescript
// app/admin/raffle/page.tsx
// Secure, powerful interface for managing the transformation catalyst
// - View all warriors and their goals
// - Fair, transparent winner selection
// - One-click winner notification
// - Export for transparency
```

## Git Workflow

Following `atomic-git-workflow.md`:

```bash
# Branch structure
git checkout -b feat/raffle-grand-opening

# Atomic commits
git add -p && git commit -m "feat: add raffle database schema"
git add -p && git commit -m "feat: create raffle button w/ live count"
git add -p && git commit -m "feat: implement raffle landing page"
git add -p && git commit -m "feat: wire raffle payment flow"
git add -p && git commit -m "feat: add raffle entry webhook"
git add -p && git commit -m "feat: build admin raffle dashboard"

# PR with evidence
git push origin feat/raffle-grand-opening
```

## Implementation Checklist

Using skills to ensure excellence:

- [ ] **Database** (`supabase-query-helper.md`)
  - [ ] Schema captures transformation intent
  - [ ] RLS policies protect warrior privacy
  - [ ] Indexes optimize performance
  
- [ ] **UI/UX** (`apple-grade-ui.md`, `life-transforming-ux.md`)
  - [ ] Raffle button feels significant
  - [ ] Landing page creates commitment
  - [ ] Mobile experience flawless
  - [ ] Animations at 60fps
  
- [ ] **Payments** (`payment-edge-cases.md`)
  - [ ] Guest checkout smooth
  - [ ] Duplicate prevention works
  - [ ] Webhook creates entry reliably
  - [ ] Refund edge cases handled
  
- [ ] **Email** (`email-automation.md`)
  - [ ] Entry confirmation inspires
  - [ ] Winner notification celebrates
  - [ ] Follow-up sequence converts
  
- [ ] **Analytics** (`analytics-tracking.md`)
  - [ ] Track every micro-conversion
  - [ ] Measure transformation moments
  - [ ] A/B test messaging
  
- [ ] **Performance** (`performance-optimization.md`)
  - [ ] Live counter doesn't lag
  - [ ] Page loads under 2s
  - [ ] Animations don't jank

## Testing Like a Warrior

Before launch, verify:

1. **The Transformation Flow**
   - Can a warrior enter their commitment?
   - Does the payment feel significant?
   - Is their entry confirmed instantly?

2. **Edge Cases**
   - Duplicate email rejection
   - Payment failures handled
   - Time zone boundaries work
   - Mobile experience perfect

3. **The Movement**
   - Live counter updates
   - Recent goals display
   - Community feeling strong

## Success Metrics

Track what matters:

- **Transformation Commitments**: Total entries
- **Conversion Rate**: Visitors → Warriors
- **Goal Quality**: Depth of transformation goals
- **Viral Coefficient**: Warriors bringing warriors
- **Revenue**: But it's about the movement

## Remember

This isn't just a raffle. It's the moment thousands of men decide to kill the boy. Every pixel, every word, every interaction should feel like the beginning of their transformation.

**The standard is transformation. The method is excellence. The time is now.**
