# Analytics Tracking Skill

Track every step of the transformation journey. Data-driven decisions for life-changing outcomes.

## Analytics Architecture

### Core Tracking Events
```typescript
// Comprehensive event taxonomy
type TrackingEvent = 
  // Journey Events
  | 'journey_started'
  | 'assessment_began'
  | 'assessment_completed'
  | 'results_viewed'
  | 'avatar_revealed'
  
  // Engagement Events
  | 'content_viewed'
  | 'video_played'
  | 'module_started'
  | 'module_completed'
  | 'action_item_completed'
  
  // Conversion Events
  | 'email_captured'
  | 'pricing_viewed'
  | 'checkout_initiated'
  | 'purchase_completed'
  | 'course_accessed'
  
  // Retention Events
  | 'daily_visit'
  | 'streak_maintained'
  | 'milestone_reached'
  | 'transformation_shared';
```

### 1. Custom Analytics System
```typescript
// lib/analytics.ts
class TrajectoryAnalytics {
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startSession();
    this.flushQueue();
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        
        // Context
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        
        // UTM params
        ...this.getUTMParams(),
        
        // User state
        isAuthenticated: !!this.userId,
        hasAssessment: this.hasCompletedAssessment(),
        hasPurchase: this.hasMadePurchase(),
      },
    };

    // Add to queue
    this.queue.push(analyticsEvent);

    // Send to all providers
    this.sendToProviders(analyticsEvent);
    
    // Store locally for offline
    this.storeLocally(analyticsEvent);
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.userId = userId;
    
    // Update all providers
    if (window.gtag) {
      gtag('config', GA_ID, { user_id: userId });
    }
    
    if (window.analytics) {
      window.analytics.identify(userId, traits);
    }
    
    // Store user traits
    this.updateUserTraits(traits);
  }

  private sendToProviders(event: AnalyticsEvent) {
    // Google Analytics
    if (window.gtag) {
      gtag('event', event.event, {
        ...event.properties,
        send_to: GA_ID,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      const fbEvent = this.mapToFacebookEvent(event.event);
      if (fbEvent) {
        fbq('track', fbEvent, event.properties);
      }
    }

    // Custom backend
    this.sendToBackend(event);
  }

  private async sendToBackend(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true, // For page unload events
      });
    } catch (error) {
      // Store failed events for retry
      this.storeFailedEvent(event);
    }
  }
}

export const analytics = new TrajectoryAnalytics();
```

### 2. User Journey Tracking
```typescript
// Track complete user journey
interface UserJourney {
  userId: string;
  sessions: Session[];
  milestones: Milestone[];
  currentPhase: 'awareness' | 'consideration' | 'decision' | 'success' | 'advocacy';
}

class JourneyTracker {
  async trackUserJourney(userId: string): Promise<UserJourney> {
    // Get all user events
    const events = await this.getUserEvents(userId);
    
    // Identify journey phases
    const journey: UserJourney = {
      userId,
      sessions: this.extractSessions(events),
      milestones: this.extractMilestones(events),
      currentPhase: this.determinePhase(events),
    };

    // Key journey metrics
    const metrics = {
      daysToFirstAssessment: this.calculateDaysTo(events, 'assessment_completed'),
      daysToFirstPurchase: this.calculateDaysTo(events, 'purchase_completed'),
      engagementScore: this.calculateEngagementScore(events),
      transformationProgress: this.calculateProgress(events),
    };

    return { journey, metrics };
  }

  private determinePhase(events: AnalyticsEvent[]): string {
    const hasAssessment = events.some(e => e.event === 'assessment_completed');
    const hasPurchase = events.some(e => e.event === 'purchase_completed');
    const hasCompletion = events.some(e => e.event === 'course_completed');
    const hasShared = events.some(e => e.event === 'transformation_shared');

    if (hasShared) return 'advocacy';
    if (hasCompletion) return 'success';
    if (hasPurchase) return 'decision';
    if (hasAssessment) return 'consideration';
    return 'awareness';
  }
}
```

### 3. Real-Time Dashboard
```tsx
// components/AnalyticsDashboard.tsx
const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    assessmentsToday: 0,
    purchasesToday: 0,
    revenueToday: 0,
    conversionRate: 0,
    avgTimeToConvert: 0,
  });

  useEffect(() => {
    // Real-time updates via WebSocket
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    
    ws.on('analytics:update', (data) => {
      setMetrics(prev => ({
        ...prev,
        ...data,
      }));
    });

    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard
        title="Active Now"
        value={metrics.activeUsers}
        icon={<Users className="w-5 h-5" />}
        trend="+12%"
        live
      />
      
      <MetricCard
        title="Assessments Today"
        value={metrics.assessmentsToday}
        icon={<Target className="w-5 h-5" />}
        target={50}
      />
      
      <MetricCard
        title="Revenue Today"
        value={`$${metrics.revenueToday.toFixed(2)}`}
        icon={<DollarSign className="w-5 h-5" />}
        trend="+24%"
      />
      
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate.toFixed(1)}%`}
        icon={<TrendingUp className="w-5 h-5" />}
        benchmark="2.3%"
      />
    </div>
  );
};
```

### 4. Funnel Analysis
```typescript
// Track conversion funnel
interface FunnelStep {
  name: string;
  event: string;
  users: number;
  dropoff: number;
  avgTime: number;
}

