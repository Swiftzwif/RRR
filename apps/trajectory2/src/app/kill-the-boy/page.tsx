'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function KillTheBoyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            THE TRANSFORMATION
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 bg-gradient-to-r from-slate-900 via-red-900 to-orange-900 gradient-text-fallback mb-6">
            Kill the Boy
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            The story that changed everything. The moment that transformed a
            life from reactive to intentional.
          </p>
        </motion.div>

        {/* Main Story */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 text-white rounded-3xl p-12 shadow-2xl">
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-xl text-red-200 leading-relaxed">
                &ldquo;When I turned 25, my mentor told me something I&apos;ll
                never forget:&rdquo;
              </p>

              <div className="text-center py-8">
                <p className="text-6xl font-bold text-orange-400 mb-4">
                  &ldquo;Kill the boy.&rdquo;
                </p>
                <p className="text-lg text-red-200">
                  It wasn&apos;t about violence. It was about transformation.
                </p>
              </div>

              <p className="text-lg text-red-200 leading-relaxed">
                It meant letting go of the parts of me that kept me small,
                reactive, average — so I could rise into discipline, presence,
                and responsibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">
                    The Boy
                  </h3>
                  <ul className="space-y-4">
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy settles. The man insists.</span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>
                        The boy tolerates mediocrity. The man demands
                        excellence.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>
                        The boy complains. The man is silent, steady, grounded.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>
                        The boy explains himself. The man doesn&apos;t need to —
                        his presence speaks.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>
                        The boy reacts, pulled like a puppet. The man observes,
                        cuts the strings, and chooses his response.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>The boy rushes. The man moves with intention.</span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>
                        The boy asks: &ldquo;What can the world offer me?&rdquo;
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">
                    The Man
                  </h3>
                  <ul className="space-y-4">
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man commands.</span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>The man creates solutions for others.</span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>
                        The man needs no explanation. His presence speaks louder
                        than words.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>
                        The man cuts the strings and chooses every response with
                        intention.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>
                        The man moves with patience and precision, every action
                        aligned.
                      </span>
                    </li>
                    <li className="text-red-200 flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>
                        The man asks: &ldquo;What can I offer the world?&rdquo;
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-12">
                <p className="text-2xl text-orange-400 leading-relaxed">
                  To kill the boy is not to reject your youth, but to lay it to
                  rest — so the man can rise.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Transformation Process */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-12 text-center">
            The Transformation Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">1</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                Awareness
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Recognize the boy within. See the patterns of reactivity,
                settling, and external validation seeking.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">2</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                Acceptance
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Accept that the boy served a purpose, but it&apos;s time to let
                him go. No judgment, just transition.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">3</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                Action
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Begin making choices from the man&apos;s perspective. Command
                your attention, energy, and money.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 text-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              Ready to Kill the Boy?
            </h2>
            <p className="text-xl text-red-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take the assessment to discover where you stand and begin your
              transformation journey.
            </p>
            <Link
              href="/assessment/landing"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              Start Your Assessment
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
