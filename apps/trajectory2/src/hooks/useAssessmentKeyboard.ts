import { useEffect, useCallback } from 'react';
import type { AssessmentAnswers } from "@/types/assessment";

interface UseAssessmentKeyboardProps {
  currentQuestionId: string;
  answers: AssessmentAnswers;
  onAnswer: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function useAssessmentKeyboard({
  currentQuestionId,
  answers,
  onAnswer,
  onNext,
  onPrevious,
}: UseAssessmentKeyboardProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") {
        onAnswer(parseInt(e.key));
      } else if (e.key === "ArrowLeft") {
        onPrevious();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (answers[currentQuestionId]) {
          onNext();
        }
      }
    },
    [currentQuestionId, answers, onAnswer, onNext, onPrevious]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
