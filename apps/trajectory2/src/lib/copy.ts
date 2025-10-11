// Centralized copy and microcopy for the Trajectory platform

export const COPY = {
  // Brand
  brand: {
    name: 'Trajectory',
    tagline: 'Your trajectory determines your destiny',
    description: 'Discover what\'s shaping your path and how to raise your floor in 10 minutes.',
  },

  // Navigation
  nav: {
    home: 'Home',
    story: 'Story',
    assessment: 'Assessment',
    laneDiagnostic: 'Lane Diagnostic',
    results: 'Results',
    course: 'Course',
    coaching: 'Coaching',
    community: 'Community',
    resources: 'Resources',
    about: 'About',
    killTheBoy: 'Kill the Boy',
    testimonials: 'Testimonials',
    signin: 'Sign In',
    signup: 'Sign Up',
  },

  // Landing page
  landing: {
    hero: {
      headline: 'Discover Your Life Trajectory',
      subhead: 'Take a 10-minute assessment to understand what\'s shaping your path and how to raise your floor.',
      cta: 'Start Assessment',
      ctaSecondary: 'Learn More',
    },
    features: {
      title: 'What You\'ll Discover',
      items: [
        {
          title: 'Your Life Identity',
          description: 'Are you a Drifter, Balancer, or Architect? Discover your current trajectory pattern.',
        },
        {
          title: 'Domain Analysis',
          description: 'Get insights into 6 key life domains: identity, health, finances, relationships, emotions, and focus.',
        },
        {
          title: 'Action Plan',
          description: 'Receive personalized 7-day and 30-day action plans based on your lowest-scoring areas.',
        },
      ],
    },
  },

  // Assessment
  assessment: {
    title: 'Life Trajectory Assessment',
    subtitle: 'Take a breath. Answer honestly.',
    progress: 'Question {current} of {total}',
    next: 'Next',
    previous: 'Previous',
    submit: 'Complete Assessment',
    scale: {
      labels: {
        1: 'Never / Very Low',
        2: 'Rarely',
        3: 'Sometimes',
        4: 'Often',
        5: 'Always / Excellent',
      },
    },
  },

  // Lane Diagnostic
  laneDiagnostic: {
    title: 'Lane Diagnostic Quiz',
    subtitle: 'Discover which financial lane you\'re actually in based on MJ DeMarco\'s Millionaire Fastlane framework',
    description: 'Take our 2-minute diagnostic to uncover the hidden patterns keeping you from financial freedom',
    progress: 'Question {current} of {total}',
    next: 'Next',
    previous: 'Previous',
    submit: 'Get Results',
    lanes: {
      sidewalk: {
        name: 'Sidewalk Lane',
        description: 'You\'re living in the moment, but the moment is costing you your future',
        characteristics: [
          'Spends more than earns',
          'No emergency fund',
          'Consumer-focused mindset',
          'No long-term financial plan'
        ]
      },
      slowlane: {
        name: 'Slowlane',
        description: 'You\'re building wealth, but you\'re trading time for money at a 1:1 ratio',
        characteristics: [
          'Trades time for money',
          'Linear income growth',
          'Traditional retirement planning',
          'Security over growth'
        ]
      },
      fastlane: {
        name: 'Fastlane',
        description: 'You understand systems, but you might be missing the community and support',
        characteristics: [
          'Builds systems and assets',
          'Exponential income potential',
          'Leverage and multiplication',
          'Freedom and control'
        ]
      }
    }
  },

  // Results
  results: {
    title: 'Your Trajectory Results',
    subtitle: 'Here\'s what your assessment reveals about your current path',
    avatar: {
      title: 'Your Life Avatar',
      drifter: {
        title: 'The Drifter',
        description: 'You\'re in exploration mode, seeking direction and clarity. This is a powerful place to start building intentional momentum.',
        traits: ['Curious', 'Adaptable', 'Open to change'],
      },
      balancer: {
        title: 'The Balancer',
        description: 'You\'re managing multiple priorities with varying success. You have solid foundations to build upon.',
        traits: ['Stable', 'Practical', 'Growth-oriented'],
      },
      architect: {
        title: 'The Architect',
        description: 'You\'re actively designing your life with intention and purpose. You have strong systems in place.',
        traits: ['Strategic', 'Disciplined', 'Purpose-driven'],
      },
    },
    domains: {
      title: 'Domain Analysis',
      identity: 'Identity',
      health: 'Health',
      finances: 'Finances',
      relationships: 'Relationships',
      emotions: 'Emotions',
      focus: 'Focus',
    },
    actions: {
      title: 'Your Action Plan',
      sevenDay: '7-Day Quick Wins',
      thirtyDay: '30-Day Deep Work',
    },
    cta: {
      course: {
        title: 'Unlock Your Full Potential',
        description: 'Get access to our complete transformation course with 5 core modules.',
        price: '$99.99',
        button: 'Buy Course',
      },
      coaching: {
        title: 'Get Personal Guidance',
        description: 'Book a 1-on-1 coaching interview to create your personalized roadmap.',
        price: '$24.99',
        button: 'Apply for Interview',
      },
    },
  },

  // TBD Modules
  tbd: {
    course: {
      title: 'Trajectory Course',
      subtitle: 'Complete life transformation in 5 modules',
      description: 'Unlock your full potential with our comprehensive course designed to raise your floor across all life domains.',
      modules: [
        {
          title: 'Awareness',
          description: 'Develop deep self-awareness and understand your current trajectory patterns.',
          status: 'coming_soon',
        },
        {
          title: 'Inner State',
          description: 'Master your emotional regulation and inner world management.',
          status: 'coming_soon',
        },
        {
          title: 'Rewrite Story',
          description: 'Transform limiting beliefs and create empowering narratives.',
          status: 'coming_soon',
        },
        {
          title: 'Raise Standards',
          description: 'Set and maintain higher standards across all life domains.',
          status: 'coming_soon',
        },
        {
          title: 'Relationship Inventory',
          description: 'Audit and optimize your relationships for maximum growth.',
          status: 'coming_soon',
        },
      ],
    },
    coaching: {
      title: '1-on-1 Coaching',
      subtitle: 'Personalized guidance for your transformation',
      description: 'Work directly with our coaches to create a customized roadmap for your specific situation and goals.',
      process: [
        'Complete a detailed intake assessment',
        '60-minute deep-dive interview',
        'Receive your personalized transformation plan',
        'Ongoing support and accountability',
      ],
    },
    community: {
      title: 'The Lodge',
      subtitle: 'Your transformation community',
      description: 'Join a private community of like-minded individuals on their own trajectory journeys. Share wins, get support, and accelerate your growth.',
      features: [
        'Private discussion forums',
        'Weekly group coaching calls',
        'Accountability partnerships',
        'Exclusive resources and tools',
      ],
    },
  },

  // Email capture
  email: {
    title: 'Stay Updated',
    description: 'Get notified when new modules and features are released.',
    placeholder: 'Enter your email',
    button: 'Notify Me',
    success: 'Thanks! We\'ll notify you when it\'s ready.',
    error: 'Something went wrong. Please try again.',
  },

  // Auth
  auth: {
    signin: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue your journey',
      email: 'Email',
      password: 'Password',
      button: 'Sign In',
      forgot: 'Forgot password?',
      noAccount: 'Don\'t have an account?',
      signup: 'Sign up',
    },
    signup: {
      title: 'Start Your Journey',
      subtitle: 'Create your account to begin',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      button: 'Create Account',
      hasAccount: 'Already have an account?',
      signin: 'Sign in',
    },
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    required: 'Required',
    optional: 'Optional',
  },

  // Footer
  footer: {
    description: 'Your trajectory determines your destiny.',
    links: {
      about: 'About',
      blog: 'Blog',
      resources: 'Resources',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    newsletter: {
      title: 'Get the Weekly Trajectory Brief',
      description: 'No spam. Unsubscribe anytime.',
    },
    copyright: '© {year} Trajectory',
    tagline: 'Raise your floor',
  },
} as const;

// Helper function to get copy with interpolation
export function getCopy(path: string, variables?: Record<string, string | number>): string | Record<string, unknown> {
  const keys = path.split('.');
  let value: string | Record<string, unknown> = COPY;
  
  for (const key of keys) {
    if (typeof value === 'object' && value !== null) {
      value = (value as Record<string, unknown>)[key] as string | Record<string, unknown>;
      if (value === undefined) {
        console.warn(`Copy path not found: ${path}`);
        return path;
      }
    } else {
      console.warn(`Copy path not found: ${path}`);
      return path;
    }
  }
  
  if (typeof value === 'string' && variables) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }
  
  return value;
}
