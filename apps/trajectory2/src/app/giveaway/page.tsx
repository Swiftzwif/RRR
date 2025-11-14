import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Giveaway Event Ended | Trajectory',
  description: 'The Kill The Boy Grand Opening giveaway has ended. Thank you for your interest! Stay tuned for future opportunities.',
};

export default function GiveawayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Giveaway Event Ended
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Thank you for your interest in the Kill The Boy Grand Opening giveaway.
        </p>

        <p className="text-lg text-slate-500 mb-10">
          While this event has concluded, your transformation journey can start today. Explore our digital course and coaching options to begin your path from drift to dominion.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
