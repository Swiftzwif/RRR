# Assessment Flow Optimization Skill

Turn the assessment into a transformative experience that captures emails and converts visitors into course buyers.

## The Perfect Assessment Flow

### 1. Landing Hook
```tsx
// Compelling entry that promises transformation
<AssessmentLanding>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center max-w-3xl mx-auto"
  >
    <h1 className="text-5xl md:text-7xl font-bold mb-6">
      Are You Living as a Boy or a Man?
    </h1>
    <p className="text-xl text-sky-700 mb-8">
      10 minutes to discover your true trajectory. No fluff. Just truth.
    </p>
    <AssessmentStartButton />
    
    {/* Social proof */}
    <div className="mt-12 flex items-center justify-center gap-8">
      <div>
        <p className="text-3xl font-bold text-sky-900">12,847</p>
        <p className="text-sm text-sky-600">Men Assessed</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-sky-900">4.8/5</p>
        <p className="text-sm text-sky-600">Accuracy Rating</p>
      </div>
    </div>
  </motion.div>
</AssessmentLanding>
```

### 2. Question Experience
```tsx
// Each question feels significant
const QuestionCard = ({ question, currentIndex, total }) => {
  // Keyboard shortcuts for power users
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        handleAnswer(parseInt(e.key));
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress context */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-sky-600 mb-2">
          <span>{question.domain}</span>
          <span>{currentIndex} of {total}</span>
        </div>
        <Progress value={(currentIndex / total) * 100} className="h-2" />
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-sky-900">
        {question.text}
      </h2>

      {/* Answer options with hover states */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(value => (
          <AnswerButton
            key={value}
            value={value}
            label={getAnswerLabel(value)}
            onClick={() => handleAnswer(value)}
            selected={answers[question.id] === value}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <p className="text-sm text-sky-500 text-center mt-6">
        Press 1-5 to answer quickly
      </p>
    </motion.div>
  );
};
```

### 3. Email Gate (Critical)
```tsx
// Capture email before showing results
const EmailGate = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Save email with assessment ID
    const { error } = await supabase
      .from('assessment_emails')
      .insert({
        email,
        assessment_id: sessionStorage.getItem('assessment_id'),
        captured_at: new Date().toISOString()
      });

    if (!error) {
      // Trigger welcome sequence
      await triggerWelcomeSequence(email);
      onComplete(email);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="bg-sky-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-sky-600" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Your Results Are Ready</h2>
      <p className="text-sky-700 mb-8">
        Enter your email to receive your personalized trajectory report 
        and transformation roadmap.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-lg py-6"
          required
          autoFocus
        />
        
        <Button 
          type="submit" 
          size="lg" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Unlocking...' : 'Unlock My Results'}
        </Button>

        <p className="text-xs text-sky-600">
          We'll send you weekly trajectory tips. Unsubscribe anytime.
        </p>
      </form>
    </motion.div>
  );
};
```

### 4. Results That Convert
```tsx
// Results page that drives course sales
const AssessmentResults = ({ avatar, scores, email }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Avatar reveal with animation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 text-center"
      >
        <AvatarReveal avatar={avatar} />
        <h1 className="text-5xl font-bold mt-8 mb-4">
          You're a {avatar}
        </h1>
        <p className="text-xl text-sky-700 max-w-2xl mx-auto">
          {getAvatarDescription(avatar)}
        </p>
      </motion.section>

      {/* Domain breakdown */}
      <section className="py-12 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Your Trajectory Breakdown
        </h2>
        <DomainScoreCards scores={scores} />
      </section>

      {/* Personalized CTA based on avatar */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Your Next Step is Clear
          </h2>
          {avatar === 'Drifter' && <DrifterCTA />}
          {avatar === 'Balancer' && <BalancerCTA />}
          {avatar === 'Architect' && <ArchitectCTA />}
          
          <div className="mt-8">
            <Button size="lg" className="text-lg px-8">
              Start Your Transformation - $99
            </Button>
            <p className="mt-4 text-sm text-sky-600">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
```

