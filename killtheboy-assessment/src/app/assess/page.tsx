'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/lib/store';
import { logAssessmentStart, logQuestionAnswered } from '@/lib/events';
import Likert from '@/components/Likert';
import ProgressBar from '@/components/ProgressBar';

interface Question {
  id: string;
  domain?: string;
  prompt: string;
}

interface QuestionsData {
  metadata: {
    note: string;
    domains: string[];
  };
  scored: Question[];
  reflective: Question[];
}

// Fallback component for missing/invalid questions
function QuestionsFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full px-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            TBD – Questions Not Ready
          </h1>
          <p className="text-gray-600 mb-6">
            Paste verbatim questions into <code className="bg-gray-100 px-2 py-1 rounded">/src/content/questions.json</code> and run:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            npm run validate:questions
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Use <code className="bg-gray-100 px-2 py-1 rounded">questions.template.json</code> as your starting point.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const router = useRouter();
  const { answers, setAnswer, reset } = useAssessmentStore();
  const [questionsData, setQuestionsData] = useState<QuestionsData | null>(null);
  const [reflectiveAnswers, setReflectiveAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load questions data
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/validate-questions');
        if (!response.ok) {
          setError('Questions validation failed');
          setLoading(false);
          return;
        }
        
        // Load questions.json directly
        const questionsResponse = await fetch('/content/questions.json');
        if (!questionsResponse.ok) {
          setError('Failed to load questions.json');
          setLoading(false);
          return;
        }
        
        const data: QuestionsData = await questionsResponse.json();
        setQuestionsData(data);
        setLoading(false);
        logAssessmentStart();
      } catch (error) {
        setError('Failed to load questions');
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !questionsData) {
    return <QuestionsFallback />;
  }

  // Check if questions are still placeholder
  const hasPlaceholderQuestions = questionsData.scored.some(q => 
    q.prompt.includes('TBD') || q.prompt.includes('<<<VERBATIM FROM DOCS>>>')
  );

  if (hasPlaceholderQuestions) {
    return <QuestionsFallback />;
  }

  const scoredQuestions = questionsData.scored;
  const reflectiveQuestions = questionsData.reflective;
  const totalScored = scoredQuestions.length;
  const answeredScored = scoredQuestions.filter(q => answers[q.id] !== undefined).length;
  const canSubmit = answeredScored === totalScored;

  const handleScoredAnswer = (questionId: string, value: number) => {
    setAnswer(questionId, value);
    logQuestionAnswered(questionId, value);
  };

  const handleReflectiveAnswer = (questionId: string, value: string) => {
    setReflectiveAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers,
          reflective: reflectiveAnswers
        })
      });
      
      if (response.ok) {
        const { id } = await response.json();
        router.push(`/results?submission=${id}`);
      } else {
        const errorData = await response.json();
        console.error('Submission error:', errorData);
        alert('Failed to submit assessment. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trajectory Life Assessment
          </h1>
          <p className="text-gray-600">
            Answer honestly. Take your time.
          </p>
        </div>

        {/* Progress */}
        <ProgressBar 
          current={answeredScored} 
          total={totalScored}
          label={`${answeredScored}/${totalScored} scored questions answered`}
        />

        {/* Scored Questions */}
        <div className="space-y-8 mb-12">
          {scoredQuestions.map((question, index) => (
            <div key={question.id} className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Question {index + 1} of {totalScored}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500 capitalize">{question.domain}</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {question.prompt}
              </h2>
              
              <Likert 
                value={answers[question.id] || null}
                onChange={(value) => handleScoredAnswer(question.id, value)}
              />
            </div>
          ))}
        </div>

        {/* Reflective Questions */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reflection Questions
          </h2>
          
          {reflectiveQuestions.map((question, index) => (
            <div key={question.id} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {question.prompt}
              </h3>
              
              <textarea
                value={reflectiveAnswers[question.id] || ''}
                onChange={(e) => handleReflectiveAnswer(question.id, e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Get Your Results'}
          </button>
          
          {!canSubmit && (
            <p className="text-sm text-gray-500 mt-4">
              Please answer all {totalScored} scored questions to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
