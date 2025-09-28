'use client';

import ModuleCardTBD from '@/components/ModuleCardTBD';
import Paywall from '@/components/Paywall';
import StrataDivider from '@/components/StrataDivider';
import { getCopy } from '@/lib/copy';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Module {
  title: string;
  description: string;
  status: 'coming_soon' | 'locked' | 'unlocked';
  progress?: number;
}

export default function CoursePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user has purchased the course
          const { data: purchase } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', user.id)
            .eq('product', 'course')
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
    alert('Payment integration for the course is coming soon! Stay tuned.');
  };

  const handleNotify = async (email: string) => {
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          topic: 'course',
        }),
      });
    } catch (error) {
      console.error('Error saving notification:', error);
      throw error;
    }
  };

  const courseData = getCopy('tbd.course') as any;
  const modules: Module[] = (courseData.modules || []).map((module: any) => ({
    title: module.title,
    description: module.description,
    status: hasAccess ? 'unlocked' : 'coming_soon',
    progress: hasAccess ? Math.floor(Math.random() * 100) : undefined,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sunset border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sand-200">Loading course...</p>
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
            {courseData.title}
          </h1>
          <p className="text-lg text-sand-200 max-w-3xl mx-auto">
            {courseData.description}
          </p>
        </motion.div>

        <StrataDivider />

        {/* Modules */}
        <Paywall
          hasAccess={hasAccess}
          product="course"
          onPurchase={handlePurchase}
        >
          <div className="space-y-6">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ModuleCardTBD
                  module={module}
                  onNotify={handleNotify}
                />
              </motion.div>
            ))}
          </div>
        </Paywall>
      </div>
    </div>
  );
}
