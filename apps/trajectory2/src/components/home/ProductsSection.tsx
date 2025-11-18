"use client";

import { Badge } from "@/components/ui/badge";
import ProductCard from '@/components/products/ProductCard';
import PricingDisplay from '@/components/products/PricingDisplay';
import LimitedTimeOffer from '@/components/products/LimitedTimeOffer';
import { PRODUCTS } from '@/lib/config';
import { motion } from "framer-motion";
import { BookOpen, Clock, Users } from "lucide-react";

export function ProductsSection() {
  return (
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
  );
}
