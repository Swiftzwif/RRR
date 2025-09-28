'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Question {
  id: string;
  domain: string;
  prompt: string;
}

interface AssessmentStepperProps {
  questions: Question[];
  onComplete: (answers: Record<string, number>) => void;
  className?: string;
}

export default function AssessmentStepper({ 
  questions, 
  onComplete, 
  className = '' 
}: AssessmentStepperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key >= '1' && e.key <= '5') {
      handleAnswer(parseInt(e.key));
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      if (answers[currentQuestion.id]) {
        handleNext();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, answers]);

  const scaleLabels = {
    1: 'Never / Very Low',
    2: 'Rarely',
    3: 'Sometimes',
    4: 'Often',
    5: 'Always / Excellent',
  };

  return (
    <div className={`max-w-2xl mx-auto px-6 ${className}`}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-sky-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-sky-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-sky-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-sky-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-sky-800 mb-6 leading-relaxed">
            {currentQuestion.prompt}
          </h2>
          
          <p className="text-sm text-sky-500 mb-8">
            Take a breath. Answer honestly.
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Scale */}
      <div className="space-y-4 mb-8">
        {[1, 2, 3, 4, 5].map((value) => (
          <motion.button
            key={value}
            onClick={() => handleAnswer(value)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              answers[currentQuestion.id] === value
                ? 'border-sky-400 bg-sky-50 text-sky-800'
                : 'border-sky-200 bg-white text-sky-600 hover:border-sky-300 hover:bg-sky-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: value * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{value}</span>
              <span className="text-sm text-sky-500">{scaleLabels[value as keyof typeof scaleLabels]}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentIndex === 0
              ? 'text-sky-400 cursor-not-allowed'
              : 'text-sky-600 hover:text-sky-800 hover:bg-sky-100'
          }`}
          whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
          whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              answers[currentQuestion.id]
                ? 'bg-sky-400 text-white hover:bg-sky-500'
                : 'bg-sky-200 text-sky-400 cursor-not-allowed'
            }`}
          whileHover={answers[currentQuestion.id] ? { scale: 1.05 } : {}}
          whileTap={answers[currentQuestion.id] ? { scale: 0.95 } : {}}
        >
          {currentIndex === questions.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-6 text-center">
        <p className="text-xs text-sky-500">
          Use number keys 1-5 to answer, arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
