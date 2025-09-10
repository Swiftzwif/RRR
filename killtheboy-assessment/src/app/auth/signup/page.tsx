'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCopy } from '@/lib/copy';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/results`,
        },
      });

      if (error) throw error;
      
      alert('Check your email for the confirmation link!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center py-12 px-6">
      <motion.div
        className="strata-card p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-sand-50 mb-2">
            {getCopy('auth.signup.title')}
          </h1>
          <p className="text-sand-200">
            {getCopy('auth.signup.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sand-200 mb-2">
              {getCopy('auth.signup.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="strata-input w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sand-200 mb-2">
              {getCopy('auth.signup.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="strata-input w-full"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-sand-200 mb-2">
              {getCopy('auth.signup.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="strata-input w-full"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="strata-button w-full"
          >
            {loading ? 'Creating account...' : getCopy('auth.signup.button')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-sand-200">
            {getCopy('auth.signup.hasAccount')}{' '}
            <Link href="/auth/signin" className="text-sunset hover:text-sunset-dark transition-colors">
              {getCopy('auth.signup.signin')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
