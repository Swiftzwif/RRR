'use client';

import StrataDivider from '@/components/StrataDivider';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-sky-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-sky-800 mb-6">
            The Story Behind Trajectory
          </h1>
          <p className="text-lg text-sky-600 max-w-3xl mx-auto leading-relaxed">
            Every life follows a trajectory. Some lead to fulfillment, others to frustration. 
            The difference isn't luck—it's the systems, habits, and choices that shape your path.
          </p>
        </motion.div>

        <StrataDivider />

        {/* Story Sections */}
        <div className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold text-sky-800 mb-6">
              The Problem
            </h2>
            <div className="prose max-w-none">
              <p className="text-sky-600 leading-relaxed mb-4">
                Most people drift through life without a clear understanding of what's actually 
                driving their trajectory. They make decisions based on immediate circumstances 
                rather than long-term vision, leading to inconsistent progress and unfulfilled potential.
              </p>
              <p className="text-sky-600 leading-relaxed">
                The result? A life that feels reactive rather than intentional, where you're 
                constantly putting out fires instead of building the future you actually want.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold text-sky-800 mb-6">
              The Solution
            </h2>
            <div className="prose max-w-none">
              <p className="text-sky-600 leading-relaxed mb-4">
                Trajectory is built on the principle that your life follows predictable patterns 
                based on six core domains: identity, health, finances, relationships, emotions, and focus.
              </p>
              <p className="text-sky-600 leading-relaxed mb-4">
                By understanding where you currently stand in each domain and identifying the 
                areas that need the most attention, you can make targeted improvements that 
                compound over time.
              </p>
              <p className="text-sky-600 leading-relaxed">
                This isn't about perfection—it's about progress. Small, consistent improvements 
                in your weakest areas create exponential growth in your overall trajectory.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold text-sky-800 mb-6">
              Your Journey
            </h2>
            <div className="prose max-w-none">
              <p className="text-sky-600 leading-relaxed mb-4">
                The assessment takes just 10 minutes but provides insights that can transform 
                your approach to life. You'll discover your current trajectory pattern and 
                receive personalized recommendations for improvement.
              </p>
              <p className="text-sky-600 leading-relaxed">
                From there, you can choose to dive deeper with our course, get personalized 
                coaching, or join a community of like-minded individuals on their own 
                transformation journeys.
              </p>
            </div>
          </motion.section>
        </div>

        <StrataDivider />

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-display font-bold text-sky-800 mb-6">
            Ready to Discover Your Trajectory?
          </h2>
          <p className="text-sky-600 mb-8 max-w-2xl mx-auto">
            Take the assessment now and start your journey to a higher trajectory.
          </p>
          <Link
            href="/assessment"
            className="strata-button text-lg px-8 py-4 inline-block"
          >
            Start Your Assessment
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
