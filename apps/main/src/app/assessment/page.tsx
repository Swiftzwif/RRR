'use client';

import AssessmentStepper from '@/components/AssessmentStepper';
import { getCopy } from '@/lib/copy';
import { scoreDomains } from '@/lib/scoring';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Question {
  id: string;
  domain: string;
  prompt: string;
}

interface QuestionsData {
  scored: Question[];
  reflective: Question[];
}

export default function AssessmentPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data: QuestionsData = await response.json();
        setQuestions(data.scored);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleComplete = async (answers: Record<string, number>) => {
    try {
      // Calculate scores
      const result = scoreDomains(answers);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save assessment to database
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          user_id: user?.id || null,
          answers,
          domain_scores: result.domainScores,
          avatar: result.avatar,
          score: result.overall,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment:', error);
        // Still proceed to results even if save fails
      }

      // Store results in session storage for results page
      sessionStorage.setItem('assessmentResults', JSON.stringify({
        ...result,
        assessmentId: data?.id,
      }));

      // Redirect to results
      router.push('/results');
    } catch (err) {
      console.error('Error processing assessment:', err);
      setError('Failed to process assessment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sky-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-display font-bold text-sky-800 mb-4">
            Error Loading Assessment
          </h1>
          <p className="text-sky-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="strata-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-sky-800 mb-4">
            {getCopy('assessment.title')}
          </h1>
          <p className="text-lg text-sky-600">
            {getCopy('assessment.subtitle')}
          </p>
        </div>

        <AssessmentStepper
          questions={questions}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
