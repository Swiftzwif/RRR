"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface LimitedTimeOfferProps {
  saleEndsDate: string;
}

export default function LimitedTimeOffer({ saleEndsDate }: LimitedTimeOfferProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(saleEndsDate);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [saleEndsDate]);

  if (!timeRemaining) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      <Clock className="w-5 h-5 text-red-400" />
      <div className="flex items-center gap-2">
        <span className="text-slate-300">Sale ends in:</span>
        <div className="flex items-center gap-1 font-bold text-red-400">
          {timeRemaining.days > 0 && (
            <span>{timeRemaining.days}d </span>
          )}
          <span>{String(timeRemaining.hours).padStart(2, '0')}:</span>
          <span>{String(timeRemaining.minutes).padStart(2, '0')}:</span>
          <span>{String(timeRemaining.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

