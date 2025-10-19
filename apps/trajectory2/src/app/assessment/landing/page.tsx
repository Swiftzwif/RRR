'use client';

import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Target, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentLandingPage() {
  return (
    <div className="min-h-screen bg-base py-12 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="border-gold text-gold mb-6 px-6 py-3 luxury-glow"
          >
            <span className="w-2 h-2 bg-gold rounded-full mr-2 animate-pulse"></span>
            LIFE TRAJECTORY ASSESSMENT
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary mb-6 leading-tight">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#C89B3C] bg-clip-text text-transparent">
              Life Trajectory
            </span>
          </h1>
          <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed mb-8">
            Take a 10-minute assessment to understand what&apos;s shaping your
            path and how to raise your floor. Get personalized insights that can
            transform your approach to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center px-10 py-5 luxury-button rounded-2xl shadow-xl text-lg group"
            >
              Begin Assessment
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/story"
              className="inline-flex items-center px-10 py-5 border-2 border-[var(--border-gold)] text-gold rounded-2xl hover:bg-gold hover:text-black hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* What You'll Discover */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-gold text-gold mb-4">
              YOUR INSIGHTS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              What You&apos;ll Discover
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Our assessment analyzes six core life domains to give you a
              complete picture of your current trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="luxury-card text-center group"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Your Life Identity
              </h3>
              <p className="text-secondary leading-relaxed">
                Are you a Drifter, Balancer, or Architect? Discover your current
                trajectory pattern and what it means for your future.
              </p>
            </motion.div>

            <motion.div
              className="luxury-card text-center group"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#F7931E] to-[#C89B3C] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Domain Analysis
              </h3>
              <p className="text-secondary leading-relaxed">
                Get insights into 6 key life domains: identity, health,
                finances, relationships, emotions, and focus.
              </p>
            </motion.div>

            <motion.div
              className="luxury-card text-center group"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C89B3C] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Action Plan
              </h3>
              <p className="text-secondary leading-relaxed">
                Receive personalized 7-day and 30-day action plans based on your
                lowest-scoring areas.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-gold text-gold mb-4">
              THE PROCESS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              How It Works
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Simple, honest, and designed to give you real insights about your
              life trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white font-bold text-2xl">1</span>
              </motion.div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Answer Honestly
              </h3>
              <p className="text-secondary leading-relaxed">
                15 carefully crafted questions about your life across six key
                domains. Take your time and be honest with yourself.
              </p>
            </div>

            <div className="text-center">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-[#F7931E] to-[#C89B3C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white font-bold text-2xl">2</span>
              </motion.div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Get Your Results
              </h3>
              <p className="text-secondary leading-relaxed">
                Receive your personalized trajectory analysis with domain
                scores, avatar type, and actionable insights.
              </p>
            </div>

            <div className="text-center">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-[#C89B3C] to-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white font-bold text-2xl">3</span>
              </motion.div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Take Action
              </h3>
              <p className="text-secondary leading-relaxed">
                Use your personalized action plan to start making targeted
                improvements in your weakest areas.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why Take This Assessment */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-[var(--brand-gold)] relative overflow-hidden text-white rounded-3xl p-12 shadow-2xl">
            {/* Animated background effects */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, -20, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <div className="text-center mb-12 relative z-10">
              <Badge
                variant="outline"
                className="border-gold text-gold mb-4 bg-black/30"
              >
                WHY IT MATTERS
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Why Take This Assessment?
              </h2>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
                Most people drift through life without understanding what&apos;s
                actually driving their trajectory. This assessment changes that.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Clarity on Your Current Path
                    </h3>
                    <p className="text-orange-100">
                      Understand exactly where you stand across all life domains
                      and what&apos;s driving your trajectory.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F7931E] to-[#C89B3C] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Targeted Improvement Areas
                    </h3>
                    <p className="text-orange-100">
                      Identify your weakest domains and get specific actions to
                      improve them quickly.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#C89B3C] to-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Immediate Action Plan
                    </h3>
                    <p className="text-orange-100">
                      Get 7-day and 30-day action plans tailored to your
                      specific situation and goals.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#C89B3C] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Personalized Avatar
                    </h3>
                    <p className="text-orange-100">
                      Discover your trajectory pattern and understand what it
                      means for your future success.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F7931E] to-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Quick & Efficient
                    </h3>
                    <p className="text-orange-100">
                      Complete in just 10 minutes and get insights that can
                      transform your approach to life.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#C89B3C] to-[#F7931E] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Based on Proven Frameworks
                    </h3>
                    <p className="text-orange-100">
                      Built on research-backed frameworks used by top
                      entrepreneurs and leaders.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="luxury-glass-gold rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 via-[#F7931E]/10 to-[#C89B3C]/10 animate-pulse" />

            <div className="relative z-10">
              <Badge variant="outline" className="border-gold text-gold mb-6">
                BEGIN YOUR JOURNEY
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                Ready to Discover Your Trajectory?
              </h2>
              <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of men who have taken this assessment and
                transformed their approach to life. Your trajectory determines
                your destiny—start understanding yours today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/assessment"
                  className="inline-flex items-center px-12 py-6 luxury-button rounded-2xl shadow-2xl text-xl group"
                >
                  Begin Assessment
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-secondary">
                <div className="flex items-center gap-2 px-4 py-2 bg-elev-1 rounded-full">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>10 minutes</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-elev-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <span>Free</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-elev-1 rounded-full">
                  <Users className="w-4 h-4 text-gold" />
                  <span>Personalized results</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
