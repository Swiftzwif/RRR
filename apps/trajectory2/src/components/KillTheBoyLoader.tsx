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

    // Start animation sequence
    const textTimer = setTimeout(() => setShowText(true), 100);
    const splitTimer = setTimeout(() => {
      setStartSplit(true);
      if (onComplete) {
        setTimeout(onComplete, 600);
      }
    }, 1200);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(splitTimer);
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Left half */}
          <motion.div
            className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 z-[100] flex items-center justify-end overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: startSplit ? "-100%" : 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <div className="pr-0 translate-x-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-right"
              >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider">
                  KILL THE
                </h1>
              </motion.div>
            </div>
          </motion.div>

          {/* Right half */}
          <motion.div
            className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-slate-900 via-red-900 to-orange-900 z-[100] flex items-center justify-start overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: startSplit ? "100%" : 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <div className="pl-0 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-left"
              >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider">
                  BOY
                </h1>
              </motion.div>
            </div>
          </motion.div>

          {/* Center line (appears before split) */}
          {showText && !startSplit && (
            <motion.div
              className="fixed top-0 left-1/2 -translate-x-1/2 w-[2px] h-screen bg-gradient-to-b from-transparent via-gold to-transparent z-[101]"
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