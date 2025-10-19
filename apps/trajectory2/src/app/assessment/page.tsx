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
      <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
        {/* Luxury Background Orbs */}
        <div className="luxury-orb-container">
          <div className="luxury-orb luxury-orb-1" />
          <div className="luxury-orb luxury-orb-2" />
          <div className="luxury-orb luxury-orb-3" />
        </div>

        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-secondary text-lg">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
        {/* Luxury Background Orbs */}
        <div className="luxury-orb-container">
          <div className="luxury-orb luxury-orb-1" />
          <div className="luxury-orb luxury-orb-2" />
          <div className="luxury-orb luxury-orb-3" />
        </div>

        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white text-3xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-4">
            Error Loading Assessment
          </h1>
          <p className="text-secondary mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-8 py-4 luxury-button rounded-xl shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base py-12 relative overflow-hidden">
      {/* Luxury Background Orbs */}
      <div className="luxury-orb-container">
        <div className="luxury-orb luxury-orb-1" />
        <div className="luxury-orb luxury-orb-2" />
        <div className="luxury-orb luxury-orb-3" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIFE ASSESSMENT
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#C89B3C] bg-clip-text text-transparent">
              {getCopy("assessment.title") as string}
            </span>
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            {getCopy("assessment.subtitle") as string}
          </p>
        </div>

        <AssessmentStepper questions={questions} onComplete={handleComplete} />
      </div>
    </div>
  );
}
