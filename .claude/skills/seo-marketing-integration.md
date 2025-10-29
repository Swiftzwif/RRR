# SEO & Marketing Integration Skill

Drive organic traffic and convert visitors into life-changers. Every page is a transformation opportunity.

## SEO Foundation

### 1. Next.js 15 Metadata API
```typescript
// app/layout.tsx - Global SEO
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://trajectorygroup.org'),
  title: {
    template: '%s | Trajectory - Transform Your Life Path',
    default: 'Trajectory - Kill the Boy, Become the Man',
  },
  description: 'Discover your life trajectory with our free assessment. Join thousands transforming from Drifters to Architects. Premium course & coaching available.',
  keywords: ['life transformation', 'mens coaching', 'personal development', 'trajectory assessment', 'kill the boy'],
  authors: [{ name: 'Jean', url: 'https://trajectorygroup.org' }],
  creator: 'Trajectory Group',
  publisher: 'Trajectory Group',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trajectorygroup.org',
    siteName: 'Trajectory',
    title: 'Kill the Boy, Become the Man - Trajectory',
    description: 'Transform your life trajectory in 31 days',
    images: [
      {
        url: '/og-image-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Trajectory - Transform Your Life Path',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@trajectorygroup',
    creator: '@trajectorygroup',
    title: 'Kill the Boy, Become the Man',
    description: 'Take the free assessment. Discover your trajectory.',
    images: ['/twitter-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};
```

