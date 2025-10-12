"use client";

import { LogoMark } from "@/components/LogoMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
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

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["attention", "energy", "money"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  const features = [
    {
      title: "Your Life Identity",
      description:
        "Discover if you're a Drifter, Balancer, or Architect through our comprehensive assessment",
      icon: Users,
    },
    {
      title: "Domain Analysis",
      description:
        "Understand your strengths and gaps across 7 key life domains with actionable insights",
      icon: Zap,
    },
    {
      title: "Action Plan",
      description:
        "Get a personalized roadmap with daily actions to transform your trajectory",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-base pt-20">
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-[var(--brand-gold)] relative overflow-hidden shadow-2xl">
                {/* Animated background effects */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div 
                    className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      x: [0, 20, 0],
                      y: [0, -20, 0]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                      x: [0, -20, 0],
                      y: [0, 20, 0]
                    }}
                    transition={{ 
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                <CardHeader className="text-center pb-4 relative z-10">
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                      boxShadow: [
                        "0 0 20px rgba(251, 146, 60, 0.5)",
                        "0 0 40px rgba(251, 146, 60, 0.8)",
                        "0 0 20px rgba(251, 146, 60, 0.5)"
                      ]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <BookOpen className="w-12 h-12 text-white drop-shadow-lg" />
                  </motion.div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    Free Resources
                  </CardTitle>
                  <CardDescription className="text-orange-200 text-base">
                    Everything you need to start your transformation
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  {/* Tabbed Preview with Vibrant Tiles */}
                  <Tabs defaultValue="story" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 backdrop-blur-sm border border-orange-500/30 p-1 rounded-xl">
                      <TabsTrigger 
                        value="story" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Story
                      </TabsTrigger>
                      <TabsTrigger 
                        value="assessment" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Assessment
                      </TabsTrigger>
                      <TabsTrigger 
                        value="resources" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <Gift className="w-4 h-4 mr-1" />
                        Resources
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="story" className="mt-6">
                      <motion.div 
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-600/20 border-2 border-orange-500/50 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(251, 146, 60, 0.8)" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 animate-pulse" />
                        <div className="relative p-6 space-y-4">
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                              <FileText className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-white mb-2">Kill the Boy Story</h4>
                              <p className="text-orange-100 leading-relaxed">
                                Discover the transformational moment that changed everything. The story that sparked a movement.
                              </p>
                            </div>
                          </div>
                          <Button 
                            asChild 
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            <Link href="/resources#story">
                              Read the Story <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="assessment" className="mt-6">
                      <motion.div 
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 border-2 border-blue-500/50 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.8)" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse" />
                        <div className="relative p-6 space-y-4">
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Target className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-white mb-2">Free Life Assessment</h4>
                              <p className="text-blue-100 leading-relaxed">
                                Discover your Life Identity and get personalized actions in just 10 minutes. Know where you stand.
                              </p>
                            </div>
                          </div>
                          <Button 
                            asChild 
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            <Link href="/assessment/landing">
                              Take Assessment <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="resources" className="mt-6">
                      <motion.div 
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 border-2 border-purple-500/50 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.8)" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
                        <div className="relative p-6 space-y-4">
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                              animate={{ 
                                y: [0, -10, 0],
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Gift className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-white mb-2">Free Book List & Resources</h4>
                              <p className="text-purple-100 leading-relaxed">
                                50+ transformational books curated for high-value men. Wisdom distilled and ready.
                              </p>
                            </div>
                          </div>
                          <Button 
                            asChild 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            <Link href="/resources">
                              View Resources <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>
                  </Tabs>

                  {/* 7-Day Experience - PULSATING CTA */}
                  <motion.div 
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600/30 via-red-600/30 to-yellow-600/30 border-2 border-orange-500 backdrop-blur-sm p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20" />
                    
                    <div className="relative space-y-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Unlock className="w-7 h-7 text-orange-400" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-white">7-Day Experience</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { icon: BookOpen, text: "21 curated book summaries" },
                          { icon: CheckCircle, text: "Daily action tasks & worksheets" },
                          { icon: Zap, text: "Personalized growth roadmap" }
                        ].map((item, idx) => (
                          <motion.div 
                            key={idx}
                            className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3 border border-orange-500/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ scale: 1.05, borderColor: "rgba(251, 146, 60, 0.6)" }}
                          >
                            <item.icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                            <span className="text-orange-100 font-medium">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* PULSATING GLOWING CTA */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.02, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Button 
                          asChild 
                          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white relative overflow-hidden group"
                          size="lg"
                        >
                          <Link href="/experience" className="relative z-10">
                            <motion.span
                              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 blur-xl"
                              animate={{
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <span className="relative z-10 flex items-center justify-center">
                              Start Free 7 Days
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <ArrowRight className="w-6 h-6 ml-2" />
                              </motion.div>
                            </span>
                          </Link>
                        </Button>
                      </motion.div>

                      <motion.p 
                        className="text-center text-sm text-orange-300 font-medium"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        Days 1-7 free • Full access after meeting with Jean
                      </motion.p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              DISCOVER YOUR PATH
            </Badge>
            <h2 className="text-5xl font-bold text-primary mb-6">
              Your Transformation Starts Here
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Take the Trajectory Assessment to understand where you are and get
              a clear roadmap to where you want to be.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-elev-2 border-[var(--border-default)] hover:border-[var(--border-gold)] transition-all duration-300 hover:gold-glow-sm group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-elev-3 group-hover:bg-gold-gradient transition-all duration-300 flex items-center justify-center mb-4">
                      <feature.icon className="w-7 h-7 text-gold group-hover:text-black transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl text-primary">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-secondary">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button asChild size="lg" className="group">
              <Link href="/assessment/landing">
                Take the Free Assessment
                <ArrowRight
                  className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                  size={20}
                />
              </Link>
            </Button>
          </motion.div>
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
    </div>
  );
}
