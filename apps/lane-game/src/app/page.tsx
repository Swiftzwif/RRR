'use client';

import { AnimatedQuote } from '@/components/AnimatedQuote';
import { DomainsPreview } from '@/components/DomainsPreview';
import { FooterLegal } from '@/components/FooterLegal';
import { HeroCard } from '@/components/HeroCard';
import { ResourceBooks } from '@/components/ResourceBooks';
import { SocialProof } from '@/components/SocialProof';
import { StoryTeaser } from '@/components/StoryTeaser';
import { TopNav } from '@/components/TopNav';
import { trackQuizStart } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  const handleStartQuiz = () => {
    trackQuizStart('landing');
    router.push('/quiz');
  };

  const handleHowItWorks = () => {
    // TODO: Scroll to how it works section or show modal
    console.log('How it works clicked');
  };

  const inspiringQuotes = [
    {
      text: "The boy dies, but the man lives. Kill the boy and let the man be born.",
      author: "George R.R. Martin",
      book: "A Game of Thrones"
    },
    {
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      author: "James Clear",
      book: "Atomic Habits"
    },
    {
      text: "The Fastlane is about leverage, multiplication, and systems.",
      author: "MJ DeMarco",
      book: "The Millionaire Fastlane"
    },
    {
      text: "Deep work is the superpower of the 21st century.",
      author: "Cal Newport",
      book: "Deep Work"
    }
  ];

  useEffect(() => {
    // Track landing page view
    console.log('Landing page viewed');
  }, []);
  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <HeroCard 
            onPrimaryClick={handleStartQuiz}
            onSecondaryClick={handleHowItWorks}
          />
        </section>

        {/* Story Teaser */}
        <section className="py-16">
          <StoryTeaser />
        </section>

        {/* Domains Preview */}
        <section className="py-16">
          <DomainsPreview />
        </section>

        {/* Social Proof */}
        <section className="py-16">
          <SocialProof />
        </section>

        {/* Inspiring Quotes */}
        <section className="py-16 bg-gray-50">
          <AnimatedQuote quotes={inspiringQuotes} />
        </section>

        {/* Resource Books */}
        <section className="py-16">
          <ResourceBooks />
        </section>
      </main>

      <FooterLegal />
    </div>
  );
}
