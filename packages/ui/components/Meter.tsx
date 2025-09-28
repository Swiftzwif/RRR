'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
// Local scoring function to avoid dependency issues
const labelForScore = (score: number): string => {
  if (score <= 2.0) return 'Low';
  if (score <= 3.0) return 'Below Average';
  if (score <= 3.5) return 'Average';
  if (score <= 4.0) return 'Above Average';
  return 'High';
};

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
          <span className="text-sm font-medium text-sky-800">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-sky-600">{displayValue.toFixed(1)}</span>
            <span className="text-lg">{getScoreEmoji(value)}</span>
          </div>
        </div>
      )}
      
      <div className="w-full bg-sky-200 rounded-full h-3 relative">
        <motion.div
          className={`h-3 rounded-full ${getScoreColor(value)}`}
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
        <div className="flex justify-between text-xs text-sky-500">
          <span>1.0</span>
          <span className="font-medium text-sky-700">{scoreLabel}</span>
          <span>5.0</span>
        </div>
      )}
    </div>
  );
}
