// Analytics event system for Trajectory assessment funnel

export interface AnalyticsEvent {
  event: string;
  sessionId: string;
  timestamp: number;
  payload: Record<string, any>;
}

// Session management
let sessionId: string | null = null;

export const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = generateSessionId();
    if (typeof window !== 'undefined') {
      localStorage.setItem('trajectory_session_id', sessionId);
    }
  }
  return sessionId;
};

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Event tracking
export const trackEvent = (eventName: string, payload: Record<string, any> = {}) => {
  const event: AnalyticsEvent = {
    event: eventName,
    sessionId: getSessionId(),
    timestamp: Date.now(),
    payload
  };

  // Log to console for development
  console.log('Analytics Event:', event);

  // In production, send to analytics service
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // TODO: Implement actual analytics service integration
    // Example: sendToAnalyticsService(event);
  }
};

// Quiz flow events
export const trackQuizStart = (source: 'landing' | 'direct' = 'landing') => {
  trackEvent('quizStart', { source });
};

export const trackQuestionAnswered = (
  questionId: string,
  domain: string,
  value: number,
  questionNumber: number,
  totalQuestions: number
) => {
  trackEvent('questionAnswered', {
    questionId,
    domain,
    value,
    questionNumber,
    totalQuestions
  });
};

export const trackDomainLevelUp = (
  domain: string,
  fromLevel: 'low' | 'mid' | 'high',
  toLevel: 'low' | 'mid' | 'high',
  newScore: number
) => {
  trackEvent('domainLevelUp', {
    domain,
    fromLevel,
    toLevel,
    newScore
  });
};

export const trackQuizCompleted = (
  totalTime: number,
  avatar: string,
  domainScores: any,
  lowestTwoDomains: [string, string]
) => {
  trackEvent('quizCompleted', {
    totalTime,
    avatar,
    domainScores,
    lowestTwoDomains
  });
};

// Email & Results events
export const trackEmailSubmitted = (email: string, avatar: string) => {
  // Hash email for privacy
  const hashedEmail = btoa(email).replace(/[^a-zA-Z0-9]/g, '');
  
  trackEvent('emailSubmitted', {
    email: hashedEmail,
    avatar
  });
};

export const trackResultsViewed = (
  avatar: string,
  domainScores: any,
  lowestTwoDomains: [string, string]
) => {
  trackEvent('resultsViewed', {
    avatar,
    domainScores,
    lowestTwoDomains
  });
};

// Offer & conversion events
export const trackOfferViewed = (
  offerType: 'course' | 'interview' | 'coaching',
  source: 'results' | 'direct' | 'email'
) => {
  trackEvent('offerViewed', {
    offerType,
    source
  });
};

export const trackOfferClicked = (
  offerType: 'course' | 'interview' | 'coaching',
  ctaText: string,
  location: string
) => {
  trackEvent('offerClicked', {
    offerType,
    ctaText,
    location
  });
};

export const trackPurchaseIntent = (
  offerType: 'course' | 'interview' | 'coaching',
  price: number,
  currency: string = 'USD'
) => {
  trackEvent('purchaseIntent', {
    offerType,
    price,
    currency
  });
};

export const trackInterviewClicked = (source: 'course' | 'results' | 'direct') => {
  trackEvent('interviewClicked', { source });
};

export const trackCoachingClicked = (source: 'course' | 'interview' | 'results') => {
  trackEvent('coachingClicked', { source });
};

// Utility functions
export const hashEmail = (email: string): string => {
  return btoa(email).replace(/[^a-zA-Z0-9]/g, '');
};

export const getUserId = (email?: string): string | null => {
  if (!email) return null;
  return hashEmail(email);
};

// Initialize session on app load
if (typeof window !== 'undefined') {
  const storedSessionId = localStorage.getItem('trajectory_session_id');
  if (storedSessionId) {
    sessionId = storedSessionId;
  }
}
