# Analytics Event Schema

## Event Naming Convention
All events use camelCase naming with descriptive action verbs.

## Core Events

### Quiz Flow
```typescript
// User starts the assessment
{
  event: 'quizStart',
  sessionId: string,
  timestamp: number,
  payload: {
    source: 'landing' | 'direct'
  }
}

// User answers a question
{
  event: 'questionAnswered',
  sessionId: string,
  timestamp: number,
  payload: {
    questionId: string,
    domain: string,
    value: number, // 1-5 Likert scale
    questionNumber: number,
    totalQuestions: number
  }
}

// Domain level changes during quiz
{
  event: 'domainLevelUp',
  sessionId: string,
  timestamp: number,
  payload: {
    domain: string,
    fromLevel: 'low' | 'mid' | 'high',
    toLevel: 'low' | 'mid' | 'high',
    newScore: number // 0-100
  }
}

// Quiz completion
{
  event: 'quizCompleted',
  sessionId: string,
  timestamp: number,
  payload: {
    totalTime: number, // seconds
    avatar: string,
    domainScores: {
      identity: number,
      energy: number,
      finances: number,
      relationships: number,
      emotions: number,
      focus: number
    },
    lowestTwoDomains: [string, string]
  }
}
```

### Email & Results
```typescript
// Email submitted
{
  event: 'emailSubmitted',
  sessionId: string,
  timestamp: number,
  payload: {
    email: string, // hashed for privacy
    avatar: string
  }
}

// Results page viewed
{
  event: 'resultsViewed',
  sessionId: string,
  timestamp: number,
  payload: {
    avatar: string,
    domainScores: object,
    lowestTwoDomains: [string, string]
  }
}
```

### Offers & Conversion
```typescript
// Offer page viewed
{
  event: 'offerViewed',
  sessionId: string,
  timestamp: number,
  payload: {
    offerType: 'course' | 'interview' | 'coaching',
    source: 'results' | 'direct' | 'email'
  }
}

// CTA button clicked
{
  event: 'offerClicked',
  sessionId: string,
  timestamp: number,
  payload: {
    offerType: 'course' | 'interview' | 'coaching',
    ctaText: string,
    location: string // which page/section
  }
}

// Purchase intent (Stripe checkout initiated)
{
  event: 'purchaseIntent',
  sessionId: string,
  timestamp: number,
  payload: {
    offerType: 'course' | 'interview' | 'coaching',
    price: number,
    currency: 'USD'
  }
}

// Specific offer interactions
{
  event: 'interviewClicked',
  sessionId: string,
  timestamp: number,
  payload: {
    source: 'course' | 'results' | 'direct'
  }
}

{
  event: 'coachingClicked',
  sessionId: string,
  timestamp: number,
  payload: {
    source: 'course' | 'interview' | 'results'
  }
}
```

## Session Management

### Session ID Generation
- Generate unique session ID on first page load
- Persist in localStorage for duration of user journey
- Include in all events for funnel analysis

### User ID (when available)
- Use email hash as user ID after email submission
- Link session events to user for cohort analysis
- Maintain privacy by hashing emails

## Implementation Notes

### Event Timing
- Fire events immediately on user action
- Use requestIdleCallback for non-critical events
- Batch events if network is slow

### Error Handling
- Log events to console if analytics service fails
- Retry failed events with exponential backoff
- Don't block user experience for analytics

### Privacy
- Hash personally identifiable information
- Respect user's privacy preferences
- Comply with GDPR/CCPA requirements

### Performance
- Keep event payloads small (< 1KB)
- Use efficient serialization
- Avoid blocking the main thread

## Funnel Analysis

### Key Metrics
1. **Quiz Completion Rate**: quizCompleted / quizStart
2. **Email Capture Rate**: emailSubmitted / quizCompleted  
3. **Results View Rate**: resultsViewed / emailSubmitted
4. **Offer Click Rate**: offerClicked / resultsViewed
5. **Purchase Intent Rate**: purchaseIntent / offerClicked

### Cohort Analysis
- Group users by avatar type
- Track conversion by lowest domains
- Analyze time-to-conversion patterns

### A/B Testing
- Test different copy variations
- Optimize CTA button text and placement
- Experiment with offer sequencing
