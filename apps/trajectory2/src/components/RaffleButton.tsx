'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Zap, TrendingUp, Users } from 'lucide-react';

interface RaffleConfig {
  id: string;
  name: string;
  tagline: string;
  start_date: string;
  end_date: string;
  entry_price: number;
  regular_price: number;
  savings_amount: number;
  status: string;
}

export default function RaffleButton() {
  const [isActive, setIsActive] = useState(false);
  const [warriorCount, setWarriorCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [raffleConfig, setRaffleConfig] = useState<RaffleConfig | null>(null);

  useEffect(() => {
    const checkRaffleStatus = async () => {
      const supabase = createClient();

      // Get active raffle configuration
      const { data: raffle, error } = await supabase
        .from('raffle_config')
        .select('*')
        .eq('status', 'active')
        .single();

      if (raffle && !error) {
        setRaffleConfig(raffle);
        setIsActive(true);

        // Get initial warrior count
        fetchWarriorCount(raffle.id);

        // Start countdown timer
        const countdownInterval = updateCountdown(raffle.end_date);

        // Subscribe to live updates for new entries
        const channel = supabase
          .channel('raffle-count')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'raffle_entries',
              filter: `raffle_id=eq.${raffle.id}`
            },
            () => {
              fetchWarriorCount(raffle.id);
            }
          )
          .subscribe();

        return () => {
          clearInterval(countdownInterval);
          supabase.removeChannel(channel);
        };
      }
    };

    checkRaffleStatus();
  }, []);

  const fetchWarriorCount = async (raffleId: string) => {
    const supabase = createClient();
    const { count } = await supabase
      .from('raffle_entries')
      .select('*', { count: 'exact', head: true })
      .eq('raffle_id', raffleId);

    setWarriorCount(count || 0);
  };

  const updateCountdown = (endDate: string): NodeJS.Timeout => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('ENDED');
        setIsActive(false);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    }, 1000);

    return timer;
  };

  if (!isActive || !raffleConfig) return null;

  const discountPercentage = Math.round((raffleConfig.savings_amount / raffleConfig.regular_price) * 100);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 right-8 z-50 md:fixed lg:fixed"
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        <Link href="/raffle" className="block">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sunset via-red-500 to-sunset rounded-2xl blur-xl opacity-70 group-hover:opacity-90"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main button container */}
            <div className="relative bg-gradient-to-r from-sunset to-sunset-dark text-white px-6 py-5 rounded-2xl shadow-2xl backdrop-blur-sm">
              {/* Header with icon and title */}
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-yellow-200" />
                <span className="text-sm font-bold uppercase tracking-wider text-yellow-200">
                  Grand Opening Raffle
                </span>
              </div>

              {/* Main offer */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{discountPercentage}%</span>
                  <span className="text-xl font-bold">OFF</span>
                </div>
                <p className="text-sm font-medium text-white/90">
                  Transform Your Life + Win Prizes
                </p>
                <div className="flex items-center gap-2 text-xs text-yellow-200">
                  <span className="font-bold">${(raffleConfig.entry_price / 100).toFixed(0)}</span>
                  <span className="line-through opacity-75">${(raffleConfig.regular_price / 100).toFixed(0)}</span>
                  <span className="text-white">• Save ${(raffleConfig.savings_amount / 100).toFixed(0)}</span>
                </div>
              </div>

              {/* Live stats */}
              <div className="mt-4 pt-3 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-bold">{warriorCount}</span>
                    <span className="text-white/80">Warriors In</span>
                  </div>
                  <span className="text-yellow-200 font-medium">
                    {timeLeft}
                  </span>
                </div>
              </div>

              {/* Call to action */}
              <div className="mt-3 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-200">
                  Begin Your Transformation →
                </span>
              </div>

              {/* Live pulse indicator */}
              <motion.div
                className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Mobile optimized tap area */}
            <div className="absolute inset-0 -m-2 rounded-2xl" />
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}