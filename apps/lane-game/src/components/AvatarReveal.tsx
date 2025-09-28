'use client';

import { formatAvatarReveal } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AvatarRevealProps {
  avatar: string;
  onComplete: () => void;
  className?: string;
}

export function AvatarReveal({ avatar, onComplete, className = '' }: AvatarRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger reveal animation
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
      setShowConfetti(true);
    }, 500);

    // Hide confetti after 2 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 2500);

    // Complete animation after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(confettiTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={cn('relative text-center', className)}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 text-2xl animate-bounce">🎉</div>
          <div className="absolute top-0 right-1/4 text-2xl animate-bounce delay-100">✨</div>
          <div className="absolute top-0 left-1/2 text-2xl animate-bounce delay-200">🎊</div>
          <div className="absolute top-0 left-3/4 text-2xl animate-bounce delay-300">🌟</div>
        </div>
      )}

      {/* Avatar Card */}
      <div className={cn(
        'bg-gradient-to-br from-accent/10 to-accent/5 rounded-card p-8 border-2 border-accent/20 transition-all duration-slow',
        isRevealed ? 'scale-105 shadow-elevation-6' : 'scale-95 opacity-0'
      )}>
        <div className="text-6xl mb-4">👑</div>
        
        <h1 className="text-h1 font-display font-bold text-ink mb-2">
          {formatAvatarReveal(avatar)}
        </h1>
        
        <p className="text-lg text-gray-600">
          Your unique trajectory profile
        </p>
      </div>

      {/* Reveal Animation */}
      <div className={cn(
        'mt-8 transition-all duration-normal',
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}>
        <p className="text-gray-500">
          Unlocking your personalized insights...
        </p>
      </div>
    </div>
  );
}
