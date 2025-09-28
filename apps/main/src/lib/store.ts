import { create } from 'zustand';

interface AssessmentStore {
  answers: Record<string, number>;
  setAnswer: (questionId: string, value: number) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  answers: {},
  setAnswer: (questionId, value) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: value }
    })),
  reset: () =>
    set({ answers: {} })
}));
