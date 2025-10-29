# Course Content Management Skill

Manage 50+ pages of life-changing content with conversational format between Jean (founder) and the end consumer.

## Content Architecture

### Module Structure

```typescript
interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  duration: string; // "5 days", "1 week"
  conversations: Conversation[];
  actionItems: ActionItem[];
  resources: Resource[];
  locked: boolean;
  progress?: ModuleProgress;
}

interface Conversation {
  id: string;
  speaker: 'jean' | 'user';
  content: string;
  emotion?: 'inspiring' | 'challenging' | 'supportive' | 'breakthrough';
  timestamp?: string; // For pacing the conversation
}
```

### Conversational UI Component

```tsx
// Make users feel like they're in a real conversation
const ConversationFlow = ({ conversations, moduleId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRead, setHasRead] = useState<Set<string>>(new Set());

  // Auto-advance conversation
  useEffect(() => {
    if (currentIndex < conversations.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3000); // Paced reading
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatePresence>
        {conversations.slice(0, currentIndex + 1).map((conv, idx) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.5 }}
            className={`flex ${
              conv.speaker === 'jean' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div className={`max-w-xl ${
              conv.speaker === 'jean' 
                ? 'bg-sky-50 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' 
                : 'bg-sunset/10 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
            } p-6 space-y-3`}>
              {/* Speaker indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  conv.speaker === 'jean' ? 'bg-sky-200' : 'bg-sunset/20'
                }`}>
                  {conv.speaker === 'jean' ? 'J' : 'You'}
                </div>
                <span className="text-sm font-medium text-sky-700">
                  {conv.speaker === 'jean' ? 'Jean' : 'Your thoughts'}
                </span>
              </div>
              
              {/* Conversational content */}
              <div className="prose prose-sky">
                <ReactMarkdown>{conv.content}</ReactMarkdown>
              </div>

              {/* Emotional indicator */}
              {conv.emotion && (
                <EmotionBadge emotion={conv.emotion} />
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Continue button after reading */}
      {currentIndex === conversations.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button size="lg" onClick={markComplete}>
            I'm Ready to Apply This
          </Button>
        </motion.div>
      )}
    </div>
  );
};
```

### Course Content Database Schema

```sql
-- Store course content in Supabase
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  order_index INTEGER NOT NULL,
  duration TEXT,
  is_premium BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id),
  speaker VARCHAR(10) CHECK (speaker IN ('jean', 'user')),
  content TEXT NOT NULL,
  emotion VARCHAR(20),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id),
  title TEXT NOT NULL,
  description TEXT,
  estimated_time TEXT,
  order_index INTEGER NOT NULL
);

