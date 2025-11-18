"use client";

import { useCallback, useEffect, useState } from 'react';
import { isSaleActive } from '@/lib/config';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function LimitedTimeOffer({ saleEndsDate }: { saleEndsDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  // Memoize calculation function to prevent recreation on every render
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +new Date(saleEndsDate) - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [saleEndsDate]);

  useEffect(() => {
    setMounted(true);

    if (!isSaleActive()) {
      return;
    }

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!mounted || !isSaleActive() || !timeLeft) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl px-6 py-3">
      <span className="text-sm font-semibold text-red-400">Sale ends in:</span>
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">{timeLeft.days}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
        )}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <>
            <span className="text-white">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs text-slate-400">hrs</span>
            </div>
          </>
        )}
        <span className="text-white">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs text-slate-400">min</span>
        </div>
        <span className="text-white">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs text-slate-400">sec</span>
        </div>
      </div>
    </div>
  );
}
