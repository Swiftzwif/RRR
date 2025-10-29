'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Target, TrendingUp, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Badge } from '@/components/ui/badge';

interface WarriorEntry {
  id: string;
  transformation_goal: string;
  created_at: string;
  email: string;
  entry_number: number;
}

export default function LiveWarriorFeed() {
  const [warriors, setWarriors] = useState<WarriorEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [latestEntry, setLatestEntry] = useState<WarriorEntry | null>(null);

  useEffect(() => {
    const fetchWarriors = async () => {
      const supabase = createClient();

      // Get active raffle
      const { data: raffle } = await supabase
        .from('raffle_config')
        .select('id')
        .eq('status', 'active')
        .single();

      if (!raffle) return;

      // Get recent entries
      const { data: entries, count } = await supabase
        .from('raffle_entries')
        .select('*', { count: 'exact' })
        .eq('raffle_id', raffle.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (entries) {
        setWarriors(entries);
        setTotalCount(count || 0);
        if (entries.length > 0) {
          setLatestEntry(entries[0]);
        }
      }

      // Subscribe to new entries
      const channel = supabase
        .channel('live-warriors')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'raffle_entries',
            filter: `raffle_id=eq.${raffle.id}`
          },
          (payload) => {
            const newEntry = payload.new as WarriorEntry;
            setLatestEntry(newEntry);
            setWarriors((prev) => [newEntry, ...prev.slice(0, 4)]);
            setTotalCount((prev) => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchWarriors();
  }, []);

  // Example warriors for when the feed is empty
  const exampleWarriors: WarriorEntry[] = [
    {
      id: 'example-1',
      email: 'john***@gmail.com',
      transformation_goal: 'Break free from the 9-5 grind and build my own business empire',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      entry_number: 1,
    },
    {
      id: 'example-2',
      email: 'mike***@outlook.com',
      transformation_goal: 'Become the father and husband my family deserves',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      entry_number: 2,
    },
    {
      id: 'example-3',
      email: 'alex***@yahoo.com',
      transformation_goal: 'Conquer my self-doubt and step into my power as a leader',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      entry_number: 3,
    },
  ];

  const maskEmail = (email: string) => {
    if (email.includes('***')) return email; // Already masked
    const [username, domain] = email.split('@');
    const masked = username.substring(0, 2) + '***';
    return `${masked}@${domain}`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Use example data if no real entries yet
  const displayWarriors = warriors.length > 0 ? warriors : exampleWarriors;
  const displayLatest = latestEntry || exampleWarriors[0];
  const displayCount = totalCount > 0 ? totalCount : 3;
  const isUsingExamples = warriors.length === 0;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-sky-800 mb-4">
            {isUsingExamples ? 'Join The Movement' : 'The Movement Is Growing'}
          </h2>
          <div className="flex items-center justify-center gap-4 text-sky-600">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="text-2xl font-bold text-sunset">{displayCount}</span>
              <span>{isUsingExamples ? 'Example Transformations' : 'Warriors Committed'}</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-sky-200" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>{isUsingExamples ? 'Be Next To Join' : 'Growing Every Hour'}</span>
            </div>
          </div>
        </motion.div>

        {/* Latest entry highlight */}
        {displayLatest && (
          <motion.div
            className="mb-8 p-6 bg-gradient-to-r from-sunset/10 to-sky-100 rounded-2xl border-2 border-sunset/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            key={displayLatest.id}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-sky-800 uppercase tracking-wider">
                {isUsingExamples ? 'Example Warrior' : 'Latest Warrior'}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <p className="text-sky-700 font-medium mb-1">
                  {maskEmail(displayLatest.email)} joined {getTimeAgo(displayLatest.created_at)}
                </p>
                <p className="text-sky-900 font-bold">
                  <Target className="w-4 h-4 inline mr-2 text-sunset" />
                  Goal: "{displayLatest.transformation_goal}"
                </p>
              </div>
              <Badge className="bg-sunset text-white">
                Entry #{displayLatest.entry_number}
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Recent entries */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {displayWarriors.slice(1).map((warrior, index) => (
              <motion.div
                key={warrior.id}
                className="p-4 bg-white rounded-xl border border-sky-200 hover:border-sunset/50 transition-colors"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <User className="w-4 h-4 text-sky-600" />
                      <span className="text-sm text-sky-600">
                        {maskEmail(warrior.email)}
                      </span>
                      <span className="text-xs text-sky-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {getTimeAgo(warrior.created_at)}
                      </span>
                    </div>
                    {warrior.transformation_goal && (
                      <p className="text-sm text-sky-800 ml-7">
                        "{warrior.transformation_goal}"
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-sky-500">
                    Entry #{warrior.entry_number}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Join message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sky-600">
            Every warrior who commits inspires another to begin.
            <br />
            <span className="font-bold text-sunset">Will you be next?</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}