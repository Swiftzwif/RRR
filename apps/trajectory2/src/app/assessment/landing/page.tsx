'use client';

import { AnimatedDiv } from '@/components/animation/AnimatedComponents';
import { ArrowRight, CheckCircle, Clock, Target, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-gold-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <AnimatedDiv
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-gold-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIFE TRAJECTORY ASSESSMENT
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-sky-900 mb-8 leading-tight">
            Discover Your Life Trajectory
          </h1>
          <p className="text-xl text-sky-700 max-w-4xl mx-auto leading-relaxed mb-10">
            Take a 10-minute assessment to understand what&apos;s shaping your path and how to raise your floor.
            Get personalized insights that can transform your approach to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-sky-500 to-gold-500 text-white rounded-2xl hover:from-sky-600 hover:to-gold-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              Begin Assessment
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link
              href="/story"
              className="inline-flex items-center px-10 py-5 border-2 border-sky-300 text-sky-800 rounded-2xl hover:border-sky-400 hover:bg-sky-50 hover:scale-105 transition-all duration-300 font-semibold"
            >
              Learn More
            </Link>
          </div>
        </AnimatedDiv>

        {/* What You'll Discover */}
        <AnimatedDiv
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sky-900 mb-6">
              What You&apos;ll Discover
            </h2>
            <p className="text-lg text-sky-700 max-w-3xl mx-auto">
              Our assessment analyzes six core life domains to give you a complete picture of your current trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-sky-900 mb-4">
                Your Life Identity
              </h3>
              <p className="text-sky-700 leading-relaxed">
                Are you a Drifter, Balancer, or Architect? Discover your current trajectory pattern and what it means for your future.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-sky-900 mb-4">
                Domain Analysis
              </h3>
              <p className="text-sky-700 leading-relaxed">
                Get insights into 6 key life domains: identity, health, finances, relationships, emotions, and focus.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-sky-900 mb-4">
                Action Plan
              </h3>
              <p className="text-sky-700 leading-relaxed">
                Receive personalized 7-day and 30-day action plans based on your lowest-scoring areas.
              </p>
            </div>
          </div>
        </AnimatedDiv>

        {/* How It Works */}
        <AnimatedDiv
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sky-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-sky-700 max-w-3xl mx-auto">
              Simple, honest, and designed to give you real insights about your life trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-display font-bold text-sky-900 mb-4">
                Answer Honestly
              </h3>
              <p className="text-sky-700 leading-relaxed">
                15 carefully crafted questions about your life across six key domains. Take your time and be honest with yourself.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-display font-bold text-sky-900 mb-4">
                Get Your Results
              </h3>
              <p className="text-sky-700 leading-relaxed">
                Receive your personalized trajectory analysis with domain scores, avatar type, and actionable insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-display font-bold text-sky-900 mb-4">
                Take Action
              </h3>
              <p className="text-sky-700 leading-relaxed">
                Use your personalized action plan to start making targeted improvements in your weakest areas.
              </p>
            </div>
          </div>
        </AnimatedDiv>

        {/* Why Take This Assessment */}
        <AnimatedDiv
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Why Take This Assessment?
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Most people drift through life without understanding what&apos;s actually driving their trajectory. 
                This assessment changes that.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Clarity on Your Current Path</h3>
                    <p className="text-blue-200">Understand exactly where you stand across all life domains and what&apos;s driving your trajectory.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Targeted Improvement Areas</h3>
                    <p className="text-blue-200">Identify your weakest domains and get specific actions to improve them quickly.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Immediate Action Plan</h3>
                    <p className="text-blue-200">Get 7-day and 30-day action plans tailored to your specific situation and goals.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Personalized Avatar</h3>
                    <p className="text-blue-200">Discover your trajectory pattern and understand what it means for your future success.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quick & Efficient</h3>
                    <p className="text-blue-200">Complete in just 10 minutes and get insights that can transform your approach to life.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Based on Proven Frameworks</h3>
                    <p className="text-blue-200">Built on research-backed frameworks used by top entrepreneurs and leaders.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* Final CTA */}
        <AnimatedDiv
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mb-6">
              Ready to Discover Your Trajectory?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of men who have taken this assessment and transformed their approach to life. 
              Your trajectory determines your destiny—start understanding yours today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/assessment"
                className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-xl"
              >
                Begin Assessment
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Personalized results</span>
              </div>
            </div>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
