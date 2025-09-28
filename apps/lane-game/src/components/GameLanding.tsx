'use client';

import { useGameStore } from '@/lib/game-store';
import { Button } from '@trajectory/ui';
import { Clock, Play, Target, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function GameLanding() {
  const router = useRouter();
  const startSession = useGameStore(state => state.startSession);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    startSession();
    
    // Small delay for UX
    setTimeout(() => {
      router.push('/game');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 strata-text">
            Lane Diagnostic
          </h1>
          <p className="text-xl md:text-2xl text-sky-600 mb-8 max-w-3xl mx-auto">
            Discover your financial lane through an engaging, honest assessment designed to reveal your true money mindset.
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="strata-card p-6">
            <Clock className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">60-Second Timer</h3>
            <p className="text-sky-600">
              Each question has a 60-second timer to capture your first instinct and prevent overthinking.
            </p>
          </div>
          
          <div className="strata-card p-6">
            <Target className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Anti-Gaming</h3>
            <p className="text-sky-600">
              Built-in measures to ensure honest responses and accurate lane classification.
            </p>
          </div>
          
          <div className="strata-card p-6">
            <Trophy className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Achievements</h3>
            <p className="text-sky-600">
              Earn badges based on your performance and unlock insights about your financial mindset.
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600">18</div>
              <div className="text-sm text-sky-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600">4</div>
              <div className="text-sm text-sky-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600">15</div>
              <div className="text-sm text-sky-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600">3</div>
              <div className="text-sm text-sky-500">Lanes</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            size="lg"
            className="text-lg px-12 py-4 bg-sky-400 hover:bg-sky-500 text-white"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Starting Game...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Assessment
              </>
            )}
          </Button>
          
          <p className="text-sm text-sky-500">
            No registration required • Takes 10-15 minutes • Get instant results
          </p>
        </div>
      </div>
    </div>
  );
}
