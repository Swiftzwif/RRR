import { z } from 'zod';

// Game-specific types
export const GameSessionSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  questionOrder: z.array(z.string()),
  consistencyScore: z.number().min(0).max(1),
  avgAnswerMs: z.number(),
  timeouts: z.number(),
  version: z.string(),
});

export const GameEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  qIndex: z.number(),
  questionId: z.string(),
  answer: z.number().min(1).max(5).optional(),
  startedAt: z.string(),
  answeredAt: z.string().optional(),
  durationMs: z.number(),
  timedOut: z.boolean(),
  changedAnswer: z.boolean(),
});

export const AchievementSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  sessionId: z.string(),
  code: z.string(),
  createdAt: z.string(),
});

export type GameSession = z.infer<typeof GameSessionSchema>;
export type GameEvent = z.infer<typeof GameEventSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;

// Lane classification based on category scores
export interface LaneScores {
  financial_mindset: number;
  time_freedom: number;
  risk_opportunity: number;
  systems_scalability: number;
}

export interface LaneResult {
  lane: 'sidewalk' | 'slowlane' | 'fastlane';
  confidence: number;
  scores: LaneScores;
  badges: string[];
  nextSteps: string[];
}

// Anti-gaming confidence calculation
export interface ConfidenceFactors {
  avgAnswerTime: number;
  answerChanges: number;
  timeouts: number;
  validationConsistency: number;
}

export function calculateConfidence(factors: ConfidenceFactors): number {
  let confidence = 100;
  
  // Penalize very fast answers (likely random clicking)
  if (factors.avgAnswerTime < 2000) {
    confidence -= 20;
  } else if (factors.avgAnswerTime < 5000) {
    confidence -= 10;
  }
  
  // Penalize frequent answer changes
  if (factors.answerChanges > 5) {
    confidence -= 15;
  } else if (factors.answerChanges > 2) {
    confidence -= 8;
  }
  
  // Penalize timeouts
  confidence -= factors.timeouts * 10;
  
  // Reward validation consistency
  if (factors.validationConsistency < 0.6) {
    confidence -= 25;
  } else if (factors.validationConsistency < 0.8) {
    confidence -= 10;
  }
  
  return Math.max(0, Math.min(100, confidence));
}

// Lane classification logic
export function classifyLane(scores: LaneScores): LaneResult {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const avgScore = totalScore / 4;
  
  let lane: 'sidewalk' | 'slowlane' | 'fastlane';
  let nextSteps: string[];
  
  if (avgScore <= 2.5) {
    lane = 'sidewalk';
    nextSteps = [
      "Create a basic budget and track expenses for 30 days",
      "Build a $1,000 emergency fund before any other goals",
      "Read 'The Millionaire Fastlane' to shift your money mindset"
    ];
  } else if (avgScore <= 3.5) {
    lane = 'slowlane';
    nextSteps = [
      "Maximize your 401k match and open a Roth IRA",
      "Start a side hustle to create additional income streams",
      "Learn about business and entrepreneurship basics"
    ];
  } else {
    lane = 'fastlane';
    nextSteps = [
      "Identify one scalable business opportunity to pursue",
      "Build systems and processes that work without your direct involvement",
      "Focus on creating assets that generate passive income"
    ];
  }
  
  return {
    lane,
    confidence: 85, // Will be updated with actual confidence calculation
    scores,
    badges: [], // Will be populated based on session data
    nextSteps
  };
}

// Badge calculation
export function calculateBadges(
  session: GameSession,
  events: GameEvent[],
  validationConsistency: number
): string[] {
  const badges: string[] = [];
  
  // SKY_PILOT - completed once
  if (session.completedAt) {
    badges.push('SKY_PILOT');
  }
  
  // FIRST_INSTINCT - fast average, minimal changes
  const totalChanges = events.reduce((sum, event) => sum + (event.changedAnswer ? 1 : 0), 0);
  if (session.avgAnswerMs < 8000 && totalChanges <= 2) {
    badges.push('FIRST_INSTINCT');
  }
  
  // STEADY_CLIMB - zero timeouts
  if (session.timeouts === 0) {
    badges.push('STEADY_CLIMB');
  }
  
  // HONEST_SIGNAL - high consistency
  if (validationConsistency >= 0.8) {
    badges.push('HONEST_SIGNAL');
  }
  
  // CLOSER_90 - strong finish
  const lastThreeEvents = events.slice(-3);
  const lastThreeAvg = lastThreeEvents.reduce((sum, event) => sum + (event.answer || 0), 0) / 3;
  if (lastThreeAvg >= 4) {
    badges.push('CLOSER_90');
  }
  
  return badges;
}

// Micro-insight generation
export function generateMicroInsight(
  category: string,
  recentAnswers: number[],
  insights: Record<string, { high: string; low: string }>
): string {
  const avgScore = recentAnswers.reduce((sum, score) => sum + score, 0) / recentAnswers.length;
  const isHigh = avgScore >= 3.5;
  
  return insights[category]?.[isHigh ? 'high' : 'low'] || 'Keep going—you\'re making progress.';
}

// Question randomization with validation placement
export function generateQuestionOrder(questions: any[], validationQuestions: any[]): string[] {
  const mainQuestions = questions.map(q => q.id);
  const validationIds = validationQuestions.map(q => q.id);
  
  // Shuffle main questions
  const shuffled = mainQuestions.sort(() => Math.random() - 0.5);
  
  // Insert validation questions at 25% and 75% positions
  const totalQuestions = shuffled.length + validationIds.length;
  const pos1 = Math.floor(totalQuestions * 0.25);
  const pos2 = Math.floor(totalQuestions * 0.75);
  
  const result: string[] = [];
  let mainIndex = 0;
  let validationIndex = 0;
  
  for (let i = 0; i < totalQuestions; i++) {
    if (i === pos1 || i === pos2) {
      if (validationIndex < validationIds.length) {
        result.push(validationIds[validationIndex]);
        validationIndex++;
      } else {
        result.push(shuffled[mainIndex]);
        mainIndex++;
      }
    } else {
      if (mainIndex < shuffled.length) {
        result.push(shuffled[mainIndex]);
        mainIndex++;
      }
    }
  }
  
  return result;
}
