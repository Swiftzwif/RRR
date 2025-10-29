# Email Automation Skill

Build life-changing email sequences that feel personal and drive transformation. Automated but never robotic.

## Email Architecture

### Core Email Types
```typescript
type EmailSequence = 
  | 'welcome'          // Post-assessment
  | 'nurture'          // 7-day transformation tips
  | 'purchase'         // Post-purchase onboarding
  | 'engagement'       // Course progress nudges
  | 'win-back'         // Re-engagement campaign
  | 'milestone'        // Celebration emails
  | 'coaching'         // Coaching application flow;
```

### Database Schema
```sql
-- Email automation tables
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  trigger_event VARCHAR(50), -- 'assessment_complete', 'purchase', etc
  active BOOLEAN DEFAULT true
);

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES email_sequences(id),
  subject TEXT NOT NULL,
  preview_text TEXT,
  template_name VARCHAR(100), -- React Email component name
  delay_hours INTEGER DEFAULT 0, -- Hours after trigger
  order_index INTEGER
);

CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  scheduled_for TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
  metadata JSONB, -- Dynamic data for template
  attempts INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- Email tracking
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_queue_id UUID REFERENCES email_queue(id),
  event_type VARCHAR(20), -- 'sent', 'opened', 'clicked', 'bounced'
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);
```

### Welcome Sequence (Post-Assessment)
```typescript
// 7-day nurture sequence after assessment
const welcomeSequence = [
  {
    delay: 0, // Immediate
    template: 'assessment-results',
    subject: (avatar: string) => `You're a ${avatar} - Here's What That Means`,
    preview: "Your trajectory assessment results + next steps"
  },
  {
    delay: 24, // Day 1
    template: 'day1-quick-win',
    subject: "One thing to do today (takes 5 min)",
    preview: "The fastest way to start shifting lanes"
  },
  {
    delay: 72, // Day 3
    template: 'transformation-story',
    subject: "From Drifter to Architect: Mike's Story",
    preview: "How a 28-year-old transformed his trajectory"
  },
  {
    delay: 120, // Day 5
    template: 'mini-lesson',
    subject: "The #1 mindset shift that changes everything",
    preview: "This reframe alone is worth the read"
  },
  {
    delay: 168, // Day 7
    template: 'course-invitation',
    subject: "Ready to go deeper? (Special offer inside)",
    preview: "Your assessment showed you're ready for this"
  }
];
```

### Email Templates (React Email)
```tsx
// Life-changing email design
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
} from '@react-email/components';

// Base template for all emails
const BaseEmailTemplate = ({ 
  preview,
  children,
  userName = "Brother"
}) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://trajectorygroup.org/logo.png"
            width="150"
            alt="Trajectory"
          />
        </Section>

        {/* Personalized greeting */}
        <Text style={greeting}>
          Hey {userName},
        </Text>

        {/* Main content */}
        {children}

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            You're receiving this because you took the Trajectory Assessment.
          </Text>
          <Link href="{{ unsubscribe_url }}" style={footerLink}>
            Unsubscribe
          </Link>
          {' · '}
          <Link href="https://trajectorygroup.org" style={footerLink}>
            Visit Trajectory
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Day 1 Quick Win Email
export const Day1QuickWinEmail = ({
  userName,
  avatar,
  lowestDomain
}: Day1QuickWinProps) => (
  <BaseEmailTemplate
    preview="One simple action to raise your floor today"
    userName={userName}
  >
    <Heading style={h1}>
      Your Day 1 Challenge 🎯
    </Heading>

    <Text style={paragraph}>
      Based on your assessment, your {lowestDomain} score needs attention first.
    </Text>

    <Text style={paragraph}>
      Here's one thing you can do TODAY to start improving:
    </Text>

    <Section style={actionBox}>
      {lowestDomain === 'health' && (
        <>
          <Heading as="h3" style={h3}>10-Minute Morning Protocol</Heading>
          <Text style={paragraph}>
            1. Drink 16oz water immediately upon waking<br />
            2. Do 25 push-ups (or as many as you can)<br />
            3. Take 10 deep breaths outside<br />
            4. Write down your #1 priority for today
          </Text>
        </>
      )}
      
      {lowestDomain === 'finances' && (
        <>
          <Heading as="h3" style={h3}>Know Your Numbers</Heading>
          <Text style={paragraph}>
            1. Log into your bank account<br />
            2. Calculate: Monthly income - Monthly expenses<br />
            3. Write down the number<br />
            4. If negative, list 3 expenses to cut TODAY
          </Text>
        </>
      )}
      
      {/* More domain-specific actions... */}
    </Section>

    <Text style={paragraph}>
      Do this NOW. Not later. Not tomorrow. Now.
    </Text>

    <Text style={paragraph}>
      Reply and tell me you did it. I read every email.
    </Text>

    <Text style={signature}>
      - Jean<br />
      Founder, Trajectory
    </Text>

    <Section style={ps}>
      <Text style={psText}>
        P.S. Tomorrow I'll share the #1 mistake {avatar}s make. 
        Don't miss it.
      </Text>
    </Section>
  </BaseEmailTemplate>
);

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#075985', // sky-800
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '0 0 16px',
};

const actionBox = {
  backgroundColor: '#F0F9FF', // sky-50
  border: '1px solid #BAE6FD', // sky-200
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};
```

