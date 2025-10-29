# Performance Optimization Skill

Make the site feel instant. Every millisecond counts in the transformation journey.

## Core Metrics & Targets

```typescript
// Apple-grade performance standards
const performanceTargets = {
  LCP: 1.2,    // Largest Contentful Paint < 1.2s
  FID: 50,     // First Input Delay < 50ms
  CLS: 0.05,   // Cumulative Layout Shift < 0.05
  TTFB: 300,   // Time to First Byte < 300ms
  FCP: 1.0,    // First Contentful Paint < 1s
  TTI: 2.5     // Time to Interactive < 2.5s
};
```

## Next.js 15 Optimizations

### 1. Turbopack Configuration
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@sentry/node': '@sentry/browser',
      };
    }
    return config;
  },
};
```

### 2. Route Segment Config
```typescript
// app/assessment/page.tsx
export const runtime = 'edge'; // Edge runtime for assessment
export const revalidate = 3600; // Cache for 1 hour

// app/course/[moduleId]/page.tsx
export const dynamicParams = true;
export const generateStaticParams = async () => {
  // Pre-render popular modules
  return [
    { moduleId: 'kill-the-boy' },
    { moduleId: 'module-1' },
    { moduleId: 'module-2' }
  ];
};
```

### 3. Streaming & Suspense
```tsx
// Progressive loading for course content
import { Suspense } from 'react';

const CoursePage = async ({ params }) => {
  return (
    <div className="min-h-screen">
      {/* Header loads immediately */}
      <CourseHeader moduleId={params.moduleId} />
      
      {/* Content streams in */}
      <Suspense fallback={<ContentSkeleton />}>
        <CourseContent moduleId={params.moduleId} />
      </Suspense>
      
      {/* Sidebar loads independently */}
      <Suspense fallback={<SidebarSkeleton />}>
        <CourseSidebar />
      </Suspense>
    </div>
  );
};

// Loading skeletons that match real content
const ContentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-sky-200 rounded w-3/4 mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-sky-100 rounded" />
      <div className="h-4 bg-sky-100 rounded w-5/6" />
      <div className="h-4 bg-sky-100 rounded w-4/6" />
    </div>
  </div>
);
```

### 4. Dynamic Imports
```typescript
// Load heavy components only when needed
import dynamic from 'next/dynamic';

// Chart library - only for results page
const ResultsChart = dynamic(
  () => import('@/components/ResultsChart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false // Client-only
  }
);

// Video player - only for course modules
const VideoPlayer = dynamic(
  () => import('@/components/VideoPlayer'),
  { 
    loading: () => <VideoSkeleton />,
    ssr: false
  }
);

// Payment form - only on checkout
const PaymentForm = dynamic(
  () => import('@/components/PaymentForm'),
  { 
    loading: () => <div className="h-96 bg-sky-50 animate-pulse rounded-lg" />,
    ssr: false
  }
);
```

## Database Query Optimization

### 1. Supabase Query Patterns
```typescript
// Efficient data fetching
const getAssessmentWithResults = async (userId: string) => {
  // Single query with joins
  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      avatar,
      score,
      domain_scores,
      created_at,
      user:user_id (
        email,
        user_metadata
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data;
};

// Parallel queries when independent
const loadDashboard = async (userId: string) => {
  const [assessment, purchases, progress] = await Promise.all([
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    
    supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId),
    
    supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
  ]);

  return { assessment, purchases, progress };
};
```

### 2. Database Indexes
```sql
-- Critical indexes for performance
CREATE INDEX idx_assessments_user_created 
ON assessments(user_id, created_at DESC);

CREATE INDEX idx_purchases_user_status 
ON purchases(user_id, status);

CREATE INDEX idx_progress_user_module 
ON user_progress(user_id, module_id);

-- Partial indexes for common queries
CREATE INDEX idx_purchases_completed 
ON purchases(status) 
WHERE status = 'completed';

CREATE INDEX idx_email_queue_pending 
ON email_queue(scheduled_for, status) 
WHERE status = 'pending';
```

### 3. Connection Pooling
```typescript
// Optimize Supabase connections
import { createClient } from '@supabase/supabase-js';

// Singleton pattern for client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: { 'x-application': 'trajectory' },
        },
      }
    );
  }
  return supabaseClient;
};
```

## Frontend Optimizations

### 1. Bundle Splitting
```typescript
// Optimize client bundles
// app/layout.tsx
import { Inter, Clash_Display } from 'next/font/google';

// Font optimization with subsetting
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const clash = Clash_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-clash',
  preload: true,
});

// Critical CSS inlining
export const metadata = {
  other: {
    'critical-css': `
      body { margin: 0; font-family: var(--font-inter); }
      .hero { min-height: 100vh; }
    `,
  },
};
```

### 2. Image Optimization
```tsx
// Next.js Image with blur placeholder
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';

// Generate blur data at build time
export async function getStaticProps() {
  const { base64 } = await getPlaiceholder('/hero-image.jpg');
  
  return {
    props: {
      heroBlur: base64,
    },
  };
}

// Use in component
<Image
  src="/hero-image.jpg"
  alt="Transform your trajectory"
  width={1920}
  height={1080}
  priority // LCP image
  placeholder="blur"
  blurDataURL={heroBlur}
  className="object-cover"
  sizes="100vw"
/>
```

### 3. React Optimization Patterns
```tsx
// Memoization for expensive computations
const AssessmentResults = ({ scores }) => {
  const chartData = useMemo(() => 
    transformScoresToChartData(scores),
    [scores]
  );

  const topDomains = useMemo(() => 
    scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3),
    [scores]
  );

  return (
    <div>
      <ResultsChart data={chartData} />
      <TopDomains domains={topDomains} />
    </div>
  );
};

