'use client';

import { labelForScore } from '@/lib/scoring';
import { AnimatedDiv } from '@/components/animation/AnimatedComponents';
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
    if (score <= 3.1) return 'from-red-500 to-red-600';
    if (score <= 4.1) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
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
          <span className="text-lg font-semibold text-slate-700">{label}</span>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-slate-800">{displayValue.toFixed(1)}</span>
            <span className="text-xl">{getScoreEmoji(value)}</span>
          </div>
        </div>
      )}

      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
        <AnimatedDiv
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
        <div className="flex justify-between text-sm text-slate-500">
          <span>1.0</span>
          <span className="font-semibold text-slate-700">{scoreLabel}</span>
          <span>5.0</span>
        </div>
      )}
    </div>
  );
}
