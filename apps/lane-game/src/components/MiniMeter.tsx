'use client';

import { getDomainLabel } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface MiniMeterProps {
  domain: string;
  level: 'low' | 'mid' | 'high';
  progress: number; // 0-100 (internal only)
  nextMilestone: string;
  className?: string;
}

export function MiniMeter({
  domain,
  level,
  progress,
  nextMilestone,
  className = ''
}: MiniMeterProps) {
  const domainLabel = getDomainLabel(domain, level);
  const progressWidth = `${progress}%`;

  return (
    <div className={cn('bg-white rounded-card border border-gray-200 p-4 shadow-elevation-2', className)}>
      {/* Domain Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-ink capitalize">{domain}</h3>
        <span className="text-xs text-gray-500">Level: {domainLabel}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-normal ease-out',
            level === 'high' ? 'bg-green' : 
            level === 'mid' ? 'bg-yellow' : 'bg-red'
          )}
          style={{ width: progressWidth }}
        />
      </div>

      {/* Next Milestone */}
      <p className="text-xs text-gray-600 leading-relaxed">
        {nextMilestone}
      </p>
    </div>
  );
}
