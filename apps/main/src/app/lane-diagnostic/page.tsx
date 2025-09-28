'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  category: string;
  prompt: string;
  type: string;
  options: Array<{ value: number; text: string }>;
}

interface QuestionsData {
  questions: Question[];
}

export default function LaneDiagnosticPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the landing page
    router.push('/lane-diagnostic/landing');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-sunset border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sand-200">Redirecting to Lane Diagnostic...</p>
      </div>
    </div>
  );
}
