"use client";

import KillTheBoyLoader from "@/components/KillTheBoyLoader";
import { LogoMark } from "@/components/LogoMark";
import { FEATURE_FLAGS } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Gift,
  Heart,
  Target,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import PricingDisplay from '@/components/products/PricingDisplay';
import LimitedTimeOffer from '@/components/products/LimitedTimeOffer';
import { PRODUCTS } from '@/lib/config';

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["attention", "energy", "money"];
  const [activeTab, setActiveTab] = useState("story");
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Loading detection - only show on first visit
  useEffect(() => {
    // Check if we've already shown the loader this session
    const hasShownLoader = sessionStorage.getItem("hasShownKillTheBoyLoader");

    if (hasShownLoader === "true") {
      setIsLoading(false);
      setShowContent(true);
      return;
    }

    // Track when everything is ready
    let fontsLoaded = false;
    let domReady = false;
    let minimumTimeElapsed = false;

    const checkAllReady = () => {
      if (fontsLoaded && domReady && minimumTimeElapsed) {
        // Mark that we've shown the loader
        sessionStorage.setItem("hasShownKillTheBoyLoader", "true");
      }
    };

    // Check font loading
    if (document.fonts.ready) {
      document.fonts.ready.then(() => {
        fontsLoaded = true;
        checkAllReady();
      });
    } else {
      fontsLoaded = true;
      checkAllReady();
    }

    // DOM is ready since we're in useEffect
    domReady = true;
    checkAllReady();

    // Minimum display time for the animation to complete
    const minimumTimer = setTimeout(() => {
      minimumTimeElapsed = true;
      checkAllReady();
    }, 2800); // Extended to match new animation timing

    return () => {
      clearTimeout(minimumTimer);
    };
  }, []);

  // Handle loader completion
  const handleLoaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };
  // Combine and slow down animations for subtlety
  useEffect(() => {
    if (!showContent) return;

    const tabs = ["story", "assessment", "resources"];

    // Word cycling - slower and more subtle (6s)
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 6000);

    // Tab cycling - slower to reduce distraction (8s)
    const tabInterval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        return tabs[(currentIndex + 1) % tabs.length];
      });
    }, 8000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(tabInterval);
    };
  }, [words.length, showContent]);

  return (
    <>
      {/* Loading Screen */}
      <KillTheBoyLoader isLoading={isLoading} onComplete={handleLoaderComplete} />

      {/* Main Content */}
      {showContent && (
        <motion.div
          className="min-h-screen bg-base text-white pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
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
                  {/* AUTO-CYCLING SHOWCASE - LARGE SECTION */}
                  <div className="relative">
                    {/* Indicator dots - subtle animations */}
                    <div className="flex justify-center gap-3 mb-6">
                      {["story", "assessment", "resources"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
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

                      {/* COMPACT CTA */}
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-elev-1 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="border-gold text-gold mb-4">
              CHOOSE YOUR PATH
            </Badge>
            <h2 className="text-5xl font-bold text-primary mb-6">
              Transform Your Trajectory
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Command your attention, energy, and resources. Transform from drifter to architect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Digital Course */}
            <ProductCard
              badge="MOST POPULAR"
              badgeVariant="gold"
              title={PRODUCTS.DIGITAL_COURSE.name}
              subtitle={PRODUCTS.DIGITAL_COURSE.tagline}
              features={PRODUCTS.DIGITAL_COURSE.benefits}
              cta={{
                text: "Get Instant Access on Thinkific",
                href: PRODUCTS.DIGITAL_COURSE.thinkificUrl,
                external: true
              }}
            >
              {/* Pricing */}
              <div className="py-8 border-y border-slate-700">
                <PricingDisplay
                  regularPrice={PRODUCTS.DIGITAL_COURSE.regularPrice}
                  salePrice={PRODUCTS.DIGITAL_COURSE.salePrice}
                  size="lg"
                />
                <div className="mt-4 flex justify-center">
                  <LimitedTimeOffer saleEndsDate={PRODUCTS.DIGITAL_COURSE.saleEndsDate} />
                </div>
              </div>

              {/* Impact Statement */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-200 leading-relaxed italic">
                  {PRODUCTS.DIGITAL_COURSE.impact}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <BookOpen className="w-6 h-6 text-[#FFD700] mx-auto mb-2" />
                  <p className="text-sm text-slate-400">10 Lessons</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-[#FFD700] mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Lifetime Access</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-[#FFD700] mx-auto mb-2" />
                  <p className="text-sm text-slate-400">1,000+ Students</p>
                </div>
              </div>
            </ProductCard>

            {/* Inner Mastery Sessions */}
            <ProductCard
              badge="COMING SOON"
              badgeVariant="silver"
              title={PRODUCTS.INNER_MASTERY.name}
              subtitle={PRODUCTS.INNER_MASTERY.tagline}
              features={[
                "Personal coaching with Jean",
                "Custom transformation roadmap",
                "Weekly accountability calls",
                "Direct access via private channel",
                "Personalized frameworks",
                "Limited to 250 clients per year"
              ]}
              cta={{
                text: "Join Waitlist",
                href: PRODUCTS.INNER_MASTERY.applicationUrl
              }}
            >
              {/* Coming Soon Badge */}
              <div className="py-8 border-y border-slate-700 text-center">
                <div className="inline-block bg-slate-700 text-slate-300 px-6 py-3 rounded-xl text-lg font-semibold">
                  {PRODUCTS.INNER_MASTERY.pricing} Pricing
                </div>
                <p className="text-slate-400 mt-4">Application Required</p>
              </div>

              {/* Description */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-200 leading-relaxed italic">
                  {PRODUCTS.INNER_MASTERY.description}
                </p>
              </div>
            </ProductCard>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 bg-elev-1 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="border-gold text-gold mb-4">
              ULTIMATE TRANSPARENCY
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              You Can Do This Yourself
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Everything we offer can be done on your own. We&apos;re not hiding anything.
              The books are available. The frameworks are out there. The wisdom is accessible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-elev-2 border-[var(--border-gold)]">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Why We Exist</h3>
                        <p className="text-secondary leading-relaxed">
                          We exist for two reasons: <strong className="text-primary">accountability</strong> and{' '}
                          <strong className="text-primary">simplicity</strong>. We&apos;ve curated, organized, and 
                          distilled the essential wisdom so you don&apos;t have to spend years searching.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-primary mb-2">What We Provide</h3>
                        <p className="text-secondary leading-relaxed">
                          Clear structure. Focused action. A community of men committed to growth. 
                          Someone to meet with who will hold you accountable to your word and your transformation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--border-default)] text-center">
                  <p className="text-lg text-primary font-semibold mb-4">
                    All Free Resources Are Immediately Accessible
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button asChild variant="outline">
                      <Link href="/resources">
                        Browse Free Resources
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/assessment/landing">
                        Take Free Assessment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/experience">
                        Start 7-Day Experience
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-base relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Stop Drifting. Start Commanding.
            </h2>
            <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of men who have transformed their trajectory from
              passive observer to active commander.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/assessment/landing">Start Your Journey</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/course">View Full Course</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
      )}
    </>
  );
}
