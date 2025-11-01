"use client";

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/products/ProductCard';
import PricingDisplay from '@/components/products/PricingDisplay';
import LimitedTimeOffer from '@/components/products/LimitedTimeOffer';
import TestimonialCard from '@/components/products/TestimonialCard';
import { PRODUCTS } from '@/lib/config';
import { Clock, Users, BookOpen } from 'lucide-react';

const testimonials = [
  {
    name: "Armani Martinez",
    location: "Lawrence, MA",
    quote: "Guttural, to the point, page turner, insightful, lots of wisdom, action steps, opened my eyes to what was holding me back."
  },
  {
    name: "Jose Manuel",
    location: "Manchester, NH",
    quote: "I have a newfound desire to pursue an old passion of mine thanks to the conversation on the Map of Consciousness. After going through the exercise and reflecting as to how I have been showing up. I finally had an insight that led me to pick up a old passion of mine. I'm 32 now and I use to love anime as a kid. I have over 9 years without creating and after this course I felt inspired and starting creating my own anime series. Pursing my passion once again has given me joy and purpose."
  },
  {
    name: "Luis Rosario",
    location: "Andover, MA",
    quote: "I would recommend this to any man seeking knowledge. If you are looking for truth and wisdom. This is the course for you. Game-changer!"
  }
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-base text-white pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFD700] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="border-[#FFD700] text-[#FFD700] mb-6 text-sm">
              TRANSFORM YOUR LIFE
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Choose Your Path
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Command your attention, energy, and resources. Transform from drifter to architect.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-elev-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
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

      {/* Testimonials */}
      <section className="py-20 bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="border-[#FFD700] text-[#FFD700] mb-4">
              REAL TRANSFORMATIONS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Men Are Saying
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join 1,000+ men who have transformed their trajectory
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-elev-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "What if I can't afford it?",
                a: "We offer a 30-day money-back guarantee. If the course doesn't deliver value, you get a full refund—no questions asked."
              },
              {
                q: "How is this different from other courses?",
                a: "This isn't theory—it's implementation. You'll learn the operating system upgrade that changes how you think, feel, and act. It's distilled wisdom from 148 books and years of personal transformation."
              },
              {
                q: "What's the time commitment?",
                a: "The course is self-paced. Most men complete it in 2-4 weeks, spending 30-60 minutes per day. You have lifetime access, so you can revisit anytime."
              },
              {
                q: "Can I get a refund?",
                a: "Yes. 30-day money-back guarantee. If you're not satisfied, email us and we'll refund you immediately."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-300 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Kill The Boy?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Your transformation starts now. Choose your path.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
