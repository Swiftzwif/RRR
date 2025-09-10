'use client';

import ModuleCardTBD from '@/components/ModuleCardTBD';
import { getCopy } from '@/lib/copy';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CommunityPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user has purchased course or coaching
          const { data: purchases } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', user.id)
            .in('product', ['course', 'coaching']);

          setHasAccess(!!(purchases && purchases.length > 0));
        }
      } catch (error) {
        console.error('Error checking access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleNotify = async (email: string) => {
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          topic: 'community',
        }),
      });
    } catch (error) {
      console.error('Error saving notification:', error);
      throw error;
    }
  };

  const communityData = getCopy('tbd.community') as any;
  const features = communityData.features || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sunset border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sand-200">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-sand-50 mb-4">
            {communityData.title}
          </h1>
          <p className="text-lg text-sand-200 max-w-3xl mx-auto">
            {communityData.description}
          </p>
        </motion.div>

        {hasAccess ? (
          /* Community Content for Members */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="strata-card p-8">
                <h2 className="text-2xl font-display font-bold text-sand-50 mb-6">
                  Community Features
                </h2>
                <div className="space-y-4">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-sunset rounded-full flex-shrink-0" />
                      <span className="text-sand-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="strata-card p-8">
                <h2 className="text-2xl font-display font-bold text-sand-50 mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-sunset/10 border border-sunset/20 rounded-lg text-sand-50 hover:bg-sunset/20 transition-colors">
                    Join Discussion Forums
                  </button>
                  <button className="w-full p-4 bg-sunset/10 border border-sunset/20 rounded-lg text-sand-50 hover:bg-sunset/20 transition-colors">
                    View Upcoming Calls
                  </button>
                  <button className="w-full p-4 bg-sunset/10 border border-sunset/20 rounded-lg text-sand-50 hover:bg-sunset/20 transition-colors">
                    Find Accountability Partner
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 strata-card">
                <MessageCircle className="w-12 h-12 text-sunset mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-sand-50 mb-2">
                  Discussion Forums
                </h3>
                <p className="text-sand-200 text-sm">
                  Connect with like-minded individuals on their transformation journey
                </p>
              </div>
              <div className="text-center p-6 strata-card">
                <Calendar className="w-12 h-12 text-sunset mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-sand-50 mb-2">
                  Weekly Calls
                </h3>
                <p className="text-sand-200 text-sm">
                  Join group coaching sessions and Q&A with experts
                </p>
              </div>
              <div className="text-center p-6 strata-card">
                <BookOpen className="w-12 h-12 text-sunset mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-sand-50 mb-2">
                  Resources
                </h3>
                <p className="text-sand-200 text-sm">
                  Access exclusive tools, templates, and guides
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* TBD Module for Non-Members */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ModuleCardTBD
              module={{
                title: communityData.title,
                description: communityData.description,
                status: 'coming_soon',
              }}
              onNotify={handleNotify}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
