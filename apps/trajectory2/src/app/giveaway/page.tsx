import { Metadata } from 'next';
import { Suspense } from 'react';
import GiveawayHero from '@/components/giveaway/GiveawayHero';
import PrizeShowcase from '@/components/giveaway/PrizeShowcase';
import GiveawayEntryForm from '@/components/giveaway/GiveawayEntryForm';
import LiveParticipantFeed from '@/components/giveaway/LiveParticipantFeed';
import GiveawayCountdown from '@/components/giveaway/GiveawayCountdown';

export const metadata: Metadata = {
  title: 'Kill The Boy Grand Opening - Enter to Win Transformation Prizes',
  description: 'Join the movement. Enter to win transformation accelerators worth over $2,500. Your journey from drift to dominion starts with a single decision.',
  openGraph: {
    title: 'Kill The Boy Grand Opening - Enter to Win Transformation Prizes',
    description: 'Join the movement. Enter to win transformation accelerators worth over $2,500.',
    images: ['/og-giveaway.png'],
  },
};

export default function GiveawayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero that creates the moment of decision */}
      <Suspense fallback={<div className="h-[600px] animate-pulse bg-gradient-to-b from-sky-100/50 to-white" />}>
        <GiveawayHero />
      </Suspense>

      {/* Countdown creating urgency */}
      <Suspense fallback={<div className="py-12 px-4"><div className="h-24 animate-pulse bg-gray-100 rounded-xl max-w-4xl mx-auto" /></div>}>
        <GiveawayCountdown />
      </Suspense>

      {/* Show the transformation tools they could win */}
      <Suspense fallback={<div className="py-20"><div className="h-96 animate-pulse bg-gray-50" /></div>}>
        <PrizeShowcase />
      </Suspense>

      {/* Live feed of participants joining the movement */}
      <Suspense fallback={<div className="py-20 bg-gradient-to-b from-white to-sky-50"><div className="h-96 animate-pulse" /></div>}>
        <LiveParticipantFeed />
      </Suspense>

      {/* Entry Form */}
      <div id="entry-form">
        <Suspense fallback={<div className="py-24"><div className="h-96 animate-pulse bg-gradient-to-b from-white to-red-50" /></div>}>
          <GiveawayEntryForm />
        </Suspense>
      </div>
    </div>
  );
}
