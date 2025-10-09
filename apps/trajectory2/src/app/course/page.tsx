'use client';

import { getCopy } from '@/lib/copy';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Clock, Users } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            DIGITAL APPLICATION
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            {courseData.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {courseData.description}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
              Comprehensive Content
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Deep-dive modules covering all aspects of trajectory transformation
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
              Self-Paced Learning
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Learn at your own pace with lifetime access to all materials
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
              Community Access
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Join a community of like-minded individuals on their journey
            </p>
          </div>
        </motion.div>

        {/* Modules */}
        <motion.div
          className="space-y-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {modules.map((module, index) => (
            <motion.div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-slate-800 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {module.status === 'unlocked' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Unlocked</span>
                    </div>
                  )}
                  {module.status === 'coming_soon' && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Coming Soon</span>
                    </div>
                  )}
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </motion.div>
          ))}
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
                You're All Set!
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                You have full access to the course. Start your transformation journey today.
              </p>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                Access Course
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white p-12 rounded-3xl shadow-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                Ready to Transform Your Trajectory?
              </h3>
              <p className="text-blue-200 mb-8 leading-relaxed">
                Get lifetime access to the complete course and start your journey to a higher trajectory.
              </p>
              <div className="text-4xl font-bold text-orange-400 mb-8">
                $199.99 → $99.99
              </div>
              <div className="text-lg text-blue-200 mb-8">
                50% OFF - Limited to first 250 people
              </div>
              <button
                onClick={handlePurchase}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
              >
                Get the Course
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
