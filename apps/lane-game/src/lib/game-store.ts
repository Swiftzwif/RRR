'use client';

import { laneGameQuestions } from '@trajectory/content';
import { generateQuestionOrder, type GameEvent } from '@trajectory/lib';
import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameState {
  // Session data
  sessionId: string | null;
  questionOrder: string[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  events: GameEvent[];
  
  // Game mechanics
  timer: number;
  isTimerActive: boolean;
  timeouts: number;
  answerChanges: number;
  
  // Progress tracking
  milestones: Set<number>;
  microInsights: string[];
  
  // Results
  isCompleted: boolean;
  results: any;
  
  // Actions
  startSession: () => void;
  answerQuestion: (questionId: string, answer: number, changed: boolean) => void;
  advanceQuestion: () => void;
  timeoutQuestion: () => void;
  completeSession: () => void;
  resetGame: () => void;
  
  // Timer actions
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  
  // Progress actions
  checkMilestones: () => void;
  generateMicroInsight: (category: string, recentAnswers: number[]) => void;
}

const initialState = {
  sessionId: null,
  questionOrder: [],
  currentQuestionIndex: 0,
  answers: {},
  events: [],
  timer: 60,
  isTimerActive: false,
  timeouts: 0,
  answerChanges: 0,
  milestones: new Set<number>(),
  microInsights: [],
  isCompleted: false,
  results: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      startSession: () => {
        const sessionId = crypto.randomUUID();
        const questionOrder = generateQuestionOrder(
          laneGameQuestions.questions,
          laneGameQuestions.validationQuestions
        );
        
        set({
          sessionId,
          questionOrder,
          currentQuestionIndex: 0,
          answers: {},
          events: [],
          timer: 60,
          isTimerActive: false,
          timeouts: 0,
          answerChanges: 0,
          milestones: new Set<number>(),
          microInsights: [],
          isCompleted: false,
          results: null,
        });
      },
      
      answerQuestion: (questionId: string, answer: number, changed: boolean) => {
        const state = get();
        const newAnswers = { ...state.answers, [questionId]: answer };
        const newAnswerChanges = changed ? state.answerChanges + 1 : state.answerChanges;
        
        // Create event
        const event: GameEvent = {
          id: crypto.randomUUID(),
          sessionId: state.sessionId!,
          qIndex: state.currentQuestionIndex,
          questionId,
          answer,
          startedAt: new Date().toISOString(),
          answeredAt: new Date().toISOString(),
          durationMs: (60 - state.timer) * 1000,
          timedOut: false,
          changedAnswer: changed,
        };
        
        set({
          answers: newAnswers,
          answerChanges: newAnswerChanges,
          events: [...state.events, event],
        });
      },
      
      advanceQuestion: () => {
        const state = get();
        const nextIndex = state.currentQuestionIndex + 1;
        
        if (nextIndex >= state.questionOrder.length) {
          get().completeSession();
          return;
        }
        
        set({
          currentQuestionIndex: nextIndex,
          timer: 60,
          isTimerActive: false,
        });
        
        // Check milestones and generate insights
        get().checkMilestones();
        get().generateMicroInsight('current', []);
      },
      
      timeoutQuestion: () => {
        const state = get();
        const currentQuestionId = state.questionOrder[state.currentQuestionIndex];
        
        // Create timeout event
        const event: GameEvent = {
          id: crypto.randomUUID(),
          sessionId: state.sessionId!,
          qIndex: state.currentQuestionIndex,
          questionId: currentQuestionId,
          startedAt: new Date().toISOString(),
          answeredAt: new Date().toISOString(),
          durationMs: 60000,
          timedOut: true,
          changedAnswer: false,
        };
        
        set({
          timeouts: state.timeouts + 1,
          events: [...state.events, event],
        });
        
        // Auto-advance after timeout
        setTimeout(() => {
          get().advanceQuestion();
        }, 1000);
      },
      
      completeSession: () => {
        set({ isCompleted: true });
        // Results will be calculated and set by the results component
      },
      
      resetGame: () => {
        set(initialState);
      },
      
      startTimer: () => {
        set({ isTimerActive: true });
      },
      
      stopTimer: () => {
        set({ isTimerActive: false });
      },
      
      tickTimer: () => {
        const state = get();
        if (!state.isTimerActive) return;
        
        const newTimer = state.timer - 1;
        if (newTimer <= 0) {
          get().timeoutQuestion();
          return;
        }
        
        set({ timer: newTimer });
      },
      
      checkMilestones: () => {
        const state = get();
        const progress = state.currentQuestionIndex / state.questionOrder.length;
        const milestones = [0.25, 0.5, 0.75, 1.0];
        
        milestones.forEach(threshold => {
          if (progress >= threshold && !state.milestones.has(threshold)) {
            const newMilestones = new Set(state.milestones);
            newMilestones.add(threshold);
            set({ milestones: newMilestones });
          }
        });
      },
      
      generateMicroInsight: (category: string, recentAnswers: number[]) => {
        const insights = laneGameQuestions.metadata.microInsights;
        const avgScore = recentAnswers.reduce((sum, score) => sum + score, 0) / recentAnswers.length;
        const isHigh = avgScore >= 3.5;
        const insight = insights[category]?.[isHigh ? 'high' : 'low'] || 'Keep going—you\'re making progress.';
        
        set(state => ({
          microInsights: [...state.microInsights, insight]
        }));
      },
      
      generateMicroInsightForCurrent: () => {
        const state = get();
        const currentIndex = state.currentQuestionIndex;
        
        // Generate insight every 3 questions
        if (currentIndex > 0 && currentIndex % 3 === 0) {
          const recentEvents = state.events.slice(-3);
          const recentAnswers = recentEvents
            .filter(event => event.answer)
            .map(event => event.answer!);
          
          if (recentAnswers.length > 0) {
            // Get the category of the current question
            const currentQuestionId = state.questionOrder[currentIndex];
            const question = [...laneGameQuestions.questions, ...laneGameQuestions.validationQuestions]
              .find(q => q.id === currentQuestionId);
            
            if (question) {
              get().generateMicroInsight(question.category, recentAnswers);
            }
          }
        }
      },
    }),
    {
      name: 'lane-game-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        questionOrder: state.questionOrder,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        timeouts: state.timeouts,
        answerChanges: state.answerChanges,
        milestones: Array.from(state.milestones),
        isCompleted: state.isCompleted,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert milestones array back to Set
          state.milestones = new Set(Array.from(state.milestones));
        }
      },
    }
  )
);

// Timer hook
export const useGameTimer = () => {
  const { timer, isTimerActive, tickTimer } = useGameStore();
  
  React.useEffect(() => {
    if (!isTimerActive) return;
    
    const interval = setInterval(tickTimer, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, tickTimer]);
  
  return { timer, isTimerActive };
};

// Game provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};
