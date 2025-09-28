"use client";

import CanyonHero from "@/components/CanyonHero";
import StrataDivider from "@/components/StrataDivider";
import { getCopy } from "@/lib/copy";
import { motion } from "framer-motion";
import { CheckCircle, Users, Zap } from "lucide-react";

export default function HomePage() {
  const features = (getCopy("landing.features.items") as any) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CanyonHero />

      {/* Features Section */}
      <section className="py-24 bg-sky-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sky-800 mb-4">
              {getCopy("landing.features.title")}
            </h2>
            <p className="text-lg text-sky-600 max-w-2xl mx-auto">
              Get insights into your life trajectory across six key domains and
              receive personalized recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature: any, index: number) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-lg border border-sky-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {index === 0 && <Users className="w-8 h-8 text-sky-500" />}
                  {index === 1 && <Zap className="w-8 h-8 text-sky-500" />}
                  {index === 2 && (
                    <CheckCircle className="w-8 h-8 text-sky-500" />
                  )}
                </div>
                <h3 className="text-xl font-display font-semibold text-sky-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sky-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StrataDivider />

      {/* CTA Section */}
      <section className="py-24 bg-sky-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sky-800 mb-6">
              Ready to Discover Your Trajectory?
            </h2>
            <p className="text-lg text-sky-600 mb-8 max-w-2xl mx-auto">
              Take the assessment now and start your journey to a higher
              trajectory.
            </p>
            <motion.a
              href="/assessment"
              className="strata-button text-lg px-8 py-4 inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Assessment
            </motion.a>
            
            {/* Hidden preview link for lane game */}
            {process.env.NEXT_PUBLIC_SHOW_LANE_GAME_PREVIEW === '1' && (
              <div className="mt-4">
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-500 hover:text-sky-600 underline"
                >
                  🎮 Try the new Lane Diagnostic Game (Preview)
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