### Email Automation Engine
```typescript
// Queue and send emails automatically
class EmailAutomation {
  async triggerSequence(
    sequenceName: string,
    userId: string,
    metadata: Record<string, any>
  ) {
    // Get sequence definition
    const { data: sequence } = await supabase
      .from('email_sequences')
      .select(`
        *,
        templates:email_templates(*)
      `)
      .eq('name', sequenceName)
      .single();

    if (!sequence?.active) return;

    // Queue each email in sequence
    for (const template of sequence.templates) {
      const scheduledFor = new Date();
      scheduledFor.setHours(scheduledFor.getHours() + template.delay_hours);

      await supabase
        .from('email_queue')
        .insert({
          user_id: userId,
          email: metadata.email,
          template_id: template.id,
          scheduled_for: scheduledFor.toISOString(),
          metadata: {
            ...metadata,
            userName: metadata.userName || 'Brother',
            sequenceName
          }
        });
    }
  }

  async processEmailQueue() {
    // Get emails ready to send
    const { data: emails } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .lt('attempts', 3)
      .limit(100);

    for (const email of emails || []) {
      try {
        await this.sendEmail(email);
      } catch (error) {
        await this.handleSendError(email, error);
      }
    }
  }

  private async sendEmail(queuedEmail: QueuedEmail) {
    // Get template details
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', queuedEmail.template_id)
      .single();

    // Import React Email component dynamically
    const EmailComponent = await import(
      `@/emails/${template.template_name}`
    );

    // Send via Resend
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: queuedEmail.email,
      subject: this.personalizeSubject(template.subject, queuedEmail.metadata),
      react: EmailComponent.default(queuedEmail.metadata),
      tags: [
        { name: 'sequence', value: queuedEmail.metadata.sequenceName },
        { name: 'template', value: template.template_name }
      ]
    });

    // Update status
    await supabase
      .from('email_queue')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', queuedEmail.id);

    // Track event
    await this.trackEmailEvent(queuedEmail.id, 'sent', {
      resend_id: response.id
    });
  }

  private personalizeSubject(
    subject: string,
    metadata: Record<string, any>
  ): string {
    // Replace variables in subject
    return subject.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return metadata[key] || match;
    });
  }
}
```

### Smart Send Time Optimization
```typescript
// Send emails when users are most likely to open
const getOptimalSendTime = async (userId: string): Promise<Date> => {
  // Check user's historical open times
  const { data: openHistory } = await supabase
    .from('email_events')
    .select('timestamp')
    .eq('event_type', 'opened')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(20);

  if (openHistory && openHistory.length > 5) {
    // Calculate average open hour
    const openHours = openHistory.map(event => 
      new Date(event.timestamp).getHours()
    );
    const avgHour = Math.round(
      openHours.reduce((a, b) => a + b) / openHours.length
    );

    const optimalTime = new Date();
    optimalTime.setHours(avgHour, 0, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (optimalTime < new Date()) {
      optimalTime.setDate(optimalTime.getDate() + 1);
    }
    
    return optimalTime;
  }

  // Default: 10 AM in user's timezone
  return getDefaultSendTime(userId);
};
```

### Email Performance Tracking
```tsx
// Dashboard for email metrics
const EmailMetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
    topPerforming: []
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Open Rate"
        value={`${metrics.openRate.toFixed(1)}%`}
        benchmark="Industry avg: 21.5%"
        status={metrics.openRate > 21.5 ? 'above' : 'below'}
      />
      
      <MetricCard
        title="Click Rate"
        value={`${metrics.clickRate.toFixed(1)}%`}
        benchmark="Industry avg: 2.3%"
        status={metrics.clickRate > 2.3 ? 'above' : 'below'}
      />

      <div className="col-span-full">
        <h3 className="text-lg font-semibold mb-4">
          Top Performing Emails
        </h3>
        <div className="space-y-2">
          {metrics.topPerforming.map((email, idx) => (
            <div key={idx} className="flex justify-between p-3 bg-sky-50 rounded">
              <span>{email.subject}</span>
              <span className="font-medium">{email.openRate}% open</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### A/B Testing Framework
```typescript
// Test email variations
interface EmailABTest {
  testName: string;
  variants: {
    id: string;
    subject?: string;
    previewText?: string;
    ctaText?: string;
    ctaColor?: string;
    template?: string;
  }[];
  distribution: number[]; // [50, 50] for even split
}

