# Integration Patterns Skill

Connect seamlessly with external services. Every integration should be bulletproof and enhance the transformation experience.

## Core Integration Architecture

### Base Integration Class
```typescript
// lib/integrations/base.ts
abstract class BaseIntegration {
  protected name: string;
  protected config: IntegrationConfig;
  protected retryPolicy: RetryPolicy;
  protected rateLimiter: RateLimiter;
  
  constructor(name: string, config: IntegrationConfig) {
    this.name = name;
    this.config = config;
    this.retryPolicy = config.retryPolicy || defaultRetryPolicy;
    this.rateLimiter = new RateLimiter(config.rateLimit);
  }

  protected async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    // Check rate limit
    await this.rateLimiter.checkLimit();
    
    // Add auth headers
    const headers = {
      ...options.headers,
      ...this.getAuthHeaders(),
    };
    
    // Execute with retry
    return this.executeWithRetry(async () => {
      const response = await fetch(
        `${this.config.baseUrl}${endpoint}`,
        {
          ...options,
          headers,
        }
      );
      
      if (!response.ok) {
        throw new IntegrationError(
          this.name,
          response.status,
          await response.text()
        );
      }
      
      return response.json();
    });
  }

  protected abstract getAuthHeaders(): Record<string, string>;
  
  abstract healthCheck(): Promise<boolean>;
}
```

## 1. Twilio SMS Integration
```typescript
// lib/integrations/twilio.ts
class TwilioIntegration extends BaseIntegration {
  constructor() {
    super('Twilio', {
      baseUrl: 'https://api.twilio.com/2010-04-01',
      rateLimit: { requests: 100, window: 60 }, // 100 req/min
    });
  }

  getAuthHeaders() {
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString('base64');
    
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  async sendSMS(to: string, body: string, opts?: SMSOptions): Promise<SMSResult> {
    const data = new URLSearchParams({
      To: to,
      From: process.env.TWILIO_PHONE_NUMBER!,
      Body: body,
      ...(opts?.mediaUrl && { MediaUrl: opts.mediaUrl }),
      ...(opts?.statusCallback && { StatusCallback: opts.statusCallback }),
    });

    const result = await this.request<TwilioResponse>(
      `/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        body: data.toString(),
      }
    );

    // Track in analytics
    analytics.track('sms_sent', {
      provider: 'twilio',
      messageId: result.sid,
      to: to.slice(0, -4) + '****', // Privacy
      status: result.status,
    });

    return {
      id: result.sid,
      status: result.status,
      price: result.price,
    };
  }

  async sendBulkSMS(
    recipients: SMSRecipient[],
    template: string
  ): Promise<BulkSMSResult> {
    const results = await Promise.allSettled(
      recipients.map(recipient => 
        this.sendSMS(
          recipient.phone,
          this.personalizeTemplate(template, recipient.data)
        )
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      sent: successful,
      failed,
      details: results,
    };
  }

  private personalizeTemplate(
    template: string,
    data: Record<string, string>
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => 
      data[key] || match
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      const account = await this.request(
        `/Accounts/${process.env.TWILIO_ACCOUNT_SID}.json`,
        { method: 'GET' }
      );
      return account.status === 'active';
    } catch {
      return false;
    }
  }
}

