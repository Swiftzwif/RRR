'use client';

import AssessmentStepper from '@/components/AssessmentStepper';
import { getCopy } from '@/lib/copy';
import { scoreDomains } from '@/lib/scoring';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
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
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
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
        logger.error('Error saving assessment', error);
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
      logger.error('Error processing assessment', err as Error);
      setError('Failed to process assessment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-4">
            Error Loading Assessment
          </h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIFE ASSESSMENT
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 gradient-text-fallback mb-6">
            {getCopy('assessment.title') as string}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {getCopy('assessment.subtitle') as string}
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
