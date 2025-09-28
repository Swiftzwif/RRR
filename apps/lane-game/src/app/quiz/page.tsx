'use client';

import { MicroToast } from '@/components/MicroToast';
import { MiniMeter } from '@/components/MiniMeter';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { trackDomainLevelUp, trackQuestionAnswered, trackQuizCompleted, trackQuizStart } from '@/lib/analytics';
import { calculateLevel, getNextMilestone } from '@/lib/design-tokens';
import { questions, useQuizStore } from '@/lib/quiz-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    answers,
    domainScores,
    currentMicrocopy,
    showToast,
    toastMessage,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    hideToast
  } = useQuizStore();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Start quiz tracking on mount
  useEffect(() => {
    if (currentQuestionIndex === 0 && Object.keys(answers).length === 0) {
      startQuiz();
      trackQuizStart('direct');
    }
  }, [currentQuestionIndex, answers, startQuiz]);

  // Handle question answer
  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;

    const previousAnswer = answers[currentQuestion.id];
    answerQuestion(currentQuestion.id, value);
    
    // Track analytics
    trackQuestionAnswered(
      currentQuestion.id,
      currentQuestion.category,
      value,
      currentQuestionIndex + 1,
      questions.length
    );

    // Check for level changes and track
    const domainMapping: Record<string, string> = {
      'financial_mindset': 'finances',
      'time_freedom': 'energy', 
      'risk_opportunity': 'identity',
      'systems_scalability': 'focus'
    };

    const domain = domainMapping[currentQuestion.category];
    if (domain) {
      const oldLevel = calculateLevel(domainScores[domain as keyof typeof domainScores]);
      const newScore = Math.round(((domainScores[domain as keyof typeof domainScores] + value) / 2) * 25);
      const newLevel = calculateLevel(newScore);
      
      if (oldLevel !== newLevel && newLevel !== 'low') {
        trackDomainLevelUp(domain, oldLevel, newLevel, newScore);
      }
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
      trackQuizCompleted(
        Date.now() - useQuizStore.getState().startTime,
        useQuizStore.getState().avatar,
        useQuizStore.getState().domainScores,
        useQuizStore.getState().lowestTwoDomains
      );
      router.push('/email-gate');
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  // Don't render if no question
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
          <p className="text-center text-gray-500 mt-2 text-sm">
            {currentMicrocopy}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <QuestionCard
              question={currentQuestion.prompt}
              domain={currentQuestion.category}
              value={answers[currentQuestion.id] || 0}
              onChange={handleAnswer}
              microcopy={currentMicrocopy}
            />
          </div>

          {/* Side Rail with Mini Meters */}
          <div className="lg:col-span-1 space-y-4">
            {Object.entries(domainScores).map(([domain, score]) => {
              const level = calculateLevel(score);
              const nextMilestone = getNextMilestone(domain, level);
              
              return (
                <MiniMeter
                  key={domain}
                  domain={domain}
                  level={level}
                  progress={score}
                  nextMilestone={nextMilestone}
                />
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Get My Results' : 'Next'}
          </button>
        </div>
      </div>

      {/* Micro Toast for level ups */}
      {showToast && (
        <MicroToast
          message={toastMessage}
          type="success"
          onClose={hideToast}
        />
      )}
    </div>
  );
}
