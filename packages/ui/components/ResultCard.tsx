'use client';

import { motion } from 'framer-motion';

interface ResultCardProps {
  domain: string;
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
  const domainName = domain;
  
  const getScoreColor = (score: number) => {
    if (score <= 3.1) return 'text-danger';
    if (score <= 4.1) return 'text-warn';
    return 'text-success';
  };

  const getScoreEmoji = (score: number) => {
    if (score <= 3.1) return '🔴';
    if (score <= 4.1) return '🟡';
    return '🟢';
  };

  return (
    <motion.div
      className={`bg-white p-6 rounded-lg shadow-sm border border-sky-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sky-800">
          {domainName}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-xl">{getScoreEmoji(score)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-sky-200 rounded-full h-2 mb-2">
          <motion.div
            className="h-2 rounded-full bg-sunset"
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <div className="flex justify-between text-xs text-sky-500">
          <span>1.0</span>
          <span>5.0</span>
        </div>
      </div>

      {actions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-sky-700 mb-2">
            Suggested Actions:
          </h4>
          <ul className="space-y-1">
            {actions.map((action, index) => (
              <motion.li
                key={index}
                className="text-sm text-sky-600 flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <span className="text-sunset mt-0.5">•</span>
                {action}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
