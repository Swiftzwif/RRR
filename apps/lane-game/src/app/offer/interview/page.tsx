'use client';

import { CTAButton } from '@/components/CTAButton';
import { FooterLegal } from '@/components/FooterLegal';
import { TopNav } from '@/components/TopNav';
import { trackCoachingClicked, trackOfferClicked, trackOfferViewed } from '@/lib/analytics';
import { content } from '@/lib/content';
import { useEffect } from 'react';

export default function InterviewOfferPage() {
  useEffect(() => {
    trackOfferViewed('interview', 'direct');
  }, []);

  const handleInterviewClick = () => {
    trackOfferClicked('interview', 'Book Interview', 'interview-page');
    // TODO: Integrate with Stripe checkout
    console.log('Interview booking initiated');
  };

  const handleCoachingClick = () => {
    trackCoachingClicked('interview');
    // TODO: Navigate to coaching page
    console.log('Navigate to coaching page');
  };

  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-h1 font-display font-bold text-ink mb-6">
            {content.offer.interview.header}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {content.offer.interview.subtitle}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {content.offer.interview.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton
              variant="primary"
              size="lg"
              onClick={handleInterviewClick}
            >
              {content.offer.interview.cta} - {content.offer.interview.price}
            </CTAButton>
            <p className="text-sm text-gray-500">
              {content.offer.interview.duration}
            </p>
          </div>
        </section>

        {/* What You'll Get */}
        <section className="mb-16">
          <h2 className="text-h2 font-display font-semibold text-ink mb-8 text-center">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Personalized Assessment</h3>
              <p className="text-gray-600">
                Deep dive into your specific situation and challenges
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Custom Action Plan</h3>
              <p className="text-gray-600">
                Tailored recommendations for your unique trajectory
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Priority Focus Areas</h3>
              <p className="text-gray-600">
                Clear direction on which domains to focus on first
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Next Steps</h3>
              <p className="text-gray-600">
                Concrete actions to take immediately after the call
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mb-16">
          <h2 className="text-h2 font-display font-semibold text-ink mb-8 text-center">
            The Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold text-ink mb-2">Assessment Review</h3>
              <p className="text-gray-600 text-sm">
                We'll review your assessment results and discuss your current situation
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold text-ink mb-2">Deep Dive</h3>
              <p className="text-gray-600 text-sm">
                Explore your challenges, goals, and what's holding you back
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold text-ink mb-2">Action Plan</h3>
              <p className="text-gray-600 text-sm">
                Receive your personalized roadmap for transformation
              </p>
            </div>
          </div>
        </section>

        {/* Secondary CTA */}
        <section className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready for ongoing support?
          </p>
          <CTAButton
            variant="secondary"
            onClick={handleCoachingClick}
          >
            Apply for Coaching
          </CTAButton>
        </section>
      </main>

      <FooterLegal />
    </div>
  );
}
