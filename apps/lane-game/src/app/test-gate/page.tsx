'use client';

import { AnimatedQuote } from '@/components/AnimatedQuote';
import { AvatarReveal } from '@/components/AvatarReveal';
import { CTAButton } from '@/components/CTAButton';
import { DomainStatCard } from '@/components/DomainStatCard';
import { EmailGate } from '@/components/EmailGate';
import { MicroToast } from '@/components/MicroToast';
import { MiniMeter } from '@/components/MiniMeter';
import { OfferStripe } from '@/components/OfferStripe';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ResourceBooks } from '@/components/ResourceBooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestGatePage() {
  const router = useRouter();
  const [currentTest, setCurrentTest] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);

  const tests = [
    {
      name: 'Landing Page',
      component: (
        <div className="text-center">
          <h1 className="text-h1 font-display font-bold text-ink mb-6">
            Test Gate - Landing Components
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Testing all landing page components
          </p>
          <div className="space-y-4">
            <CTAButton variant="primary" onClick={() => setCurrentTest(1)}>
              Test Quiz Components
            </CTAButton>
            <CTAButton variant="secondary" onClick={() => setCurrentTest(7)}>
              Test Results Components
            </CTAButton>
          </div>
        </div>
      )
    },
    {
      name: 'Progress Bar',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Progress Bar Test</h2>
          <ProgressBar current={4} total={17} />
          <ProgressBar current={17} total={17} />
          <CTAButton variant="primary" onClick={() => setCurrentTest(2)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Question Card',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Question Card Test</h2>
          <QuestionCard
            question="How would you rate your current energy levels throughout the day?"
            domain="energy"
            value={3}
            onChange={(value) => console.log('Answer:', value)}
            microcopy="Take a breath. Answer honestly."
          />
          <CTAButton variant="primary" onClick={() => setCurrentTest(3)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Mini Meters',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Mini Meters Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MiniMeter
              domain="energy"
              level="mid"
              progress={65}
              nextMilestone="2 strong choices to Energized"
            />
            <MiniMeter
              domain="focus"
              level="low"
              progress={35}
              nextMilestone="3 strong choices to Laser-Focused"
            />
            <MiniMeter
              domain="finances"
              level="high"
              progress={85}
              nextMilestone="Maintain excellence"
            />
            <MiniMeter
              domain="relationships"
              level="mid"
              progress={60}
              nextMilestone="2 strong choices to Supported"
            />
          </div>
          <CTAButton variant="primary" onClick={() => setCurrentTest(4)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Micro Toast',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Micro Toast Test</h2>
          <CTAButton 
            variant="primary" 
            onClick={() => setShowToast(true)}
          >
            Show Toast
          </CTAButton>
          <CTAButton variant="secondary" onClick={() => setCurrentTest(5)}>
            Next Test
          </CTAButton>
          {showToast && (
            <MicroToast
              message="Energy leveled up → Energized"
              type="success"
              onClose={() => setShowToast(false)}
            />
          )}
        </div>
      )
    },
    {
      name: 'Avatar Reveal',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Avatar Reveal Test</h2>
          <AvatarReveal avatar="ARCHITECT" onComplete={() => console.log('Avatar reveal complete')} />
          <CTAButton variant="primary" onClick={() => setCurrentTest(6)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Email Gate',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Email Gate Test</h2>
          <CTAButton 
            variant="primary" 
            onClick={() => setShowEmailGate(true)}
          >
            Show Email Gate
          </CTAButton>
          <CTAButton variant="secondary" onClick={() => setCurrentTest(7)}>
            Next Test
          </CTAButton>
          {showEmailGate && (
            <EmailGate
              isOpen={true}
              onClose={() => setShowEmailGate(false)}
              onSubmit={(email) => {
                console.log('Email submitted:', email);
                setShowEmailGate(false);
              }}
              isLoading={false}
            />
          )}
        </div>
      )
    },
    {
      name: 'Domain Stat Cards',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Domain Stat Cards Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DomainStatCard
              domain="energy"
              level="mid"
              progress={65}
              nextMilestone="2 strong choices to Energized"
              sevenDayPlay="8-minute morning walk + water."
              isFocusArea={true}
            />
            <DomainStatCard
              domain="focus"
              level="low"
              progress={35}
              nextMilestone="3 strong choices to Laser-Focused"
              sevenDayPlay="Phone in another room for 2 hours."
              isFocusArea={true}
            />
            <DomainStatCard
              domain="finances"
              level="high"
              progress={85}
              nextMilestone="Maintain excellence"
              sevenDayPlay="Track every dollar for 7 days."
              isFocusArea={false}
            />
          </div>
          <CTAButton variant="primary" onClick={() => setCurrentTest(8)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Offer Stripe',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Offer Stripe Test</h2>
          <OfferStripe
            title="Rethink. Redesign. Reignite."
            description="A comprehensive system to transform your trajectory across all six domains."
            cta="Get the Playbook"
            onCTAClick={() => console.log('Course CTA clicked')}
          />
          <CTAButton variant="primary" onClick={() => setCurrentTest(9)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Animated Quotes',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Animated Quotes Test</h2>
          <AnimatedQuote 
            quotes={[
              {
                text: "The boy dies, but the man lives. Kill the boy and let the man be born.",
                author: "George R.R. Martin",
                book: "A Game of Thrones"
              },
              {
                text: "You do not rise to the level of your goals. You fall to the level of your systems.",
                author: "James Clear",
                book: "Atomic Habits"
              }
            ]}
            interval={3000}
          />
          <CTAButton variant="primary" onClick={() => setCurrentTest(10)}>
            Next Test
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Resource Books',
      component: (
        <div className="space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">Resource Books Test</h2>
          <ResourceBooks />
          <CTAButton variant="primary" onClick={() => setCurrentTest(11)}>
            Complete Tests
          </CTAButton>
        </div>
      )
    },
    {
      name: 'Complete',
      component: (
        <div className="text-center space-y-8">
          <h2 className="text-h2 font-display font-semibold text-ink">All Tests Complete!</h2>
          <p className="text-lg text-gray-600">
            All components are working correctly. The application is ready for production.
          </p>
          <div className="space-y-4">
            <CTAButton variant="primary" onClick={() => router.push('/')}>
              Go to Landing Page
            </CTAButton>
            <CTAButton variant="secondary" onClick={() => setCurrentTest(0)}>
              Run Tests Again
            </CTAButton>
          </div>
        </div>
      )
    }
  ];

  const currentTestData = tests[currentTest];

  return (
    <div className="min-h-screen bg-paper">
      <div className="container mx-auto px-4 py-8">
        {/* Test Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-h1 font-display font-bold text-ink">
              Component Test Gate
            </h1>
            <div className="text-sm text-gray-500">
              Test {currentTest + 1} of {tests.length}
            </div>
          </div>
          <ProgressBar current={currentTest + 1} total={tests.length} />
        </div>

        {/* Current Test */}
        <div className="bg-white rounded-card border border-gray-200 p-8 shadow-elevation-2">
          {currentTestData.component}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <CTAButton 
            variant="secondary" 
            onClick={() => setCurrentTest(Math.max(0, currentTest - 1))}
            disabled={currentTest === 0}
          >
            Previous
          </CTAButton>
          
          <div className="flex space-x-2">
            {tests.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTest(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTest ? 'bg-accent' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <CTAButton 
            variant="primary" 
            onClick={() => setCurrentTest(Math.min(tests.length - 1, currentTest + 1))}
            disabled={currentTest === tests.length - 1}
          >
            Next
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
