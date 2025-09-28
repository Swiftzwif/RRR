'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomMicrocopy } from './content';
import { calculateLevel, getDomainLabel } from './design-tokens';

// Import questions data
import questionsData from '../../../../packages/content/lane-diagnostic-questions.json';

export interface Question {
  id: string;
  category: string;
  prompt: string;
  type: string;
  options: Array<{ value: number; text: string }>;
}

export interface DomainScores {
  identity: number;
  energy: number;
  finances: number;
  relationships: number;
  emotions: number;
  focus: number;
}

export interface QuizState {
  // Quiz state
  currentQuestionIndex: number;
  answers: Record<string, number>;
  isCompleted: boolean;
  startTime: number;
  
  // Domain scores (calculated)
  domainScores: DomainScores;
  avatar: string;
  lowestTwoDomains: [string, string];
  
  // UI state
  currentMicrocopy: string;
  showToast: boolean;
  toastMessage: string;
  
  // Actions
  startQuiz: () => void;
  answerQuestion: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  
  // UI actions
  showLevelUpToast: (domain: string, newLevel: string) => void;
  hideToast: () => void;
}

const questions: Question[] = questionsData.questions;

// Calculate domain scores from answers
const calculateDomainScores = (answers: Record<string, number>): DomainScores => {
  const domainMapping: Record<string, keyof DomainScores> = {
    'financial_mindset': 'finances',
    'time_freedom': 'energy',
    'risk_opportunity': 'identity',
    'systems_scalability': 'focus'
  };

  const scores: DomainScores = {
    identity: 0,
    energy: 0,
    finances: 0,
    relationships: 0,
    emotions: 0,
    focus: 0
  };

  const domainCounts: Record<string, number> = {
    identity: 0,
    energy: 0,
    finances: 0,
    relationships: 0,
    emotions: 0,
    focus: 0
  };

  // Map questions to domains and calculate scores
  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer && domainMapping[question.category]) {
      const domain = domainMapping[question.category];
      scores[domain] += answer;
      domainCounts[domain]++;
    }
  });

  // Convert to percentages (1-5 scale to 0-100)
  Object.keys(scores).forEach(domain => {
    if (domainCounts[domain] > 0) {
      scores[domain as keyof DomainScores] = Math.round((scores[domain as keyof DomainScores] / domainCounts[domain]) * 25);
    }
  });

  // Set default values for domains not covered by questions
  scores.relationships = Math.round((scores.identity + scores.emotions) / 2);
  scores.emotions = Math.round((scores.identity + scores.focus) / 2);

  return scores;
};

// Determine avatar based on lowest domains
const determineAvatar = (domainScores: DomainScores): string => {
  const sortedDomains = Object.entries(domainScores)
    .sort(([, a], [, b]) => a - b)
    .map(([domain]) => domain);

  const lowestTwo = sortedDomains.slice(0, 2) as [string, string];

  // Simple avatar logic based on lowest domains
  if (lowestTwo.includes('identity') && lowestTwo.includes('focus')) {
    return 'SEEKER';
  } else if (lowestTwo.includes('energy') && lowestTwo.includes('focus')) {
    return 'WARRIOR';
  } else if (lowestTwo.includes('relationships') && lowestTwo.includes('emotions')) {
    return 'SAGE';
  } else if (lowestTwo.includes('finances') && lowestTwo.includes('relationships')) {
    return 'BUILDER';
  } else {
    return 'BALANCER';
  }
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      startTime: 0,
      domainScores: {
        identity: 0,
        energy: 0,
        finances: 0,
        relationships: 0,
        emotions: 0,
        focus: 0
      },
      avatar: '',
      lowestTwoDomains: ['identity', 'energy'],
      currentMicrocopy: getRandomMicrocopy(),
      showToast: false,
      toastMessage: '',

      // Actions
      startQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: {},
          isCompleted: false,
          startTime: Date.now(),
          currentMicrocopy: getRandomMicrocopy()
        });
      },

      answerQuestion: (questionId: string, value: number) => {
        const state = get();
        const newAnswers = { ...state.answers, [questionId]: value };
        const newDomainScores = calculateDomainScores(newAnswers);

        // Check for level changes
        const currentScores = state.domainScores;
        let toastMessage = '';

        Object.keys(newDomainScores).forEach(domain => {
          const oldLevel = calculateLevel(currentScores[domain as keyof DomainScores]);
          const newLevel = calculateLevel(newDomainScores[domain as keyof DomainScores]);
          
          if (oldLevel !== newLevel && newLevel !== 'low') {
            const domainLabel = getDomainLabel(domain, newLevel);
            toastMessage = `${domain} leveled up → ${domainLabel}`;
          }
        });

        set({
          answers: newAnswers,
          domainScores: newDomainScores,
          showToast: !!toastMessage,
          toastMessage
        });
      },

      nextQuestion: () => {
        const state = get();
        if (state.currentQuestionIndex < questions.length - 1) {
          set({
            currentQuestionIndex: state.currentQuestionIndex + 1,
            currentMicrocopy: getRandomMicrocopy(),
            showToast: false
          });
        }
      },

      previousQuestion: () => {
        const state = get();
        if (state.currentQuestionIndex > 0) {
          set({
            currentQuestionIndex: state.currentQuestionIndex - 1,
            showToast: false
          });
        }
      },

      completeQuiz: () => {
        const state = get();
        const finalScores = calculateDomainScores(state.answers);
        const avatar = determineAvatar(finalScores);
        
        const sortedDomains = Object.entries(finalScores)
          .sort(([, a], [, b]) => a - b)
          .map(([domain]) => domain);
        
        const lowestTwo = sortedDomains.slice(0, 2) as [string, string];

        set({
          isCompleted: true,
          domainScores: finalScores,
          avatar,
          lowestTwoDomains: lowestTwo
        });
      },

      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: {},
          isCompleted: false,
          startTime: 0,
          domainScores: {
            identity: 0,
            energy: 0,
            finances: 0,
            relationships: 0,
            emotions: 0,
            focus: 0
          },
          avatar: '',
          lowestTwoDomains: ['identity', 'energy'],
          currentMicrocopy: getRandomMicrocopy(),
          showToast: false,
          toastMessage: ''
        });
      },

      showLevelUpToast: (domain: string, newLevel: string) => {
        set({
          showToast: true,
          toastMessage: `${domain} leveled up → ${newLevel}`
        });
      },

      hideToast: () => {
        set({ showToast: false });
      }
    }),
    {
      name: 'quiz-store',
      partialize: (state) => ({
        answers: state.answers,
        isCompleted: state.isCompleted,
        domainScores: state.domainScores,
        avatar: state.avatar,
        lowestTwoDomains: state.lowestTwoDomains
      })
    }
  )
);

export { questions };