CREATE TABLE user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  module_id UUID REFERENCES course_modules(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_conversation_id UUID,
  completion_percentage INTEGER DEFAULT 0,
  action_items_completed JSONB DEFAULT '[]',
  UNIQUE(user_id, module_id)
);
```

### Content Loading & Caching

```typescript
// Efficient content loading with caching
const useCourseModule = (moduleId: string) => {
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      // Check cache first
      const cached = await caches.match(`/api/modules/${moduleId}`);
      if (cached) {
        const data = await cached.json();
        setModule(data);
        setLoading(false);
      }

      // Fetch fresh data
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          conversations:course_conversations(*),
          action_items:course_action_items(*)
        `)
        .eq('id', moduleId)
        .single();

      if (data) {
        setModule(data);
        // Cache for offline access
        const cache = await caches.open('course-content-v1');
        cache.put(
          `/api/modules/${moduleId}`,
          new Response(JSON.stringify(data))
        );
      }
      setLoading(false);
    };

    loadModule();
  }, [moduleId]);

  return { module, loading };
};
```

### Module Navigation

```tsx
const CourseNavigation = ({ currentModule, allModules }) => {
  return (
    <div className="bg-sky-50 rounded-xl p-6">
      <h3 className="font-semibold text-sky-900 mb-4">Your Journey</h3>
      <div className="space-y-2">
        {allModules.map((module, idx) => {
          const isActive = module.id === currentModule.id;
          const isCompleted = module.progress?.completed;
          const isLocked = module.locked && !isCompleted;

          return (
            <Link
              key={module.id}
              href={isLocked ? '#' : `/course/module/${module.id}`}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all
                ${isActive ? 'bg-sky-100 border border-sky-300' : ''}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-100'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isCompleted ? 'bg-green-500 text-white' : 'bg-sky-200 text-sky-700'}
              `}>
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sky-900">{module.title}</p>
                <p className="text-sm text-sky-600">{module.duration}</p>
              </div>
              {isLocked && <Lock className="w-4 h-4 text-sky-400" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
```

### Action Items Tracker

```tsx
const ActionItemsPanel = ({ items, moduleId, userId }) => {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleItem = async (itemId: string) => {
    const newCompleted = completed.includes(itemId)
      ? completed.filter(id => id !== itemId)
      : [...completed, itemId];

    setCompleted(newCompleted);

    // Update progress
    await supabase
      .from('user_module_progress')
      .update({
        action_items_completed: newCompleted,
        completion_percentage: (newCompleted.length / items.length) * 100
      })
      .eq('user_id', userId)
      .eq('module_id', moduleId);
  };

  return (
    <div className="bg-gradient-to-br from-sunset/5 to-sunset/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-sky-900 mb-4">
        Today's Transformation Tasks
      </h3>
      <div className="space-y-3">
        {items.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ x: 4 }}
            className="flex items-start gap-3"
          >
            <Checkbox
              id={item.id}
              checked={completed.includes(item.id)}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <label
              htmlFor={item.id}
              className={`flex-1 cursor-pointer ${
                completed.includes(item.id) ? 'line-through opacity-60' : ''
              }`}
            >
              <p className="font-medium text-sky-900">{item.title}</p>
              <p className="text-sm text-sky-700 mt-1">{item.description}</p>
              {item.estimated_time && (
                <p className="text-xs text-sky-600 mt-1">
                  ⏱ {item.estimated_time}
                </p>
              )}
            </label>
          </motion.div>
        ))}
      </div>

      {completed.length === items.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-lg font-semibold text-green-600 mb-2">
            🎉 Module Complete!
          </p>
          <Button onClick={proceedToNext}>
            Continue Your Journey
          </Button>
        </motion.div>
      )}
    </div>
  );
};
```

### Content Delivery Optimization

```tsx
// Progressive content reveal
const ProgressiveContent = ({ content, readingSpeed = 200 }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = content.split(' ');

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleWords(prev => Math.min(prev + 1, words.length));
    }, readingSpeed);

    return () => clearInterval(interval);
  }, [words.length, readingSpeed]);

  return (
    <p className="text-lg leading-relaxed">
      {words.slice(0, visibleWords).join(' ')}
      {visibleWords < words.length && (
        <span className="opacity-30">
          {' ' + words.slice(visibleWords).join(' ')}
        </span>
      )}
    </p>
  );
};
```

### Mobile-First Course Experience

```tsx
const MobileCourseLayout = ({ children }) => {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-sky-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-semibold text-sky-900">Trajectory Course</h1>
          <button
            onClick={() => setShowNav(!showNav)}
            className="p-2 hover:bg-sky-50 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Slide-out navigation */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-40"
          >
            <CourseNavigation />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="p-4 pb-20">
        {children}
      </main>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-200 p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Previous
          </Button>
          <Button size="sm" className="flex-1">
            Next Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### Content Analytics

```typescript
// Track engagement with content
const trackContentEngagement = {
  moduleStarted: (moduleId: string) => {
    analytics.track('module_started', {
      moduleId,
      timestamp: new Date().toISOString()
    });
  },

  conversationRead: (conversationId: string, timeSpent: number) => {
    analytics.track('conversation_read', {
      conversationId,
      timeSpent,
      readingSpeed: calculateReadingSpeed(timeSpent)
    });
  },

  actionItemCompleted: (itemId: string, moduleId: string) => {
    analytics.track('action_item_completed', {
      itemId,
      moduleId,
      completionTime: new Date().toISOString()
    });
  },

  moduleCompleted: (moduleId: string, totalTime: number) => {
    analytics.track('module_completed', {
      moduleId,
      totalTime,
      completionRate: 100
    });
  }
};
```

### Admin Content Editor

```tsx
// Simple CMS for updating course content
const ContentEditor = ({ moduleId }) => {
  const [conversations, setConversations] = useState([]);

  const addConversation = () => {
    setConversations([
      ...conversations,
      {
        id: crypto.randomUUID(),
        speaker: 'jean',
        content: '',
        emotion: 'supportive'
      }
    ]);
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations(convs =>
      convs.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const saveModule = async () => {
    const { error } = await supabase
      .from('course_conversations')
      .upsert(
        conversations.map((c, idx) => ({
          ...c,
          module_id: moduleId,
          order_index: idx
        }))
      );

    if (!error) {
      toast.success('Module content saved!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Edit Module Content</h2>
      
      {conversations.map((conv, idx) => (
        <div key={conv.id} className="mb-6 p-4 border rounded-lg">
          <div className="flex gap-4 mb-4">
            <Select
              value={conv.speaker}
              onValueChange={(value) => 
                updateConversation(conv.id, { speaker: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jean">Jean</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={conv.emotion}
              onValueChange={(value) =>
                updateConversation(conv.id, { emotion: value })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspiring">Inspiring</SelectItem>
                <SelectItem value="challenging">Challenging</SelectItem>
                <SelectItem value="supportive">Supportive</SelectItem>
                <SelectItem value="breakthrough">Breakthrough</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={conv.content}
            onChange={(e) => 
              updateConversation(conv.id, { content: e.target.value })
            }
            className="min-h-[100px]"
            placeholder="Enter conversation content..."
          />
        </div>
      ))}

      <div className="flex gap-4">
        <Button onClick={addConversation} variant="outline">
          Add Conversation
        </Button>
        <Button onClick={saveModule}>
          Save Module
        </Button>
      </div>
    </div>
  );
};
```
