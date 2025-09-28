'use client';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface MicroToastProps {
  message: string;
  type?: 'success' | 'info';
  duration?: number;
  onClose: () => void;
}

export function MicroToast({
  message,
  type = 'success',
  duration = 3000,
  onClose
}: MicroToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: 'bg-green text-white border-green/20',
    info: 'bg-accent text-white border-accent/20'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-normal">
      <div className={cn(
        'px-4 py-3 rounded-lg border shadow-elevation-6 flex items-center space-x-3',
        typeClasses[type]
      )}>
        {/* Sparkle Icon */}
        <div className="text-lg">✨</div>
        
        {/* Message */}
        <span className="font-medium">{message}</span>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
