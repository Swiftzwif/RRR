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
        className="fixed top-16 left-0 right-0 z-40 px-4 md:px-8 lg:px-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        <Link
          href="/raffle"
          className="block max-w-7xl mx-auto"
          aria-label={`Grand Opening Raffle: ${discountPercentage}% off digital course, $${(raffleConfig.entry_price / 100).toFixed(0)} entry fee, ${warriorCount} warriors entered, ${timeLeft} remaining`}
        >
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-xl blur-xl opacity-50 group-hover:opacity-70"
              animate={{
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main button container - horizontal layout */}
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left section - Badge and offer */}
                <div className="flex items-center gap-4">
                  {/* Badge */}
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-200" />
                    <span className="text-xs font-bold uppercase tracking-wider text-yellow-200">
                      Grand Opening
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">{discountPercentage}% OFF</span>
                    <span className="text-sm font-medium">Digital Course</span>
                  </div>
                </div>

                {/* Center section - Pricing */}
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-xl">${(raffleConfig.entry_price / 100).toFixed(0)}</span>
                  <span className="line-through opacity-75">${(raffleConfig.regular_price / 100).toFixed(0)}</span>
                  <span className="bg-yellow-400/20 px-2 py-1 rounded-md text-yellow-200 font-bold">
                    Save ${(raffleConfig.savings_amount / 100).toFixed(0)}
                  </span>
                </div>

                {/* Right section - Live stats and CTA */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-bold">{warriorCount}</span>
                      <span className="text-white/80 hidden lg:inline">Warriors</span>
                    </div>
                    <div className="text-yellow-200 font-medium">
                      {timeLeft}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-yellow-200">
                    <span>Enter Now</span>
                    <span>→</span>
                  </div>
                </div>
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