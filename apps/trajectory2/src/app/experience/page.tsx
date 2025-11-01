'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Lock, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Day {
  day: number;
  title: string;
  description: string;
  bookSummaries: number;
  tasks: number;
  isLocked: boolean;
  isFree: boolean;
}

export default function ExperiencePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [completedDays] = useState<number[]>([]);

  // Generate 31 days - First 7 are free, rest are locked
  const days: Day[] = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const isFree = dayNum <= 7;
    
    return {
      day: dayNum,
      title: `Day ${dayNum}: ${getDayTitle(dayNum)}`,
      description: getDayDescription(dayNum),
      bookSummaries: 3,
      tasks: 2,
      isLocked: !isFree && !hasAccess,
      isFree,
    };
  });

  useEffect(() => {
    // Check if user has purchased access
    // This would connect to your Supabase/payment system
    const checkAccess = async () => {
      // TODO: Implement real access check
      setHasAccess(false);
    };
    
    checkAccess();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            31-DAY TRANSFORMATION EXPERIENCE
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 gradient-text-fallback mb-6">
            Rethink. Redesign. Reignite.
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
            A transformational journey designed to help you become the commander of your life. 
            Each day includes 3 curated book summaries, 2 action tasks, and printable worksheets.
          </p>
          
          {/* Free Access Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Star className="w-6 h-6 text-green-600" />
              <span className="text-lg font-bold text-slate-800">Start Free: Days 1-7 Unlocked</span>
            </div>
            <p className="text-slate-600">Experience the transformation. Unlock all 31 days after meeting with Jean</p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        {completedDays.length > 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Your Progress</h3>
              <span className="text-lg font-semibold text-orange-600">
                {completedDays.length} / {hasAccess ? 31 : 7} days completed
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedDays.length / (hasAccess ? 31 : 7)) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {days.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={day.isLocked ? '#' : `/experience/day/${day.day}`}
                className={`block h-full ${day.isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`relative h-full rounded-2xl p-6 transition-all duration-300 ${
                    day.isLocked
                      ? 'bg-slate-100 border-2 border-slate-300 opacity-60'
                      : day.isFree
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:shadow-xl hover:scale-105'
                      : 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {/* Lock Badge */}
                  {day.isLocked && (
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Free Badge */}
                  {day.isFree && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        FREE
                      </div>
                    </div>
                  )}

                  {/* Day Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      day.isLocked
                        ? 'bg-slate-300 text-slate-600'
                        : day.isFree
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                    }`}>
                      {day.day}
                    </div>
                    {completedDays.includes(day.day) && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {day.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {day.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{day.bookSummaries} books</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{day.tasks} tasks</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Unlock CTA */}
        {!hasAccess && (
          <motion.div
            className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white rounded-3xl p-12 shadow-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Unlock All 31 Days?</h2>
            <p className="text-xl text-orange-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get lifetime access to the complete transformation experience after meeting with Jean. All book summaries, action tasks, and printable worksheets included.
            </p>
            <div className="text-3xl font-bold text-orange-400 mb-8">
              Full access after meeting with Jean
            </div>
            <p className="text-lg text-orange-200 mb-8">
              Schedule your meeting to unlock the complete experience
            </p>
            <button
              onClick={() => alert('Contact Jean to schedule your meeting and unlock full access!')}
              className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-xl"
            >
              Contact Jean for Access
              <ArrowRight className="ml-3 w-6 h-6" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper functions for day content
function getDayTitle(day: number): string {
  const titles: Record<number, string> = {
    1: 'Kill the Boy - The Awakening',
    2: 'Command Your Attention',
    3: 'Command Your Energy',
    4: 'Command Your Money',
    5: 'The Three Lanes',
    6: 'Audit Your Vehicle',
    7: 'Equipment Upgrades',
    // Add more titles as needed
  };
  
  return titles[day] || `Transformation Step ${day}`;
}

function getDayDescription(day: number): string {
  const descriptions: Record<number, string> = {
    1: 'Begin your transformation by understanding the power of killing the boy and awakening the commander within.',
    2: 'Learn to reclaim your attention from algorithms and distractions that steal your focus.',
    3: 'Master your energy management and create sustainable systems for peak performance.',
    4: 'Transform your relationship with money and build financial command.',
    5: 'Understand the SlowLane, SideLane, and FastLane - and choose your trajectory.',
    6: 'Conduct a deep audit of your current position and identify areas for improvement.',
    7: 'Learn the knowledge, understanding, and wisdom upgrades that accelerate growth.',
  };
  
  return descriptions[day] || 'Continue your journey of transformation and growth.';
}
