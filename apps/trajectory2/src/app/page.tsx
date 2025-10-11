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
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = [
    "Command your attention",
    "Command your energy",
    "Command your money",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const features = [
    {
      title: "Your Life Avatar",
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
                  <motion.span
                    key={currentPhrase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {phrases[currentPhrase]}
                  </motion.span>
                </h2>
              </div>

              <div className="space-y-6 text-lg text-secondary leading-relaxed mb-8">
                <p>
                  Transform from good little soldier to commander of your life.
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
              <Card className="bg-elev-2 border-[var(--border-gold)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--brand-gold)] to-transparent opacity-10 blur-3xl animate-pulse" />

                <CardHeader className="text-center pb-2">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-4 bg-gold-gradient rounded-2xl flex items-center justify-center gold-glow-sm"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <BookOpen className="w-10 h-10 text-black" />
                  </motion.div>
                  <CardTitle className="text-2xl text-primary mb-2">
                    Free Resources
                  </CardTitle>
                  <CardDescription className="text-secondary">
                    Everything you need to start your transformation
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tabbed Preview */}
                  <Tabs defaultValue="story" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-elev-1">
                      <TabsTrigger value="story" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black">
                        <FileText className="w-4 h-4 mr-1" />
                        Story
                      </TabsTrigger>
                      <TabsTrigger value="assessment" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black">
                        <Target className="w-4 h-4 mr-1" />
                        Assessment
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black">
                        <Gift className="w-4 h-4 mr-1" />
                        Resources
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="story" className="mt-4 space-y-3">
                      <div className="bg-elev-1 p-4 rounded-lg border border-[var(--border-default)]">
                        <h4 className="font-semibold text-primary mb-2">Kill the Boy Story</h4>
                        <p className="text-sm text-secondary mb-3">
                          Discover the transformational moment that changed everything.
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href="/resources#story">
                            Read the Story <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="assessment" className="mt-4 space-y-3">
                      <div className="bg-elev-1 p-4 rounded-lg border border-[var(--border-default)]">
                        <h4 className="font-semibold text-primary mb-2">Free Life Assessment</h4>
                        <p className="text-sm text-secondary mb-3">
                          Discover your Life Identity and get personalized actions in 10 minutes.
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href="/assessment/landing">
                            Take Assessment <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="resources" className="mt-4 space-y-3">
                      <div className="bg-elev-1 p-4 rounded-lg border border-[var(--border-default)]">
                        <h4 className="font-semibold text-primary mb-2">Free Book List & Resources</h4>
                        <p className="text-sm text-secondary mb-3">
                          50+ transformational books curated for high-value men.
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href="/resources">
                            View Resources <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* 7-Day Experience */}
                  <div className="pt-4 border-t border-[var(--border-default)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Unlock className="w-5 h-5 text-gold" />
                      <h4 className="font-semibold text-primary">7-Day Experience</h4>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                        21 curated book summaries
                      </div>
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                        Daily action tasks & worksheets
                      </div>
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                        Personalized growth roadmap
                      </div>
                    </div>
                    <Button asChild className="w-full" size="lg">
                      <Link href="/experience">Start Free 7 Days</Link>
                    </Button>
                    <p className="text-center text-xs text-muted mt-2">
                      Days 1-7 free • Full access after meeting with Jean
                    </p>
                  </div>
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
