'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  const progressWidth = `${percentage}%`;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-ink">
          Progress: {current} of {total}
        </span>
        <span className="text-sm text-gray-500">
          {percentage}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-normal ease-out"
          style={{ width: progressWidth }}
        />
      </div>
      
      {/* Progress indicator dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-fast',
              index < current ? 'bg-accent' : 'bg-gray-300'
            )}
          />
        ))}
      </div>
    </div>
  );
}
