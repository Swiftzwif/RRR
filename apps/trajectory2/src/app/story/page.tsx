'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Lightbulb, Sparkles, Target } from "lucide-react";
import Link from 'next/link';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-base py-12 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero */}
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
            THE TRAJECTORY STORY
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary mb-6 leading-tight">
            The Story Behind{" "}
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#C89B3C] bg-clip-text text-transparent">
              Trajectory
            </span>
          </h1>
          <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
            Every life follows a trajectory. Some lead to fulfillment, others to
            frustration. The difference isn&apos;t luck—it&apos;s the systems,
            habits, and choices that shape your path.
          </p>
        </motion.div>

        {/* Kill the Boy - Featured Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-[var(--brand-gold)] relative overflow-hidden text-white rounded-3xl p-12 shadow-2xl">
            {/* Animated background effects */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl"
                animate={{
                  scale: [1.3, 1, 1.3],
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <Badge
                  variant="outline"
                  className="border-gold text-gold mb-6 bg-black/30"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  THE AWAKENING
                </Badge>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                  &ldquo;Kill the Boy&rdquo;
                </h2>
                <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
                  When I turned 25, my mentor told me something I&apos;ll never
                  forget
                </p>
              </div>

              <div className="max-w-5xl mx-auto space-y-8 mb-12">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gold mb-4 leading-tight">
                    &ldquo;Kill the boy.&rdquo;
                  </p>
                  <p className="text-lg text-orange-200">
                    It wasn&apos;t about violence. It was about transformation.
                  </p>
                </div>

                <p className="text-lg text-orange-100 leading-relaxed">
                  It meant letting go of the parts of me that kept me small,
                  reactive, average — so I could rise into discipline, presence,
                  and responsibility.
                </p>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="side-panel-container mb-8">
                <motion.div
                  className="side-panel-left"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    The Boy
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "The boy settles. The man insists.",
                      "The boy tolerates mediocrity. The man demands excellence.",
                      "The boy complains. The man is silent, steady, grounded.",
                      "The boy explains himself. The man doesn't need to — his presence speaks.",
                      "The boy reacts, pulled like a puppet. The man observes, cuts the strings.",
                      "The boy rushes. The man moves with intention.",
                      'The boy asks: "What can the world offer me?"',
                    ].map((text, i) => (
                      <motion.li
                        key={i}
                        className="text-secondary flex items-start gap-3 pl-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-red-400 mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  className="side-panel-right"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C89B3C] to-[#FF6B35] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    The Man
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "The man commands.",
                      "The man creates solutions for others.",
                      "The man needs no explanation. His presence speaks louder than words.",
                      "The man cuts the strings and chooses every response with intention.",
                      "The man moves with patience and precision, every action aligned.",
                      'The man asks: "What can I offer the world?"',
                    ].map((text, i) => (
                      <motion.li
                        key={i}
                        className="text-orange-100 flex items-start gap-3 pl-2"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-gold mt-1 flex-shrink-0">•</span>
                        <span>{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <p className="text-xl text-center text-white font-semibold leading-relaxed">
                To kill the boy is not to reject your youth, but to lay it to
                rest — so the man can rise.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Three Core Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Target,
              title: "The Problem",
              content:
                "Most people drift through life without a clear understanding of what's actually driving their trajectory. They make decisions based on immediate circumstances rather than long-term vision, leading to inconsistent progress and unfulfilled potential.",
              gradient: "from-[#FF6B35] to-[#F7931E]",
            },
            {
              icon: Lightbulb,
              title: "The Solution",
              content:
                "Trajectory is built on the principle that your life follows predictable patterns based on six core domains. By understanding where you currently stand in each domain, you can make targeted improvements that compound over time.",
              gradient: "from-[#F7931E] to-[#C89B3C]",
            },
            {
              icon: ArrowRight,
              title: "Your Journey",
              content:
                "The assessment takes just 10 minutes but provides insights that can transform your approach to life. You'll discover your current trajectory pattern and receive personalized recommendations for improvement.",
              gradient: "from-[#C89B3C] to-[#FF6B35]",
            },
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="luxury-card h-full text-center group">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-4">
                  {section.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* About Jean Paul Maldonado */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="luxury-glass-gold rounded-3xl p-12 shadow-2xl border-2 border-[var(--brand-gold)]">
            <div className="text-center mb-10">
              <Badge variant="outline" className="border-gold text-gold mb-4">
                <Heart className="w-4 h-4 mr-2" />
                MEET THE FOUNDER
              </Badge>
              <h2 className="text-4xl font-display font-bold text-primary mb-4">
                About Jean Paul Maldonado
              </h2>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              <p className="text-lg text-secondary leading-relaxed">
                My name is Jean Paul Maldonado — I&apos;m not a guru; I&apos;m
                an advisor and curator of esoteric information. My inspired
                talent lies in researching and translating complex, unseen
                truths into practical, grounded concepts that help people
                thrive. I&apos;m especially skilled at connecting the dots
                between the spiritual and the strategic.
              </p>

              <p className="text-lg text-secondary leading-relaxed">
                My education wouldn&apos;t be half of what it is without my
                apprenticeship under Robinson Aquino, who has been my mentor
                since 2018. I credit much of my understanding to his teachings.
                With a background in finance, accounting, and taxation, I hold a
                B.S. in Finance from Providence College and a degree in
                Accounting from UMass Lowell. I&apos;m also an Enrolled Agent,
                licensed to represent taxpayers before the IRS.
              </p>

              <p className="text-lg text-secondary leading-relaxed">
                I founded Trajectory because where I come from, I&apos;ve seen
                too many people — especially young men — struggling in silence.
                My mission is to improve the joy-to-misery ratio in my community
                by helping men get the best return on investment for their time,
                energy, and attention. My goal is to transform the lives of 250
                men by 2026, and 2,500 by 2030.
              </p>

              <p className="text-lg text-secondary leading-relaxed">
                Born on June 12, 2000 in Methuen, Massachusetts and raised in a
                proud Dominican household, I still love my rice and beans — and
                I love helping people flourish. I&apos;m a lifelong learner,
                reader, traveler, and student of life.
              </p>

              <div className="mt-8 p-8 bg-gradient-to-br from-[#FF6B35]/20 via-[#F7931E]/20 to-[#C89B3C]/20 rounded-2xl border-2 border-gold/30">
                <p className="text-2xl md:text-3xl font-bold text-center text-primary leading-relaxed">
                  My message to the world is simple:
                  <br />
                  <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#C89B3C] bg-clip-text text-transparent">
                    You have infinite worth.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="luxury-glass-gold rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 via-[#F7931E]/10 to-[#C89B3C]/10 animate-pulse" />

            <div className="relative z-10">
              <Badge variant="outline" className="border-gold text-gold mb-6">
                START YOUR JOURNEY
              </Badge>
              <h2 className="text-4xl font-display font-bold text-primary mb-6">
                Ready to Discover Your Trajectory?
              </h2>
              <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                Take the assessment now and start your journey to a higher
                trajectory.
              </p>
              <Button
                asChild
                className="luxury-button h-16 px-12 text-xl shadow-2xl"
              >
                <Link
                  href="/assessment/landing"
                  className="inline-flex items-center gap-3"
                >
                  Start Your Assessment
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
