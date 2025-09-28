'use client';

import { CTAButton } from '@/components/CTAButton';
import { FooterLegal } from '@/components/FooterLegal';
import { TopNav } from '@/components/TopNav';
import { trackInterviewClicked, trackOfferClicked, trackOfferViewed } from '@/lib/analytics';
import { content } from '@/lib/content';
import { useEffect } from 'react';

export default function CourseOfferPage() {
  useEffect(() => {
    trackOfferViewed('course', 'direct');
  }, []);

  const handleCourseClick = () => {
    trackOfferClicked('course', 'Get the Playbook', 'course-page');
    // TODO: Integrate with Stripe checkout
    console.log('Course checkout initiated');
  };

  const handleInterviewClick = () => {
    trackInterviewClicked('course');
    // TODO: Navigate to interview page
    console.log('Navigate to interview page');
  };

  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-h1 font-display font-bold text-ink mb-6">
            {content.offer.course.header}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {content.offer.course.subtitle}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {content.offer.course.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton
              variant="primary"
              size="lg"
              onClick={handleCourseClick}
            >
              {content.offer.course.cta} - {content.offer.course.price}
            </CTAButton>
            <p className="text-sm text-gray-500">
              {content.offer.course.guarantee}
            </p>
          </div>
        </section>

        {/* Outcome Bullets */}
        <section className="mb-16">
          <h2 className="text-h2 font-display font-semibold text-ink mb-8 text-center">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Identity Upgrade</h3>
              <p className="text-gray-600">
                Transform from reactive to architect of your own life
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">System Design</h3>
              <p className="text-gray-600">
                Build sustainable systems across all six domains
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Momentum Creation</h3>
              <p className="text-gray-600">
                Create unstoppable forward progress in your trajectory
              </p>
            </div>
          </div>
        </section>

        {/* Modules Overview */}
        <section className="mb-16">
          <h2 className="text-h2 font-display font-semibold text-ink mb-8 text-center">
            The Playbook Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Module 1: Identity Architecture</h3>
              <p className="text-gray-600 mb-4">
                Design your ideal identity and align your actions with your values
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Identity assessment framework</li>
                <li>• Values alignment exercises</li>
                <li>• Decision-making protocols</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Module 2: Energy Systems</h3>
              <p className="text-gray-600 mb-4">
                Optimize your physical and mental energy for peak performance
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Energy audit and optimization</li>
                <li>• Morning routine design</li>
                <li>• Recovery protocols</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Module 3: Financial Architecture</h3>
              <p className="text-gray-600 mb-4">
                Build wealth-building systems and financial security
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Financial assessment tools</li>
                <li>• Investment strategy framework</li>
                <li>• Automated wealth building</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-6 rounded-card">
              <h3 className="font-semibold text-ink mb-3">Module 4: Relationship Systems</h3>
              <p className="text-gray-600 mb-4">
                Cultivate meaningful connections and support networks
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Relationship mapping</li>
                <li>• Communication frameworks</li>
                <li>• Network building strategies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Secondary CTA */}
        <section className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Want personal guidance?
          </p>
          <CTAButton
            variant="secondary"
            onClick={handleInterviewClick}
          >
            Interview Process
          </CTAButton>
        </section>
      </main>

      <FooterLegal />
    </div>
  );
}
