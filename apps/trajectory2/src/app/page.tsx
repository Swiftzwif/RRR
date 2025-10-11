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
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle, Users, Zap } from "lucide-react";
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
              <Card className="bg-elev-2 border-[var(--border-gold)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--brand-gold)] to-transparent opacity-10 blur-3xl" />

                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gold-gradient rounded-2xl flex items-center justify-center gold-glow-sm">
                    <BookOpen className="w-10 h-10 text-black" />
                  </div>
                  <CardTitle className="text-2xl text-primary">
                    Free 7-Day Experience
                  </CardTitle>
                  <CardDescription className="text-secondary">
                    Start your transformation journey today
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-secondary">
                        21 curated book summaries
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-secondary">
                        Daily action tasks & worksheets
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-secondary">
                        Personalized growth roadmap
                      </span>
                    </div>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/experience">Explore 31-Day Experience</Link>
                  </Button>

                  <p className="text-center text-sm text-muted">
                    Days 1-7 free • Unlock all 31 days after meeting with Jean
                  </p>
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
