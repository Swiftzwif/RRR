import { Metadata } from 'next';
import { Suspense } from 'react';
import RaffleHero from '@/components/raffle/RaffleHero';
import PrizeShowcase from '@/components/raffle/PrizeShowcase';
import RaffleAuthCTA from '@/components/raffle/RaffleAuthCTA';
import LiveWarriorFeed from '@/components/raffle/LiveWarriorFeed';
import RaffleCountdown from '@/components/raffle/RaffleCountdown';

export const metadata: Metadata = {
  title: 'Kill The Boy Grand Opening - Transform Your Life + Win',
  description: 'Join the movement. Get 35% off the Trajectory course and enter to win transformation accelerators. Your journey from drift to dominion starts with a single decision.',
  openGraph: {
    title: 'Kill The Boy Grand Opening - Transform Your Life + Win',
    description: 'Join the movement. Get 35% off the Trajectory course and enter to win transformation accelerators.',
    images: ['/og-raffle.png'],
  },
};

export default function RafflePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero that creates the moment of decision */}
      <Suspense fallback={<div className="h-[600px] animate-pulse bg-gradient-to-b from-sky-100/50 to-white" />}>
        <RaffleHero />
      </Suspense>

      {/* Countdown creating urgency */}
      <Suspense fallback={<div className="py-12 px-4"><div className="h-24 animate-pulse bg-gray-100 rounded-xl max-w-4xl mx-auto" /></div>}>
        <RaffleCountdown />
      </Suspense>

      {/* Show the transformation tools they could win */}
      <Suspense fallback={<div className="py-20"><div className="h-96 animate-pulse bg-gray-50" /></div>}>
        <PrizeShowcase />
      </Suspense>

      {/* Live feed of warriors joining the movement */}
      <Suspense fallback={<div className="py-20 bg-gradient-to-b from-white to-sky-50"><div className="h-96 animate-pulse" /></div>}>
        <LiveWarriorFeed />
      </Suspense>

      {/* New Auth CTA - replaces TransformationCommitment */}
      <Suspense fallback={<div className="py-24"><div className="h-96 animate-pulse bg-gradient-to-b from-white to-red-50" /></div>}>
        <RaffleAuthCTA />
      </Suspense>
    </div>
  );
}