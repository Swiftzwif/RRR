/**
 * Type definitions for assessment flow
 * Centralizes types used across assessment, results, and scoring
 */

import type { Domain, Avatar, ScoringResult } from '@/lib/scoring';

/**
 * Question structure from questions.json
 */
export interface Question {
  id: string;
  domain: Domain;
  prompt: string;
}

/**
 * Questions data structure from questions.json
 */
export interface QuestionsData {
  scored: Question[];
  reflective: Question[];
}

/**
 * User answers to assessment questions
 * Key: question ID (e.g., "Q1"), Value: rating 1-5
 */
export type AssessmentAnswers = Record<string, number>;

/**
 * Complete assessment results for results page
 * Extends ScoringResult with optional assessment ID
 */
export interface AssessmentResults extends ScoringResult {
  /** Database ID of saved assessment (if user is logged in) */
  assessmentId?: string;
}

/**
 * Saved assessment record from database
 */
export interface SavedAssessment {
  id: string;
  user_id: string | null;
  email: string | null;
  answers: AssessmentAnswers;
  domain_scores: Record<Domain, number>;
  avatar: Avatar;
  score: number;
  created_at: string;
}

/**
 * Suggested actions for improvement
 */
export interface SuggestedActions {
  sevenDay: string[];
  thirtyDay: string[];
}

// Re-export scoring types for convenience
export type { Domain, Avatar, ScoringResult } from '@/lib/scoring';
