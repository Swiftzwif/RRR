'use client';

import { getDomainLabel } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface DomainStatCardProps {
  domain: string;
  level: 'low' | 'mid' | 'high';
  progress: number; // 0-100 (internal only)
  nextMilestone: string;
  sevenDayPlay: string;
  isFocusArea?: boolean;
  className?: string;
}

export function DomainStatCard({
  domain,
  level,
  progress,
  nextMilestone,
  sevenDayPlay,
  isFocusArea = false,
  className = ''
}: DomainStatCardProps) {
  const domainLabel = getDomainLabel(domain, level);
  const progressWidth = `${progress}%`;

  return (
    <div className={cn(
      'bg-white rounded-card border-2 p-6 shadow-elevation-2 transition-all duration-normal hover:shadow-elevation-6',
      isFocusArea ? 'border-accent bg-accent/5' : 'border-gray-200',
      className
    )}>
      {/* Focus Badge */}
      {isFocusArea && (
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent text-white text-xs font-medium mb-4">
          Focus Now
        </div>
      )}

      {/* Domain Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h4 font-semibold text-ink capitalize">{domain}</h3>
        <span className={cn(
          'px-3 py-1 rounded-full text-sm font-medium',
          level === 'high' ? 'bg-green/10 text-green' :
          level === 'mid' ? 'bg-yellow/10 text-yellow' :
          'bg-red/10 text-red'
        )}>
          {domainLabel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-normal ease-out',
              level === 'high' ? 'bg-green' : 
              level === 'mid' ? 'bg-yellow' : 'bg-red'
            )}
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Next Milestone */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 font-medium mb-2">Next Milestone:</p>
        <p className="text-sm text-ink">{nextMilestone}</p>
      </div>

      {/* 7-Day Play */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-600 font-medium mb-2">7-Day Play:</p>
        <p className="text-sm text-ink">{sevenDayPlay}</p>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-ink rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
        Start 7-Day Play
      </button>
    </div>
  );
}
