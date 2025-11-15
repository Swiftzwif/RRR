"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Target } from "lucide-react";
import Link from 'next/link';

export function TransparencySection() {
  return (
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
  );
}
