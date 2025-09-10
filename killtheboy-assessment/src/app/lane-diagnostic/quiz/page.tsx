'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function LaneDiagnosticQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/lane-diagnostic-questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data: QuestionsData = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        handleComplete();
      }
    }, 500);
  };

  const handleComplete = async () => {
    try {
      // Store answers in session storage for results page
      sessionStorage.setItem('laneDiagnosticAnswers', JSON.stringify(answers));
      
      // Redirect to results
      router.push('/lane-diagnostic/results');
    } catch (err) {
      console.error('Error processing assessment:', err);
      setError('Failed to process assessment. Please try again.');
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sunset border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sand-200">Loading Lane Diagnostic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-display font-bold text-sand-50 mb-4">
            Error Loading Assessment
          </h1>
          <p className="text-sand-200 mb-6">{error}</p>
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <p className="text-sand-200">No questions available.</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-sky-50 py-16">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/lane-diagnostic/landing" className="text-sunset hover:text-glow transition-colors text-sm mb-6 inline-block">
            ← Back to Lane Diagnostic
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-sky-800 mb-6">
            Lane Diagnostic Quiz
          </h1>
          <p className="text-xl text-sky-600 mb-8 max-w-3xl mx-auto">
            Discover which financial lane you're actually in based on MJ DeMarco's Millionaire Fastlane framework
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-sky-200/30 rounded-full h-3 mb-4 max-w-2xl mx-auto">
            <div 
              className="bg-gradient-to-r from-sky-400 to-sky-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-sky-500">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white p-10 mb-12 rounded-lg border border-sky-200 shadow-sm">
          <h2 className="text-2xl font-display font-semibold text-sky-800 mb-8">
            {question.prompt}
          </h2>
          
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full text-left p-6 rounded-lg border transition-all duration-200 ${
                  answers[question.id] === option.value
                    ? 'border-sky-400 bg-sky-50 text-sky-800'
                    : 'border-sky-200 bg-white text-sky-600 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 ${
                    answers[question.id] === option.value
                      ? 'border-sky-400 bg-sky-400'
                      : 'border-sky-300'
                  }`}>
                    {answers[question.id] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span className="font-medium text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-8 py-3 text-sky-600 hover:text-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Previous
          </button>
          
          <div className="text-sm text-sky-500">
            {Object.keys(answers).length} of {questions.length} answered
          </div>
          
          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!answers[question.id]}
            className="strata-button disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
          >
            {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
