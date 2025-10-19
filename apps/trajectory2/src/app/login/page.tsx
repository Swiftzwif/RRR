'use client'

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
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

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
    <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <LogoMark className="h-12 w-12 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-primary">
                Trajectory
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-primary mb-2">
              {mode === "login" ? "Welcome Back" : "Join the Community"}
            </h2>
            <p className="text-secondary">
              {mode === "login"
                ? "Continue your transformation journey"
                : "Start commanding your trajectory today"}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="luxury-card border-[var(--border-gold)] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {mode === "login" ? "Sign In" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-secondary">
                {mode === "login"
                  ? "Access your premium content and continue where you left off"
                  : "Get access to exclusive content and join our community"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-primary"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="bg-elev-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-primary"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    required
                    placeholder="••••••••"
                    className="bg-elev-1"
                  />
                  {mode === "signup" && (
                    <p className="text-xs text-muted">
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full luxury-button h-14 text-lg"
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
                      {mode === "login" ? (
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
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <span className="text-gold font-semibold">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <span className="text-gold font-semibold">Sign in</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Note */}
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 p-4 luxury-glass-gold rounded-lg shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-secondary">
                      <p className="font-semibold text-primary mb-1">
                        Secure & Private
                      </p>
                      <p>
                        Your data is encrypted and secure. We&apos;ll send you a
                        confirmation email to verify your account.
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
  );
}
