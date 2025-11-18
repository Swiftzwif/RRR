"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { useAutoCycling } from "@/hooks/useAutoCycling";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';

export function HeroSection() {
  const words = ["attention", "energy", "money"];
  const { activeIndex: currentWord } = useAutoCycling(words, 6000);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gold arc background element */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="absolute top-0 right-0 w-full h-full"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 400 Q 720 100, 1440 300"
            stroke="var(--brand-gold)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0 500 Q 720 200, 1440 400"
            stroke="var(--brand-gold)"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            className="mb-12 lg:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <LogoMark className="h-16 w-16" />
                <Badge variant="outline" className="border-gold text-gold">
                  TRANSFORM YOUR TRAJECTORY
                </Badge>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-primary">
                Trajectory
              </h1>

              <h2 className="text-3xl md:text-4xl font-light text-gold mb-8 h-16 flex items-center">
                <span>Command your </span>
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  {words[currentWord]}
                </motion.span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-secondary leading-relaxed mb-8">
              <p>
                Transform into the commander of your life.
              </p>
              <p>
                Most men drift through life unaware of their worth—distracted
                by feeds, trapped in yesterday&apos;s thoughts, repeating the same
                inputs and getting the same results.
              </p>
              <p className="text-primary font-semibold">
                Trajectory exists to help you reclaim the throne of your mind
                and lead from within.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/assessment/landing">
                  Start Your Assessment
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                    size={20}
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/story">Read My Story</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <ProductShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
