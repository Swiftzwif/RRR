'use client';

import { AnimatedSvg, AnimatedPath, AnimatedCircle } from '@/components/animation/AnimatedComponents';

interface LogoMarkProps {
  className?: string;
  showGlow?: boolean;
}

export function LogoMark({ className = '', showGlow = true }: LogoMarkProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      {showGlow && (
        <div className="absolute inset-0 blur-2xl opacity-50">
          <svg
            width="48"
            height="48"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10 C 80 20, 90 50, 50 90 C 10 50, 20 20, 50 10"
              fill="var(--brand-gold)"
              opacity="0.6"
            />
          </svg>
        </div>
      )}
      
      {/* Main logo */}
      <AnimatedSvg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Golden arc path representing trajectory */}
        <AnimatedPath
          d="M20 80 Q 50 20, 80 40"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Arrow at the end */}
        <AnimatedPath
          d="M80 40 L75 35 M80 40 L75 45"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />

        {/* Starting point */}
        <AnimatedCircle
          cx="20"
          cy="80"
          r="3"
          fill="var(--brand-gold)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        />
        
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-gold-400)" />
            <stop offset="50%" stopColor="var(--brand-gold)" />
            <stop offset="100%" stopColor="var(--brand-gold-600)" />
          </linearGradient>
        </defs>
      </AnimatedSvg>
    </div>
  );
}
