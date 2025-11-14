/* eslint-disable react-hooks/exhaustive-deps */
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

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

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

  const scaleLabels = {
    1: "Never / Very Low",
    2: "Rarely",
    3: "Sometimes",
    4: "Often",
    5: "Always / Excellent",
  };

  return (
    <div className={`max-w-3xl mx-auto px-6 ${className}`}>
      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-sky-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-sky-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-sky-100 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-gold-500 rounded-full"
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sky-900 mb-8 leading-relaxed">
            {currentQuestion.prompt}
          </h2>

          <p className="text-lg text-sky-600 mb-8">
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
                ? "border-sky-500 bg-gradient-to-r from-sky-50 to-gold-50 text-sky-900 shadow-lg"
                : "border-sky-200 bg-white text-sky-700 hover:border-sky-400 hover:bg-gradient-to-r hover:from-sky-50 hover:to-gold-50 hover:shadow-md"
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
                      ? "bg-gradient-to-r from-sky-500 to-gold-500 text-white"
                      : "bg-sky-100 text-sky-700 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-gold-500 group-hover:text-white"
                  }`}
                >
                  {value}
                </div>
                <span className="text-lg font-medium">
                  {scaleLabels[value as keyof typeof scaleLabels]}
                </span>
              </div>
              {answers[currentQuestion.id] === value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-gradient-to-r from-sky-500 to-gold-500 rounded-full flex items-center justify-center"
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
              ? "text-sky-300 cursor-not-allowed"
              : "text-sky-600 hover:text-sky-800 hover:bg-sky-50"
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
              ? "bg-gradient-to-r from-sky-500 to-gold-500 text-white hover:from-sky-600 hover:to-gold-600 shadow-lg hover:shadow-xl"
              : "bg-sky-100 text-sky-300 cursor-not-allowed"
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
        <p className="text-sm text-sky-600">
          Use number keys 1-5 to answer, arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
