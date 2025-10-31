'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function GiveawayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchGiveawayConfig = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('giveaway_config')
        .select('end_date')
        .eq('status', 'active')
        .single();

      if (data) {
        setEndDate(new Date(data.end_date));
        setIsActive(true);
      }
    };

    fetchGiveawayConfig();
  }, []);

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        setIsActive(false);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!isActive) return null;

  return (
    <section className="relative py-12 px-4 bg-gradient-to-r from-sky-800 to-sky-700 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left side - Urgency message */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Clock className="w-5 h-5 text-yellow-300" />
              <span className="text-yellow-300 font-bold uppercase text-sm tracking-wider">
                Limited Time Giveaway
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Grand Opening Ends Soon
            </h2>
            <p className="text-sky-200">
              Enter now to win $2,500+ in transformation prizes
            </p>
          </div>

          {/* Right side - Countdown */}
          <div className="flex gap-3">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <motion.div
                    className="text-3xl md:text-4xl font-black text-white"
                    key={`${item.label}-${item.value}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </motion.div>
                  <div className="text-xs text-sky-200 uppercase tracking-wider mt-1">
                    {item.label}
                  </div>
                </div>

                {/* Pulse effect on seconds */}
                {item.label === 'Secs' && (
                  <motion.div
                    className="absolute inset-0 bg-yellow-400 rounded-xl opacity-20"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0, 0.2],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Urgency indicator */}
          <motion.div
            className="absolute top-2 right-2 md:top-4 md:right-4"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center gap-1 bg-yellow-400 text-sky-900 px-3 py-1 rounded-full text-xs font-bold">
              <Zap className="w-3 h-3" />
              <span>LIVE</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

