'use client';

import { AnimatedDiv, AnimatedSection } from '@/components/animation/AnimatedComponents';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <AnimatedDiv
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            THE TRAJECTORY STORY
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 gradient-text-fallback mb-6">
            The Story Behind Trajectory
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Every life follows a trajectory. Some lead to fulfillment, others to
            frustration. The difference isn&apos;t luck—it&apos;s the systems,
            habits, and choices that shape your path.
          </p>
        </AnimatedDiv>

        {/* Story Sections */}
        <div className="space-y-20">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-white/50 shadow-lg"
          >
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">
              The Problem
            </h2>
            <div className="prose max-w-none">
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Most people drift through life without a clear understanding of
                what&apos;s actually driving their trajectory. They make
                decisions based on immediate circumstances rather than long-term
                vision, leading to inconsistent progress and unfulfilled
                potential.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                The result? A life that feels reactive rather than intentional,
                where you&apos;re constantly putting out fires instead of
                building the future you actually want.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-white/50 shadow-lg"
          >
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">
              The Solution
            </h2>
            <div className="prose max-w-none">
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Trajectory is built on the principle that your life follows
                predictable patterns based on six core domains: identity,
                health, finances, relationships, emotions, and focus.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                By understanding where you currently stand in each domain and
                identifying the areas that need the most attention, you can make
                targeted improvements that compound over time.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                This isn&apos;t about perfection—it&apos;s about progress.
                Small, consistent improvements in your weakest areas create
                exponential growth in your overall trajectory.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-white/50 shadow-lg"
          >
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">
              Your Journey
            </h2>
            <div className="prose max-w-none">
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                The assessment takes just 10 minutes but provides insights that
                can transform your approach to life. You&apos;ll discover your
                current trajectory pattern and receive personalized
                recommendations for improvement.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                From there, you can choose to dive deeper with our course, get
                personalized coaching, or join a community of like-minded
                individuals on their own transformation journeys.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* CTA */}
        <AnimatedDiv
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              Ready to Discover Your Trajectory?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take the assessment now and start your journey to a higher
              trajectory.
            </p>
            <Link
              href="/assessment/landing"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              Start Your Assessment
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
