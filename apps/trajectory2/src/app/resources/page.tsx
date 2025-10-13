'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Download, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-base py-12 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="border-gold text-gold mb-6 px-6 py-3 luxury-glow">
            <span className="w-2 h-2 bg-gold rounded-full mr-2 animate-pulse"></span>
            FREE RESOURCES
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary mb-6 leading-tight">
            Free Resources &{' '}
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#C89B3C] bg-clip-text text-transparent">
              Kill the Boy
            </span>
          </h1>
          <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
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
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-[var(--brand-gold)] relative overflow-hidden text-white rounded-3xl p-12 shadow-2xl">
            {/* Animated background effects */}
            <div className="absolute inset-0 opacity-20">
              <motion.div 
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  x: [0, 30, 0],
                  y: [0, -30, 0]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl"
                animate={{ 
                  scale: [1.3, 1, 1.3],
                  x: [0, -30, 0],
                  y: [0, 30, 0]
                }}
                transition={{ 
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <Badge variant="outline" className="border-gold text-gold mb-6 bg-black/30">
                  <Sparkles className="w-4 h-4 mr-2" />
                  THE AWAKENING
                </Badge>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                  The Story: Kill the Boy
                </h2>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-8 mb-12">
                <p className="text-xl text-orange-100 leading-relaxed">
                  &ldquo;When I turned 25, my mentor told me something I&apos;ll never forget:&rdquo;
                </p>
                
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-gold mb-4">&ldquo;Kill the boy.&rdquo;</p>
                  <p className="text-lg text-orange-200">It wasn&apos;t about violence. It was about transformation.</p>
                </div>
                
                <p className="text-lg text-orange-100 leading-relaxed">
                  It meant letting go of the parts of me that kept me small, reactive, average — so I could rise into discipline, presence, and responsibility.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-2xl font-display font-bold text-white mb-6">The Boy</h3>
                    <ul className="space-y-4">
                      {[
                        'The boy settles. The man insists.',
                        'The boy tolerates mediocrity. The man demands excellence.',
                        'The boy complains. The man is silent, steady, grounded.',
                        'The boy explains himself. The man doesn\'t need to — his presence speaks.',
                        'The boy reacts, pulled like a puppet. The man observes, cuts the strings, and chooses his response.',
                        'The boy rushes. The man moves with intention.',
                        'The boy asks: "What can the world offer me?"'
                      ].map((text, i) => (
                        <li key={i} className="text-orange-100 flex items-start gap-3">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-2xl font-display font-bold text-white mb-6">The Man</h3>
                    <ul className="space-y-4">
                      {[
                        'The man commands.',
                        'The man creates solutions for others.',
                        'The man needs no explanation. His presence speaks louder than words.',
                        'The man cuts the strings and chooses every response with intention.',
                        'The man moves with patience and precision, every action aligned.',
                        'The man asks: "What can I offer the world?"'
                      ].map((text, i) => (
                        <li key={i} className="text-orange-100 flex items-start gap-3">
                          <span className="text-gold mt-1">•</span>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                
                <p className="text-xl text-center text-white font-semibold leading-relaxed mt-8">
                  To kill the boy is not to reject your youth, but to lay it to rest — so the man can rise.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Free Resources */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Free Assessment */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="luxury-card h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Free Life Assessment
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                Discover what&apos;s shaping your path and how to raise your floor in 10 minutes. Get your personalized scorecard plus 1–2 micro-actions to raise your floor this week.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-secondary flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  Find out which lane you&apos;re in
                </li>
                <li className="text-secondary flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  Get your Trajectory Avatar
                </li>
                <li className="text-secondary flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  Receive personalized actions
                </li>
              </ul>
              <Button asChild className="w-full luxury-button">
                <Link href="/assessment/landing" className="inline-flex items-center gap-2">
                  Take Free Assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trajectory Books */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="luxury-card h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F7931E] to-[#C89B3C] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Trajectory Books
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                A curated collection of 50+ transformational books for growth-minded men ready to command their lives.
              </p>
              <Button asChild variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black transition-all">
                <Link href="/resources" className="inline-flex items-center gap-2">
                  Download Free List
                  <Download className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Weekly Newsletter */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="luxury-card h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C89B3C] to-[#FF6B35] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary mb-4">
                Weekly Newsletter
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                Get weekly insights, frameworks, and practical tools to accelerate your transformation journey.
              </p>
              <Button asChild variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black transition-all">
                <Link href="/newsletter" className="inline-flex items-center gap-2">
                  Subscribe Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="luxury-glass-gold rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 via-[#F7931E]/10 to-[#C89B3C]/10 animate-pulse" />
            
            <div className="relative z-10">
              <Badge variant="outline" className="border-gold text-gold mb-6">
                START YOUR JOURNEY
              </Badge>
              <h2 className="text-4xl font-display font-bold text-primary mb-6">
                Ready to Start Your Transformation?
              </h2>
              <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                Take the free assessment now and discover your path to commanding your trajectory.
              </p>
              <Button asChild className="luxury-button h-16 px-12 text-xl shadow-2xl">
                <Link href="/assessment/landing" className="inline-flex items-center gap-3">
                  Start Free Assessment
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
