'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import AuthModal from '@/components/AuthModal';
import { Zap, Trophy, Clock, CheckCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RaffleAuthCTA() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Check URL params for auth success
      const authStatus = searchParams.get('auth');
      const userId = searchParams.get('user');

      if (authStatus === 'success' && userId) {
        // User just authenticated, proceed to payment
        handlePayment(userId);
      } else if (authStatus === 'error') {
        setError('Authentication failed. Please try again.');
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const handleAuthSuccess = async (userId: string) => {
    setIsAuthModalOpen(false);
    await handlePayment(userId);
  };

  const handlePayment = async (userId: string) => {
    setIsProcessingPayment(true);
    setError(null);

    try {
      // Get user data
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not found');
      }

      // Get active raffle
      const { data: raffle } = await supabase
        .from('raffle_config')
        .select('id, entry_price')
        .eq('status', 'active')
        .single();

      if (!raffle) {
        throw new Error('No active raffle found');
      }

      // Check for existing entry
      const { data: existingEntry } = await supabase
        .from('raffle_entries')
        .select('id')
        .eq('raffle_id', raffle.id)
        .eq('email', user.email)
        .single();

      if (existingEntry) {
        setError('You have already entered this raffle!');
        setIsProcessingPayment(false);
        return;
      }

      // Create payment request
      const response = await fetch('/api/payments/raffle-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
          phone: user.phone || '',
          commitment: 'I am ready to transform my life and commit to the journey',
          transformationGoal: 'To become the commander of my destiny and achieve breakthrough success',
          raffleId: raffle.id,
          guestCheckout: false,
          userId: user.id
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        // Trigger celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Redirect to payment
        setTimeout(() => {
          window.location.href = data.paymentUrl;
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to create payment');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleJoinRaffle = () => {
    if (user) {
      handlePayment(user.id);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="py-24 px-4 bg-gradient-to-b from-white via-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          {/* Hero CTA */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 gradient-text-fallback mb-6">
              Your Transformation Starts Now
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join the grand opening raffle. Get instant access to the Trajectory course at 35% off and enter to win life-changing prizes.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
              <Zap className="w-12 h-12 mx-auto mb-3 text-orange-500" />
              <h3 className="font-bold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600">Get immediate access to the full Trajectory course</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-bold text-gray-900 mb-2">Win Prizes</h3>
              <p className="text-sm text-gray-600">16 transformation accelerators worth over $25,000</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
              <Clock className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <h3 className="font-bold text-gray-900 mb-2">Limited Time</h3>
              <p className="text-sm text-gray-600">Grand opening offer ends soon</p>
            </div>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            className="text-center p-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-3xl font-black text-white mb-4">
                Ready to Kill The Boy?
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                One decision. One moment. Everything changes.
              </p>

              {/* Price Display */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-white/80 line-through text-2xl">$149</span>
                  <span className="text-5xl font-black text-white">$97</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SAVE 35%
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-2">One-time payment • Lifetime access</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-600/20 border border-red-400 rounded-lg">
                  <p className="text-white text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleJoinRaffle}
                disabled={isProcessingPayment}
                size="lg"
                className="w-full md:w-auto px-12 py-6 text-xl bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-xl"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Join The Raffle Now
                    <Zap className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>

              {user && (
                <p className="text-white/90 text-sm mt-4">
                  <CheckCircle className="inline mr-1 h-4 w-4" />
                  Signed in as {user.email}
                </p>
              )}
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-600 mb-4">
              🔒 Secure payment powered by Square
            </p>
            <p className="text-sm text-gray-500">
              By entering, you agree to our terms and confirm you are 18+
            </p>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Create Your Account"
        description="Sign up to enter the raffle and get instant access to the Trajectory course"
      />
    </>
  );
}