'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { labelForScore } from '@/lib/scoring';

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
    if (score <= 3.1) return 'bg-danger';
    if (score <= 4.1) return 'bg-warn';
    return 'bg-success';
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
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-sand-100">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-sand-200">{displayValue.toFixed(1)}</span>
            <span className="text-lg">{getScoreEmoji(value)}</span>
          </div>
        </div>
      )}
      
      <div className="strata-meter h-3 relative">
        <motion.div
          className={`strata-meter-fill ${getScoreColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.2 : 0,
            ease: 'easeOut',
            delay: animated ? 0.2 : 0
          }}
        />
      </div>
      
      {showLabel && (
        <div className="flex justify-between text-xs text-iron-400">
          <span>1.0</span>
          <span className="font-medium text-sand-200">{scoreLabel}</span>
          <span>5.0</span>
        </div>
      )}
    </div>
  );
}
