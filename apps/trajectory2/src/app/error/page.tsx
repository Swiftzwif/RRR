'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedDiv } from '@/components/animation/AnimatedComponents'
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Something went wrong. Please try again.'

  return (
    <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4">
      <AnimatedDiv
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-elev-2 border-red-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-primary">Oops!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <p className="text-secondary">{message}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="javascript:history.back()" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedDiv>
    </div>
  )
}

function ErrorPageSkeleton() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="bg-elev-2 border-red-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-primary">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<ErrorPageSkeleton />}>
      <ErrorContent />
    </Suspense>
  )
}
