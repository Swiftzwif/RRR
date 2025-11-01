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
import { THINKIFIC_COURSE_URL, COURSE_CONFIG } from '@/lib/config';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    Lock,
    Users,
} from "lucide-react";
import { Suspense } from 'react';

interface Module {
  title: string;
  description: string;
  lessons: string[];
  duration: string;
  status: "locked" | "unlocked" | "in_progress" | "completed";
  progress?: number;
}

function CourseContent() {
  const handlePurchase = () => {
    // Redirect to Thinkific course landing page
    window.location.href = THINKIFIC_COURSE_URL;
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
      status: "locked",
      progress: 0,
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
      status: "locked",
      progress: 0,
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
      status: "locked",
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
              <Card className="bg-elev-2 border-[var(--border-default)] opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl text-primary">
                          {module.title}
                        </CardTitle>
                        <Lock className="w-5 h-5 text-muted" />
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
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
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
          <div className="text-5xl font-bold text-gold mb-2">${COURSE_CONFIG.price}</div>
          <p className="text-secondary mb-8">
            One-time payment • Lifetime access
          </p>

          <Button size="lg" onClick={handlePurchase} className="group">
            Get Instant Access on Thinkific
            <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold" />
              30-day money back guarantee
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold" />
              Secure payment via Thinkific
            </span>
          </div>
        </motion.div>
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
