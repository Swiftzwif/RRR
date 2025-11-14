'use client';

import { labelForScore } from '@/lib/scoring';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MeterProps {
  value: number; // 1-5 scale
  label: string;
  className?: string;
  animated?: boolean;
  showLabel?: boolean;
}

export default function Meter({ 
  value, 
  label, 
  className = '', 
  animated = true,
  showLabel = true 
}: MeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = (value / 5) * 100;
  const scoreLabel = labelForScore(value);
  
  const getScoreColor = (score: number) => {
    if (score <= 3.1) return 'from-danger to-red-600';
    if (score <= 4.1) return 'from-warn to-gold-600';
    return 'from-success to-green-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score <= 3.1) return '🔴';
    if (score <= 4.1) return '🟡';
    return '🟢';
  };

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className={`space-y-4 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-sky-800">{label}</span>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-sky-900">{displayValue.toFixed(1)}</span>
            <span className="text-xl">{getScoreEmoji(value)}</span>
          </div>
        </div>
      )}

      <div className="w-full bg-sky-100 rounded-full h-4 overflow-hidden shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${getScoreColor(value)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: 'easeOut',
            delay: animated ? 0.3 : 0
          }}
        />
      </div>

      {showLabel && (
        <div className="flex justify-between text-sm text-sky-600">
          <span>1.0</span>
          <span className="font-semibold text-sky-800">{scoreLabel}</span>
          <span>5.0</span>
        </div>
      )}
    </div>
  );
}
