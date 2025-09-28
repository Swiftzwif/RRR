'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AnimatedQuoteProps {
  quotes: Array<{
    text: string;
    author: string;
    book: string;
  }>;
  interval?: number;
  className?: string;
}

export function AnimatedQuote({ 
  quotes, 
  interval = 5000, 
  className = '' 
}: AnimatedQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  const currentQuote = quotes[currentIndex];

  return (
    <div className={cn('text-center max-w-4xl mx-auto', className)}>
      <blockquote className={cn(
        'text-xl text-gray-700 italic mb-4 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}>
        "{currentQuote.text}"
      </blockquote>
      
      <div className={cn(
        'transition-all duration-300 delay-150',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}>
        <cite className="text-sm text-gray-500 not-italic">
          — {currentQuote.author}, <em>{currentQuote.book}</em>
        </cite>
      </div>
    </div>
  );
}
