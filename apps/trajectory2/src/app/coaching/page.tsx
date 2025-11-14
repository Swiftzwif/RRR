'use client';

import { getCopy } from '@/lib/copy';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Target, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CoachingPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!supabase) {
          setHasAccess(false);
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user has purchased coaching
          const { data: purchase } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', user.id)
            .eq('product', 'coaching')
            .single();

          setHasAccess(!!purchase);
        }
      } catch (error) {
        logger.error('Error checking access', error as Error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handlePurchase = async () => {
    // Payment integration coming soon
    alert('Payment integration for coaching is coming soon! Stay tuned.');
  };

  const coachingData = getCopy('tbd.coaching') as {
    title: string;
    description: string;
    process?: string[];
  };
  const processSteps = coachingData.process || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg">Loading coaching information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            ONE-ON-ONE SESSIONS
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 gradient-text-fallback mb-6">
            {coachingData.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {coachingData.description}
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-12 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            {processSteps.map((step: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-12 text-center">
            What You&apos;ll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                Expert Guidance
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Work with experienced coaches who understand trajectory transformation
              </p>
            </div>
            <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                Personalized Plan
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Get a customized roadmap tailored to your specific situation and goals
              </p>
            </div>
            <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                Ongoing Support
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Receive continued guidance and accountability throughout your journey
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {hasAccess ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-3xl border border-green-200/50 shadow-lg max-w-2xl mx-auto">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">
                You&apos;re All Set!
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your coaching interview has been scheduled. Check your email for details.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_COACHING_SCHEDULER_URL}
                className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                View Schedule
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white p-12 rounded-3xl shadow-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-blue-200 mb-8 leading-relaxed">
                Book your coaching interview and start your transformation journey.
              </p>
              <div className="text-4xl font-bold text-orange-400 mb-8">
                $100 per session
              </div>
              <div className="text-lg text-blue-200 mb-8">
                4 sessions total = $400
              </div>
              <button
                onClick={handlePurchase}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
              >
                Book Interview
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
