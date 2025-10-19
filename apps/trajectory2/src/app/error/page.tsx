'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Something went wrong. Please try again.'

  return (
    <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="luxury-card border-[var(--border-gold)] shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AlertCircle className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-primary">
              Oops!
            </CardTitle>
            <p className="text-secondary mt-2">Something unexpected happened</p>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="p-4 luxury-glass-gold rounded-lg">
              <p className="text-secondary leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="luxury-button h-12">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Go Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-[var(--border-gold)] text-gold hover:bg-gold hover:text-black transition-all h-12"
              >
                <Link
                  href="javascript:history.back()"
                  className="inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted">
              If this problem persists, please contact support
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ErrorPageSkeleton() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <Card className="luxury-card border-[var(--border-gold)] shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-primary">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<ErrorPageSkeleton />}>
      <ErrorContent />
    </Suspense>
  )
}
