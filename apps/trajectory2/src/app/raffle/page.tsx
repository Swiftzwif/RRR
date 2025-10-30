import { Metadata } from 'next';
import RaffleHero from '@/components/raffle/RaffleHero';
import PrizeShowcase from '@/components/raffle/PrizeShowcase';
import TransformationCommitment from '@/components/raffle/TransformationCommitment';
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
      <RaffleHero />

      {/* Countdown creating urgency */}
      <RaffleCountdown />

      {/* Show the transformation tools they could win */}
      <PrizeShowcase />

      {/* Live feed of warriors joining the movement */}
      <LiveWarriorFeed />

      {/* The commitment ritual - capture their transformation intent */}
      <TransformationCommitment />
    </div>
  );
}