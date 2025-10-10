'use client';

import { getCopy } from '@/lib/copy';
import { Domain } from '@/lib/scoring';
import { motion } from 'framer-motion';

interface ResultCardProps {
  domain: Domain;
  score: number;
  actions: string[];
  className?: string;
}

export default function ResultCard({ 
  domain, 
  score, 
  actions, 
  className = '' 
}: ResultCardProps) {
  const domainLabels = getCopy("results.domains") as Record<Domain, string>;
  const domainName = domainLabels[domain] || domain;
  
  const getScoreColor = (score: number) => {
    if (score <= 3.1) return 'text-red-600';
    if (score <= 4.1) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score <= 3.1) return '🔴';
    if (score <= 4.1) return '🟡';
    return '🟢';
  };

  const getCardGradient = (score: number) => {
    if (score <= 3.1) return 'from-red-50 to-red-100';
    if (score <= 4.1) return 'from-yellow-50 to-yellow-100';
    return 'from-green-50 to-green-100';
  };

  const getBorderColor = (score: number) => {
    if (score <= 3.1) return 'border-red-200';
    if (score <= 4.1) return 'border-yellow-200';
    return 'border-green-200';
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${getCardGradient(score)} p-8 rounded-3xl border ${getBorderColor(score)} shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-bold text-slate-800">
          {domainName}
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-2xl">{getScoreEmoji(score)}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-white/50 rounded-full h-3 mb-3 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>1.0</span>
          <span>5.0</span>
        </div>
      </div>

      {actions.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-4">
            Suggested Actions:
          </h4>
          <ul className="space-y-3">
            {actions.map((action, index) => (
              <motion.li
                key={index}
                className="text-slate-600 flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{action}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
