'use client';

import { AnimatedDiv } from '@/components/animation/AnimatedComponents';
import { Zap, Clock, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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

export default function RaffleHeroSection() {
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
          .channel('raffle-count-hero')
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
      .eq('raffle_id', raffleId)
      .eq('payment_status', 'completed');

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
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    }, 1000);

    return timer;
  };

  if (!isActive || !raffleConfig) return null;

  const discountPercentage = Math.round((raffleConfig.savings_amount / raffleConfig.regular_price) * 100);
  const displayPrice = raffleConfig.entry_price / 100;
  const regularPrice = raffleConfig.regular_price / 100;
  const savings = raffleConfig.savings_amount / 100;

  return (
    <AnimatedDiv
      className="relative mb-8"
      data-raffle-hero-section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main raffle container with gradient background */}
      <Link href="/raffle" className="block">
        <AnimatedDiv
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 p-6 shadow-2xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Animated glow effect */}
          <AnimatedDiv
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Top section with badge and timer */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <AnimatedDiv
                  className="flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Zap className="w-4 h-4 text-yellow-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-200">
                    Grand Opening Raffle
                  </span>
                </AnimatedDiv>

                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold" data-countdown-timer>{timeLeft} left</span>
                </div>
              </div>

              {/* Live pulse indicator */}
              <AnimatedDiv
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Main offer section */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Join the Raffle & Claim {discountPercentage}% OFF Digital Course
              </h2>

              <div className="flex flex-wrap items-end gap-6">
                {/* Pricing */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-white">${displayPrice}</span>
                  <div className="flex flex-col">
                    <span className="text-sm line-through text-white/80">${regularPrice}</span>
                    <span className="text-sm font-bold text-yellow-200">Save ${savings}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Gift className="w-4 h-4 text-yellow-200" />
                    <span className="text-white font-medium">Win $2,500+ in Prizes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white/90">{warriorCount} warriors entered</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-white font-bold">
                <span>Enter to Transform</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </AnimatedDiv>
      </Link>

      {/* Bottom text */}
      <p className="text-center text-sm text-secondary mt-2">
        Limited time offer • 16 winners will be selected
      </p>
    </AnimatedDiv>
  );
}
