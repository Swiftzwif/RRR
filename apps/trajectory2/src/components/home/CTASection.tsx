"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from 'next/link';

export function CTASection() {
  return (
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
  );
}