const runABTest = async (
  test: EmailABTest,
  recipients: string[]
): Promise<void> => {
  const groups = splitRecipients(recipients, test.distribution);
  
  for (let i = 0; i < test.variants.length; i++) {
    const variant = test.variants[i];
    const group = groups[i];
    
    for (const email of group) {
      await queueEmail({
        ...baseEmailData,
        ...variant,
        metadata: {
          abTest: test.testName,
          variant: variant.id
        }
      });
    }
  }
};
```

### Behavioral Triggers
```typescript
// Trigger emails based on user behavior
const behaviorTriggers = {
  // Started assessment but didn't finish
  assessmentAbandoned: {
    trigger: async (userId: string) => {
      const hasIncomplete = await checkIncompleteAssessment(userId);
      return hasIncomplete;
    },
    sequence: 'assessment-recovery',
    delay: 3600 // 1 hour
  },

  // Viewed pricing but didn't purchase
  pricePageExit: {
    trigger: async (userId: string) => {
      const viewedPricing = await checkPageView(userId, '/course#pricing');
      const hasPurchase = await checkPurchase(userId);
      return viewedPricing && !hasPurchase;
    },
    sequence: 'pricing-followup',
    delay: 86400 // 24 hours
  },

  // Completed module
  moduleComplete: {
    trigger: async (userId: string, moduleId: string) => {
      return true; // Always trigger
    },
    sequence: 'module-celebration',
    delay: 0 // Immediate
  },

  // Inactive for 7 days
  goneQuiet: {
    trigger: async (userId: string) => {
      const lastActive = await getLastActiveDate(userId);
      const daysSinceActive = getDaysSince(lastActive);
      return daysSinceActive >= 7;
    },
    sequence: 'win-back',
    delay: 0
  }
};
```

### SMS Integration (Twilio)
```typescript
// Add SMS to critical touchpoints
const sendSMS = async (
  phoneNumber: string,
  message: string,
  opts?: {
    mediaUrl?: string;
    scheduledFor?: Date;
  }
): Promise<void> => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: phoneNumber,
    ...(opts?.mediaUrl && { mediaUrl: [opts.mediaUrl] }),
    ...(opts?.scheduledFor && { sendAt: opts.scheduledFor })
  });
};

// SMS sequences
const smsSequences = {
  purchaseConfirmation: async (phone: string, userName: string) => {
    await sendSMS(
      phone,
      `${userName}, welcome to Trajectory! Your course access is ready: trajectorygroup.org/course`
    );
  },

  assessmentReminder: async (phone: string) => {
    await sendSMS(
      phone,
      "Your Trajectory assessment is waiting. Takes 10 min to see your path clearly: trajectorygroup.org/assessment"
    );
  },

  moduleReminder: async (phone: string, moduleName: string) => {
    await sendSMS(
      phone,
      `Ready for "${moduleName}"? 20 min to level up: trajectorygroup.org/course`
    );
  }
};
```

### Email Deliverability Best Practices
```typescript
// Ensure emails reach the inbox
const deliverabilityChecks = {
  // Warm up sending domain
  warmupSchedule: [
    { day: 1, volume: 50 },
    { day: 2, volume: 100 },
    { day: 3, volume: 200 },
    { day: 7, volume: 500 },
    { day: 14, volume: 1000 },
    { day: 30, volume: 'unlimited' }
  ],

  // Clean email list
  validateEmail: async (email: string): Promise<boolean> => {
    // Check syntax
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    // Check for bounces
    const bounced = await checkBounceList(email);
    if (bounced) return false;

    // Check engagement
    const lastOpened = await getLastOpenDate(email);
    const daysSinceOpen = getDaysSince(lastOpened);
    if (daysSinceOpen > 180) {
      // Re-engagement needed
      await triggerReEngagement(email);
      return false;
    }

    return true;
  },

  // Monitor reputation
  checkReputation: async () => {
    const metrics = await getEmailMetrics();
    
    if (metrics.bounceRate > 2) {
      console.warn('High bounce rate detected');
    }
    
    if (metrics.spamRate > 0.1) {
      console.error('Spam complaints detected!');
      // Pause campaigns
    }
  }
};
```
