import React from 'react';
import { cn } from '../utils/cn';

interface TrajectoryLogoProps {
  variant?: 'full' | 'symbol' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const TrajectoryLogo: React.FC<TrajectoryLogoProps> = ({
  variant = 'full',
  size = 'md',
  className,
  showText = true,
}) => {
  const sizeClasses = {
    sm: {
      symbol: 'w-8 h-6',
      text: 'text-lg',
      spacing: 'mb-1'
    },
    md: {
      symbol: 'w-12 h-8',
      text: 'text-xl',
      spacing: 'mb-2'
    },
    lg: {
      symbol: 'w-16 h-12',
      text: 'text-2xl',
      spacing: 'mb-3'
    },
    xl: {
      symbol: 'w-20 h-16',
      text: 'text-3xl',
      spacing: 'mb-4'
    },
  };

  const currentSize = sizeClasses[size];

  const LogoSymbol = () => (
    <div className={cn('relative', currentSize.symbol)}>
      {/* Three upward-curving lines inspired by the logo */}
      <svg
        viewBox="0 0 80 60"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top curve */}
        <path
          d="M10 45 Q40 25 70 35"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-trajectory-rise"
          style={{ animationDelay: '0s' }}
        />
        {/* Middle curve */}
        <path
          d="M15 50 Q40 30 70 40"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-trajectory-rise"
          style={{ animationDelay: '0.5s' }}
        />
        {/* Bottom curve */}
        <path
          d="M20 55 Q40 35 70 45"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-trajectory-rise"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );

  const LogoText = () => (
    <span className={cn(
      'font-display font-bold tracking-wide trajectory-text',
      currentSize.text
    )}>
      TRAJECTORY
    </span>
  );

  if (variant === 'symbol') {
    return (
      <div className={cn('trajectory-text', className)}>
        <LogoSymbol />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn('trajectory-text', className)}>
        <LogoText />
      </div>
    );
  }

  // Full logo (default)
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('trajectory-text', currentSize.spacing)}>
        <LogoSymbol />
      </div>
      {showText && <LogoText />}
    </div>
  );
};

export default TrajectoryLogo;
