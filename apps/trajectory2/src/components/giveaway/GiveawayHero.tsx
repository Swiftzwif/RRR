'use client';

import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';
import { motion } from "framer-motion";
import { Clock, Gift, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { GiveawayConfig } from '@/types/giveaway';

export default function GiveawayHero() {
  const [giveawayConfig, setGiveawayConfig] = useState<GiveawayConfig | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGiveawayData = async () => {
      const supabase = createClient();

      // Get active giveaway configuration
      const { data: giveaway } = await supabase
        .from('giveaway_config')
        .select('id, prizes')
        .eq('status', 'active')
        .single();

      if (giveaway) {
        setGiveawayConfig(giveaway);

        // Get participant count
        const { count } = await supabase
          .from('giveaway_entries')
          .select('*', { count: 'exact', head: true })
          .eq('giveaway_id', giveaway.id);

        setParticipantCount(count || 0);
      }

      setIsLoading(false);
    };

    fetchGiveawayData();
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-sunset/10" />

        {/* Floating orbs for depth */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-slate-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-sunset/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Zap className="w-4 h-4" />
          <span>GRAND OPENING GIVEAWAY</span>
          <Zap className="w-4 h-4" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Kill The Boy.
          <br />
          <span className="text-orange-600 bg-gradient-to-r from-orange-500 to-red-600 gradient-text-fallback">
            Win The War.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-xl md:text-2xl text-slate-700 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Enter to win transformation prizes worth over $2,500
          <br />
          <span className="font-bold text-orange-500">Free to enter • Multiple winners</span>
        </motion.p>

        {/* Value props */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-orange-500" />
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">$2,500+</div>
              <div className="text-sm text-slate-600">In Prizes</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-300" />

          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">Limited Time</div>
              <div className="text-sm text-slate-600">7 Days Only</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-300" />

          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">16 Winners</div>
              <div className="text-sm text-slate-600">Will Be Selected</div>
            </div>
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white px-12 py-7 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
          >
            <a href="#entry-form">
              Enter Giveaway Now
            </a>
          </Button>

          <p className="text-sm text-slate-600">
            {participantCount > 0
              ? <>Join <span className="font-bold text-slate-900">{participantCount} participants</span> who&apos;ve entered</>
              : <>Be the <span className="font-bold text-slate-900">first participant</span> to enter</>
            }
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            <span>100% Free Entry</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-slate-700" />
            <span>No Purchase Required</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-700" />
            <span>Fair Random Selection</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
