'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/lib/store';
import { logAssessmentStart, logQuestionAnswered } from '@/lib/events';
import Likert from '@/components/Likert';
import questionsData from '@/content/questions.json';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Starfield from '@/components/Starfield';
import ShipProgress from '@/components/ShipProgress';
 

interface ScoredQuestion {
  id: string;
  domain: string;
  prompt: string;
}

interface ReflectiveQuestion {
  id: string;
  prompt: string;
}

interface QuestionsData {
  metadata: {
    note: string;
    domains: string[];
  };
  scored: ScoredQuestion[];
  reflective: ReflectiveQuestion[];
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
  const [reflectiveAnswers, setReflectiveAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<'scored' | 'reflective'>('scored');
  const [debugInfo, setDebugInfo] = useState<string>('');
  

  useEffect(() => {
    // Non-blocking validation; UI loads regardless
    const validate = async () => {
      try {
        const res = await fetch('/api/validate-questions');
        if (!res.ok) {
          console.warn('validate-questions returned non-OK', await res.text());
        }
      } catch (e) {
        console.warn('validate-questions request failed', e);
      } finally {
        setLoading(false);
        logAssessmentStart();
      }
    };
    validate();
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
  if (error) {
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
  const totalReflective = reflectiveQuestions.length;
  const answeredScored = scoredQuestions.filter(q => answers[q.id] !== undefined).length;

  // Get current question based on section and index
  const getCurrentQuestion = () => {
    if (currentSection === 'scored') {
      return scoredQuestions[currentQuestionIndex];
    } else {
      return reflectiveQuestions[currentQuestionIndex];
    }
  };

  const currentQuestion = getCurrentQuestion();
  const totalQuestions = currentSection === 'scored' ? totalScored : totalReflective;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Check if we can move to reflective questions
  const canMoveToReflective = answeredScored === totalScored;

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

  const handleNext = () => {
    if (currentSection === 'scored' && isLastQuestion) {
      // Move to reflective questions
      if (canMoveToReflective) {
        setCurrentSection('reflective');
        setCurrentQuestionIndex(0);
      }
    } else if (currentSection === 'reflective' && isLastQuestion) {
      // Submit assessment
      handleSubmit();
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection === 'reflective' && isFirstQuestion) {
      // Move back to scored questions
      setCurrentSection('scored');
      setCurrentQuestionIndex(totalScored - 1);
    } else {
      // Move to previous question
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('=== SUBMISSION DEBUG ===');
    console.log('Answers:', answers);
    console.log('Reflective:', reflectiveAnswers);
    console.log('Can move to reflective:', canMoveToReflective);
    console.log('Current section:', currentSection);
    console.log('Is last question:', isLastQuestion);
    
    setDebugInfo('Starting submission...');
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        answers,
        reflective: reflectiveAnswers
      };
      
      console.log('Submitting data:', submissionData);
      setDebugInfo('Sending request to API...');
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      setDebugInfo(`Response status: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        setDebugInfo('Submission successful! Redirecting...');
        router.push(`/results?submission=${result.id}`);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setDebugInfo(`API Error: ${JSON.stringify(errorData)}`);
        alert(`Failed to submit assessment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network/JS Error:', error);
      setDebugInfo(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressInfo = () => {
    if (currentSection === 'scored') {
      return {
        current: currentQuestionIndex + 1,
        total: totalScored,
        label: `Question ${currentQuestionIndex + 1} of ${totalScored}`,
        section: 'Scored Questions'
      };
    } else {
      return {
        current: currentQuestionIndex + 1,
        total: totalReflective,
        label: `Reflection ${currentQuestionIndex + 1} of ${totalReflective}`,
        section: 'Reflection Questions'
      };
    }
  };

  const progressInfo = getProgressInfo();
  const domainLabel = currentSection === 'scored'
    ? (currentQuestion as ScoredQuestion).domain
    : 'Reflection';

  // Overall progress across all questions
  const overallTotal = totalScored + totalReflective;
  const overallCurrent = currentSection === 'scored' ? (currentQuestionIndex + 1) : (totalScored + currentQuestionIndex + 1);

  return (
    <div className="min-h-screen py-10 relative text-[var(--foreground)]">
      <Starfield density={80} speed={0.35} />
      <div className="max-w-3xl mx-auto px-6">
        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
            <strong className="font-semibold">Debug:</strong> {debugInfo}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-widest text-neutral-600 mb-2">ASSESSMENT</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900">Trajectory Life Assessment</h1>
        </div>

        {/* Progress: Rocket with overall fraction */}
        <ShipProgress current={overallCurrent} total={overallTotal} label={`${overallCurrent} / ${overallTotal}`} />

        {/* Question Card */}
        <div key={`${currentSection}-${currentQuestionIndex}`} className="bg-[var(--card)] border border-neutral-200 rounded-2xl shadow-sm p-8 md:p-10 mb-8 min-h-[420px] flex flex-col anim-fade-slide-up">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-wider text-neutral-500 uppercase">{domainLabel}</span>
              <span className="text-xs text-neutral-500">{progressInfo.label}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-relaxed">
              {currentQuestion.prompt}
            </h2>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex flex-col justify-center">
            {currentSection === 'scored' ? (
              <Likert
                value={answers[currentQuestion.id] || null}
                onChange={(value) => handleScoredAnswer(currentQuestion.id, value)}
              />
            ) : (
              <textarea
                value={reflectiveAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleReflectiveAnswer(currentQuestion.id, e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-36 p-4 border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 rounded-xl resize-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            aria-label="Previous question"
            disabled={isFirstQuestion && currentSection === 'scored'}
            className="flex items-center px-3 py-3 text-neutral-700 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="text-center">
            {currentSection === 'scored' && !canMoveToReflective && (
              <p className="text-sm text-neutral-600">
                {totalScored - answeredScored} questions remaining
              </p>
            )}
            {currentSection === 'reflective' && isLastQuestion && (
              <p className="text-sm text-neutral-600">Ready to submit</p>
            )}
          </div>

          <button
            onClick={handleNext}
            aria-label={currentSection === 'reflective' && isLastQuestion ? 'Submit assessment' : 'Next question'}
            disabled={
              (currentSection === 'scored' && !answers[currentQuestion.id]) ||
              (currentSection === 'reflective' && !reflectiveAnswers[currentQuestion.id]) ||
              isSubmitting
            }
            className="inline-flex items-center rounded-full bg-neutral-900 text-white px-6 py-3 font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : currentSection === 'reflective' && isLastQuestion ? (
              'Get Results'
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Quick Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestionIndex(i)}
              aria-label={`Jump to ${currentSection === 'scored' ? 'question' : 'reflection'} ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentQuestionIndex
                  ? 'bg-neutral-900'
                  : currentSection === 'scored'
                    ? (answers[scoredQuestions[i]?.id] ? 'bg-neutral-600' : 'bg-neutral-300')
                    : (reflectiveAnswers[reflectiveQuestions[i]?.id] ? 'bg-neutral-600' : 'bg-neutral-300')
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
