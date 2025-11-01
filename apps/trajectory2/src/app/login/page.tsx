'use client'

import { Suspense, useState, useEffect } from 'react'
import { LogoMark } from "@/components/LogoMark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion'
import { ArrowRight, LogIn, Shield, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation'
import { login, signup } from "./actions";
import { createClient } from '@/utils/supabase/client';

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  // Check for redirect parameter
  useEffect(() => {
    const redirectTo = searchParams.get('redirectTo')
    if (redirectTo) {
      // Store redirect for after login
      sessionStorage.setItem('authRedirect', redirectTo)
    }
  }, [searchParams])

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true)
      const redirectTo = searchParams.get('redirectTo') || '/'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('Google auth error:', error)
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error('Google auth error:', error)
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(formData)
      } else {
        await signup(formData)
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="absolute top-0 right-0 w-full h-full"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 400 Q 720 100, 1440 300"
            stroke="var(--brand-gold)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <LogoMark className="h-12 w-12 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-primary">Trajectory</span>
            </Link>
            <h2 className="text-3xl font-bold text-primary mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the Community'}
            </h2>
            <p className="text-secondary">
              {mode === 'login'
                ? 'Continue your transformation journey'
                : 'Start commanding your trajectory today'}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="bg-elev-2 border-[var(--border-default)]">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-secondary">
                {mode === 'login'
                  ? 'Access your premium content and continue where you left off'
                  : 'Get access to exclusive content and join our community'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Google OAuth Button */}
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading || isGoogleLoading}
                variant="outline"
                className="w-full mb-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                size="lg"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-default)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-elev-2 px-2 text-secondary">Or continue with email</span>
                </div>
              </div>

              <form action={handleSubmit} className="space-y-4">
                {/* Hidden redirect field */}
                {searchParams.get('redirectTo') && (
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={searchParams.get('redirectTo') || ''}
                  />
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-primary">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="bg-elev-1 text-white border-[var(--border-default)] placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-primary">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    placeholder="••••••••"
                    className="bg-elev-1 text-white border-[var(--border-default)] placeholder:text-gray-400"
                  />
                  {mode === 'signup' && (
                    <p className="text-xs text-muted">
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === 'login' ? (
                        <>
                          <LogIn className="w-5 h-5" />
                          Sign In
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Create Account
                        </>
                      )}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  {mode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <span className="text-gold font-semibold">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <span className="text-gold font-semibold">Sign in</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Note */}
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-elev-1 rounded-lg border border-[var(--border-default)]"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-secondary">
                      <p className="font-semibold text-primary mb-1">Secure & Private</p>
                      <p>
                        Your data is encrypted and secure. We&apos;ll send you a confirmation
                        email to verify your account.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-secondary hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