// SMS Templates
const smsTemplates = {
  assessmentReminder: `Hey {{name}}, your Trajectory assessment is waiting. Takes 10 min to discover your path: {{link}}`,
  
  purchaseConfirmation: `{{name}}, welcome to Trajectory! Your course access is ready. Start here: {{link}}`,
  
  moduleReminder: `Time to level up, {{name}}. Module "{{module}}" is calling. 20 min to transform: {{link}}`,
  
  streakReminder: `{{name}}, don't break your {{days}}-day streak! Quick 10-min lesson waiting: {{link}}`,
  
  milestoneReached: `🎯 {{name}}, you just hit {{milestone}}! You're becoming the architect. Keep building: {{link}}`,
};
```

## 2. Calendly Integration
```typescript
// lib/integrations/calendly.ts
class CalendlyIntegration extends BaseIntegration {
  constructor() {
    super('Calendly', {
      baseUrl: 'https://api.calendly.com',
      rateLimit: { requests: 350, window: 60 },
    });
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${process.env.CALENDLY_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  async createInvitee(
    eventUri: string,
    invitee: CalendlyInvitee
  ): Promise<ScheduledEvent> {
    const result = await this.request<CalendlyResponse>(
      '/scheduled_events',
      {
        method: 'POST',
        body: JSON.stringify({
          event_type: eventUri,
          invitee: {
            email: invitee.email,
            name: invitee.name,
            time_zone: invitee.timezone,
            custom_questions: [
              {
                question: "What's your biggest challenge right now?",
                answer: invitee.challenge,
              },
              {
                question: "Monthly revenue goal?",
                answer: invitee.revenueGoal,
              },
            ],
          },
        }),
      }
    );

    // Store booking
    await supabase
      .from('coaching_applications')
      .insert({
        user_id: invitee.userId,
        calendly_event_id: result.resource.uri,
        scheduled_at: result.resource.start_time,
        status: 'scheduled',
        application_data: {
          challenge: invitee.challenge,
          revenue_goal: invitee.revenueGoal,
        },
      });

    return result.resource;
  }

  async cancelEvent(eventUri: string, reason?: string): Promise<void> {
    await this.request(`/scheduled_events/${eventUri}/cancellation`, {
      method: 'POST',
      body: JSON.stringify({
        reason: reason || 'Rescheduling needed',
      }),
    });
  }

  async getEventTypes(): Promise<CalendlyEventType[]> {
    const result = await this.request<{ collection: CalendlyEventType[] }>(
      '/event_types',
      {
        method: 'GET',
        params: {
          user: process.env.CALENDLY_USER_URI,
          active: true,
        },
      }
    );

    return result.collection;
  }

  // Webhook handling
  async handleWebhook(
    signature: string,
    payload: CalendlyWebhook
  ): Promise<void> {
    // Verify signature
    if (!this.verifyWebhookSignature(signature, payload)) {
      throw new Error('Invalid webhook signature');
    }

    switch (payload.event) {
      case 'invitee.created':
        await this.handleBookingCreated(payload);
        break;
      
      case 'invitee.canceled':
        await this.handleBookingCanceled(payload);
        break;
    }
  }

  private verifyWebhookSignature(
    signature: string,
    payload: any
  ): boolean {
    const expectedSignature = createHmac(
      'sha256',
      process.env.CALENDLY_WEBHOOK_SECRET!
    )
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === expectedSignature;
  }
}
```

## 3. Stripe/Square Advanced Integration
```typescript
// lib/integrations/payment-advanced.ts
class AdvancedPaymentIntegration extends BaseIntegration {
  private square: SquareClient;
  private stripe?: StripeClient; // Future

  constructor() {
    super('Payment', {
      baseUrl: process.env.SQUARE_ENVIRONMENT === 'production'
        ? 'https://connect.squareup.com/v2'
        : 'https://connect.squareupsandbox.com/v2',
    });
    
    this.square = new Client({
      environment: process.env.SQUARE_ENVIRONMENT,
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
    });
  }

  // Subscription management
  async createSubscription(
    customerId: string,
    plan: 'monthly' | 'annual'
  ): Promise<Subscription> {
    const planId = plan === 'monthly' 
      ? process.env.SQUARE_MONTHLY_PLAN_ID
      : process.env.SQUARE_ANNUAL_PLAN_ID;

    const result = await this.square.subscriptionsApi.createSubscription({
      locationId: process.env.SQUARE_LOCATION_ID!,
      customerId,
      planId,
      startDate: new Date().toISOString().split('T')[0],
      timezone: 'America/New_York',
    });

    // Store locally
    await supabase
      .from('subscriptions')
      .insert({
        user_id: await this.getUserIdFromCustomer(customerId),
        square_subscription_id: result.subscription.id,
        plan_id: planId,
        status: 'active',
        current_period_end: result.subscription.chargedThroughDate,
        amount: plan === 'monthly' ? 9900 : 99900,
      });

    return result.subscription;
  }

  // Usage-based billing
  async trackUsage(
    userId: string,
    metric: 'ai_credits' | 'coaching_hours',
    amount: number
  ): Promise<void> {
    await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        metric,
        amount,
        timestamp: new Date().toISOString(),
        billing_period: this.getCurrentBillingPeriod(),
      });

    // Check if usage limits exceeded
    const usage = await this.getCurrentUsage(userId, metric);
    if (usage > this.getUsageLimit(metric)) {
      await this.handleOverage(userId, metric, usage);
    }
  }

