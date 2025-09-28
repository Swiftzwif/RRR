'use client';

import { getCopy } from '@/lib/copy';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CoachingPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      try {
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
        console.error('Error checking access:', error);
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

  const coachingData = getCopy('tbd.coaching') as any;
  const processSteps = coachingData.process || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sunset border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sand-200">Loading coaching information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-sand-50 mb-4">
            {coachingData.title}
          </h1>
          <p className="text-lg text-sand-200 max-w-3xl mx-auto">
            {coachingData.description}
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-display font-bold text-sand-50 mb-8 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            {processSteps.map((step: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-6 strata-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="w-8 h-8 bg-sunset/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sunset font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-sand-200 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold text-sand-50 mb-8 text-center">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 strata-card">
              <Users className="w-12 h-12 text-sunset mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-sand-50 mb-2">
                Expert Guidance
              </h3>
              <p className="text-sand-200 text-sm">
                Work with experienced coaches who understand trajectory transformation
              </p>
            </div>
            <div className="text-center p-6 strata-card">
              <Target className="w-12 h-12 text-sunset mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-sand-50 mb-2">
                Personalized Plan
              </h3>
              <p className="text-sand-200 text-sm">
                Get a customized roadmap tailored to your specific situation and goals
              </p>
            </div>
            <div className="text-center p-6 strata-card">
              <Clock className="w-12 h-12 text-sunset mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-sand-50 mb-2">
                Ongoing Support
              </h3>
              <p className="text-sand-200 text-sm">
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
            <div className="strata-card p-8 max-w-md mx-auto">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-sand-50 mb-4">
                You're All Set!
              </h3>
              <p className="text-sand-200 mb-6">
                Your coaching interview has been scheduled. Check your email for details.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_COACHING_SCHEDULER_URL}
                className="strata-button w-full"
              >
                View Schedule
              </a>
            </div>
          ) : (
            <div className="strata-card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-display font-bold text-sand-50 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-sand-200 mb-6">
                Book your coaching interview and start your transformation journey.
              </p>
              <div className="text-3xl font-bold text-sunset mb-6">
                $24.99
              </div>
              <button
                onClick={handlePurchase}
                className="strata-button w-full"
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
