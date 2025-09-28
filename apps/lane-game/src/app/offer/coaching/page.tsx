'use client';

import { CTAButton } from '@/components/CTAButton';
import { FooterLegal } from '@/components/FooterLegal';
import { TopNav } from '@/components/TopNav';
import { trackOfferClicked, trackOfferViewed } from '@/lib/analytics';
import { content } from '@/lib/content';
import { useEffect } from 'react';

export default function CoachingOfferPage() {
  useEffect(() => {
    trackOfferViewed('coaching', 'direct');
  }, []);

  const handleCoachingClick = () => {
    trackOfferClicked('coaching', 'Apply for Coaching', 'coaching-page');
    // TODO: Integrate with Stripe checkout
    console.log('Coaching application initiated');
  };

  const handleLearnMoreClick = () => {
    trackOfferClicked('coaching', 'Learn More', 'coaching-page');
    // TODO: Show more details
    console.log('Learn more clicked');
  };

  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-h1 font-display font-bold text-ink mb-6">
            {content.offer.coaching.header}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {content.offer.coaching.subtitle}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {content.offer.coaching.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton
              variant="primary"
              size="lg"
              onClick={handleCoachingClick}
            >
              {content.offer.coaching.cta} - {content.offer.coaching.price}
            </CTAButton>
            <p className="text-sm text-gray-500">
              {content.offer.coaching.duration}
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
              <h3 className="font-semibold text-ink mb-3">Weekly Strategy Sessions</h3>
              <p className="text-gray-600">
                One-on-one calls to review progress and plan next steps
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Accountability Partner</h3>
              <p className="text-gray-600">
                Someone who holds you accountable to your commitments
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Custom Systems</h3>
              <p className="text-gray-600">
                Personalized frameworks and tools for your specific situation
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Accelerated Growth</h3>
              <p className="text-gray-600">
                Faster progress with expert guidance and support
              </p>
            </div>
          </div>
        </section>

        {/* Program Structure */}
        <section className="mb-16">
          <h2 className="text-h2 font-display font-semibold text-ink mb-8 text-center">
            Program Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                Week 1
              </div>
              <h3 className="font-semibold text-ink mb-2">Foundation</h3>
              <p className="text-gray-600 text-sm">
                Assessment review, goal setting, and initial system design
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                Week 2
              </div>
              <h3 className="font-semibold text-ink mb-2">Implementation</h3>
              <p className="text-gray-600 text-sm">
                Start implementing systems and tracking progress
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                Week 3
              </div>
              <h3 className="font-semibold text-ink mb-2">Optimization</h3>
              <p className="text-gray-600 text-sm">
                Refine systems based on what's working and what isn't
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                Week 4
              </div>
              <h3 className="font-semibold text-ink mb-2">Momentum</h3>
              <p className="text-gray-600 text-sm">
                Build unstoppable momentum and plan for continued growth
              </p>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="mb-16">
          <h2 className="text-h2 font-display font-semibold text-ink mb-8 text-center">
            Who This Is For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">✓ Ready to Transform</h3>
              <p className="text-gray-600">
                You're committed to making real changes and willing to do the work
              </p>
            </div>
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">✓ Seeking Accountability</h3>
              <p className="text-gray-600">
                You know you need someone to hold you accountable to your goals
              </p>
            </div>
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">✓ Want Expert Guidance</h3>
              <p className="text-gray-600">
                You're ready to invest in professional support for faster results
              </p>
            </div>
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">✓ High Standards</h3>
              <p className="text-gray-600">
                You're not satisfied with mediocrity and want to reach your potential
              </p>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="text-center">
          <h2 className="text-h2 font-display font-semibold text-ink mb-6">
            Application Process
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            This is a selective program. We only work with men who are serious about transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="primary"
              onClick={handleCoachingClick}
            >
              Apply for Coaching
            </CTAButton>
            <CTAButton
              variant="secondary"
              onClick={handleLearnMoreClick}
            >
              Learn More
            </CTAButton>
          </div>
        </section>
      </main>

      <FooterLegal />
    </div>
  );
}