// Prevent unnecessary re-renders
const QuestionCard = memo(({ 
  question, 
  onAnswer 
}: QuestionProps) => {
  return (
    <div className="question-card">
      {/* Component content */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.question.id === nextProps.question.id;
});

// Virtual scrolling for long lists
const ModuleList = ({ modules }) => {
  return (
    <VirtualList
      height={600}
      itemCount={modules.length}
      itemSize={120}
      renderItem={({ index, style }) => (
        <div style={style}>
          <ModuleCard module={modules[index]} />
        </div>
      )}
    />
  );
};
```

### 4. Animation Performance
```tsx
// GPU-accelerated animations only
const optimizedVariants = {
  hidden: { 
    opacity: 0, 
    transform: 'translateY(20px)' // Not 'y'
  },
  visible: { 
    opacity: 1, 
    transform: 'translateY(0px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] // Custom easing
    }
  }
};

// will-change for planned animations
const AnimatedCard = styled(motion.div)`
  will-change: transform, opacity;
  contain: layout style paint;
`;

// Reduce motion for accessibility
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const motionProps = prefersReducedMotion 
  ? {} 
  : {
      initial: "hidden",
      animate: "visible",
      variants: optimizedVariants
    };
```

## API & Network Optimization

### 1. Edge Functions
```typescript
// Use edge runtime for speed
export const runtime = 'edge';

export async function POST(request: Request) {
  // Parse request at edge
  const { email } = await request.json();
  
  // Quick validation
  if (!email?.includes('@')) {
    return new Response(
      JSON.stringify({ error: 'Invalid email' }),
      { status: 400 }
    );
  }
  
  // Fast KV lookup
  const cached = await kv.get(`assessment:${email}`);
  if (cached) {
    return new Response(JSON.stringify(cached));
  }
  
  // Process and cache
  const result = await processAssessment(email);
  await kv.set(`assessment:${email}`, result, { ex: 3600 });
  
  return new Response(JSON.stringify(result));
}
```

### 2. API Response Caching
```typescript
// Cache API responses
const fetchWithCache = async (
  url: string,
  options?: RequestInit
): Promise<any> => {
  const cacheKey = `api:${url}:${JSON.stringify(options)}`;
  
  // Check memory cache first
  const memCached = memoryCache.get(cacheKey);
  if (memCached) return memCached;
  
  // Check browser cache
  const cache = await caches.open('api-v1');
  const cached = await cache.match(url);
  
  if (cached && !isStale(cached)) {
    const data = await cached.json();
    memoryCache.set(cacheKey, data);
    return data;
  }
  
  // Fetch fresh
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 3600 } // Next.js cache
  });
  
  const data = await response.json();
  
  // Cache successful responses
  if (response.ok) {
    cache.put(url, response.clone());
    memoryCache.set(cacheKey, data);
  }
  
  return data;
};
```

### 3. Optimistic Updates
```typescript
// Update UI before server confirms
const useOptimisticProgress = () => {
  const [progress, setProgress] = useState(initialProgress);
  const [pending, setPending] = useState(false);

  const updateProgress = async (moduleId: string) => {
    // Optimistic update
    setProgress(prev => ({
      ...prev,
      [moduleId]: { completed: true, percentage: 100 }
    }));
    setPending(true);

    try {
      // Server update
      await supabase
        .from('user_progress')
        .upsert({
          module_id: moduleId,
          completed: true,
          percentage: 100
        });
    } catch (error) {
      // Rollback on failure
      setProgress(prev => ({
        ...prev,
        [moduleId]: { completed: false, percentage: 0 }
      }));
      toast.error('Failed to save progress');
    } finally {
      setPending(false);
    }
  };

  return { progress, updateProgress, pending };
};
```

## Monitoring & Analytics

### 1. Real User Monitoring
```typescript
// Track real performance metrics
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = (metric: any) => {
  // Send to analytics
  analytics.track('web_vitals', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    url: window.location.href,
    userAgent: navigator.userAgent
  });
  
  // Alert on poor performance
  if (metric.rating === 'poor') {
    console.warn(`Poor ${metric.name}:`, metric.value);
  }
};

onCLS(reportWebVitals);
onFCP(reportWebVitals);
onLCP(reportWebVitals);
onTTFB(reportWebVitals);
```

### 2. Performance Budget
```javascript
// webpack.config.js performance budget
module.exports = {
  performance: {
    maxAssetSize: 244000,      // 244 KB
    maxEntrypointSize: 244000, // 244 KB
    hints: 'error',
    assetFilter: (assetFilename) => {
      return !assetFilename.endsWith('.map');
    }
  }
};
```

### 3. Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/assessment
            http://localhost:3000/course
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 4. Performance Dashboard
```tsx
// Admin performance monitoring
const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    p75_lcp: 0,
    p90_lcp: 0,
    slow_pages: [],
    api_latency: {},
    error_rate: 0
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <MetricCard
        title="LCP (p75)"
        value={`${metrics.p75_lcp.toFixed(2)}s`}
        target="< 2.5s"
        status={metrics.p75_lcp < 2.5 ? 'good' : 'poor'}
      />
      
      <div className="col-span-full">
        <h3 className="font-semibold mb-4">Slow Pages</h3>
        {metrics.slow_pages.map(page => (
          <div key={page.url} className="flex justify-between p-2">
            <span>{page.url}</span>
            <span className="text-red-600">{page.lcp}s LCP</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```
