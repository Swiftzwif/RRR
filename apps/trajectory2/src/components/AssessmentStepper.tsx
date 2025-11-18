"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Question, AssessmentAnswers } from "@/types/assessment";

interface AssessmentStepperProps {
  questions: Question[];
  onComplete: (answers: AssessmentAnswers) => void;
  className?: string;
}

// Move constant data outside component to prevent recreation
const SCALE_LABELS = {
  1: "Never / Very Low",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Always / Excellent",
} as const;

export default function AssessmentStepper({
  questions,
  onComplete,
  className = "",
}: AssessmentStepperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = useCallback((value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      onComplete(answers);
    }
  }, [currentIndex, questions.length, answers, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") {
        handleAnswer(parseInt(e.key));
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (answers[currentQuestion.id]) {
          handleNext();
        }
      }
    },
    [currentQuestion.id, answers, handleAnswer, handleNext, handlePrevious]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`max-w-3xl mx-auto px-6 ${className}`}>
      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-slate-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-slate-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mb-8 leading-relaxed">
            {currentQuestion.prompt}
          </h2>

          <p className="text-lg text-slate-500 mb-8">
            Take a breath. Answer honestly.
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Scale */}
      <div className="space-y-4 mb-12">
        {[1, 2, 3, 4, 5].map((value) => (
          <motion.button
            key={value}
            onClick={() => handleAnswer(value)}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
              answers[currentQuestion.id] === value
                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-slate-800 shadow-lg"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: value * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${
                    answers[currentQuestion.id] === value
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white"
                  }`}
                >
                  {value}
                </div>
                <span className="text-lg font-medium">
                  {SCALE_LABELS[value as keyof typeof SCALE_LABELS]}
                </span>
              </div>
              {answers[currentQuestion.id] === value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
            currentIndex === 0
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          }`}
          whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
          whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
            answers[currentQuestion.id]
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          whileHover={answers[currentQuestion.id] ? { scale: 1.05 } : {}}
          whileTap={answers[currentQuestion.id] ? { scale: 0.95 } : {}}
        >
          {currentIndex === questions.length - 1
            ? "Complete Assessment"
            : "Next Question"}
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Use number keys 1-5 to answer, arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