class FunnelAnalytics {
  async analyzeFunnel(startDate: Date, endDate: Date): Promise<FunnelStep[]> {
    const funnel = [
      { name: 'Homepage Visit', event: 'page_view:home' },
      { name: 'Assessment Started', event: 'assessment_began' },
      { name: 'Assessment Completed', event: 'assessment_completed' },
      { name: 'Email Captured', event: 'email_captured' },
      { name: 'Course Page Viewed', event: 'page_view:course' },
      { name: 'Checkout Started', event: 'checkout_initiated' },
      { name: 'Purchase Completed', event: 'purchase_completed' },
    ];

    const steps: FunnelStep[] = [];
    let previousUsers = 0;

    for (let i = 0; i < funnel.length; i++) {
      const step = funnel[i];
      const users = await this.getUsersAtStep(step.event, startDate, endDate);
      const avgTime = await this.getAvgTimeToStep(step.event, startDate, endDate);
      
      const dropoff = previousUsers > 0 
        ? ((previousUsers - users) / previousUsers) * 100
        : 0;

      steps.push({
        name: step.name,
        event: step.event,
        users,
        dropoff,
        avgTime,
      });

      previousUsers = users;
    }

    return steps;
  }
}

// Visualize funnel
const FunnelVisualization = ({ data }: { data: FunnelStep[] }) => {
  return (
    <div className="space-y-4">
      {data.map((step, index) => (
        <div key={step.name} className="relative">
          <div 
            className="bg-sky-100 rounded-lg p-4"
            style={{ 
              width: `${(step.users / data[0].users) * 100}%`,
              marginLeft: index > 0 ? '2rem' : '0'
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{step.name}</h4>
                <p className="text-sm text-sky-600">
                  {step.users.toLocaleString()} users
                </p>
              </div>
              {index > 0 && (
                <div className="text-right">
                  <p className="text-sm text-red-600">
                    -{step.dropoff.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Avg: {formatTime(step.avgTime)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 5. Cohort Analysis
```typescript
// Track user cohorts over time
interface Cohort {
  name: string;
  startDate: Date;
  users: number;
  retention: Record<string, number>; // day -> percentage
  revenue: number;
  avgLTV: number;
}

class CohortAnalytics {
  async analyzeCohorts(period: 'week' | 'month'): Promise<Cohort[]> {
    const cohorts: Cohort[] = [];
    const periods = this.getPeriods(period, 12); // Last 12 periods

    for (const period of periods) {
      const cohort = await this.buildCohort(period);
      cohorts.push(cohort);
    }

    return cohorts;
  }

  private async buildCohort(period: DateRange): Promise<Cohort> {
    const users = await this.getCohortUsers(period);
    const retention = await this.calculateRetention(users);
    const revenue = await this.calculateRevenue(users);

    return {
      name: this.formatPeriodName(period),
      startDate: period.start,
      users: users.length,
      retention,
      revenue,
      avgLTV: revenue / users.length,
    };
  }

  private async calculateRetention(users: string[]): Promise<Record<string, number>> {
    const retention: Record<string, number> = {};
    const checkpoints = [1, 7, 14, 30, 60, 90]; // Days

    for (const day of checkpoints) {
      const active = await this.getActiveUsersAfterDays(users, day);
      retention[`day${day}`] = (active / users.length) * 100;
    }

    return retention;
  }
}

// Cohort visualization
const CohortChart = ({ cohorts }: { cohorts: Cohort[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Cohort</th>
            <th>Users</th>
            <th>Day 1</th>
            <th>Day 7</th>
            <th>Day 30</th>
            <th>Revenue</th>
            <th>LTV</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map(cohort => (
            <tr key={cohort.name}>
              <td className="font-medium">{cohort.name}</td>
              <td className="text-center">{cohort.users}</td>
              <td className={getRetentionColor(cohort.retention.day1)}>
                {cohort.retention.day1.toFixed(1)}%
              </td>
              <td className={getRetentionColor(cohort.retention.day7)}>
                {cohort.retention.day7.toFixed(1)}%
              </td>
              <td className={getRetentionColor(cohort.retention.day30)}>
                {cohort.retention.day30.toFixed(1)}%
              </td>
              <td>${cohort.revenue.toFixed(0)}</td>
              <td>${cohort.avgLTV.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 6. Custom Event Tracking
```typescript
// Detailed event tracking for specific features
const trackingHelpers = {
  // Assessment tracking
  assessment: {
    questionAnswered: (questionId: string, answer: number, timeSpent: number) => {
      analytics.track('assessment_question_answered', {
        question_id: questionId,
        answer,
        time_spent: timeSpent,
        question_index: getCurrentQuestionIndex(),
      });
    },

    abandonmentPoint: (questionId: string, timeOnPage: number) => {
      analytics.track('assessment_abandoned', {
        last_question: questionId,
        questions_completed: getCompletedQuestions().length,
        time_on_assessment: timeOnPage,
        abandonment_reason: 'inferred', // Could be 'explicit' if they tell us
      });
    },

    resultsShared: (platform: string, avatar: string) => {
      analytics.track('assessment_results_shared', {
        platform,
        avatar,
        share_method: 'button', // vs 'screenshot'
      });
    },
  },

  // Course tracking
  course: {
    videoProgress: (moduleId: string, videoId: string, progress: number) => {
      analytics.track('video_progress', {
        module_id: moduleId,
        video_id: videoId,
        progress_percentage: progress,
        completed: progress >= 90,
      });
    },

    moduleEngagement: (moduleId: string, metrics: ModuleMetrics) => {
      analytics.track('module_engagement', {
        module_id: moduleId,
        time_spent: metrics.timeSpent,
        videos_watched: metrics.videosWatched,
        actions_completed: metrics.actionsCompleted,
        engagement_score: calculateEngagementScore(metrics),
      });
    },
  },

  // Payment tracking
  payment: {
    priceExperiment: (variant: 'control' | 'test', price: number) => {
      analytics.track('price_experiment_viewed', {
        variant,
        price,
        original_price: 99.99,
      });
    },

    paymentMethodSelected: (method: string) => {
      analytics.track('payment_method_selected', {
        method,
        available_methods: ['card', 'apple_pay', 'google_pay'],
      });
    },

    purchaseFriction: (step: string, issue: string) => {
      analytics.track('purchase_friction', {
        friction_point: step,
        issue_type: issue,
        recovery_attempted: true,
      });
    },
  },
};
```

### 7. Performance Analytics
```typescript
// Track site performance impact on conversions
interface PerformanceMetrics {
  pageLoad: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  conversionRate?: number;
}

class PerformanceAnalytics {
  trackPagePerformance() {
    // Use Performance Observer API
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          
          analytics.track('page_performance', {
            page: window.location.pathname,
            dns: nav.domainLookupEnd - nav.domainLookupStart,
            tcp: nav.connectEnd - nav.connectStart,
            request: nav.responseStart - nav.requestStart,
            response: nav.responseEnd - nav.responseStart,
            dom: nav.domComplete - nav.domInteractive,
            load: nav.loadEventEnd - nav.navigationStart,
            
            // Core Web Vitals
            lcp: this.getLCP(),
            fid: this.getFID(),
            cls: this.getCLS(),
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
  }

  // Correlate performance with conversions
  async analyzePerformanceImpact(): Promise<PerformanceImpact> {
    const segments = await this.segmentUsersByLoadTime();
    
    return {
      fast: {
        loadTime: '<2s',
        users: segments.fast.length,
        conversionRate: this.getConversionRate(segments.fast),
      },
      average: {
        loadTime: '2-5s',
        users: segments.average.length,
        conversionRate: this.getConversionRate(segments.average),
      },
      slow: {
        loadTime: '>5s',
        users: segments.slow.length,
        conversionRate: this.getConversionRate(segments.slow),
      },
      impact: {
        revenueOpportunity: this.calculateRevenueImpact(segments),
      },
    };
  }
}
```

### 8. Privacy & Compliance
```typescript
// GDPR/CCPA compliant tracking
class PrivacyCompliantAnalytics {
  private hasConsent: boolean = false;

  async init() {
    this.hasConsent = await this.checkConsent();
    
    if (!this.hasConsent) {
      this.showConsentBanner();
    } else {
      this.enableTracking();
    }
  }

  private async checkConsent(): Promise<boolean> {
    const consent = localStorage.getItem('analytics_consent');
    return consent === 'granted';
  }

  private enableTracking() {
    // Only enable if consent granted
    if (this.hasConsent) {
      // Load GA
      this.loadGoogleAnalytics();
      
      // Load FB Pixel
      this.loadFacebookPixel();
      
      // Enable custom tracking
      window.trackingEnabled = true;
    }
  }

  updateConsent(granted: boolean) {
    this.hasConsent = granted;
    localStorage.setItem('analytics_consent', granted ? 'granted' : 'denied');
    
    if (granted) {
      this.enableTracking();
    } else {
      this.disableTracking();
    }
  }

  private disableTracking() {
    // Remove GA
    window['ga-disable-' + GA_ID] = true;
    
    // Clear cookies
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  }
}
```