## Conversion Optimization Patterns

### Dynamic Social Proof
```tsx
// Show live assessment completions
const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    // Fetch recent completions
    const subscription = supabase
      .from('assessments')
      .on('INSERT', payload => {
        setActivities(prev => [payload.new, ...prev].slice(0, 5));
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <div className="fixed bottom-4 left-4 space-y-2">
      <AnimatePresence>
        {activities.map(activity => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white p-3 rounded-lg shadow-lg"
          >
            <p className="text-sm">
              Someone just discovered they're a{' '}
              <span className="font-semibold">{activity.avatar}</span>
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

### Urgency Without Pressure
```tsx
// Subtle urgency that feels authentic
const LimitedTimeOffer = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="bg-sunset/10 border border-sunset/20 rounded-lg p-4">
      <p className="text-sm font-medium text-sunset-dark">
        Special launch price ends in: {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
};
```

## Assessment Analytics

Track everything to optimize conversions:

```typescript
// Track assessment events
const trackAssessmentEvent = (event: string, data?: any) => {
  // Send to analytics
  analytics.track(event, {
    ...data,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId()
  });
};

// Key events to track
trackAssessmentEvent('assessment_started');
trackAssessmentEvent('question_answered', { questionId, answer, timeSpent });
trackAssessmentEvent('assessment_completed', { avatar, totalScore });
trackAssessmentEvent('email_captured', { email });
trackAssessmentEvent('results_viewed', { viewDuration });
trackAssessmentEvent('cta_clicked', { ctaType, avatar });
```

## A/B Testing Variants

```tsx
// Test different hooks
const assessmentHooks = [
  "Are You Living as a Boy or a Man?",
  "Discover Your True Trajectory in 10 Minutes",
  "The 15-Question Test That Changes Everything"
];

// Test email gate copy
const emailGateCopy = [
  "Enter your email to receive your personalized trajectory report",
  "Get your results + transformation roadmap instantly",
  "See your trajectory score and what it means for your future"
];

// Test CTA variations
const ctaVariations = [
  { text: "Start Your Transformation - $99", color: "sunset" },
  { text: "Join Trajectory Now - $99", color: "sky" },
  { text: "Unlock The Full Course - $99", color: "sunset" }
];
```

## Performance Optimizations

```tsx
// Preload next question
const preloadNextQuestion = (currentIndex: number) => {
  if (questions[currentIndex + 1]) {
    // Preload any images or assets
    const nextQ = questions[currentIndex + 1];
    if (nextQ.image) {
      const img = new Image();
      img.src = nextQ.image;
    }
  }
};

// Save progress to localStorage
const saveProgress = (answers: Record<string, number>) => {
  localStorage.setItem('assessment_progress', JSON.stringify({
    answers,
    lastUpdated: Date.now()
  }));
};

// Resume incomplete assessments
const resumeAssessment = () => {
  const saved = localStorage.getItem('assessment_progress');
  if (saved) {
    const { answers, lastUpdated } = JSON.parse(saved);
    // If less than 24 hours old, offer to resume
    if (Date.now() - lastUpdated < 86400000) {
      return answers;
    }
  }
  return {};
};
```

## Mobile Optimization

```tsx
// Touch-optimized answer buttons
<button
  className="
    w-full p-6 text-left // Large touch target
    active:scale-95 // Immediate feedback
    transition-transform duration-100
  "
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
```

## Post-Assessment Automation

```tsx
// Trigger email sequence after completion
const triggerWelcomeSequence = async (email: string, avatar: string) => {
  // Immediate welcome email
  await sendEmail('welcome', { email, avatar });
  
  // Schedule follow-up sequence
  await scheduleEmail('day1_tip', { email }, { delayHours: 24 });
  await scheduleEmail('day3_story', { email }, { delayHours: 72 });
  await scheduleEmail('day7_offer', { email }, { delayHours: 168 });
};
```