  // Intelligent retry for failed payments
  async intelligentPaymentRetry(
    paymentId: string
  ): Promise<RetryResult> {
    const payment = await this.getPaymentDetails(paymentId);
    const retryStrategy = this.determineRetryStrategy(payment);

    for (const attempt of retryStrategy.attempts) {
      await this.wait(attempt.delayHours * 3600 * 1000);
      
      try {
        const result = await this.retryPayment(
          paymentId,
          attempt.options
        );
        
        if (result.status === 'COMPLETED') {
          await this.notifyPaymentRecovered(payment.userId);
          return { success: true, attempts: attempt.number };
        }
      } catch (error) {
        await this.logRetryAttempt(paymentId, attempt, error);
      }
    }

    // All retries failed
    await this.handleFailedPayment(payment.userId, paymentId);
    return { success: false, attempts: retryStrategy.attempts.length };
  }

  private determineRetryStrategy(payment: Payment): RetryStrategy {
    const errorCode = payment.lastError?.code;
    
    // Smart retry based on error type
    if (errorCode === 'insufficient_funds') {
      return {
        attempts: [
          { number: 1, delayHours: 24, options: {} },    // Next day
          { number: 2, delayHours: 72, options: {} },    // 3 days
          { number: 3, delayHours: 168, options: {} },   // 1 week
        ],
      };
    }
    
    if (errorCode === 'card_expired') {
      // Send card update request first
      this.sendCardUpdateRequest(payment.userId);
      return {
        attempts: [
          { number: 1, delayHours: 48, options: {} },
          { number: 2, delayHours: 96, options: {} },
        ],
      };
    }

    // Default strategy
    return {
      attempts: [
        { number: 1, delayHours: 4, options: {} },
        { number: 2, delayHours: 24, options: {} },
        { number: 3, delayHours: 48, options: {} },
      ],
    };
  }
}
```

## 4. AI Integration (OpenAI/Anthropic)
```typescript
// lib/integrations/ai.ts
class AIIntegration extends BaseIntegration {
  private openai: OpenAI;
  private anthropic?: Anthropic; // Future

  constructor() {
    super('AI', {
      baseUrl: 'https://api.openai.com/v1',
      rateLimit: { requests: 3500, window: 60 },
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Personalized content generation
  async generatePersonalizedContent(
    userId: string,
    contentType: 'email' | 'module_intro' | 'motivation'
  ): Promise<string> {
    const userContext = await this.getUserContext(userId);
    
    const prompt = this.buildPrompt(contentType, userContext);
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are Jean, founder of Trajectory. Speak with authority, wisdom, and slight edge. No fluff.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0].message.content;
    
    // Store for analysis
    await this.storeGeneratedContent(userId, contentType, content);
    
    return content;
  }

  // AI-powered insights
  async analyzeUserJourney(userId: string): Promise<JourneyInsights> {
    const journeyData = await this.getUserJourneyData(userId);
    
    const analysis = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Analyze user transformation journey and provide actionable insights.',
        },
        {
          role: 'user',
          content: JSON.stringify(journeyData),
        },
      ],
      functions: [
        {
          name: 'provide_insights',
          parameters: {
            type: 'object',
            properties: {
              strengths: { type: 'array', items: { type: 'string' } },
              blockers: { type: 'array', items: { type: 'string' } },
              next_actions: { type: 'array', items: { type: 'string' } },
              risk_score: { type: 'number', minimum: 0, maximum: 10 },
              personalized_message: { type: 'string' },
            },
          },
        },
      ],
      function_call: { name: 'provide_insights' },
    });

    const insights = JSON.parse(
      analysis.choices[0].message.function_call.arguments
    );

    return insights;
  }

  // Conversational AI coach
  async coachingChat(
    userId: string,
    message: string,
    history: ChatMessage[]
  ): Promise<CoachingResponse> {
    const userProfile = await this.getUserProfile(userId);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.buildCoachingSystemPrompt(userProfile),
        },
        ...history.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.8,
      presence_penalty: 0.6,
    });

    const reply = response.choices[0].message.content;
    
    // Extract action items if mentioned
    const actionItems = await this.extractActionItems(reply);
    
    return {
      message: reply,
      actionItems,
      suggestedResources: await this.getSuggestedResources(reply, userProfile),
    };
  }
}
```

## 5. CRM Integration (Future)
```typescript
// lib/integrations/crm.ts
class CRMIntegration extends BaseIntegration {
  constructor() {
    super('CRM', {
      baseUrl: process.env.CRM_API_URL!,
      rateLimit: { requests: 100, window: 60 },
    });
  }

  async syncUser(user: User): Promise<void> {
    const crmContact = {
      email: user.email,
      firstName: user.name?.split(' ')[0],
      lastName: user.name?.split(' ').slice(1).join(' '),
      customFields: {
        trajectoryAvatar: user.avatar,
        assessmentScore: user.assessmentScore,
        courseProgress: user.courseProgress,
        ltv: user.lifetimeValue,
        lastActive: user.lastActiveAt,
      },
      tags: this.generateUserTags(user),
      lists: this.determineUserLists(user),
    };

    await this.request('/contacts', {
      method: 'PUT',
      body: JSON.stringify(crmContact),
    });
  }

