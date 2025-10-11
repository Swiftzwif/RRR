'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Download, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
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
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            FREE RESOURCES
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            Free Resources & The Kill the Boy Story
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Start your transformation journey with our free assessment and discover the story that changed everything.
          </p>
        </motion.div>

        {/* Kill the Boy Story */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
              The Story: Kill the Boy
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-xl text-blue-200 leading-relaxed">
                "When I turned 25, my mentor told me something I'll never forget:"
              </p>
              
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-400 mb-4">"Kill the boy."</p>
                <p className="text-lg text-blue-200">It wasn't about violence. It was about transformation.</p>
              </div>
              
              <p className="text-lg text-blue-200 leading-relaxed">
                It meant letting go of the parts of me that kept me small, reactive, average — so I could rise into discipline, presence, and responsibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">The Boy</h3>
                  <ul className="space-y-4">
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy settles. The man insists.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy tolerates mediocrity. The man demands excellence.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy complains. The man is silent, steady, grounded.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy explains himself. The man doesn't need to — his presence speaks.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy reacts, pulled like a puppet. The man observes, cuts the strings, and chooses his response.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy rushes. The man moves with intention.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy asks: "What can the world offer me?"</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">The Man</h3>
                  <ul className="space-y-4">
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man commands.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man creates solutions for others.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man needs no explanation. His presence speaks louder than words.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man cuts the strings and chooses every response with intention.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man moves with patience and precision, every action aligned.</span>
                    </li>
                    <li className="text-blue-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man asks: "What can I offer the world?"</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg text-blue-200 leading-relaxed text-center mt-8">
                To kill the boy is not to reject your youth, but to lay it to rest — so the man can rise.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Free Resources */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Free Assessment */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
              Free Life Assessment
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Discover what's shaping your path and how to raise your floor in 10 minutes. Get your personalized scorecard plus 1–2 micro-actions to raise your floor this week.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Find out which lane you're in
              </li>
              <li className="text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Get your Trajectory Avatar
              </li>
              <li className="text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Receive personalized actions
              </li>
            </ul>
            <Link
              href="/assessment"
              className="inline-flex items-center w-full justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Take Free Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Trajectory Books */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
              Trajectory Books
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              A curated collection of 50+ transformational books for growth-minded men ready to command their lives.
            </p>
            <Link
              href="/resources"
              className="inline-flex items-center w-full justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Download Free List
              <Download className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Weekly Newsletter */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
              Weekly Newsletter
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Get weekly insights, frameworks, and practical tools to accelerate your transformation journey.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center w-full justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Subscribe Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              Ready to Start Your Transformation?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take the free assessment now and discover your path to commanding your trajectory.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              Start Free Assessment
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
