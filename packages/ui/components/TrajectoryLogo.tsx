import React from 'react';
import Image from 'next/image';
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
      image: { width: 120, height: 40 },
      text: 'text-lg',
      spacing: 'mb-1'
    },
    md: {
      image: { width: 160, height: 53 },
      text: 'text-xl',
      spacing: 'mb-2'
    },
    lg: {
      image: { width: 200, height: 67 },
      text: 'text-2xl',
      spacing: 'mb-3'
    },
    xl: {
      image: { width: 240, height: 80 },
      text: 'text-3xl',
      spacing: 'mb-4'
    },
  };

  const currentSize = sizeClasses[size];

  const LogoImage = () => (
    <Image
      src="/trajectory-logo.png"
      alt="TRAJECTORY"
      width={currentSize.image.width}
      height={currentSize.image.height}
      className="h-auto"
      priority
    />
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
      <div className={cn(className)}>
        <LogoImage />
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

  // Full logo (default) - just show the image since it already contains the text
  return (
    <div className={cn('flex items-center', className)}>
      <LogoImage />
    </div>
  );
};

export default TrajectoryLogo;