  async createDeal(purchase: Purchase): Promise<void> {
    const deal = {
      title: `${purchase.productName} - ${purchase.userEmail}`,
      value: purchase.amount,
      stage: 'closed_won',
      contactId: await this.getContactId(purchase.userEmail),
      customFields: {
        product: purchase.productName,
        paymentMethod: purchase.paymentMethod,
        purchaseDate: purchase.createdAt,
      },
    };

    await this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  private generateUserTags(user: User): string[] {
    const tags = [`avatar:${user.avatar}`];
    
    if (user.hasPurchased) tags.push('customer');
    if (user.courseProgress > 50) tags.push('engaged');
    if (user.courseProgress === 100) tags.push('graduate');
    if (user.referralCount > 0) tags.push('advocate');
    
    return tags;
  }
}
```

## 6. Webhook Manager
```typescript
// lib/integrations/webhook-manager.ts
class WebhookManager {
  private handlers: Map<string, WebhookHandler>;
  
  constructor() {
    this.handlers = new Map();
    this.registerHandlers();
  }

  private registerHandlers() {
    // Square webhooks
    this.handlers.set('square.payment', new SquarePaymentHandler());
    this.handlers.set('square.subscription', new SquareSubscriptionHandler());
    
    // Twilio webhooks
    this.handlers.set('twilio.status', new TwilioStatusHandler());
    
    // Calendly webhooks
    this.handlers.set('calendly.booking', new CalendlyBookingHandler());
    
    // Custom webhooks
    this.handlers.set('custom.transformation', new TransformationHandler());
  }

  async processWebhook(
    source: string,
    event: string,
    payload: any,
    signature?: string
  ): Promise<WebhookResult> {
    const handlerKey = `${source}.${event}`;
    const handler = this.handlers.get(handlerKey);
    
    if (!handler) {
      console.warn(`No handler for webhook: ${handlerKey}`);
      return { processed: false, error: 'Unknown webhook type' };
    }
    
    try {
      // Verify signature
      if (signature && !handler.verifySignature(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }
      
      // Process with retry
      const result = await this.processWithRetry(
        () => handler.process(payload)
      );
      
      // Log success
      await this.logWebhook(source, event, payload, 'success');
      
      return { processed: true, result };
    } catch (error) {
      // Log failure
      await this.logWebhook(source, event, payload, 'failed', error);
      
      // Queue for retry if appropriate
      if (handler.shouldRetry(error)) {
        await this.queueForRetry(source, event, payload);
      }
      
      throw error;
    }
  }

  private async processWithRetry(
    fn: () => Promise<any>,
    attempts = 3
  ): Promise<any> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === attempts - 1) throw error;
        await this.wait(Math.pow(2, i) * 1000); // Exponential backoff
      }
    }
  }
}
```

## Integration Health Dashboard
```tsx
// components/IntegrationHealth.tsx
const IntegrationHealthDashboard = () => {
  const [health, setHealth] = useState<IntegrationHealth[]>([]);

  useEffect(() => {
    const checkHealth = async () => {
      const integrations = [
        'supabase',
        'square',
        'resend',
        'twilio',
        'calendly',
        'openai',
      ];

      const results = await Promise.all(
        integrations.map(async (name) => {
          const integration = getIntegration(name);
          const isHealthy = await integration.healthCheck();
          const metrics = await integration.getMetrics();
          
          return {
            name,
            status: isHealthy ? 'healthy' : 'unhealthy',
            uptime: metrics.uptime,
            latency: metrics.avgLatency,
            errors: metrics.errorRate,
            lastCheck: new Date(),
          };
        })
      );

      setHealth(results);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {health.map((integration) => (
        <div
          key={integration.name}
          className={`p-4 rounded-lg border ${
            integration.status === 'healthy'
              ? 'border-green-300 bg-green-50'
              : 'border-red-300 bg-red-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold capitalize">{integration.name}</h3>
            <div className={`w-3 h-3 rounded-full ${
              integration.status === 'healthy' 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`} />
          </div>
          
          <div className="text-sm space-y-1">
            <p>Uptime: {integration.uptime}%</p>
            <p>Latency: {integration.latency}ms</p>
            <p>Errors: {integration.errors}%</p>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Last check: {formatTimeAgo(integration.lastCheck)}
          </p>
        </div>
      ))}
    </div>
  );
};
```
