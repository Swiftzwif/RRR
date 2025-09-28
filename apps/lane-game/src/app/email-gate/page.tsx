'use client';

import { EmailGate } from '@/components/EmailGate';
import { trackEmailSubmitted } from '@/lib/analytics';
import { useQuizStore } from '@/lib/quiz-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailGatePage() {
  const router = useRouter();
  const { avatar, isCompleted } = useQuizStore();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if quiz not completed
  if (typeof window !== 'undefined' && !isCompleted) {
    router.push('/quiz');
    return null;
  }

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Track email submission
      trackEmailSubmitted(email, avatar);
      
      // TODO: Save email to database
      console.log('Email submitted:', email);
      
      // Redirect to results
      router.push('/results');
    } catch (error) {
      console.error('Error submitting email:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <EmailGate
          isOpen={true}
          onClose={() => router.push('/quiz')}
          onSubmit={handleEmailSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
