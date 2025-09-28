'use client';

import { getCopy } from '@/lib/copy';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CanyonHeroProps {
  className?: string;
}

export default function CanyonHero({ className = '' }: CanyonHeroProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background layers with parallax effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/strata/layer-1.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/strata/layer-2.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url(/strata/layer-3.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="strata-text">
              {getCopy('landing.hero.headline')}
            </span>
          </h1>
          
          <motion.p
            className="text-xl md:text-2xl text-sky-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {getCopy('landing.hero.subhead')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Link
              href="/assessment"
              className="strata-button text-lg px-8 py-4 animate-strata-pulse"
            >
              {getCopy('landing.hero.cta')}
            </Link>
            
            <Link
              href="/story"
              className="text-sky-600 hover:text-sky-800 transition-colors duration-300 text-lg font-medium"
            >
              {getCopy('landing.hero.ctaSecondary')}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-sky-300 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-1 h-3 bg-sky-400 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
