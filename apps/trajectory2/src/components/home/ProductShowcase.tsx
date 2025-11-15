"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAutoCycling } from "@/hooks/useAutoCycling";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
  Gift,
  Target,
  Unlock,
  Zap,
} from "lucide-react";
import Link from 'next/link';

export function ProductShowcase() {
  const tabs = ["story", "assessment", "resources"];
  const { activeIndex, setActiveIndex } = useAutoCycling(tabs, 8000);
  const activeTab = tabs[activeIndex];

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-[var(--brand-gold)] relative overflow-hidden shadow-2xl">
      {/* Static background effects - no animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl" />
      </div>

      <CardHeader className="text-center pb-6 relative z-10">
        <Badge variant="outline" className="border-gold text-gold mb-4 mx-auto">
          WHAT IS TRAJECTORY?
        </Badge>
        <CardTitle className="text-4xl font-bold text-white mb-3">
          Your Path to Commanding Life
        </CardTitle>
        <CardDescription className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
          A comprehensive system combining proven frameworks, expert guidance, and a brotherhood of men committed to transformation
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* AUTO-CYCLING SHOWCASE */}
        <div className="relative">
          {/* Indicator dots */}
          <div className="flex justify-center gap-3 mb-6">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-full transition-all duration-500 ease-out ${
                  activeTab === tab
                    ? 'w-8 h-3 bg-gradient-to-r from-orange-500 to-red-500'
                    : 'w-3 h-3 bg-orange-500/30 hover:bg-orange-500/50'
                }`}
              />
            ))}
          </div>

          {/* Story Slide */}
          {activeTab === "story" && (
            <motion.div
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-600/20 border-2 border-orange-500/50 backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-xl">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">The Story</h3>
                      <p className="text-orange-300">Where it all began</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-orange-100 text-lg leading-relaxed">
                    <p>
                      <strong className="text-white">At 25, everything changed.</strong> My mentor looked me in the eye and said: <span className="text-orange-300 font-semibold">&quot;Kill the boy.&quot;</span>
                    </p>
                    <p>
                      It wasn&apos;t about violence—it was about transformation. Killing the version of yourself that seeks approval, avoids responsibility, and drifts through life.
                    </p>
                    <p className="text-white font-semibold">
                      Trajectory was born from that moment—a complete system to help men command their attention, energy, and resources.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg h-14 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Link href="/resources#story">
                      Read the Full Story <ArrowRight className="w-6 h-6 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Assessment Slide */}
          {activeTab === "assessment" && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-600/20 border-2 border-orange-500/50 backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-xl">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">Life Assessment</h3>
                      <p className="text-orange-300">Know where you stand</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-orange-100 text-lg leading-relaxed">
                    <p>
                      <strong className="text-white">Most men are blind to their actual trajectory.</strong> They think they&apos;re doing fine until reality hits.
                    </p>
                    <p>
                      Our Life Assessment reveals your <span className="text-orange-300 font-semibold">Life Identity</span>—whether you&apos;re a Drifter, Balancer, or Architect. It measures 7 critical domains of life and shows you exactly where you&apos;re winning and where you&apos;re losing.
                    </p>
                    <p className="text-white font-semibold">
                      In 10 minutes, you&apos;ll have more clarity than most men get in 10 years.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg h-14 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Link href="/assessment/landing">
                      Take Free Assessment <ArrowRight className="w-6 h-6 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resources Slide */}
          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-600/20 border-2 border-orange-500/50 backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-xl">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">Free Resources</h3>
                      <p className="text-orange-300">Wisdom you can access now</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-orange-100 text-lg leading-relaxed">
                    <p>
                      <strong className="text-white">You don&apos;t need to pay to get started.</strong> We believe in ultimate transparency.
                    </p>
                    <p>
                      Access <span className="text-orange-300 font-semibold">50+ curated book summaries</span>, frameworks from the greatest minds, and actionable strategies—all for free. The knowledge is out there. We&apos;ve just organized it for you.
                    </p>
                    <p className="text-white font-semibold">
                      Trajectory exists for accountability and simplicity. The resources are yours. The transformation is up to you.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg h-14 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Link href="/resources">
                      Browse Free Resources <ArrowRight className="w-6 h-6 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 7-DAY EXPERIENCE - COMPACT GOLD CTA */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--brand-gold)]/20 via-yellow-600/20 to-orange-600/20 border-2 border-[var(--brand-gold)] backdrop-blur-sm p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-gold)]/10 to-orange-500/10" />

          <div className="relative space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Unlock className="w-5 h-5 text-gold" />
              <h4 className="text-lg font-bold text-white">Start Your 7-Day Experience</h4>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {[
                { icon: BookOpen, text: "21 book summaries" },
                { icon: CheckCircle, text: "Daily tasks" },
                { icon: Zap, text: "Growth roadmap" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-slate-900/50 rounded-lg px-2.5 py-1.5 border border-[var(--brand-gold)]/30"
                >
                  <item.icon className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-orange-100 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="w-full h-11 text-sm font-bold bg-gradient-to-r from-[var(--brand-gold)] to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black shadow-lg"
            >
              <Link href="/experience">
                Start Free 7 Days <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>

            <p className="text-center text-xs text-gold font-medium">
              Days 1-7 free • Full access after meeting with Jean
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
