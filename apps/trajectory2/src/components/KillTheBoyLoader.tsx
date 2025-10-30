"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface KillTheBoyLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function KillTheBoyLoader({ isLoading, onComplete }: KillTheBoyLoaderProps) {
  const [showText, setShowText] = useState(false);
  const [startSplit, setStartSplit] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    // Start animation sequence with extended timing
    const textTimer = setTimeout(() => setShowText(true), 100);
    const splitTimer = setTimeout(() => {
      setStartSplit(true);
      if (onComplete) {
        setTimeout(onComplete, 800); // Extended from 600ms to 800ms
      }
    }, 2000); // Extended from 1200ms to 2000ms for longer visibility

    return () => {
      clearTimeout(textTimer);
      clearTimeout(splitTimer);
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Left half - background only */}
          <motion.div
            className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 z-[100] overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: startSplit ? "-100%" : 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          />

          {/* Right half - background only */}
          <motion.div
            className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-slate-900 via-red-900 to-orange-900 z-[100] overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: startSplit ? "100%" : 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          />

          {/* Centered text overlay */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: showText && !startSplit ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-gold tracking-wider drop-shadow-2xl">
                KILL THE BOY
              </h1>
            </div>
          </motion.div>

          {/* Center line (appears before split) */}
          {showText && !startSplit && (
            <motion.div
              className="fixed top-0 left-1/2 -translate-x-1/2 w-[2px] h-screen bg-gradient-to-b from-transparent via-gold to-transparent z-[102]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}