'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RaffleHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-sunset/10" />

        {/* Floating orbs for depth */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-sunset/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sunset to-sunset-dark text-white rounded-full text-sm font-bold mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Zap className="w-4 h-4" />
          <span>GRAND OPENING SPECIAL</span>
          <Zap className="w-4 h-4" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-black text-sky-800 mb-6 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Kill The Boy.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset to-sunset-dark">
            Win The War.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-xl md:text-2xl text-sky-700 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Transform your life trajectory with 35% OFF the full course
          <br />
          <span className="font-bold text-sunset">+ Enter to win life-changing prizes</span>
        </motion.p>

        {/* Value props */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-sunset">$97</div>
            <div className="text-left">
              <div className="text-sm line-through text-sky-600">$149</div>
              <div className="text-sm font-bold text-sky-800">Save $52</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-sky-200" />

          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-sunset" />
            <div className="text-left">
              <div className="text-sm font-bold text-sky-800">Limited Time</div>
              <div className="text-sm text-sky-600">7 Days Only</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-sky-200" />

          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-sunset" />
            <div className="text-left">
              <div className="text-sm font-bold text-sky-800">16 Prizes</div>
              <div className="text-sm text-sky-600">Worth $2,500+</div>
            </div>
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-sunset to-sunset-dark hover:from-sunset-dark hover:to-sunset text-white px-12 py-7 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
          >
            <a href="#commitment">
              Begin Your Transformation Now
            </a>
          </Button>

          <p className="text-sm text-sky-600">
            Join <span className="font-bold">137 warriors</span> who&apos;ve already committed
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-sky-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>1,247+ Men Transformed</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>31-Day Journey</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}