### 2. Dynamic SEO for Pages
```typescript
// app/assessment/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Life Assessment - Drifter, Balancer, or Architect?',
  description: 'Take the 10-minute Trajectory assessment to discover your life archetype and get a personalized transformation roadmap.',
  openGraph: {
    title: 'Discover Your Life Trajectory - Free Assessment',
    description: 'Are you a Drifter, Balancer, or Architect? Find out in 10 minutes.',
    images: ['/og-assessment.jpg'],
  },
};

// app/course/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  // Dynamic metadata based on user or content
  const courseStats = await getCourseStats();
  
  return {
    title: `Trajectory Course - Join ${courseStats.enrollments}+ Men Transforming`,
    description: `31-day transformation journey. ${courseStats.completionRate}% success rate. Instant access for $99.`,
    openGraph: {
      title: 'Trajectory Course - Rethink. Redesign. Reignite.',
      description: `${courseStats.enrollments}+ men have transformed. You're next.`,
      images: [
        {
          url: '/og-course.jpg',
          width: 1200,
          height: 630,
          alt: 'Trajectory Course Preview',
        }
      ],
    },
  };
}
```

### 3. Structured Data (JSON-LD)
```tsx
// components/StructuredData.tsx
const CourseStructuredData = ({ courseData }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Trajectory: Rethink. Redesign. Reignite.',
    description: '31-day life transformation course for ambitious men',
    provider: {
      '@type': 'Organization',
      name: 'Trajectory Group',
      sameAs: 'https://trajectorygroup.org',
    },
    offers: {
      '@type': 'Offer',
      price: '99.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: 'P31D',
      inLanguage: 'en',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '847',
      reviewCount: '312',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// Assessment Quiz structured data
const AssessmentStructuredData = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'Trajectory Life Assessment',
    description: 'Discover if you\'re a Drifter, Balancer, or Architect',
    educationalLevel: 'beginner',
    timeRequired: 'PT10M',
    hasPart: Array.from({ length: 15 }, (_, i) => ({
      '@type': 'Question',
      position: i + 1,
      name: `Question ${i + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
```

### 4. Technical SEO
```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trajectorygroup.org';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/course`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  // Dynamic blog posts
  const posts = await getBlogPosts();
  const dynamicPages = posts.map((post) => ({
    url: `${baseUrl}/resources/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...dynamicPages];
}

// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth/'],
      },
    ],
    sitemap: 'https://trajectorygroup.org/sitemap.xml',
  };
}
```

## Content Marketing

### 1. Blog System
```typescript
// lib/blog.ts
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

// app/resources/[slug]/page.tsx
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      images: post.ogImage ? [post.ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

### 2. Landing Page Optimization
```tsx
// High-converting landing page structure
const LandingPage = () => {
  return (
    <>
      {/* Hero with clear value prop */}
      <section className="hero">
        <h1 className="text-7xl font-bold">
          Kill the Boy,<br />
          <span className="text-sky-600">Become the Man</span>
        </h1>
        <p className="text-2xl mt-6">
          95% of men live as boys in grown bodies. 
          Which one are you?
        </p>
        <CTAButton />
      </section>

      {/* Social proof */}
      <section className="social-proof">
        <div className="stats">
          <Stat number="12,847" label="Assessments Taken" />
          <Stat number="3,421" label="Course Members" />
          <Stat number="4.9/5" label="Success Rating" />
        </div>
      </section>

      {/* Problem agitation */}
      <section className="problem">
        <h2>The Silent Crisis No One Talks About</h2>
        <ProblemPoints />
      </section>

      {/* Solution introduction */}
      <section className="solution">
        <h2>There's a Clear Path Forward</h2>
        <SolutionSteps />
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <TestimonialCarousel />
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Your Trajectory Changes Today</h2>
        <CTAButton size="large" />
      </section>
    </>
  );
};
```

### 3. Conversion Rate Optimization (CRO)
```tsx
// A/B testing framework
import { useExperiment } from '@/lib/experiments';

const HeroSection = () => {
  const variant = useExperiment('hero-headline', {
    control: 'Kill the Boy, Become the Man',
    testA: 'Transform Your Life in 31 Days',
    testB: 'From Drifter to Architect: Your Journey Starts Now',
  });

  return (
    <h1 className="hero-headline">
      {variant}
    </h1>
  );
};

// Track conversions
const trackConversion = (event: string, data?: any) => {
  // Google Analytics 4
  gtag('event', event, {
    event_category: 'conversion',
    event_label: data?.label,
    value: data?.value,
  });

  // Facebook Pixel
  fbq('track', event, data);

  // Custom analytics
  analytics.track(event, data);
};
```

### 4. Email Capture Optimization
```tsx
// Exit intent popup
const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exit_popup_shown')) {
        setShow(true);
        localStorage.setItem('exit_popup_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <Modal>
      <h2>Wait! Before You Go...</h2>
      <p>Get the 5-Day Trajectory Transformation Email Course</p>
      <EmailCaptureForm source="exit_intent" />
    </Modal>
  );
};
```

## Analytics Integration

### 1. Google Analytics 4 Setup
```tsx
// app/layout.tsx
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Facebook Pixel
```tsx
// components/FacebookPixel.tsx
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export const FacebookPixel = () => {
  const pathname = usePathname();

  useEffect(() => {
    fbq('track', 'PageView');
  }, [pathname]);

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', ${FB_PIXEL_ID});
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
};
```

### 3. Conversion Tracking
```typescript
// lib/tracking.ts
export const trackEvents = {
  assessmentStarted: () => {
    gtag('event', 'begin_assessment', {
      event_category: 'engagement',
    });
    fbq('track', 'Lead');
  },

  assessmentCompleted: (avatar: string) => {
    gtag('event', 'complete_assessment', {
      event_category: 'engagement',
      avatar_result: avatar,
    });
    fbq('track', 'CompleteRegistration', {
      content_name: 'assessment',
      status: avatar,
    });
  },

  emailCaptured: (source: string) => {
    gtag('event', 'sign_up', {
      event_category: 'conversion',
      method: source,
    });
    fbq('track', 'Subscribe', {
      value: 10,
      currency: 'USD',
    });
  },

  courseViewed: () => {
    gtag('event', 'view_item', {
      currency: 'USD',
      value: 99.99,
      items: [{
        item_id: 'trajectory-course',
        item_name: 'Trajectory Course',
        price: 99.99,
      }],
    });
    fbq('track', 'ViewContent', {
      content_ids: ['trajectory-course'],
      content_type: 'product',
      value: 99.99,
      currency: 'USD',
    });
  },

  checkoutStarted: () => {
    gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: 99.99,
      items: [{
        item_id: 'trajectory-course',
        item_name: 'Trajectory Course',
        price: 99.99,
        quantity: 1,
      }],
    });
    fbq('track', 'InitiateCheckout', {
      value: 99.99,
      currency: 'USD',
    });
  },

  purchaseCompleted: (value: number) => {
    gtag('event', 'purchase', {
      transaction_id: Date.now(),
      value: value,
      currency: 'USD',
      items: [{
        item_id: 'trajectory-course',
        item_name: 'Trajectory Course',
        price: value,
        quantity: 1,
      }],
    });
    fbq('track', 'Purchase', {
      value: value,
      currency: 'USD',
    });
  },
};
```

## SEO Content Strategy

### 1. Keyword Research & Mapping
```typescript
// SEO-optimized page structure
const seoPages = {
  // Transactional intent
  '/course': {
    primary: 'mens life coaching course',
    secondary: ['transform your life course', 'personal development program'],
    longTail: ['how to stop being average man', 'masculine mindset training'],
  },
  
  // Informational intent
  '/resources/kill-the-boy': {
    primary: 'kill the boy meaning',
    secondary: ['become the man meaning', 'masculine transformation'],
    featured: true, // Featured snippet optimization
  },
  
  // Navigational intent
  '/': {
    primary: 'trajectory life coaching',
    branded: ['trajectory group', 'trajectorygroup.org'],
  },
  
  // Commercial investigation
  '/assessment': {
    primary: 'life assessment test',
    secondary: ['personal growth quiz', 'life trajectory test'],
    semantic: ['drifter balancer architect', 'life archetype quiz'],
  },
};
```

### 2. Content Optimization Checklist
```typescript
// Automated SEO checks
const seoChecklist = {
  title: {
    minLength: 30,
    maxLength: 60,
    includesKeyword: true,
  },
  description: {
    minLength: 120,
    maxLength: 160,
    includesKeyword: true,
    uniquePerPage: true,
  },
  content: {
    minWords: 600,
    headingStructure: ['h1', 'h2', 'h3'],
    keywordDensity: 0.01, // 1%
    internalLinks: 3,
    externalLinks: 1,
  },
  images: {
    hasAltText: true,
    optimizedSize: true,
    descriptiveFilenames: true,
  },
  performance: {
    loadTime: 2.5, // seconds
    mobileResponsive: true,
    coreWebVitals: 'passing',
  },
};
```
