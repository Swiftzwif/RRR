'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    Lock,
    Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from 'react';

interface Module {
  title: string;
  description: string;
  lessons: string[];
  duration: string;
  status: "locked" | "unlocked" | "in_progress" | "completed";
  progress?: number;
}

function CourseContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for success param
    if (searchParams.get("success") === "1") {
      setPurchaseSuccess(true);
    }

    const checkAccess = async () => {
      try {
        const {
          data: { user },
        } = await supabase!.auth.getUser();

        if (user) {
          // Check if user has purchased the course
          const { data: purchase } = await supabase!
            .from("purchases")
            .select("*")
            .eq("user_id", user.id)
            .eq("product", "course")
            .single();

          setHasAccess(!!purchase);
        }
      } catch (error) {
        console.error("Error checking access:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [searchParams]);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      // Get current user for email
      const {
        data: { user },
      } = await supabase!.auth.getUser();

      // Create payment link via Square API
      const response = await fetch("/api/payments/square/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: "course",
          email: user?.email || undefined,
          redirectUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      // Redirect to Square checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Unable to process payment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const modules: Module[] = [
    {
      title: "Module 1: Kill the Boy",
      description:
        "Understand the power of killing the boy and awakening the commander within.",
      lessons: [
        "The Awakening",
        "Breaking the Programming",
        "Your First Command",
      ],
      duration: "2 hours",
      status: hasAccess ? "completed" : "locked",
      progress: hasAccess ? 100 : 0,
    },
    {
      title: "Module 2: Command Your Attention",
      description:
        "Reclaim your focus from algorithms and distractions that steal your power.",
      lessons: [
        "The Attention Economy",
        "Building Focus Systems",
        "Deep Work Mastery",
      ],
      duration: "3 hours",
      status: hasAccess ? "in_progress" : "locked",
      progress: hasAccess ? 65 : 0,
    },
    {
      title: "Module 3: Command Your Energy",
      description:
        "Master your energy management for sustainable peak performance.",
      lessons: [
        "Energy Audits",
        "Physical Optimization",
        "Mental Energy Systems",
      ],
      duration: "2.5 hours",
      status: hasAccess ? "unlocked" : "locked",
      progress: 0,
    },
    {
      title: "Module 4: Command Your Money",
      description:
        "Transform your relationship with money and build financial command.",
      lessons: ["Money Mindset", "Income Acceleration", "Wealth Systems"],
      duration: "3 hours",
      status: "locked",
      progress: 0,
    },
    {
      title: "Module 5: The Three Lanes",
      description: "Understand the SlowLane, SideLane, and FastLane paradigms.",
      lessons: ["Lane Analysis", "Choosing Your Path", "Lane Transitions"],
      duration: "2 hours",
      status: "locked",
      progress: 0,
    },
    {
      title: "Module 6: Your Vehicle Audit",
      description:
        "Conduct a deep audit of your current position and trajectory.",
      lessons: ["Life Inventory", "Gap Analysis", "Upgrade Planning"],
      duration: "2.5 hours",
      status: "locked",
      progress: 0,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-secondary text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (purchaseSuccess && !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 gold-glow">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">
            Payment Processing
          </h1>
          <p className="text-secondary mb-6">
            Your payment is being processed. You&apos;ll receive an email
            confirmation shortly with access to the course.
          </p>
          <Button onClick={() => window.location.reload()}>Check Access</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="border-gold text-gold mb-6">
            TRANSFORMATION COURSE
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Rethink. Redesign. Reignite.
          </h1>
          <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
            A comprehensive course designed to help you shift from good little
            soldier to commander of your life.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-elev-2 border-[var(--border-default)] text-center">
            <CardContent className="pt-6">
              <Users className="w-10 h-10 text-gold mx-auto mb-3" />
              <p className="text-2xl font-bold text-primary mb-1">2,500+</p>
              <p className="text-secondary">Active Students</p>
            </CardContent>
          </Card>
          <Card className="bg-elev-2 border-[var(--border-default)] text-center">
            <CardContent className="pt-6">
              <Clock className="w-10 h-10 text-gold mx-auto mb-3" />
              <p className="text-2xl font-bold text-primary mb-1">15+ Hours</p>
              <p className="text-secondary">Video Content</p>
            </CardContent>
          </Card>
          <Card className="bg-elev-2 border-[var(--border-default)] text-center">
            <CardContent className="pt-6">
              <BookOpen className="w-10 h-10 text-gold mx-auto mb-3" />
              <p className="text-2xl font-bold text-primary mb-1">6 Modules</p>
              <p className="text-secondary">Transformational</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules */}
        <motion.div
          className="space-y-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-8">
            Course Modules
          </h2>

          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card
                className={`bg-elev-2 border-[var(--border-default)] ${
                  module.status === "locked" && !hasAccess ? "opacity-60" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl text-primary">
                          {module.title}
                        </CardTitle>
                        {module.status === "locked" && !hasAccess && (
                          <Lock className="w-5 h-5 text-muted" />
                        )}
                        {module.status === "completed" && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <CardDescription className="text-secondary mb-3">
                        {module.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        <span>{module.lessons.length} lessons</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {module.progress !== undefined && module.progress > 0 && (
                  <CardContent>
                    <Progress value={module.progress} className="h-2" />
                    <p className="text-sm text-muted mt-2">
                      {module.progress}% complete
                    </p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        {!hasAccess && (
          <motion.div
            className="bg-elev-2 rounded-3xl p-12 text-center border border-[var(--border-gold)] gold-glow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-primary mb-6">
              Ready to Transform Your Trajectory?
            </h2>
            <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
              Get lifetime access to all modules, future updates, and our
              private community of high-performers.
            </p>
            <div className="text-5xl font-bold text-gold mb-2">$97</div>
            <p className="text-secondary mb-8">
              One-time payment • Lifetime access
            </p>

            <Button size="lg" onClick={handlePurchase} className="group">
              Get Instant Access
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                30-day money back guarantee
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold" />
                Secure payment via Square
              </span>
            </div>
          </motion.div>
        )}

        {/* Access Dashboard */}
        {hasAccess && (
          <motion.div
            className="bg-elev-2 rounded-3xl p-12 text-center border border-[var(--border-gold)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              Welcome Back, Commander
            </h2>
            <p className="text-xl text-secondary mb-8">
              Continue your transformation journey where you left off.
            </p>
            <Button
              size="lg"
              className="group"
              onClick={() => router.push("/course/dashboard")}
            >
              Go to Course Dashboard
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense fallback={<CoursePageSkeleton />}>
      <CourseContent />
    </Suspense>
  );
}

function CoursePageSkeleton() {
  return (
    <div className="min-h-screen bg-base py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-32 h-8 bg-elev-2 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="w-96 h-12 bg-elev-2 rounded-lg mx-auto mb-6 animate-pulse" />
          <div className="w-full max-w-4xl h-6 bg-elev-2 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}
